function LoaderWithText() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <svg
        className="h-36 w-36 animate-spin"
        viewBox="0 0 100 100"
        fill="none"
        aria-label="Loading"
      >
        <title>Loading</title>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="oklch(from var(--primary) l c h / 0.25)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset="212"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-center font-medium text-lg">Loading</span>
      </div>
    </div>
  );
}

export default LoaderWithText;
