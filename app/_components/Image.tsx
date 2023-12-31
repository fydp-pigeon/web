import NextImage from "next/image";

type Props = {
  src: string;
  size?: number;
  alt: string;
  className?: string;
};

export function Image({ src, size = 24, className, alt }: Props) {
  return (
    <NextImage
      src={src}
      width={size}
      height={size}
      className={`object-cover ${className}`}
      alt={alt}
      referrerPolicy="no-referrer"
      unoptimized
      // onLoad={}
    />
  );
}
