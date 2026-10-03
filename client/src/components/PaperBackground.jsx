/**
 * A minimal, clean background layer.
 * Just the base paper color — no heavy gradients or animated grain.
 */
export function PaperBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
    </div>
  );
}

export default PaperBackground;
