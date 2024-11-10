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
    let _signer = next_account_info(accounts_iter)?; // Prefix with underscore to indicate it's unused

    // Deserialize the instruction data to get the JournalEntry
    let _journal_entry = JournalEntry::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // The `program_id` is also unused currently, so prefix it with an underscore
    let _program_id = program_id;

    // Future logic can be added here. For example:
    // - Store `journal_entry` data in an on-chain account.
    // - Check if the journal is public and broadcast accordingly.
    // - Apply any business logic needed for your app.

    // Since this example focuses on transaction logging, we'll skip storage
    Ok(())
}
