import React, { useMemo } from "react";

function getVideoId(url) {
  try {
    if (!url) return null;
    // Handles: https://www.youtube.com/watch?v=ID or youtu.be/ID or .../embed/ID
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split("?")[0];
    return url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
  } catch {
    return null;
  }
}

function Equalizer({ className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-end gap-[3px] h-4",
        className,
      ].join(" ")}
      aria-label="Playing"
      title="Playing"
    >
      {/* 4 animated bars */}
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-red-400/90 animate-[eq_900ms_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}

      {/* Local keyframes (scoped via global stylesheet rules) */}
      <style>{`
        @keyframes eq {
          0%, 100% { height: 4px; opacity: .55; }
          25% { height: 14px; opacity: 1; }
          50% { height: 7px; opacity: .8; }
          75% { height: 12px; opacity: .95; }
        }
      `}</style>
    </span>
  );
}

export default function SongCard({ song, onPlay, isActive = false }) {
  const videoId = useMemo(() => getVideoId(song?.url), [song?.url]);
  const thumb = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "https://via.placeholder.com/480x270?text=Video";

  // purely UI; you can replace with real duration later
  const duration = "3:42";

  return (
    <button
      onClick={() => onPlay(song.url)}
      className={[
        "w-full text-left group rounded-2xl border transition",
        "border-white/10 bg-white/5 hover:bg-white/7",
        isActive ? "ring-2 ring-red-500/60 bg-white/7" : "",
      ].join(" ")}
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className="relative w-[168px] shrink-0 overflow-hidden rounded-xl bg-black/40">
          <img
            src={thumb}
            alt={song.title}
            className="h-[94px] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Active playing indicator on thumbnail */}
          {isActive ? (
            <div className="absolute left-2 bottom-2 flex items-center gap-2 rounded-md bg-black/70 px-2 py-1">
              <Equalizer />
              <span className="text-[11px] text-white/90">Playing</span>
            </div>
          ) : null}

          <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[11px] text-white">
            {duration}
          </div>

          {/* Play overlay */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
            <div className="rounded-full bg-black/70 px-3 py-2 text-sm">
              ▶ Play
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">
                {song.title}
              </div>
              <div className="mt-1 truncate text-xs text-white/60">
                {song.artist || "Unknown artist"}
              </div>
            </div>

            <div className="text-white/40 opacity-0 transition group-hover:opacity-100">
              ⋮
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {song.album ? (
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-white/70">
                {song.album}
              </span>
            ) : null}
            {song.genre ? (
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-white/70">
                {song.genre}
              </span>
            ) : null}
            {isActive ? (
              <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2 py-1 text-[11px] text-red-200">
                Now playing
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}