"use client"
import LoginCard from "@/components/logincard";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function LoginPage() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full bg-black">
    <div className="">
      {/* Background Lines with lower z-index */}
      

      {/* Content on top of the background */}
      <div className="relative z-10 flex items-center justify-center">
        <LoginCard />
      </div>
      
    </div>
    </BackgroundLines>
  );
}
