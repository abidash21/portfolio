import { Education } from "./_components/education";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Skills } from "./_components/skills";
import { Work } from "./_components/work";

export default function Home() {
  return (
    <div id="top" className="mx-auto max-w-300 px-4 sm:px-6 md:px-8">
      <Header />
      <main className="flex flex-col gap-28 pb-28 md:gap-40 md:pb-40">
        <Hero />
        <Work />
        <Skills />
        <Education />
      </main>
      <Footer />
    </div>
  );
}
