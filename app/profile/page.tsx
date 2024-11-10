"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";

const links = [
  {
    label: "Feed",
    href: "#",
    icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Profile",
    href: "#",
    icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: "#",
    icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

export default function Component() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <div className="w-[20%] md:w-[15%] bg-gray-100 dark:bg-neutral-800">
          <Sidebar>
            <SidebarBody>
              {links.map((link, index) => (
                <SidebarLink key={index} link={link} />
              ))}
            </SidebarBody>
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="relative">
            {/* Background Image */}
            <div className="h-48 md:h-64 relative">
              <Image
                src="/profilebackground.svg"
                alt="Profile background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Profile Image */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/profileimage.svg"
                  alt="Profile picture"
                  fill
                  className="rounded-full border-4 border-background"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Journals Grid */}
          <div className="container mx-auto px-4 mt-20 md:mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((journal) => (
                <Link href="#" key={journal} className="block">
                  <Card className="h-48 transition-transform hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-center">Journal {journal}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
