# backend.py (main.py)

import os
import time
from typing import Optional, List, Tuple
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from solders.transaction import Transaction
from solders.instruction import AccountMeta, Instruction as TransactionInstruction
from solders.pubkey import Pubkey as PublicKey
from solders.keypair import Keypair
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solders.message import Message
from borsh_construct import CStruct, String, U8, U64
from pydantic import BaseModel
from base58 import b58decode
from solana.rpc.api import Client

# Load environment variables
print("Loading .env file...")
load_dotenv(verbose=True)

# Validate environment variables
required_env_vars = [
    "NEXT_PUBLIC_SOLANA_RPC_HOST",
    "NEXT_PUBLIC_PRIVATE_KEY",
    "NEXT_PUBLIC_PROGRAM_ID",
    "NEXT_PUBLIC_SOLANA_NETWORK"
]

missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Set up Solana client
rpc_url = os.getenv("NEXT_PUBLIC_SOLANA_RPC_HOST")
print(f"\nConnecting to Solana at: {rpc_url}")
client = Client(rpc_url)

# Set up FastAPI app
app = FastAPI(
    title="Solana Journal Backend",
    description="Backend service for handling journal entries on Solana blockchain"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request models
class JournalEntryCreate(BaseModel):
    content_hash: str
    is_public: bool

class JournalEntryVote(BaseModel):
    entry_id: str
    is_upvote: bool

# Define response models
class JournalEntrySubmitResponse(BaseModel):
    status: str
    transaction_id: str
    message: str

class JournalEntryResponse(BaseModel):
    content_hash: str
    is_public: bool
    timestamp: int
    owner: str
    upvotes: int
    downvotes: int
    address: str

class VoteResponse(BaseModel):
    status: str
    transaction_id: str
    message: str

class HealthCheckResponse(BaseModel):
    status: str
    solana_connection: dict
    network: str
    program_id: str
    wallet_public_key: str
    wallet_balance: str

# Define the JournalEntry schema
journal_entry_schema = CStruct(
    "content_hash" / String,
    "is_public" / U8,  # Represent bool as u8
    "timestamp" / U64,
    "owner" / String,
    "upvotes" / U64,
    "downvotes" / U64,
)

# Define the instruction schemas
submit_entry_schema = CStruct(
    "instruction" / U8,  # 0 for SubmitEntry
    "content_hash" / String,
    "is_public" / U8,
    "timestamp" / U64,
    "owner" / String,
    "upvotes" / U64,
    "downvotes" / U64,
)

vote_instruction_schema = CStruct(
    "instruction" / U8,  # 1 for Vote
    "is_upvote" / U8,
)

def get_wallet() -> Optional[Keypair]:
    """Get wallet keypair from environment variables."""
    try:
        private_key_str = os.getenv("NEXT_PUBLIC_PRIVATE_KEY")
        print(f"\nLoading wallet from private key...")
        # Remove brackets and split the string into a list of integers
        private_key_str = private_key_str.strip('[]')
        private_key_array = [int(x) for x in private_key_str.split(',')]
        keypair = Keypair.from_bytes(bytes(private_key_array))
        print(f"Wallet loaded successfully. Public key: {keypair.pubkey()}")
        return keypair
    except Exception as e:
        print(f"Failed to load wallet: {str(e)}")
        raise RuntimeError(f"Failed to load wallet: {str(e)}")

def find_journal_pda(author: PublicKey, content_hash: str, program_id: PublicKey) -> Tuple[PublicKey, int]:
    seeds = [
        b"journal",
        bytes(author),
        bytes(content_hash, "utf-8")
    ]
    return PublicKey.find_program_address(seeds, program_id)

@app.post("/submit_journal", response_model=JournalEntrySubmitResponse)
async def submit_journal_entry(entry: JournalEntryCreate):
    """Submit a journal entry to the Solana blockchain."""
    try:
        print("\n=== Starting Journal Submission ===")

        # Get wallet and program ID
        wallet = get_wallet()
        print(f"Wallet pubkey: {wallet.pubkey()}")

        program_id = PublicKey.from_string(os.getenv("NEXT_PUBLIC_PROGRAM_ID"))
        print(f"Program ID: {program_id}")

        current_timestamp = int(time.time())

        # Prepare instruction data
        instruction_data = submit_entry_schema.build({
            "instruction": 0,  # 0 for SubmitEntry
            "content_hash": entry.content_hash,
            "is_public": 1 if entry.is_public else 0,
            "timestamp": current_timestamp,
            "owner": str(wallet.pubkey()),
            "upvotes": 0,
            "downvotes": 0,
        })

        # Compute the PDA for the journal entry
        journal_pda, bump_seed = find_journal_pda(wallet.pubkey(), entry.content_hash, program_id)

        # Include the PDA in the accounts
        instruction = TransactionInstruction(
            program_id=program_id,
            accounts=[
                AccountMeta(wallet.pubkey(), True, True),
                AccountMeta(journal_pda, False, True),
                AccountMeta(SYSTEM_PROGRAM_ID, False, False)
            ],
            data=instruction_data  # Already in bytes
        )

        # Get recent blockhash
        blockhash = client.get_latest_blockhash().value.blockhash

        # Create and sign transaction
        message = Message([instruction], wallet.pubkey())
        transaction = Transaction([wallet], message, blockhash)

        print("\nSending transaction...")
        response = client.send_transaction(transaction)
        print(f"Response: {response}")

        if hasattr(response, 'error') and response.error:
            print(f"\nError details: {response.error}")
            raise Exception(response.error)

        result = str(response.value) if hasattr(response, 'value') else str(response)

        return JournalEntrySubmitResponse(
            status="success",
            transaction_id=result,
            message="Journal entry submitted successfully"
        )

    except Exception as e:
        print(f"\n=== Error Details ===")
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit journal entry: {str(e)}"
        )

