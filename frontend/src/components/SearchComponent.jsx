import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Search as SearchIcon, Loader2, FolderSearch } from "lucide-react";
import RepoCard from "./RepoCard";
import { RepoCardSkeleton } from "./Skeleton";

export default function Search({ repos, onRepoSelect, onBack, setPrevPage }) {
  const navigate = useNavigate()

  const [searchby, setsearchby] = useState("language");
  const [keyword, setKeyword] = useState("");
  const [currentrepos, setcurrentrepos] = useState(repos)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    (async function handler(){
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/${searchby}/${keyword}`)
        const resData = await response.json()
        setcurrentrepos(resData)
      } catch (err) {
        console.error('Search failed', err)
      } finally {
        setLoading(false)
      }
    })()
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-10">
      <div className="reveal flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-1 tracking-tight">Search Repositories</h2>
          <p className="text-sm text-gray-500">Filter by language or keyword across the profile</p>
        </div>
        <button
          onClick={onBack}
          className="btn shrink-0 px-5 py-2.5 glass-morphism hover:border-white/15 text-gray-300 hover:text-white rounded-lg"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="reveal glass-morphism p-2 mb-8 flex flex-col md:flex-row gap-2" style={{ animationDelay: '0.06s' }}>
        <select
          value={searchby}
          onChange={(e) => setsearchby(e.target.value)}
          className="input-glow p-3 rounded-lg bg-white/[0.03] text-white border border-white/10 w-full md:w-48 cursor-pointer"
        >
          <option value="language">Language</option>
          <option value="search">Keyword</option>
        </select>
        <div className="relative w-full md:flex-1">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              if (e.target.value === '') setcurrentrepos(repos)
              setKeyword(e.target.value)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search repositories…"
            className="input-glow w-full pl-10 pr-4 py-3 rounded-lg bg-white/[0.03] text-white placeholder-gray-500 border border-white/10"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-70 hover:shadow-[0_8px_28px_-8px_rgba(99,102,241,0.7)]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <SearchIcon size={16} />}
          Search
        </button>
      </div>

      <div className="reveal flex items-center justify-between mb-5" style={{ animationDelay: '0.12s' }}>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Repositories
          <span className="text-sm text-gray-500 font-normal tabular-nums">{currentrepos.length}</span>
        </h2>
        <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>Recently Updated</span>
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>Has Stars</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <RepoCardSkeleton key={i} index={i} />)}
        </div>
      ) : currentrepos.length === 0 ? (
        <div className="glass-morphism p-16 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500">
            <FolderSearch size={20} />
          </div>
          <h3 className="text-base font-semibold text-gray-300 mb-1">No repositories found</h3>
          <p className="text-sm text-gray-500">Your profile may be empty, or the query returned no matches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentrepos.map((repo, index) => (
            <RepoCard
              key={index}
              index={index}
              repo={repo}
              onClick={() => {
                onRepoSelect(repo.name);
                navigate("/loading");
                setPrevPage('search')
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
