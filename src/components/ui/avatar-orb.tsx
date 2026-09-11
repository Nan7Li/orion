import { cn } from "@/lib/utils";

const PALETTE = [
  ["#1d9bf0", "#074e7a"],
  ["#5ac8fa", "#0b4c6e"],
  ["#34c759", "#0d3b22"],
  ["#ff9f0a", "#5a3200"],
  ["#ff375f", "#5a1020"],
  ["#bf5af2", "#3a1460"],
  ["#64d2ff", "#123a52"],
  ["#ffd60a", "#4a3b00"],
];

export function avatarGradient(hue: number) {
  const i = Math.abs(Math.round(hue / 45)) % PALETTE.length;
  const [a, b] = PALETTE[i];
  return `linear-gradient(145deg, ${a}, ${b})`;
}

export function AvatarOrb({
  name,
  hue,
  size = "md",
  className,
}: {
  name: string;
  hue: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const initial = (name.trim()[0] ?? "O").toUpperCase();
  const dim = {
    xs: "size-7 text-xs",
    sm: "size-9 text-sm",
    md: "size-10 text-sm",
    lg: "size-14 text-lg",
    xl: "size-24 text-3xl",
  }[size];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
        dim,
        className,
      )}
      style={{ background: avatarGradient(hue) }}
    >
      {initial}
    </span>
  );
}
