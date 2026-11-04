# Abinash Dash — Portfolio

Personal portfolio of **Abinash Dash**, Software Engineer based in Bengaluru, building lending systems at Equall with Spring Boot, Kafka and Kotlin.

<!-- SCREENSHOT: replace this block with an image, e.g.
     ![Portfolio home page](docs/screenshot.png) -->

<p align="center">
  <br />
  <em>Screenshot coming soon</em>
  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</p>

## About

- **Current role:** Software Engineer at Equall (LTCV Credit), Bengaluru, Aug 2025 – Present
- **Previously:** Software Development Intern at Samsung Research and Development Institute, Delhi, Jan 2025 – Jul 2025
- **Education:** B.Tech, Computer Science and Engineering, Birla Institute of Technology, Mesra (2021 – 2025), CGPA 8.76
- **Focus:** Backend and distributed systems, loan journey engines, Kafka pipelines, document generation and compliance integrations

## Experience highlights

**Equall (LTCV Credit)**

- Built the post-disbursal insurance workflow end to end: third-party APIs for policy creation and PDF retrieval, with Kafka DLQ-based self-retry fallbacks. Drove a 67% customer insurance acceptance rate.
- Owned the configurable, graph-based Top-Up loan journey engine, cutting completion time by 80%+.
- Built the monthly pre-approved offer re-evaluation pipeline on that engine, reducing Risk Team effort by 90%+ and driving 30–35% of monthly loan disbursals.
- Delivered a server-side document engine (Thymeleaf, OpenHTMLtoPDF) producing Key Fact Statements, loan agreements, sanction letters and e-applications for 200+ monthly applications.
- Integrated TransUnion's AML/PEP screening API with AES-256-GCM + RSA-OAEP-SHA256 hybrid encryption for applicant PII.
- Built 15+ Kotlin Multiplatform and Jetpack Compose screens for the customer mobile app (KYC, eSign, eMandate, Banking, Payments) and shipped ReactJS features with analytics tracking, serving 40K+ users.

**Samsung Research and Development Institute**

- Deployed a Device Guard application to 100K+ devices using C# on Tizen .NET.
- Cut call latency by 30% in a doorbell caller application (Tizen .NET, One UI) targeted for 500K+ smart devices.

## Projects

- **DWELLING**: a full-stack real estate web app (ReactJS, ExpressJS, NodeJS, MongoDB, Sass) with property listings, image uploads, Leaflet maps, search filters, JWT authentication and Cloudinary media storage. Page load time improved by 20%.

## Skills

- **Languages:** Java, Kotlin, C++, JavaScript
- **Backend & distributed systems:** Spring Boot, REST APIs, Microservices, Apache Kafka, Hibernate/JPA, Liquibase, System Design
- **Databases:** PostgreSQL, MongoDB
- **Tools & practices:** Git, SigNoz, Amazon S3, Data Structures & Algorithms, OOP, DBMS
- **AI tools:** Claude, GPT, Gemini, GitHub Copilot

## Achievements

- Qualified for Round 3 in Walmart SparkPlug 2024 and Flipkart GRiD 6.0.
- Cleared the Samsung Software Competency (SWC) Test at Advanced and Pro levels.
- Competitive programming: LeetCode 1763 (max), CodeChef 1440 (2★, max), Codeforces 1207 (Pupil, max).
- Joint Treasurer, IEEE BIT Mesra (PANTHEON '24); Sponsorship Lead, EDC BIT Mesra (E-SUMMIT '23, Inventor's Forge).

## Links

- Resume: [`public/Abinash_Dash_Resume.pdf`](public/Abinash_Dash_Resume.pdf)
- GitHub: [github.com/abidash21](https://github.com/abidash21)
- LinkedIn: [linkedin.com/in/dashabinash02](https://linkedin.com/in/dashabinash02)

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and the React Compiler
- [Tailwind CSS 4](https://tailwindcss.com)
- [Motion](https://motion.dev) for animations
- [Biome](https://biomejs.dev) for linting and formatting
- [Vercel Analytics](https://vercel.com/docs/analytics) and Speed Insights
- Fonts: Bricolage Grotesque and JetBrains Mono via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Create a production build            |
| `npm run start`   | Serve the production build           |
| `npm run lint`    | Run Biome checks                     |
| `npm run format`  | Format the codebase with Biome       |

## Project structure

```
src/
├── app/                 # Routes, layout, metadata, SEO (sitemap, robots, OG images)
│   └── _components/     # Page sections: hero, work, skills, education, contact
├── components/          # Reusable UI: animations, machine figure, scroll progress
├── content/
│   ├── resume.ts        # Profile, roles, skills, education, achievements, ratings
│   └── site.ts          # Site title, description, SEO keywords
└── assets/fonts/        # Local font files
public/
└── Abinash_Dash_Resume.pdf
```

## Updating content

- Edit **`src/content/resume.ts`** to change experience, skills, education, achievements or contact links.
- Edit **`src/content/site.ts`** to change the site title, description and SEO keywords.
- Replace **`public/Abinash_Dash_Resume.pdf`** to update the downloadable resume.
- Set `NEXT_PUBLIC_SITE_URL` to the canonical domain once it is live. On Vercel, the production URL is used until then.

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
