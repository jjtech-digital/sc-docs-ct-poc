export const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width={24}
    height={24}
    fill={filled ? "#ff385c" : "none"}
    stroke="#333"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="hover:scale-105 transition-transform"
  >
    <path d="M12 21C12 21 5 13.76 5 8.5C5 5.47 7.47 3 10.5 3C12.04 3 13.54 3.81 14.26 5.03C14.98 3.81 16.48 3 18 3C21.03 3 23.5 5.47 23.5 8.5C23.5 13.76 12 21 12 21Z" />
  </svg>
);