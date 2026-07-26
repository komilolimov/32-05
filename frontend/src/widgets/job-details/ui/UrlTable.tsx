import { UrlStatusBadge } from '../../../entities/job/ui/UrlStatusBadge';
import type { UrlResult } from '../../../entities/job/model/types';

interface UrlTableProps {
  results: UrlResult[];
}

export function UrlTable({ results }: UrlTableProps) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">URL</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">HTTP Status</th>
            <th scope="col" className="px-6 py-3">Duration</th>
            <th scope="col" className="px-6 py-3">Error</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res, idx) => (
            <tr key={idx} className="bg-white border-b last:border-0 hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs" title={res.url}>
                {res.url}
              </td>
              <td className="px-6 py-4">
                <UrlStatusBadge status={res.status} />
              </td>
              <td className="px-6 py-4">
                {res.httpStatus !== null ? (
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{res.httpStatus}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {res.durationMs !== undefined ? (
                  <span className="text-gray-600">{(res.durationMs / 1000).toFixed(1)}s</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-red-500">
                {res.error || <span className="text-gray-400">-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
