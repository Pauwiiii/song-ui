import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SongCard from "./components/SongCard";
import VideoPlayer from "./components/VideoPlayer";

function uniqSorted(values) {
  return Array.from(
    new Set(values.map((v) => (v ?? "").toString().trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
}

function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return (haystack ?? "")
    .toString()
    .toLowerCase()
    .includes(needle.toLowerCase());
}

function SongCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 shadow-lg">
      <div className="flex gap-3 animate-pulse">
        <div className="h-[94px] w-[168px] rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-20 rounded-full bg-white/10" />
            <div className="h-6 w-24 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [artist, setArtist] = useState("All");
  const [genre, setGenre] = useState("All");

  const API_URL = "/api/ochoa/songs";

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      const data = Array.isArray(res.data) ? res.data : [];
      setSongs(data);

      if (!currentVideo && data?.[0]?.url) {
        setCurrentVideo(data[0].url);
      }
    } catch {
      setError("Failed to load songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const artists = useMemo(
    () => ["All", ...uniqSorted(songs.map((s) => s.artist))],
    [songs]
  );

  const genres = useMemo(
    () => ["All", ...uniqSorted(songs.map((s) => s.genre))],
    [songs]
  );

  const filteredSongs = useMemo(() => {
    const q = query.trim();
    return songs.filter((s) => {
      const matchesArtist = artist === "All" || s.artist === artist;
      const matchesGenre = genre === "All" || s.genre === genre;

      const matchesQuery =
        !q ||
        includesInsensitive(s.title, q) ||
        includesInsensitive(s.artist, q) ||
        includesInsensitive(s.album, q) ||
        includesInsensitive(s.genre, q);

      return matchesArtist && matchesGenre && matchesQuery;
    });
  }, [songs, query, artist, genre]);

  const currentSong = useMemo(() => {
    if (!currentVideo) return null;
    return songs.find((s) => s.url === currentVideo) || null;
  }, [songs, currentVideo]);

  const clearFilters = () => {
    setQuery("");
    setArtist("All");
    setGenre("All");
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#07070c] via-[#0b0b14] to-[#0a0a12]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-4 px-5 py-3">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg grid place-items-center font-bold">
              ▶
            </div>
            <div>
              <div className="font-semibold tracking-wide">SongTube</div>
              <div className="text-xs text-white/40">Feel the sound</div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-2xl flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-inner">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search music..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-white/40"
              />
              <span className="text-white/40">⌕</span>
            </div>
          </div>

          <button
            onClick={fetchSongs}
            className="ml-auto px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr]">

        {/* SIDEBAR */}
        <aside className="hidden lg:block border-r border-white/10 p-5 bg-white/5 backdrop-blur-xl">
          <div className="space-y-4">

            <div className="text-xs text-white/40 uppercase tracking-widest">
              Filters
            </div>

            <select
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-sm"
            >
              {artists.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-sm"
            >
              {genres.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="w-full rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-white/10 py-2 text-sm hover:from-red-500/30"
            >
              Clear Filters
            </button>

            <div className="text-xs text-white/40">
              {filteredSongs.length} / {songs.length} songs
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="p-5 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

          {/* PLAYER */}
          <section className="space-y-4">
            <VideoPlayer videoUrl={currentVideo} />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
              <h1 className="text-xl font-semibold">
                {currentSong?.title || "Select a song"}
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {currentSong?.artist}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-200">
                {error}
              </div>
            )}
          </section>

          {/* LIST */}
          <aside className="space-y-3">
            <div className="flex justify-between text-sm text-white/60">
              <span>Up Next</span>
              <span>{loading ? "Loading..." : `${filteredSongs.length} results`}</span>
            </div>

            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SongCardSkeleton key={i} />
                ))
              : filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onPlay={setCurrentVideo}
                    isActive={song.url === currentVideo}
                  />
                ))}
          </aside>
        </main>
      </div>
    </div>
  );
}