@app.get("/journal_entries", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    public_only: bool = True,
    owner: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
):
    """Get journal entries with pagination."""
    try:
        print("\nFetching journal entries...")
        program_id = PublicKey.from_string(os.getenv("NEXT_PUBLIC_PROGRAM_ID"))

        # Get program accounts
        response = client.get_program_accounts(
            program_id,
            encoding="base64",
            commitment="confirmed"
        )

        entries = []
        for item in response.value:
            try:
                # Parse account data
                data = b58decode(item.account.data[0])
                entry_data = journal_entry_schema.parse(data)

                # Convert is_public from u8 to bool
                entry_data["is_public"] = bool(entry_data["is_public"])

                # Apply filters
                if public_only and not entry_data["is_public"]:
                    continue

                if owner and entry_data["owner"] != owner:
                    continue

                entries.append({
                    **entry_data,
                    "address": str(item.pubkey)
                })
            except Exception as e:
                print(f"Failed to parse entry: {e}")
                continue

        # Sort and paginate
        entries.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
        paginated_entries = entries[skip:skip + limit]

        print(f"Retrieved {len(paginated_entries)} entries")
        return paginated_entries

    except Exception as e:
        print(f"Error fetching journal entries: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch entries: {str(e)}"
        )

@app.post("/vote_journal", response_model=VoteResponse)
async def vote_journal(entry_vote: JournalEntryVote):
    """Vote on a journal entry."""
    try:
        print("\n=== Starting Journal Vote ===")

        # Validate entry_id
        try:
            journal_pda = PublicKey.from_string(entry_vote.entry_id)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid entry_id: {str(e)}"
            )

        # Get wallet and program ID
        wallet = get_wallet()
        program_id = PublicKey.from_string(os.getenv("NEXT_PUBLIC_PROGRAM_ID"))

        # Prepare instruction data for voting
        instruction_data = vote_instruction_schema.build({
            "instruction": 1,  # 1 for Vote
            "is_upvote": 1 if entry_vote.is_upvote else 0,
        })

        # Create the instruction
        instruction = TransactionInstruction(
            program_id=program_id,
            accounts=[
                AccountMeta(wallet.pubkey(), True, True),
                AccountMeta(journal_pda, False, True),
            ],
            data=instruction_data
        )

        # Send the transaction
        blockhash = client.get_latest_blockhash().value.blockhash
        message = Message([instruction], wallet.pubkey())
        transaction = Transaction([wallet], message, blockhash)

        print("\nSending transaction...")
        response = client.send_transaction(transaction)
        print(f"Response: {response}")

        if hasattr(response, 'error') and response.error:
            raise Exception(response.error)

        result = str(response.value) if hasattr(response, 'value') else str(response)

        return VoteResponse(
            status="success",
            transaction_id=result,
            message="Vote submitted successfully"
        )

    except HTTPException as http_exc:
        # Re-raise HTTP exceptions
        raise http_exc
    except Exception as e:
        print(f"Error voting on journal entry: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to vote on journal entry: {str(e)}"
        )

@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint to verify service status."""
    try:
        network = os.getenv("NEXT_PUBLIC_SOLANA_NETWORK", "devnet")

        # Test wallet loading
        wallet = get_wallet()
        print(f"Wallet test passed. Public key: {wallet.pubkey()}")

        # Test Solana connection
        version = client.get_version()
        print(f"Connected to Solana. Version: {version}")

        # Get program info
        program_id = PublicKey.from_string(os.getenv("NEXT_PUBLIC_PROGRAM_ID"))
        account_info = client.get_account_info(program_id)

        # Check balance
        balance = client.get_balance(wallet.pubkey())

        return HealthCheckResponse(
            status="healthy",
            solana_connection={
                "status": "ok",
                "version": str(version)
            },
            network=network,
            program_id=os.getenv("NEXT_PUBLIC_PROGRAM_ID"),
            wallet_public_key=str(wallet.pubkey()),
            wallet_balance=str(balance.value) if hasattr(balance, 'value') else "0"
        )

    except Exception as e:
        print(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )
