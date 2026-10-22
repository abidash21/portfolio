import { ResumeButtons } from "@/components/resume-buttons";
import { profile } from "@/content/resume";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between gap-6 py-6">
      <a
        href="#top"
        className="press text-[17px] font-medium tracking-[-0.01em]"
      >
        {profile.name}
      </a>
      <nav aria-label="Primary" className="flex items-center gap-6">
        <ul className="hidden items-center gap-2 font-mono text-[13px] tracking-[0.08em] text-muted uppercase sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link block px-2 py-2.5">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <ResumeButtons size="sm" />
      </nav>
    </header>
  );
}
