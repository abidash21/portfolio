export type Highlight = {
  figure?: string;
  text: string;
};

export type Role = {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: Highlight[];
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
      {
        figure: "67%",
        text: "customer insurance acceptance after I built the post-disbursal insurance workflow end to end: third-party APIs for policy creation and PDF retrieval, with Kafka dead-letter queues retrying failed operations on their own.",
      },
      {
        figure: "80%+",
        text: "faster Top-Up loan journeys on a configurable, graph-based journey engine I owned end to end.",
      },
      {
        figure: "90%+",
        text: "less Risk Team effort from the monthly pre-approved offer re-evaluation pipeline built on that engine, which now drives 30–35% of monthly disbursals.",
      },
      {
        figure: "200+",
        text: "loan applications a month get their Key Fact Statements, loan agreements, sanction letters and e-applications from a server-side document engine (Thymeleaf, OpenHTMLtoPDF).",
      },
      {
        figure: "AML",
        text: "and PEP compliance screening through TransUnion's API, with applicant PII exchanged under AES-256-GCM + RSA-OAEP-SHA256 hybrid encryption and the decrypted XML and Base64 PDFs parsed into the rules-engine pipeline.",
      },
      {
        figure: "40K+",
        text: "users served by 15+ Kotlin Multiplatform and Jetpack Compose screens (KYC, eSign, eMandate, banking, payments) and ReactJS features with analytics tracking on the website.",
      },
    ],
  },
  {
    company: "Samsung R&D Institute",
    role: "Software Development Intern",
    location: "Delhi",
    period: "Jan 2025 – Jul 2025",
    highlights: [
      {
        figure: "100K+",
        text: "devices run the Device Guard app I deployed with C# on Tizen .NET, showing real-time access restrictions based on EMI payment status.",
      },
      {
        figure: "30%",
        text: "lower call latency in a doorbell caller app (Tizen .NET, One UI) for real-time video and audio, targeted at 500K+ smart devices.",
      },
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
  { site: "LeetCode", rating: "1763" },
  { site: "CodeChef", rating: "1440", note: "2 star" },
  { site: "Codeforces", rating: "1207", note: "Pupil" },
];
