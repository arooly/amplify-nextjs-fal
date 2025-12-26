"use client";

import { useState } from "react";
import "./../app/app.css";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateImage() {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt,
          image_size: "square_hd",
        },
        pollInterval: 5000,
        logs: true,
        onQueueUpdate(update) {
          console.log("queue update", update);
        },
      });

      const imageUrl = result.data.images[0].url;
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>
          Generate Image with fal.ai
        </h1>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image prompt..."
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isGenerating) {
                generateImage();
              }
            }}
          />
        </div>
        <button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: isGenerating ? "#ccc" : "#0070f3",
            color: "white",
            cursor: isGenerating ? "not-allowed" : "pointer",
          }}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </button>
        {imageUrl && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={imageUrl}
              alt="Generated"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
