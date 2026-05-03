import { useScreenSize } from "@/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GooeyFilter } from "@/components/ui/gooey-filter";

function GooeyDemo() {
  const screenSize = useScreenSize();

  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center gap-8 overflow-hidden bg-black text-center text-pretty">
      <img
        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80"
        alt="stage lights"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />

      <GooeyFilter id="gooey-filter-pixel-trail" strength={5} />

      <div className="absolute inset-0 z-0" style={{ filter: "url(#gooey-filter-pixel-trail)" }}>
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 24 : 32}
          fadeDuration={0}
          delay={500}
          pixelClassName="bg-white"
        />
      </div>

      <p className="z-10 w-1/2 text-7xl font-bold text-white">
        Speaking things into existence
        <span></span>
      </p>
    </div>
  );
}

export { GooeyDemo };

