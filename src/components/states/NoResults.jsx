import { SearchX } from 'lucide-react';

export default function NoResults({ query, onClear }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span className="w-14 h-14 rounded-2xl bg-paper border border-line flex items-center justify-center mb-4">
        <SearchX className="w-7 h-7 text-ink-3" />
      </span>
      <h3 className="font-ui font-semibold text-lg text-ink">No results found</h3>
      {query ? <p className="mt-2 text-sm text-ink-2">No matches for “{query}”. Try different keywords or clear filters.</p> : <p className="mt-2 text-sm text-ink-2">Try adjusting your filters.</p>}
      {onClear && <button onClick={onClear} className="mt-5 rounded-xl border border-line bg-surface hover:bg-paper text-sm font-medium px-5 py-2.5 transition-colors">Clear filters</button>}
    </div>
  );
}
