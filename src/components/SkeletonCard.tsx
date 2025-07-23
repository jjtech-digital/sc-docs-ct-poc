export const SkeletonCard = () => (
  <div
    className="relative bg-white border rounded-lg shadow-sm p-4 flex flex-col h-full w-full animate-pulse hover:shadow-lg transition"
    style={{ maxWidth: 400 }}
  >
    <div className="absolute top-2 right-2">
      <div className="w-6 h-6 bg-gray-200 rounded-full" />
    </div>

    <div className="w-full h-36 bg-gray-200 rounded mb-3" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-1" />
    <div className="h-3 bg-gray-100 rounded w-2/3 mb-1" />
    <div className="h-3 bg-gray-100 rounded w-1/3 mb-1" />
    <div className="h-4 bg-green-100 rounded w-20 mb-2" />
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
      ))}
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
    <div className="h-5 bg-orange-300 rounded w-1/2" />
  </div>
);