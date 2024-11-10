use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

// Define the JournalEntry struct
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct JournalEntry {
    pub content_hash: String,
    pub is_public: u8, // Use u8 to represent boolean
    pub timestamp: u64,
    pub owner: String,
    pub upvotes: u64,
    pub downvotes: u64,
}

// Define instruction types
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum JournalInstruction {
    SubmitEntry(JournalEntry), // Discriminant 0
    Vote { is_upvote: u8 },    // Discriminant 1
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = JournalInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    match instruction {
        JournalInstruction::SubmitEntry(journal_entry) => {
            process_submit_entry(program_id, accounts, journal_entry)
        }
        JournalInstruction::Vote { is_upvote } => {
            process_vote(program_id, accounts, is_upvote)
        }
    }
}

fn process_submit_entry(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    journal_entry: JournalEntry,
) -> ProgramResult {
    msg!("Processing SubmitEntry instruction");

    // Get accounts
    let accounts_iter = &mut accounts.iter();
    let author = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // Verify author signed
    if !author.is_signer {
        msg!("Author must sign");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Calculate PDA
    let (pda, bump_seed) = Pubkey::find_program_address(
        &[
            b"journal",
            author.key.as_ref(),
            journal_entry.content_hash.as_bytes(),
        ],
        program_id,
    );

    if pda != *pda_account.key {
        msg!("Invalid PDA account");
        return Err(ProgramError::InvalidArgument);
    }

    // Allocate space and assign account if needed
    if pda_account.lamports() == 0 {
        let rent = Rent::get()?;
        let required_lamports = rent.minimum_balance(std::mem::size_of::<JournalEntry>());

        invoke(
            &system_instruction::create_account(
                author.key,
                pda_account.key,
                required_lamports,
                std::mem::size_of::<JournalEntry>() as u64,
                program_id,
            ),
            &[
                author.clone(),
                pda_account.clone(),
                system_program.clone(),
            ],
        )?;
    }

    // Store the entry data
    let mut account_data = pda_account.data.borrow_mut();
    journal_entry.serialize(&mut &mut account_data[..])?;

    Ok(())
}

fn process_vote(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    is_upvote: u8,
) -> ProgramResult {
    msg!("Processing Vote instruction");

    // Get accounts
    let accounts_iter = &mut accounts.iter();
    let voter = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;

    // Verify voter signed
    if !voter.is_signer {
        msg!("Voter must sign");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Check if PDA account is owned by the program
    if pda_account.owner != program_id {
        msg!("PDA account is not owned by the program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize the journal entry
    let mut journal_entry = JournalEntry::try_from_slice(&pda_account.data.borrow())
        .map_err(|_| ProgramError::InvalidAccountData)?;

    // Update upvotes or downvotes
    if is_upvote == 1 {
        journal_entry.upvotes = journal_entry.upvotes.checked_add(1).ok_or(ProgramError::Overflow)?;
    } else {
        journal_entry.downvotes = journal_entry.downvotes.checked_add(1).ok_or(ProgramError::Overflow)?;
    }

    // Serialize the updated data back into the account
    journal_entry.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}
