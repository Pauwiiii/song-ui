import React, { useMemo } from "react";

function getEmbedUrl(url) {
  if (!url) return null;

  // More robust parsing than split("v=")
  try {
    // watch?v=
    if (url.includes("watch?v=")) {
      const id = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    // youtu.be/
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    // /embed/
    if (url.includes("/embed/")) {
      const id = url.split("/embed/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }

    // fallback
    const id = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

export default function VideoPlayer({ videoUrl }) {
  const embed = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

  if (!embed) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
        <div className="text-sm text-white/60">Select a song to start playing</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          className="h-full w-full"
          src={embed}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}