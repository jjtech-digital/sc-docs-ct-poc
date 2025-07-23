export const StarRating = ({ rating = 0, count = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <polygon points="9.9,1.1 12.3,7 18.7,7.6 13.6,11.9 15.2,18.2 9.9,14.6 4.7,18.2 6.3,11.9 1.2,7.6 7.6,7 " />
      </svg>
    ))}
    {count > 0 && <span className="text-xs text-gray-600 ml-1">({count})</span>}
  </div>
);