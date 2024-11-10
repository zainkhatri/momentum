'use client';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { EvervaultCard, Icon } from "./ui/evervault-card";

export default function Component() {
    const { connected, publicKey } = useWallet();
    const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

    useEffect(() => {
        // Check if Phantom is installed
        if (typeof window !== 'undefined') {
            const isPhantom = window?.solana?.isPhantom;
            setIsPhantomInstalled(!!isPhantom);
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md mx-4">
                {!isPhantomInstalled ? (
                    <Card className="bg-neutral-900 text-white shadow-lg rounded-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome to Momentum</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center">
                            <p className="mb-4 text-neutral-300">Install Phantom to continue</p>
                            <a
                                href="https://phantom.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Install Phantom
                            </a>
                        </CardContent>
                    </Card>
                ) : connected ? (
                    <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-center max-w-sm mx-auto p-4 relative h-[30rem] bg-neutral-900 text-white rounded-lg">
                        <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                        <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                        <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                        <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                        <EvervaultCard text="Success" />

                        <p className="text-neutral-300 font-mono mt-4 text-sm text-center">
                            {publicKey?.toString()}
                        </p>

                        <a 
                            href="/profile" 
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 mt-4"
                        >
                            Get Started
                        </a>
                    </div>
                ) : (
                    <Card className="bg-neutral-900 text-white shadow-lg rounded-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome to Momentum</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center">
                            <p className="mb-4 text-neutral-300">Connect your Phantom wallet to continue</p>
                            <WalletMultiButton className="bg-blue-500 text-white hover:bg-blue-600 shadow-none" />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
