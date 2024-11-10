import React from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const testimonials = [
  {
    quote:
      "I worked on HackSC Hackathon at USC and worked on the Phantom login integration to make sure the user's wallet is connected when they upload their journals",
    name: "Mo Mamoon",
    title: "A Night at HackSC",
  },
  {
    quote: "I grinded 9 hours to get the API working.",
    name: "Mohsin Khawaja",
    title: "I Hate APIs",
  },
  {
    quote:
      "I crashed out today because Mohsin took 9 hours on the API, but parkside dining hall was fire today.",
    name: "Zain Khatri",
    title: "Egomaniac crashes out",
  },
  {
    quote: "I love love. I also made the button green.",
    name: "Bilal Mulic",
    title: "FEIN",
  },
  {
    quote: "I cant quite fathom the western idealism.",
    name: "Haadi Razzak",
    title: "FENT",
  },
];

const words = `A decentralized journal social media platform.`;

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      <BackgroundLines className="flex items-center justify-center w-full bg-black">
        {/* Header */}
        <header className="flex justify-between w-full p-5 absolute top-0 z-20">
          <div className="text-2xl font-medium ml-5">Momentum</div>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mr-5 hover:bg-blue-600">
            Sign Up
          </button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center w-full flex-1 relative">
          {/* Spotlight Effect */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <Spotlight className="absolute top-0 left-0 w-full h-full md:w-2/3" fill="white" />
          </div>

          {/* Title and Description */}
          <div className="relative z-10 text-center p-4 mt-20">
            <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Momentum
            </h1>
            <TextGenerateEffect words={words} className="mt-2 text-lg text-white max-w-md mx-auto" />
          </div>

          {/* Infinite Moving Cards */}
          <div className="w-full mt-2 mb-20 max-w-5xl px-4">
            <div className="h-[24rem] rounded-md flex flex-col items-center justify-center relative overflow-hidden dark:bg-black dark:bg-grid-white/[0.05]">
              <InfiniteMovingCards items={testimonials} direction="right" speed="normal" />
            </div>
          </div>
        </main>
      </BackgroundLines>
    </div>
  );
};

export default HomePage;
