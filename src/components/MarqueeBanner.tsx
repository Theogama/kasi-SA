interface MarqueeBannerProps {
  text?: string;
  reverse?: boolean;
}

const MarqueeBanner = ({ 
  text = "KASI SA STREETWEAR • FROM THE KASI TO THE WORLD • STREETWEAR CULTURE • LIMITED DROP • ",
  reverse = false 
}: MarqueeBannerProps) => {
  const repeated = text.repeat(6);

  return (
    <div className="border-y border-border bg-primary text-primary-foreground overflow-hidden py-3 sm:py-4 select-none">
      <div className={`whitespace-nowrap font-heading text-sm sm:text-lg md:text-xl tracking-[0.1em] sm:tracking-[0.15em] ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {repeated}
      </div>
    </div>
  );
};

export default MarqueeBanner;
