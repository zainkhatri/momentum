use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

// Define the instruction data structure
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct JournalEntry {
    pub content_hash: String,
}

// Program entrypoint
entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // Deserialize the instruction data
    let journal_entry = JournalEntry::try_from_slice(instruction_data)?;

    // Log the content hash and author
    msg!("Author: {}", account.key);
    msg!("Content Hash: {}", journal_entry.content_hash);

    // Business logic would go here (e.g., storing data on-chain)

    Ok(())
}
