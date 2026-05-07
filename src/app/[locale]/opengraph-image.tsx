import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Hemma";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Load font
  // Note: process.cwd() is the root of the project
  const geDinarTwo = await readFile(
    join(process.cwd(), "src/app/fonts/ge-dinar-two/GE-Dinar-Two-Medium.woff"),
  );

  // Load logo as base64
  const logoData = await readFile(
    join(process.cwd(), "public/logo.svg"),
    "base64",
  );
  const logoBase64 = `data:image/svg+xml;base64,${logoData}`;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #683c21 0%, #391d0f 100%)",
        position: "relative",
      }}
    >
      {/* Decorative background element */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.2)",
        }}
      />
      {/* Content Box */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <img src={logoBase64} alt="Hemma Logo" height="100" />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "geDinarTwo",
          data: geDinarTwo,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
