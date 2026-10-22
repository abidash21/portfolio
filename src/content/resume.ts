export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
};

export const profile = {
  name: "Abinash Dash",
  role: "Software Engineer",
  summary:
    "Software engineer building lending systems at Equall, with Spring Boot, Kafka and Kotlin. Based in Bengaluru.",
  email: "abinashdash2025@gmail.com",
  resume: "/Abinash_Dash_Resume.pdf",
  whatsapp: "https://wa.me/919178237403",
  links: [
    { label: "GitHub", href: "https://github.com/abidash21" },
    { label: "LinkedIn", href: "https://linkedin.com/in/dashabinash02" },
    { label: "WhatsApp", href: "https://wa.me/919178237403" },
  ],
};

export const roles: Role[] = [
  {
    company: "Equall (LTCV Credit)",
    role: "Software Engineer",
    location: "Bengaluru",
    period: "Aug 2025 – Present",
    highlights: [
      "Built the post-disbursal insurance workflow end to end: third-party APIs for policy creation and PDF retrieval, with Kafka dead-letter queues retrying failed operations on their own.",
      "Owned a configurable, graph-based journey engine end to end, used to streamline Top-Up loan journeys.",
      "Built the monthly pre-approved offer re-evaluation pipeline on that engine, taking manual work off the Risk Team.",
      "Built a server-side document engine (Thymeleaf, OpenHTMLtoPDF) that generates Key Fact Statements, loan agreements, sanction letters and e-applications.",
      "Integrated AML and PEP compliance screening through TransUnion's API, with applicant PII exchanged under AES-256-GCM + RSA-OAEP-SHA256 hybrid encryption and the decrypted XML and Base64 PDFs parsed into the rules-engine pipeline.",
      "Shipped Kotlin Multiplatform and Jetpack Compose screens (KYC, eSign, eMandate, banking, payments) and ReactJS features with analytics tracking on the website.",
    ],
  },
  {
    company: "Samsung R&D Institute",
    role: "Software Development Intern",
    location: "Delhi",
    period: "Jan 2025 – Jul 2025",
    highlights: [
      "Deployed the Device Guard app with C# on Tizen .NET, showing real-time access restrictions based on EMI payment status.",
      "Reduced call latency in a doorbell caller app (Tizen .NET, One UI) for real-time video and audio on smart devices.",
    ],
  },
];

export const skills = [
  { group: "Languages", items: ["Java", "Kotlin", "C++", "JavaScript"] },
  {
    group: "Backend & distributed systems",
    items: [
      "Spring Boot",
      "REST APIs",
      "Microservices",
      "Apache Kafka",
      "Hibernate/JPA",
      "Liquibase",
      "System design",
    ],
  },
  { group: "Databases", items: ["PostgreSQL", "MongoDB"] },
  {
    group: "Tools & practices",
    items: ["Git", "SigNoz", "Amazon S3", "DSA", "OOP", "DBMS"],
  },
  {
    group: "AI tools",
    items: ["Claude", "GPT", "Gemini", "GitHub Copilot"],
  },
];

export const education = {
  school: "Birla Institute of Technology, Mesra",
  degree: "B.Tech, Computer Science and Engineering",
  detail: "CGPA 8.76",
  period: "2021 – 2025",
};

export const achievements = [
  "Joint Treasurer, IEEE BIT Mesra: finances and coding events for Pantheon '24.",
  "Sponsorship Lead, EDC BIT Mesra: partnerships for E-Summit '23 and Inventor's Forge.",
];

export const ratings = [
  {
    site: "LeetCode",
    rating: "1763",
    href: "https://leetcode.com/u/abidash21/",
  },
  {
    site: "CodeChef",
    rating: "1440",
    note: "2 star",
    href: "https://www.codechef.com/users/bruce_wayne485",
  },
  {
    site: "Codeforces",
    rating: "1207",
    note: "Pupil",
    href: "https://codeforces.com/profile/bruce_wayne0485",
  },
];
