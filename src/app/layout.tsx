import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], style: "italic", variable: "--font-instrument-serif" });

export const metadata: Metadata = {
  title: "Flowchart AI",
  description: "Collaborative Agentic Flowchart Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased bg-black text-white`}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="bg-video fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-40"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
