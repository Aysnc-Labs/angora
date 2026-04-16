export function CardImage({
  src,
  alt,
  height = "h-40",
}: {
  src?: string;
  alt?: string;
  height?: string;
}) {
  if (!src) {
    return <div data-component="CardImage" className={`w-full ${height} bg-muted`} />;
  }
  return (
    <img
      data-component="CardImage"
      src={src}
      alt={alt || ""}
      className={`w-full ${height} object-cover`}
    />
  );
}
