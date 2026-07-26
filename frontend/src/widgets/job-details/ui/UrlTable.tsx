import { UrlStatusBadge } from '../../../entities/job/ui/UrlStatusBadge';
import type { UrlResult } from '../../../entities/job/model/types';

interface UrlTableProps {
  results: UrlResult[];
}

export function UrlTable({ results }: UrlTableProps) {
  return (
    <div className="overflow-x-auto border border-zinc-800 rounded-lg">
      <table className="w-full text-sm text-left text-zinc-400">
        <thead className="text-[10px] text-zinc-500 uppercase tracking-wider bg-zinc-950 border-b border-zinc-800 font-mono">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">URL</th>
            <th scope="col" className="px-6 py-3 font-medium">Status</th>
            <th scope="col" className="px-6 py-3 font-medium">HTTP Status</th>
            <th scope="col" className="px-6 py-3 font-medium">Duration</th>
            <th scope="col" className="px-6 py-3 font-medium">Error</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res, idx) => (
            <tr key={idx} className="bg-zinc-950 border-b border-zinc-800 last:border-0 hover:bg-zinc-900/50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-zinc-200 truncate max-w-xs" title={res.url}>
                {res.url}
              </td>
              <td className="px-6 py-4">
                <UrlStatusBadge status={res.status} />
              </td>
              <td className="px-6 py-4">
                {res.httpStatus !== null ? (
                  <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">{res.httpStatus}</span>
                ) : (
                  <span className="text-zinc-600 font-mono">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {res.durationMs !== undefined ? (
                  <span className="text-zinc-400 font-mono text-xs">{(res.durationMs / 1000).toFixed(1)}s</span>
                ) : (
                  <span className="text-zinc-600 font-mono">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-red-400 font-mono text-xs">
                {res.error || <span className="text-zinc-600">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
