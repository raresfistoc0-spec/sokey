import Image from "next/image";
export default function Home() {
  return (
      <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          SOKEY
        </h1>

        <p className="text-zinc-400 text-center mb-6">
          Tap. Connect. Share.
        </p>

        <button className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg mb-4">
          Open Spotify
        </button>

        <button className="w-full bg-white/10 hover:bg-white/20 transition-all duration-300 text-white font-semibold py-3 rounded-xl">
          Modify Link (PIN required)
        </button>

      </div>
    </div>
  )
}