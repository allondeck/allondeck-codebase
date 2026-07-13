/**
 * Image or placeholder for page sections (feature, image+text, values).
 */
export function SectionImageSlot({
  imageUrl,
  alt = "Section image",
  className = "",
  width = 400,
  height = 300,
}: {
  imageUrl: string | null;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
    >
      <svg
        className="h-24 w-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
        />
      </svg>
    </div>
  );
}
