import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const launchConfettiFrame = (end: number) => {
  confetti({
    particleCount: 5,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ["#A3FF12", "#009CDE", "#ffffff", "#f59e0b"],
  });
  confetti({
    particleCount: 5,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ["#A3FF12", "#009CDE", "#ffffff", "#f59e0b"],
  });

  if (Date.now() < end) {
    requestAnimationFrame(launchConfettiFrame);
  }
};
