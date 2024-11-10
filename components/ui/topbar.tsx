"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface TopBarProps {
  documents: { title: string; timestamp: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TopBar({ documents, searchQuery, setSearchQuery }: TopBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if Phantom wallet and EIP-1193 provider are available
    if (typeof window !== 'undefined' && window.ethereum) {
      // Request connection to wallet using EIP-1193 "eth_requestAccounts"
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            console.log("Wallet Address:", address);
          } else {
            console.log("No accounts found.");
          }
        })
        .catch((error: any) => {
          console.error("Error connecting to Ethereum provider:", error);
        });
    } else {
      console.log("Ethereum provider not detected.");
    }
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between mb-8 bg-black px-4 h-40 border-b border-gray-500">
      <div className="relative flex-grow mr-4 ml-12">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#737373]" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-14 pr-4 py-7 w-full text-white text-md border-gray-500 bg-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="lg:mr-12 xl:mr-12">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-4 border border-gray-500 py-7 px-7 rounded-md hover:border-black h-[58px] bg-black"
            >
              <Avatar className="h-10 w-10">
                <Image className="text-white" src="/circle-user-round.svg" alt="Avatar" width={100} height={40} />
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="font-400 text-white font-semibold hidden lg:block xl:block 2xl:block">
                  {walletAddress || "Not Connected"}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-black">
            <DropdownMenuItem>
              <span className="text-red-600">Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
