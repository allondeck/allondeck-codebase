import { useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";

export default function NotFound() {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const rippleCount = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.random() > 0.4) {
      const newRipple = { id: rippleCount.current++, x, y };
      setRipples((prev) => [...prev.slice(-15), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-brand-dark-alt font-sans text-white overflow-hidden relative cursor-crosshair min-h-[calc(100vh-100px)] lg:min-h-[calc(100vh-150px)]"
      onMouseMove={handleMouseMove}
    >
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border-2 border-brand-light/30 pointer-events-none mix-blend-screen"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
            animation: "ripple-fade 1s ease-out forwards",
          }}
        />
      ))}

      <div className="relative z-10 text-center pointer-events-none p-6">
        <h1 className="font-heading text-[120px] leading-none font-black text-white drop-shadow-xl opacity-90">
          404
        </h1>
        <p className="mt-6 text-lg text-brand-cream max-w-sm mx-auto font-medium">
          Navigated into uncharted waters.
        </p>

        <div className="mt-12 pointer-events-auto">
          <Button to="/" variant="primary" size="md">
            Back to home
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes ripple-fade {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
