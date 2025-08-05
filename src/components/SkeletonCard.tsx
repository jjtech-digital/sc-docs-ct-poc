export const SkeletonCard = () => (
  <div
    className="
      w-full md:max-w-xs
      bg-white rounded-2xl border border-gray-100
      shadow-md transition-transform duration-300
      hover:-translate-y-1 hover:shadow-xl
      flex flex-col relative animate-pulse
      p-4
    "
    style={{ maxWidth: 400 }}
  >
    <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-200 rounded-full" />

    <div className="w-full h-64 bg-gray-200 rounded-2xl mb-3" />

    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />

    <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />

    <div className="flex flex-wrap gap-2 mb-3">
      <div className="h-4 bg-gray-100 rounded-full w-20" />
      <div className="h-4 bg-gray-100 rounded-full w-16" />
    </div>

    <div className="h-3 bg-gray-100 rounded w-full mb-1" />
    <div className="h-3 bg-gray-100 rounded w-5/6 mb-1" />

    <div className="w-fit bg-green-100 h-5 rounded-full px-4 mb-3" />

    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
      ))}
    </div>

    <div className="mb-3">
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-1" />
      <div className="h-5 bg-orange-300 rounded w-1/2" />
    </div>

    <div className="h-10 bg-indigo-300 rounded-lg mt-auto" />
  </div>
);
