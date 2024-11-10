use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint, entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
};

// Define the data structure for a journal entry
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct JournalEntry {
    pub content_hash: String,
    pub is_public: bool,
}

// Define the program's entrypoint
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,      // Public key of the program
    accounts: &[AccountInfo], // Accounts involved in the instruction
    instruction_data: &[u8],  // Serialized JournalEntry
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // Get the account of the person who initiated the transaction
    let signer = next_account_info(accounts_iter)?;

    // Deserialize the instruction data to get the JournalEntry
    let journal_entry = JournalEntry::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // Here, you'd typically store the journal entry in an account or process it further
    // Since this example focuses on transaction logging, we'll skip storage

    // For demonstration, you might log the entry or perform other actions

    Ok(())
}
