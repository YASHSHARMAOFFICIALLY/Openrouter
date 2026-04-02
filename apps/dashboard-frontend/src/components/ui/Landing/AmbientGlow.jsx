 const AmbientGlow = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[120px]" />
    <div className="absolute -bottom-60 -left-20 h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-[100px]" />
  </div>
);
export default AmbientGlow