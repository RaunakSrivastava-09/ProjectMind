import "./globals.css";

export const metadata = {
  title: "ProjectMind | AI Project Assistant",
  description:
    "Talk to your project. ProjectMind turns natural language into real project actions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}