import { useMemo, useState } from "react"
import { Folder, FileText, Home, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react"

function isDir(val) {
  return typeof val === "object" && val !== null
}

function getNodeAtPath(data, path) {
  let node = data
  for (const seg of path) {
    if (!node || typeof node !== "object") return null
    node = node[seg]
  }
  return node
}

function getEntries(node) {
  if (!node || typeof node !== "object") return []
  return Object.entries(node)
    .map(([name, val]) => ({ name, type: isDir(val) ? "dir" : "file" }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

function EntryCard({ name, type, index, onClick }) {
  const isFolder = type === "dir"
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index * 0.02, 0.3)}s` }}
      className="group reveal flex items-center gap-3 p-3 rounded-lg text-left
        bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14]
        hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all duration-200"
    >
      <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors
        ${isFolder ? "bg-primary/15 text-primary group-hover:bg-primary/25" : "bg-white/[0.05] text-gray-400"}`}>
        {isFolder ? <Folder size={17} /> : <FileText size={17} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-gray-100 truncate">{name}</span>
        <span className="block text-[11px] text-gray-500">{isFolder ? "Folder" : "File"}</span>
      </span>
      {isFolder && (
        <ChevronRight size={15} className="text-gray-600 group-hover:text-gray-300 transition-colors shrink-0" />
      )}
    </button>
  )
}

export default function RadialFileMap({ data }) {
  const [path, setPath] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)

  const node = useMemo(() => getNodeAtPath(data, path), [data, path])
  const entries = useMemo(() => getEntries(node), [node])

  const folders = entries.filter((e) => e.type === "dir").length
  const files = entries.length - folders
  const currentLabel = path.length === 0 ? "root" : path[path.length - 1]

  function openFolder(name) {
    setSelectedFile(null)
    setPath((prev) => [...prev, name])
  }
  function selectFile(name) {
    setSelectedFile([...path, name].join("/"))
  }
  function goUp() {
    setSelectedFile(null)
    setPath((prev) => prev.slice(0, -1))
  }

  return (
    <div className="glass-morphism rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
          <button
            onClick={() => { setSelectedFile(null); setPath([]) }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors
              ${path.length === 0 ? "text-white bg-white/[0.06]" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"}`}
          >
            <Home size={14} /> root
          </button>
          {path.map((seg, idx) => (
            <span key={idx} className="flex items-center gap-1 min-w-0">
              <ChevronRight size={13} className="text-gray-600 shrink-0" />
              <button
                onClick={() => { setSelectedFile(null); setPath(path.slice(0, idx + 1)) }}
                className={`px-2.5 py-1.5 rounded-lg truncate max-w-[160px] transition-colors
                  ${idx === path.length - 1 ? "text-white bg-white/[0.06]" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"}`}
              >
                {seg}
              </button>
            </span>
          ))}
        </nav>

        {path.length > 0 && (
          <button
            onClick={goUp}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-gray-300
              border border-white/[0.08] hover:border-white/[0.16] hover:text-white transition-all duration-200"
          >
            <ChevronLeft size={15} /> Up
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/15 text-primary shrink-0">
          <FolderOpen size={20} />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{currentLabel}</div>
          <div className="text-xs text-gray-500">
            {folders} folder{folders === 1 ? "" : "s"} · {files} file{files === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          <FolderOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">This folder is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {entries.map((item, idx) => (
            <EntryCard
              key={item.name}
              name={item.name}
              type={item.type}
              index={idx}
              onClick={() => (item.type === "dir" ? openFolder(item.name) : selectFile(item.name))}
            />
          ))}
        </div>
      )}

      <div className="mt-5 text-sm text-gray-500">
        {selectedFile ? (
          <span>Selected: <span className="text-gray-200 font-mono text-[13px]">{selectedFile}</span></span>
        ) : (
          <span>Open a folder to navigate, or select a file to see its path.</span>
        )}
      </div>
    </div>
  )
}
