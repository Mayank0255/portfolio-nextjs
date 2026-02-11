"use client";

import { Sidebar } from "@/components/Sidebar";
import { TrendingTopics } from "@/components/TrendingTopics";
import { TopBar } from "@/components/TopBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen main-wrapper-bg">
      <Sidebar />
      <div className="md:ml-72 lg:ml-80">
        <TopBar />
        <main className="p-6 pt-4 md:pt-6 lg:p-12 lg:pt-6 min-h-screen flex gap-8">
          <div className="flex-1 min-w-0">{children}</div>
          <TrendingTopics />
        </main>
      </div>
    </div>
  );
}
