export interface Post {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  date: string;
  categories: string[];
  tags: string[];
  pin?: boolean;
  workTime?: string;
  image?: { src: string; alt?: string };
}

export interface PortfolioData {
  profile: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  social: {
    github: string;
    linkedin: string;
    medium: string;
    email: string;
  };
  about: string;
  experience: {
    id: string;
    company: string;
    role: string;
    period: string;
    workType: string;
    description: string;
    technologies: string[];
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    link: string;
    stars?: number;
    technologies: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  timeline: {
    id: string;
    date: string;
    title: string;
    description: string;
    type: 'education' | 'work' | 'achievement' | 'certification' | 'publication';
  }[];
  posts: Post[];
}

export const defaultPortfolio: PortfolioData = {
  profile: {
    name: "Mayank Aggarwal",
    title: "Software Development Engineer-2 at Zomato-Ads",
    avatar: "/images/avatar.png",
    bio: "Building scalable ad systems at Zomato. Passionate about open-source and distributed systems.",
  },
  social: {
    github: "https://github.com/Mayank0255",
    linkedin: "https://www.linkedin.com/in/mayank-aggarwal-14301b168",
    medium: "https://medium.com/@mayank0255",
    email: "mayank2aggarwal@gmail.com",
  },
  about: `I'm currently a Software Development Engineer 2 at Zomato in the Ads Team. I own the Ads Serving Service, adept at managing peak loads of up to 350k RPM and successfully conducting load tests at 1.5M RPM. My role involves driving technical innovations that directly contribute to substantial revenue growth and platform relevance for our Ads business.

At Zomato, I've led major initiatives to reduce gRPC latency and strengthen system resilience, utilizing cutting-edge technologies like Apache Flink. My technical skills are diverse, ranging across Golang, JavaScript, PHP, and Python. Prior to my current role, I was integral in migrating the Ads Creation System from a PHP-based monolith to a robust Golang Microservices architecture, while also developing the Ads platform using React.js. This showcases my versatility in handling both frontend and backend development.

Beyond my professional endeavors, I am passionate about open-source projects and have led projects like a ![StackOverflow](https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg) [StackOverflow Clone](https://github.com/Mayank0255/Stackoverflow-Clone-Frontend) and [Amegma Galaxy Attack](https://github.com/Amegma/Galaxy-Attack), both of which have garnered significant attention and community engagement on GitHub.

I am keen to connect with fellow technology enthusiasts and explore potential collaborations or opportunities. Feel free to reach out through my ![LinkedIn](https://upload.wikimedia.org/wikipedia/commons/f/f8/LinkedIn_icon_circle.svg) [LinkedIn](https://www.linkedin.com/in/mayank-aggarwal-14301b168) or check out my ![GitHub](https://upload.wikimedia.org/wikipedia/commons/a/ae/Github-desktop-logo-symbol.svg) [GitHub](https://github.com/Mayank0255) to learn more about my projects and professional journey.`,
  experience: [
    {
      id: "exp-1",
      company: "Zomato",
      role: "Software Development Engineer 2",
      period: "July 2023 - Present",
      workType: "Full-Time",
      description: "Ad-Tech and Search. Dedicated to the Ads team, focusing on crafting tech-driven solutions that fuel restaurant's growth. Currently own the Ads Serving Service, which runs on 350k RPM at peak and is load tested at 1.5M RPM. Worked on optimisations to reduce gRPC latency and system resiliency from transactional to feedback systems built on Apache Flink. For Ads business, worked on multiple target pacing and Ads ranking logic to increase Ads revenue and platform relevancy.",
      technologies: ["Go", "Apache Flink", "Redis", "MongoDB", "Apache Kafka", "AWS", "DynamoDB", "MySQL", "gRPC", "Prometheus", "PHP", "React.js"],
    },
    {
      id: "exp-2",
      company: "Zomato",
      role: "Software Development Engineer",
      period: "July 2022 - July 2023",
      workType: "Full-Time",
      description: "Worked at Zomato in the Ad-Tech Team. Started working on the complete Ads Creation and Billing system, building better platforms to increase booked revenue. Worked on React.js, PHP and Golang to migrate the Ads Creation System from monolith written in PHP to Golang Microservice and Ads platform written in React.js. Then transitioned to Ads Targeting System from Creation pod.",
      technologies: ["Go", "Redis", "MongoDB", "Apache Kafka", "AWS", "MySQL", "PHP", "React.js", "Redux", "Python", "JavaScript", "Grafana", "Kibana", "New Relic"],
    },
    {
      id: "exp-3",
      company: "Zomato",
      role: "Software Developer Intern",
      period: "Jan 2022 - June 2022",
      workType: "Full-Time",
      description: "Joined the Ads team and was entrusted with full ownership of the Ads Creation Platform on Zomato's restaurant partner app. Led the integration of multiple ad products, enhancing platform versatility and utility for restaurant owners. Streamlined the complete ad creation process, from campaign initiation to performance tracking. Achieved a 2-3x increase in user traffic with ads on the merchant app through targeted optimizations.",
      technologies: ["MongoDB", "Apache Kafka", "AWS", "MySQL", "PHP", "React.js", "Redux", "Python", "JavaScript", "Grafana", "ETL"],
    },
    {
      id: "exp-4",
      company: "Dirio",
      role: "Software Developer Intern",
      period: "June 2021 - Dec 2021",
      workType: "Part-Time",
      description: "Dirio is a UK-based startup led by a team of well-experienced people with 20+ years of experience each. Responsibilities were as a FullStack developer-oriented towards the front end and user interface technologies, with server-side work as well. Used React.js with TypeScript on the front-end and Python on the back-end, on a Linux environment.",
      technologies: ["React.js", "TypeScript", "CSS", "Python", "Git", "JavaScript"],
    },
    {
      id: "exp-5",
      company: "GirlScript Summer of Code",
      role: "Open Source Contributor",
      period: "Feb 2021 - May 2021",
      workType: "Part-Time",
      description: "GirlScript Summer of Code is a 3 month-long Open Source program during summers conducted by GirlScript Foundation, with an aim to help beginners get started with Open Source Development. Contributed to two Open Source projects, mostly in the back-end code base using Node.js, React.js, and MongoDB.",
      technologies: ["MongoDB", "Express.js", "Node.js", "React.js", "JavaScript", "Git"],
    },
    {
      id: "exp-6",
      company: "Techpot",
      role: "Junior Developer",
      period: "Feb 2021 - May 2021",
      workType: "Part-Time",
      description: "Worked with the creator of Techpot (techpot.io), a curated platform for developer resources for various programming languages. Worked on intermediate tasks and as a data maintainer using Node.js, Next.js, and PostgreSQL.",
      technologies: ["Node.js", "Next.js", "PostgreSQL", "NestJS", "JavaScript", "Git"],
    },
    {
      id: "exp-7",
      company: "Chegg",
      role: "Subject Matter Expert",
      period: "Oct 2020 - Feb 2021",
      workType: "Part-Time",
      description: "Worked as a Subject Matter Expert answering Computer Science related questions asked by students. Also helped in revision of Computer Science topics and concepts.",
      technologies: ["Computer Science", "Data Structures", "Algorithms"],
    },
    {
      id: "exp-8",
      company: "Stack Finance",
      role: "Back-end Developer Intern",
      period: "May 2020 - July 2020",
      workType: "Full-Time",
      description: "Worked on building a Package for a specific feature integrating third-party APIs. Worked on building/analyzing schemas and web sockets. Built API Docs for the Back-end API. Built user flows for research tasks like UPI and KYC.",
      technologies: ["MongoDB", "Express.js", "Node.js", "JavaScript", "Git", "Postman"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "StackOverflow Clone",
      description: "A clone project of a famously known QnA Website, built using MySQL, Sequelize, Express, React and Node.js. Deployed on Vercel and Render. The project has gathered 500+ GitHub stars on Frontend and 100+ stars on Backend. Converted into an open-source project with 8-9 active contributors.",
      link: "https://github.com/Mayank0255/Stackoverflow-Clone-Frontend",
      stars: 500,
      technologies: ["React.js", "Redux", "Node.js", "Express.js", "MySQL", "Sequelize", "SASS", "Bootstrap"],
    },
    {
      id: "proj-2",
      name: "Amegma Galaxy Attack",
      description: "An inspiration of the original Atari Space Invaders game built in PyGame. Part of an open-source gaming organization called Amegma. Features multiple levels and classic arcade gameplay.",
      link: "https://github.com/Amegma/Galaxy-Attack",
      stars: 100,
      technologies: ["Python", "PyGame", "Git"],
    },
    {
      id: "proj-3",
      name: "Resume Chat-Bot",
      description: "A Messenger Chat bot that generates a resume based on questions asked by the bot. Uses Facebook Messenger WebHook integration and generates LaTeX resumes.",
      link: "https://github.com/Mayank0255/Resume-Bot",
      technologies: ["Node.js", "Express.js", "Facebook Messenger API", "LaTeX", "CSS", "Bootstrap"],
    },
    {
      id: "proj-4",
      name: "MovieSurfer",
      description: "An inspiration of websites like IMDB & Rotten Tomatoes. Full-stack movie browsing application using TMDB API with MongoDB backend.",
      link: "https://github.com/Mayank0255/Movie-Surfer",
      technologies: ["Node.js", "Express.js", "MongoDB", "TMDB API", "HTML", "CSS", "Bootstrap"],
    },
    {
      id: "proj-5",
      name: "Blog Site",
      description: "A Blog Application that provides users accessibility to perform most of the necessary functionalities including creating, editing, and managing blog posts.",
      link: "https://github.com/Mayank0255/Blog-Site",
      technologies: ["Node.js", "Express.js", "MySQL", "HTML", "CSS", "Semantic UI"],
    },
  ],
  skills: [
    {
      category: "Languages",
      items: ["Golang", "JavaScript", "TypeScript", "Python", "PHP", "SQL", "Java", "C"],
    },
    {
      category: "Backend",
      items: ["gRPC", "REST APIs", "Microservices", "Apache Flink", "Apache Kafka", "Node.js", "Express.js", "NestJS"],
    },
    {
      category: "Frontend",
      items: ["React.js", "Redux", "Next.js", "HTML5", "CSS3", "SASS", "Bootstrap", "Tailwind CSS"],
    },
    {
      category: "Databases",
      items: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "DynamoDB", "Elasticsearch"],
    },
    {
      category: "DevOps & Tools",
      items: ["AWS", "Kubernetes", "Docker", "Git", "GitHub", "CI/CD", "Prometheus", "Grafana", "Kibana", "New Relic"],
    },
    {
      category: "Other",
      items: ["Data Structures", "Algorithms", "System Design", "ETL", "Data Mining", "Postman"],
    },
  ],
  timeline: [
    {
      id: "tl-1",
      date: "July 2023",
      title: "Software Development Engineer 2 at Zomato",
      description: "Promoted to SDE-2 in the Ads Team. Took ownership of Ads Serving Service handling 350k RPM.",
      type: "work",
    },
    {
      id: "tl-2",
      date: "July 2022",
      title: "Software Development Engineer at Zomato",
      description: "Converted to full-time SDE. Worked on Ads Creation, Billing, and Targeting systems.",
      type: "work",
    },
    {
      id: "tl-3",
      date: "June 2022",
      title: "Bachelor of Technology from Manipal University Jaipur",
      description: "B.Tech in Information Technology with CGPA 8.43. Core coursework in Data Structures, Algorithms, DBMS, and Software Engineering.",
      type: "education",
    },
    {
      id: "tl-4",
      date: "Jan 2022",
      title: "Software Developer Intern at Zomato",
      description: "Joined Zomato Ads team. Owned the Ads Creation Platform on restaurant partner app.",
      type: "work",
    },
    {
      id: "tl-5",
      date: "Dec 2021",
      title: "Research Publication - Crime Analysis in India",
      description: "Published 'A Study of Lightweight Approaches to Analyze Crime Conditions in India' on Taylor & Francis Online.",
      type: "publication",
    },
    {
      id: "tl-6",
      date: "July 2021",
      title: "Amegma Galaxy Attack Released",
      description: "Released the space shooter game inspired by Atari Space Invaders, built with PyGame.",
      type: "achievement",
    },
    {
      id: "tl-7",
      date: "June 2021",
      title: "Software Developer Intern at Dirio",
      description: "Joined UK-based startup as a FullStack developer working with React.js, TypeScript, and Python.",
      type: "work",
    },
    {
      id: "tl-8",
      date: "Feb 2021",
      title: "Open Source Contributor at GirlScript Summer of Code",
      description: "Contributed to two Open Source projects in Node.js, React.js, and MongoDB.",
      type: "work",
    },
    {
      id: "tl-9",
      date: "Feb 2021",
      title: "Junior Developer at Techpot",
      description: "Worked on techpot.io, a curated platform for developer resources.",
      type: "work",
    },
    {
      id: "tl-10",
      date: "Oct 2020",
      title: "Subject Matter Expert at Chegg",
      description: "Started answering Computer Science questions for students.",
      type: "work",
    },
    {
      id: "tl-11",
      date: "Aug 2020",
      title: "AlgoExpert Certification",
      description: "Completed AlgoExpert Python course for coding interview preparation with 100+ problems.",
      type: "certification",
    },
    {
      id: "tl-12",
      date: "May 2020",
      title: "Back-end Developer Intern at Stack Finance",
      description: "Built APIs, schemas, and web sockets. Worked on UPI and KYC user flows.",
      type: "work",
    },
    {
      id: "tl-13",
      date: "Apr 2020",
      title: "Complete React Developer - Udemy",
      description: "Completed comprehensive React.js development course on Udemy.",
      type: "certification",
    },
    {
      id: "tl-14",
      date: "Apr 2020",
      title: "StackOverflow Clone Released",
      description: "Released the StackOverflow Clone project. Now has 500+ GitHub stars with active contributors.",
      type: "achievement",
    },
    {
      id: "tl-15",
      date: "Oct 2019",
      title: "The Web Developer Bootcamp - Udemy",
      description: "Completed full-stack web development bootcamp covering HTML, CSS, JavaScript, Node.js, and MongoDB.",
      type: "certification",
    },
    {
      id: "tl-16",
      date: "Nov 2019",
      title: "MovieSurfer Project",
      description: "Built MovieSurfer - an IMDB/Rotten Tomatoes inspired movie browsing application.",
      type: "achievement",
    },
    {
      id: "tl-17",
      date: "2018",
      title: "Started B.Tech at Manipal University Jaipur",
      description: "Enrolled in Bachelor of Technology - Information Technology program.",
      type: "education",
    },
    {
      id: "tl-18",
      date: "2018",
      title: "Higher Secondary from Delhi Public School, Sushant Lok",
      description: "Completed Class 12 with Science (Non-Medical) stream. Scored 85.2%.",
      type: "education",
    },
  ],
  posts: [],
};

import staticPostsJson from "./posts.json";

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.flatMap((t) =>
    typeof t === "string" && t.includes(",") ? t.split(",").map((s) => s.trim()) : typeof t === "string" ? [t] : []
  );
}

export function getStaticPortfolio(): PortfolioData {
  return {
    ...defaultPortfolio,
    posts: (staticPostsJson as Post[]).map((p) => ({
      ...p,
      tags: normalizeTags(p.tags),
    })),
  };
}
