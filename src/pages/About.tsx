import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Our Story
            </p>
            <h1 className="text-5xl md:text-7xl font-heading mb-6">
              Kasi SA Streetwear
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born from the heart of South Africa's townships, we create bold graphic tees that celebrate authentic street culture and unapologetic style.
            </p>
          </div>
        </div>
      </section>

      {/* The Beginning */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading mb-8">The Beginning</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Kasi SA Streetwear started as a dream in the vibrant streets of Kasi, where creativity flows as freely as the culture itself. We witnessed the raw talent, the bold personalities, and the unmistakable style that defines township culture.
              </p>
              <p>
                What struck us most was how this authentic energy was often overlooked by mainstream fashion. We decided to change that. We wanted to create something that spoke directly to the streets—designs that resonated with the people who live and breathe this culture daily.
              </p>
              <p>
                Every tee we create is a tribute to the township spirit: bold, unapologetic, and unmistakably real. We're not just selling clothing; we're amplifying voices and celebrating a culture that deserves to be seen and celebrated globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading mb-8">Our Mission</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                We exist to bridge the gap between authentic township culture and the world. Our mission is simple but powerful:
              </p>
              <ul className="space-y-4 ml-6">
                <li className="flex gap-3">
                  <span className="text-foreground">•</span>
                  <span><strong>Celebrate Authenticity:</strong> Keep the raw, real essence of street culture at the heart of everything we do.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-foreground">•</span>
                  <span><strong>Empower Communities:</strong> Reinvest in the communities that inspire us, supporting local artists and creators.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-foreground">•</span>
                  <span><strong>Create Quality:</strong> Deliver premium tees that feel as good as they look, designed to last.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-foreground">•</span>
                  <span><strong>Build Community:</strong> Create a global family of people who understand and respect the culture we celebrate.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-heading mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Authenticity */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <Zap className="mb-4 text-foreground" size={28} />
              <h3 className="text-xl font-heading mb-4">Authenticity</h3>
              <p className="text-muted-foreground">
                We never compromise on the real. Everything we create reflects the genuine spirit of the streets, unfiltered and unapologetic.
              </p>
            </div>

            {/* Community */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <Users className="mb-4 text-foreground" size={28} />
              <h3 className="text-xl font-heading mb-4">Community</h3>
              <p className="text-muted-foreground">
                We're built on the strength of community. From the artists who inspire our designs to the people who wear them, community is everything.
              </p>
            </div>

            {/* Heart */}
            <div className="border border-border rounded-lg p-8 hover:border-foreground transition-colors">
              <Heart className="mb-4 text-foreground" size={28} />
              <h3 className="text-xl font-heading mb-4">Passion</h3>
              <p className="text-muted-foreground">
                Every design, every stitch, every decision is made with passion. We put our hearts into creating pieces we'd wear ourselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20 border-b border-border bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading mb-8">Our Creative Process</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-heading text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Inspiration & Research</h3>
                  <p className="text-muted-foreground">
                    We immerse ourselves in the culture, connecting with community members, attending events, and absorbing the energy of the streets.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-heading text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Collaboration with Artists</h3>
                  <p className="text-muted-foreground">
                    We partner with talented artists from the community to bring authentic designs to life, ensuring every design tells a real story.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-heading text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Quality Production</h3>
                  <p className="text-muted-foreground">
                    Using premium cotton and advanced printing techniques, we create tees that feel amazing and last through countless wears.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-heading text-lg">
                  4
                </div>
                <div>
                  <h3 className="font-heading text-lg mb-2">Community Benefit</h3>
                  <p className="text-muted-foreground">
                    A portion of every sale goes back to supporting local artists, youth programs, and community initiatives in the townships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials & Quality */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading mb-8">Quality & Materials</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                We believe in creating pieces that last. Every Kasi SA Streetwear piece is crafted with premium materials and meticulous attention to detail.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-heading text-foreground mb-3">Premium Cotton</h3>
                  <p>
                    100% high-quality cotton blend that feels soft, breathes well, and improves with every wash.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-foreground mb-3">Expert Craftsmanship</h3>
                  <p>
                    Each tee is produced with care, using advanced printing techniques that ensure vibrant colors that won't fade.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-foreground mb-3">Sustainable Practices</h3>
                  <p>
                    We're committed to minimizing our environmental impact through responsible sourcing and production methods.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-foreground mb-3">Ethical Production</h3>
                  <p>
                    Fair wages, safe working conditions, and respect for workers are non-negotiable in everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-heading mb-6">Join the Movement</h2>
            <p className="text-lg text-muted-foreground mb-8">
              When you wear Kasi SA Streetwear, you're not just wearing a shirt. You're making a statement. You're supporting a community. You're celebrating authentic culture.
            </p>
            <Link to="/">
              <Button size="lg" className="text-base">
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
