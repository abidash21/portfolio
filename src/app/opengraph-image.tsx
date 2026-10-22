import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/resume";
import { site } from "@/content/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "src/assets/fonts");
const bricolage = await readFile(join(fonts, "bricolage-grotesque-500.ttf"));
const jetbrains = await readFile(join(fonts, "jetbrains-mono-500.ttf"));

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#121315",
        // Same graph-paper grid as the site background.
        backgroundImage:
          "linear-gradient(rgba(236,236,232,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(236,236,232,0.05) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        color: "#ecece8",
        fontFamily: "Bricolage",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "JetBrains Mono",
          fontSize: 24,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#9a9ca3",
        }}
      >
        <span>{profile.role}</span>
        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64">
          <path
            d="M17 20 31 32 17 44"
            fill="none"
            stroke="#ecece8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="35" y="39" width="14" height="6" rx="1.5" fill="#3dff8f" />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 128,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 20,
            width: 120,
            height: 8,
            background: "#3dff8f",
          }}
        />
        <div
          style={{
            marginTop: 36,
            maxWidth: 900,
            fontSize: 36,
            lineHeight: 1.3,
            color: "#ecece8",
          }}
        >
          {site.shareDescription}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 500, style: "normal" },
        {
          name: "JetBrains Mono",
          data: jetbrains,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}
