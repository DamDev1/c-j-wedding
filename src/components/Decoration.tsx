/**
 * Decorative floral line-art from the Figma file.
 * Both are CSS backgrounds, so if an image file is missing the layer simply
 * renders nothing instead of a broken-image icon.
 * Files live in /public/images (see README for how to fetch them).
 */

/**
 * Full-section floral frame using the Decoration.png asset.
 * The artwork is landscape-oriented and covers the entire section.
 */
export function FloralFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-[length:100%_100%] bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/Decoration.png)" }}
      />
    </div>
  );
}

/** Floral border that sits along the bottom edge using Decoration-2.svg. */
export function FloralBottom() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-[-20px] left-1/2 aspect-[1440/463] w-[max(102.6%,1100px)] -translate-x-1/2 bg-contain bg-bottom bg-no-repeat"
      style={{ backgroundImage: "url(/images/Decoration-2.svg)" }}
    />
  );
}
