export function ChiliLogo({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 6.5C18 8 19.5 11.5 18.3 15.2C17 19.2 12.5 21.3 7 21.8C11 19.8 13.2 16.2 13.4 12.4C13.5 9.6 14 7.4 15 6.5Z" />
      <path d="M13.6 7C13.9 5.3 14.9 4.1 16.6 3.7l.9 1.9c-1.2.4-2 1-2.4 2Z" />
      <path
        d="M16.8 4.4C17.3 3 18.3 2.2 19.8 2"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
