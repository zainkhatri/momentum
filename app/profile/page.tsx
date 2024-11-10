"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Sidebar from "@/components/ui/sidebar";
import TopBar from "@/components/ui/topbar";
import DocumentCard from "@/components/ui/documentcard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const documents = [
    { title: "Beach Day", timestamp: "1m ago" },
    { title: "FEIN", timestamp: "40m ago" },
    { title: "Coffee Date at Dulce", timestamp: "2 hrs ago" },
    { title: "Travis Scott Concert", timestamp: "Apr 25, 2024" },
    { title: "Parkside Dining Hall", timestamp: "March 27, 2023" },
    { title: "San Diego Trip", timestamp: "Feb 20, 2023" },
  ];

  // Filter documents based on the search query
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#EDEDED]">
        <Button className="p-0 bg-transparent border-none shadow-none">
          <Image src="/icons/listMobile.svg" alt="Home" width={30} height={15} className="ml-4" />
        </Button>
        <div className="flex items-center">
          <h1>Momentum</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Image src="/icons/magnify.svg" alt="Home" width={40} height={15} className="mr-6" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar without documents prop */}
        <Sidebar />
        
        <main className="flex-1 p-0 overflow-auto">
          {/* Pass documents, searchQuery, and setSearchQuery to TopBar */}
          <TopBar documents={documents} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="flex-col align-left max-w-7xl mx-auto pl-6 pr-6 pt-4">
            {/* Desktop Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-row"></div>
            </div>

            {/* Display Filtered Documents */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 ml-auto text-black sm: ml-10">
              {filteredDocuments.map((doc, index) => (
                <DocumentCard key={index} title={doc.title} timestamp={doc.timestamp} onClick={() => console.log("here")} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <Button className="md:hidden fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg bg-[#34347B]">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
