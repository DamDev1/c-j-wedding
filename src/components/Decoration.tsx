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

type FloralBottomProps = {
  /** gold = on the olive "The day" section, brown = on the blush "Venue" section */
  tone: "gold" | "brown";
};

/** Floral border that sits along the bottom edge and bleeds off it. */
export function FloralBottom({ tone }: FloralBottomProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-[-75px] left-1/2 aspect-[1477.566/535.908] w-[max(102.6%,1100px)] -translate-x-1/2 bg-contain bg-bottom bg-no-repeat"
      style={{ backgroundImage: `url(/images/floral-bottom-${tone}.svg)` }}
    />
  );
}
