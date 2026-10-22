import { MachineArt } from "@/components/machine/art";
import { MachineScene } from "@/components/machine/scene";
import { Contact } from "./_components/contact";
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
      <main className="pb-16 md:pb-20">
        <MachineScene
          hero={<Hero />}
          figure={<MachineArt />}
          sections={
            <>
              <Work />
              <Skills />
              <Education />
            </>
          }
          contact={<Contact />}
        />
      </main>
      <Footer />
    </div>
  );
}
