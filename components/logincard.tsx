'use client';


import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

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
        <main className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
                <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                    Welcome to Momentum
                </h1>
                
                {!isPhantomInstalled ? (
                  <Card className="w-full max-w-md mx-auto ">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-center">Welcome to Momentum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 justify-center justify-contents-center" >
                      <a 
                            href="https://phantom.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
                        >
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" >
                              Install Phantom
                            </Button>
                        </a>
                      
                      
                    </CardContent>
                  </Card>
                ) : connected ? (
                    <div className="text-center space-y-4">
                        <p className="text-gray-200 text-lg">Connected with wallet:</p>
                        <div className="bg-black/30 p-4 rounded-lg backdrop-blur border border-white/10">
                            <p className="font-mono text-purple-300 break-all">
                                {publicKey?.toString()}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-gray-200 text-lg">Connect your Phantom wallet to continue</p>
                        <div className="flex justify-center">
                            <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 transition-all duration-200" />
                        </div>
                    </div>
                )}
        </main>
    );
}