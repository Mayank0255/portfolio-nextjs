import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ChatBot } from "@/components/ChatBot";

export const metadata: Metadata = {
  title: "Mayank Aggarwal | Portfolio",
  description: "Software Development Engineer at Zomato. Building scalable systems and passionate about open-source.",
  keywords: ["Software Engineer", "Full Stack Developer", "Golang", "React", "Portfolio"],
  authors: [{ name: "Mayank Aggarwal" }],
  icons: {
    icon: "/images/avatar.png",
    apple: "/images/avatar.png",
  },
  openGraph: {
    title: "Mayank Aggarwal | Portfolio",
    description: "Software Development Engineer at Zomato",
    type: "website",
  },
};

// Single source of truth: script runs before paint and sets class from localStorage
const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    const isDark = theme !== 'light';
    document.documentElement.classList.toggle('dark', isDark);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <PortfolioProvider>
          {children}
          <ChatBot />
        </PortfolioProvider>
      </body>
    </html>
  );
}
