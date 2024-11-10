"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  // No default selected tab
  const [selectedTab, setSelectedTab] = useState("");

  const getButtonStyles = (tabName: string) => {
    const isSelected = selectedTab === tabName;
    
    // Default hover effect for all tabs
    return `
      flex items-center w-full justify-start font-semibold
      ${isSelected ? "text-[#34347B] bg-[#C1C1D0] bg-opacity-55" : "text-[#505064]"}
      hover:bg-[#C1C1D0] hover:bg-opacity-55
    `;
  };

  return (
    <aside className="w-72 bg-black p-4 hidden md:flex flex-col items-center pt-12 border-x border-gray-500">
      <div className="flex items-center mb-8 mt-4 mr-5">
        <button onClick={() => {}}>
          <Link href="/" legacyBehavior>
            <a>
              <h1 className="text-2xl font-bold text-white">Momentum</h1>
            </a>
          </Link>
        </button>
      </div>
      <div className="flex items-center ml-[-40px]">
        <nav className="flex-1 w-full text-[#505064] space-y-1.5">
          <Button
            variant="ghost"
            className={`${getButtonStyles("All Projects")} ml-[5px] mb-1`}
            onClick={() => {
              setSelectedTab("All Projects");
              window.location.href = '/feed';
            }}
          >
            <Image src="icons/home-variant.svg" alt="Home" width={20} height={15} className="mr-3 mt-[-4px]" />
            <span className="text-white">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`${getButtonStyles("Your Projects")} mb-1`}
            onClick={() => {
              setSelectedTab("Your Projects");
              window.location.href = '/profile';
            }}
          >
            <Image src="icons/account.svg" alt="Your projects" width={30} height={24} className="mr-2 mt-[-4px]" />
            <span className="text-white">Your Journals</span>
          </Button>
          <Button
            variant="ghost"
            className={`${getButtonStyles("Shared with You")} mb-1`}
            onClick={() => setSelectedTab("Shared with You")}
          >
            <Image src="icons/shared.svg" alt="Shared with you" width={30} height={24} className="mr-2 mt-[-4px]" />
            <span className="text-white">Likes</span>
          </Button>
          <Button
            variant="ghost"
            className={`${getButtonStyles("Archived")} mb-1 ml-1`}
            onClick={() => setSelectedTab("Archived")}
          >
            <Image src="icons/archive.svg" alt="Archived" width={25} height={24} className="mr-[9px] mt-[-4px]" />
            <span className="text-white">Archived</span>
          </Button>
          <Button
            variant="ghost"
            className={`${getButtonStyles("Trash")} mb-1`}
            onClick={() => setSelectedTab("Trash")}
          >
            <Image src="icons/delete.svg" alt="Trash" width={30} height={24} className="mr-2 mt-[-4px] ml-[1.5px]" />
            <span className="text-white">Trash</span>
          </Button>
        </nav>
      </div>

      <div className="w-full mt-auto mb-1 p-4">
        <Button
          className="w-full mt-auto font-semibold bg-blue-500 text-white text-md hover:opacity-90 hover:bg-blue-00"
          onClick={() => window.location.href = '/post'}
        >
          + New
        </Button>
      </div>
    </aside>
  );
}
