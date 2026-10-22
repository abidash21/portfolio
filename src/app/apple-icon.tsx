import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same mark as icon.svg, full-bleed: iOS applies its own corner mask.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#121315",
      }}
    >
      <svg aria-hidden="true" width="180" height="180" viewBox="0 0 64 64">
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
    </div>,
    size,
  );
}
