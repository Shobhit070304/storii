/**
 * The paper itself: a green base, a soft canopy across the top, three slow
 * colour washes, a jittering fibre layer and a green vignette. Pure CSS, fixed
 * behind everything, cheap to run.
 */
export function PaperBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-paper" />
      <div className="storii-canopy absolute inset-x-0 top-0 h-[38rem]" />

      <div
        className="storii-wash absolute -left-40 -top-48 h-[42rem] w-[42rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--wash-1), transparent 68%)",
        }}
      />
      <div
        className="storii-wash storii-wash-2 absolute -right-52 top-24 h-[46rem] w-[46rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--wash-2), transparent 68%)",
        }}
      />
      <div
        className="storii-wash absolute -bottom-64 left-1/4 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--wash-3), transparent 70%)",
          animationDuration: "58s",
        }}
      />

      <div className="storii-grain absolute -inset-[8%]" />
      <div className="storii-vignette absolute inset-0" />
    </div>
  );
}

export default PaperBackground;
