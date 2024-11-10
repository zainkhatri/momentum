"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Sidebar from "@/components/ui/sidebar";
import TopBar from "@/components/ui/topbar";
import Post from "@/components/post";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample posts array with image and text
  const posts = [
    { title: "Beach Day", timestamp: "1m ago", image: "/images/beach.jpg", text: "Had an amazing time at the beach with friends!" },
    { title: "FEIN", timestamp: "40m ago", image: "/images/fein.jpg", text: "Worked on some interesting features at FEIN." },
    { title: "Coffee Date at Dulce", timestamp: "2 hrs ago", image: "/images/coffee.jpg", text: "Caught up with friends over coffee at Dulce." },
    { title: "Travis Scott Concert", timestamp: "Apr 25, 2024", image: "/images/concert.jpg", text: "The concert was lit! Can't wait for the next one." },
    { title: "Parkside Dining Hall", timestamp: "March 27, 2023", image: "/images/dining.jpg", text: "Lunch at Parkside today was surprisingly good." },
    { title: "San Diego Trip", timestamp: "Feb 20, 2023", image: "/images/sandiego.jpg", text: "Exploring San Diego was a blast!" },
  ];

  // Filter posts based on the search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-black z-10 border-r border-gray-500">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 overflow-y-auto p-6">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-[#EDEDED] sticky top-0 z-20">
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

        {/* Display Filtered Posts */}
        <div className="space-y-6 mt-6">
          {filteredPosts.map((post, index) => (
            <Post
              key={index}
              title={post.title}
              timestamp={post.timestamp}
              image={post.image}
              text={post.text}
            />
          ))}
        </div>
      </main>

      {/* Floating Button for Mobile */}
      <Button className="md:hidden fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg bg-[#34347B]">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
