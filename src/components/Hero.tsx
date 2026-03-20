import teeDuo from "@/assets/tee-duo.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 space-y-8">
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              From the Kasi to the World
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl leading-[0.85] font-heading">
              Kasi SA<br />Streetwear <br />Collection
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Bold graphic tees rooted in township culture. Designed for the streets, made for the world.
          </p>
          <a
            href="#shop"
            className="inline-block bg-primary text-primary-foreground text-xs font-medium tracking-[0.2em] uppercase px-10 py-4 hover:opacity-80 transition-opacity"
          >
            Shop Collection
          </a>
        </div>

        <div className="order-1 md:order-2 flex justify-center items-center">
          {/* Grid Background */}
          <div className="relative w-full max-w-md h-96">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(0,0,0,0.03)_1px,_transparent_1px),_linear-gradient(0deg,_rgba(0,0,0,0.03)_1px,_transparent_1px)] bg-[size:40px_40px] rounded-2xl" />

            {/* Image Container with Zoom */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={teeDuo}
                alt="Kasi SA Streetwear"
                className="w-[100%] h-[100%] object-contain transition-transform duration-700 hover:scale-110 active:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
