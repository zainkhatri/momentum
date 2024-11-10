"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundLines } from "@/components/ui/background-lines";
import Sidebar from "@/components/ui/sidebar"; // Import Sidebar component

export default function Component() {
  const [text, setText] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', text);
    setText(''); // Clear the input after submission

    // Redirect to feed page
    router.push('/feed');
  };

  return (
    <div className="flex min-h-screen relative bg-black">
      {/* Sidebar with higher z-index to ensure it's clickable */}
      <aside className="z-20">
        <Sidebar />
      </aside>

      {/* Main Content with Background Lines */}
      <BackgroundLines className="flex-1 bg-black z-10 relative">
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="relative z-10 w-full max-w-md flex items-center justify-center">
            <Card className="w-full max-w-md bg-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-white">Post Something</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent>
                  <Input
                    type="text"
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Post
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
}
