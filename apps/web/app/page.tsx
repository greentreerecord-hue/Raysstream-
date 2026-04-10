import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Ray'sStream 🚀</h1>
      <p>Your platform is live.</p>

      <div style={{ marginTop: "20px" }}>
        <a href="/api/videos/upload">
          Test API Route
        </a>
      </div>
    </main>
  );
} 
