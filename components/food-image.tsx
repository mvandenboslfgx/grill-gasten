import Image, { type ImageProps } from "next/image";
import { IMAGE_QUALITY } from "@/lib/image-quality";

type FoodImageProps = ImageProps & {
  tier?: keyof typeof IMAGE_QUALITY;
};

/** Consistente hoge kwaliteit voor food photography */
export function FoodImage({
  tier = "default",
  quality,
  alt,
  fill,
  width,
  height,
  ...props
}: FoodImageProps) {
  const sizeProps = fill ? { fill: true as const } : { width, height };
  return (
    <Image
      alt={alt}
      quality={quality ?? IMAGE_QUALITY[tier]}
      {...sizeProps}
      {...props}
    />
  );
}
