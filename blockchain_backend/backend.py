import os
import time
from typing import Optional, List, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from solders.keypair import Keypair
from solders.pubkey import Pubkey as PublicKey
from solders.system_program import ID as SYSTEM_PROGRAM_ID
from solana.rpc.api import Client
from dotenv import load_dotenv

# Load environment variables
print("Loading .env file...")
load_dotenv(verbose=True)

# In-memory storage for development
journal_entries: List[Dict] = []

# Set up FastAPI app
app = FastAPI()

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
    wallet_address: Optional[str] = None

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
    address: str

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "entries_count": len(journal_entries)
    }

@app.get("/journal_entries", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    skip: int = 0,
    limit: int = 20
):
    """Get journal entries with pagination."""
    try:
        print("\nFetching journal entries...")
        # Filter only public entries
        public_entries = [entry for entry in journal_entries if entry.get("is_public", False)]
        # Sort by timestamp descending
        sorted_entries = sorted(public_entries, key=lambda x: x.get("timestamp", 0), reverse=True)
        # Apply pagination
        paginated_entries = sorted_entries[skip:skip + limit]
        
        print(f"Retrieved {len(paginated_entries)} entries")
        return paginated_entries

    except Exception as e:
        print(f"Error fetching journal entries: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch entries: {str(e)}"
        )

@app.post("/submit_journal", response_model=JournalEntrySubmitResponse)
async def submit_journal_entry(entry: JournalEntryCreate):
    """Submit a journal entry."""
    try:
        # Create new journal entry
        new_entry = {
            "content_hash": entry.content_hash,
            "is_public": entry.is_public,
            "timestamp": int(time.time()),
            "owner": entry.wallet_address,
            "address": f"entry_{len(journal_entries)}"  # Simple unique identifier
        }
        
        # Store the entry
        journal_entries.append(new_entry)
        
        print(f"Stored new entry from {entry.wallet_address}")
        print(f"Total entries: {len(journal_entries)}")
        
        return JournalEntrySubmitResponse(
            status="success",
            transaction_id=f"local_{len(journal_entries)}",
            message="Journal entry submitted successfully"
        )
    except Exception as e:
        print(f"Error submitting journal entry: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit entry: {str(e)}"
        )