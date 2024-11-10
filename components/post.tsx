// components/ui/PostCard.tsx
"use client";

import Image from "next/image";

interface PostCardProps {
  title: string;
  timestamp: string;
  image: string;
  text: string;
}

export default function PostCard({ title, timestamp, image, text }: PostCardProps) {
  return (
    <div className="bg-neutral-900 text-white rounded-lg shadow-lg p-4 w-full">
      {/* Post Image */}
      <Image
        src={image}
        alt={title}
        width={800} // Adjust width as needed
        height={450} // Adjust height as needed
        className="w-full h-64 object-cover rounded-md"
      />
      
      {/* Post Content */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-gray-400">{timestamp}</p>
        <p className="mt-2">{text}</p>
      </div>
    </div>
  );
}
