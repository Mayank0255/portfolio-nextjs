import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ChatBot } from "@/components/ChatBot";

const SITE_URL = "https://mayankaggarwal.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mayank Aggarwal | Software Engineer at Zomato",
    template: "%s | Mayank Aggarwal",
  },
  description:
    "Software Development Engineer at Zomato specializing in Golang, distributed systems, and scalable ad-serving infrastructure handling 350k+ RPM. Open-source contributor and full-stack developer.",
  keywords: [
    "Mayank Aggarwal",
    "Software Engineer",
    "Zomato",
    "Golang",
    "React",
    "Full Stack Developer",
    "Distributed Systems",
    "Ad Tech",
    "Open Source",
    "Portfolio",
  ],
  authors: [{ name: "Mayank Aggarwal", url: SITE_URL }],
  creator: "Mayank Aggarwal",
  icons: {
    icon: "/images/avatar.png",
    apple: "/images/avatar.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Mayank Aggarwal | Software Engineer at Zomato",
    description:
      "SDE-2 at Zomato Ads. Building scalable ad-serving systems handling 350k+ RPM. Golang, React, distributed systems.",
    type: "website",
    url: SITE_URL,
    siteName: "Mayank Aggarwal",
    locale: "en_US",
    images: [
      {
        url: "/images/avatar.png",
        width: 512,
        height: 512,
        alt: "Mayank Aggarwal",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Mayank Aggarwal | Software Engineer at Zomato",
    description:
      "SDE-2 at Zomato Ads. Golang, React, distributed systems. Open-source contributor.",
    images: ["/images/avatar.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for Person + WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mayank Aggarwal",
      url: SITE_URL,
      jobTitle: "Software Development Engineer 2",
      worksFor: {
        "@type": "Organization",
        name: "Zomato",
        url: "https://www.zomato.com",
      },
      description:
        "Software Development Engineer at Zomato specializing in Golang, distributed systems, and scalable ad-serving infrastructure.",
      image: `${SITE_URL}/images/avatar.png`,
      sameAs: [
        "https://github.com/Mayank0255",
        "https://www.linkedin.com/in/mayank-aggarwal-14301b168",
        "https://medium.com/@mayank0255",
      ],
      knowsAbout: [
        "Golang",
        "React",
        "JavaScript",
        "TypeScript",
        "Distributed Systems",
        "gRPC",
        "Apache Flink",
        "Microservices",
        "Ad Tech",
        "Open Source",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mayank Aggarwal",
      description: "Portfolio and blog of Mayank Aggarwal, Software Engineer at Zomato",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
