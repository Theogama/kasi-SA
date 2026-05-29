import teeDuo from "@/assets/tee-duo.png";

const Hero = () => {
  return (
    <section className="min-h-[calc(100dvh-var(--navbar-height))] flex items-center pt-navbar pb-10 sm:pb-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div className="order-2 md:order-1 space-y-5 sm:space-y-8 text-center md:text-left">
          <div>
            <p className="text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-muted-foreground mb-3 sm:mb-4">
              From the Kasi to the World
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] font-heading break-words">
              Kasi SA
              <br />
              Streetwear
              <br />
              Collection
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto md:mx-0 text-sm sm:text-base leading-relaxed">
            Bold graphic tees rooted in township culture. Designed for the streets, made for the world.
          </p>
          <a
            href="#shop"
            className="inline-block bg-primary text-primary-foreground text-xs font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase px-8 sm:px-10 py-3.5 sm:py-4 hover:opacity-80 transition-opacity"
          >
            Shop Collection
          </a>
        </div>

        <div className="order-1 md:order-2 flex justify-center items-center w-full min-w-0">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[4/5] sm:aspect-[3/4]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.03)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(0,0,0,0.03)_1px,_transparent_1px)] bg-[size:40px_40px] rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={teeDuo}
                alt="Kasi SA Streetwear"
                className="w-[85%] h-[85%] object-contain transition-transform duration-700 hover:scale-110 active:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
