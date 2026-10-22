import { profile } from "@/content/resume";

type ResumeButtonsProps = {
  variant?: "solid" | "outline";
  size?: "sm" | "md";
};

const variants = {
  solid: {
    view: "bg-accent text-bg transition-colors duration-150 hover:bg-ink",
    download:
      "border-l border-bg/25 bg-accent text-bg transition-colors duration-150 hover:bg-ink",
  },
  outline: {
    view: "btn-outline",
    download: "btn-outline -ml-px",
  },
};

const sizes = {
  sm: { view: "px-4 py-2 text-[15px]", download: "px-3", icon: 16 },
  md: { view: "px-5 py-3", download: "px-4", icon: 18 },
};

// Split button: the label opens the PDF in a new tab, the icon saves it.
export function ResumeButtons({
  variant = "solid",
  size = "md",
}: ResumeButtonsProps) {
  const v = variants[variant];
  const s = sizes[size];
  return (
    <div className="flex">
      <a
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
        className={`press rounded-l-full font-medium ${s.view} ${v.view}`}
      >
        Resume
      </a>
      <a
        href={profile.resume}
        download
        title="Download resume"
        className={`press flex items-center rounded-r-full ${s.download} ${v.download}`}
      >
        <svg
          aria-hidden="true"
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v11" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 20h14" />
        </svg>
        <span className="sr-only">Download resume</span>
      </a>
    </div>
  );
}
