import Image, { StaticImageData } from "next/image";

interface BlurryBgImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageSrc: any;
  caption: string;
}

export default function BlurryBgImage({
  imageSrc,
  caption,
}: BlurryBgImageProps) {
  return (
    <div
      className="relative w-full 
  h-[220px] sm:h-[230px] md:h-[240px] lg:h-[250px]
  rounded-lg overflow-hidden"
    >
      {/* Background Blur */}
      <Image
        src={imageSrc}
        alt={caption}
        fill
        className="object-cover blur-md"
      />

      {/* Foreground Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={caption}
          width={300}
          height={300}
          className="rounded-lg object-contain max-h-[70%]"
        />
      </div>
    </div>
  );
}
