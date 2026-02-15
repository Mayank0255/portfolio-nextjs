import type { Metadata } from "next";
import "./globals.css";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ChatBot } from "@/components/ChatBot";

const SITE_URL = "https://mayankaggarwal.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mayank Aggarwal | SDE 3 at Zomato Ads",
    template: "%s | Mayank Aggarwal",
  },
  description:
    "SDE 3 at Zomato building high-performance ad delivery systems serving 350k RPM. Golang, React.js, Apache Flink expert. Manipal grad scaling restaurant growth through tech innovation.",
  keywords: [
    "Mayank Aggarwal",
    "SDE 3 Zomato",
    "Software Development Engineer Zomato Ads",
    "Golang developer",
    "React.js developer",
    "Apache Flink",
    "gRPC optimization",
    "distributed systems engineer",
    "ad tech engineer India",
    "Zomato engineering",
    "full stack developer Gurgaon",
    "open source contributor",
    "Manipal University Jaipur",
  ],
  authors: [{ name: "Mayank Aggarwal", url: SITE_URL }],
  creator: "Mayank Aggarwal",
  icons: {
    icon: [
      { url: "/images/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Mayank Aggarwal | SDE 3 at Zomato Ads",
    description:
      "SDE 3 at Zomato building ad systems serving 350k RPM. Golang, React.js, Apache Flink. Manipal grad scaling restaurant ads through tech.",
    type: "website",
    url: SITE_URL,
    siteName: "Mayank Aggarwal",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Aggarwal | SDE 3 at Zomato Ads",
    description:
      "SDE 3 at Zomato building ad systems serving 350k RPM. Golang, React.js, Apache Flink expert.",
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

// Comprehensive JSON-LD: Person + WebSite + FAQPage
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Mayank Aggarwal",
      givenName: "Mayank",
      familyName: "Aggarwal",
      url: SITE_URL,
      jobTitle: "Software Development Engineer 3",
      worksFor: {
        "@type": "Organization",
        name: "Zomato",
        url: "https://www.zomato.com",
        department: "Ads Platform",
      },
      description:
        "SDE 3 at Zomato Ads building high-performance ad delivery systems serving 350k requests per minute. Owns the Ads Serving Service. Expert in Golang, React.js, Apache Flink, and gRPC. Successfully conducted load tests at 1.5M RPM.",
      image: `${SITE_URL}/images/avatar.png`,
      email: "mayank2aggarwal@gmail.com",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Manipal University Jaipur",
        url: "https://jaipur.manipal.edu",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gurgaon",
        addressRegion: "Haryana",
        addressCountry: "IN",
      },
      nationality: { "@type": "Country", name: "India" },
      sameAs: [
        "https://github.com/Mayank0255",
        "https://www.linkedin.com/in/mayank-aggarwal-14301b168",
        "https://medium.com/@mayank0255",
      ],
      knowsAbout: [
        "Golang",
        "React.js",
        "JavaScript",
        "TypeScript",
        "PHP",
        "Python",
        "gRPC",
        "Apache Flink",
        "Apache Kafka",
        "Redis",
        "MongoDB",
        "MySQL",
        "Amazon Web Services",
        "Amazon DynamoDB",
        "Distributed Systems",
        "Microservices Architecture",
        "Ad Tech",
        "Real-Time Bidding",
        "Open Source Development",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Software Development Engineer 3",
        occupationLocation: {
          "@type": "City",
          name: "Gurgaon",
        },
        skills:
          "Golang, React.js, Apache Flink, gRPC, Redis, MongoDB, Apache Kafka, AWS, Microservices",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mayank Aggarwal — SDE 3 at Zomato Ads",
      description:
        "Portfolio and engineering blog of Mayank Aggarwal, SDE 3 at Zomato Ads Platform. Golang, React.js, distributed systems, and open-source projects.",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is Mayank Aggarwal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mayank Aggarwal is a Software Development Engineer 3 at Zomato's Ads Platform team in Gurgaon, India. He owns the Ads Serving Service that handles 350,000 requests per minute at peak and has been load-tested at 1.5 million RPM. He graduated from Manipal University Jaipur with a B.Tech in Information Technology (2018-2022).",
          },
        },
        {
          "@type": "Question",
          name: "What does Mayank Aggarwal do at Zomato?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mayank owns the Ads Serving Service at Zomato, managing peak loads of 350k RPM. He led initiatives to reduce gRPC latency and strengthen system resilience using Apache Flink. He migrated the Ads Creation System from a PHP monolith to Golang Microservices and built the Ads platform frontend using React.js.",
          },
        },
        {
          "@type": "Question",
          name: "What is Mayank Aggarwal's tech stack?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mayank's primary tech stack includes Golang, React.js, JavaScript, TypeScript, PHP, and Python. He works extensively with Apache Flink, Apache Kafka, gRPC, Redis, MongoDB, MySQL, Amazon Web Services (AWS), DynamoDB, and Prometheus for monitoring.",
          },
        },
        {
          "@type": "Question",
          name: "What are Mayank Aggarwal's open source projects?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mayank's notable open-source projects include a full-featured StackOverflow Clone (frontend and backend) and Amegma Galaxy Attack, a space-shooter game. Both projects have garnered significant community engagement on GitHub under the handle Mayank0255.",
          },
        },
        {
          "@type": "Question",
          name: "Where did Mayank Aggarwal study?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mayank Aggarwal graduated with a B.Tech in Information Technology from Manipal University Jaipur (2018-2022). During his studies, he also completed certifications from IIT Bombay and NPTEL.",
          },
        },
      ],
    },
  ],
};

// Theme script runs before paint
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
