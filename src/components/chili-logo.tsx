import Image from "next/image";

export function ChiliLogo({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.webp"
      alt="LocalBoost"
      width={size * 4}
      height={size}
      className={className}
      style={{ width: "auto", height: size }}
      priority
    />
  );
}
