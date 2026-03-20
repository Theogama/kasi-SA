import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Clock, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Get In Touch
            </p>
            <h1 className="text-5xl md:text-7xl font-heading mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Have a question, collaboration idea, or just want to connect? We'd love to hear from you. Drop us a message and we'll get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards + Form */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Left - Contact Info */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-heading mb-8">Let's Talk</h2>

                {/* Email */}
                <div className="border border-border rounded-lg p-6 hover:border-foreground transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-wider mb-1">Email</h3>
                      <a
                        href="mailto:hello@kasisastreet.co.za"
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        hello@kasisastreet.co.za
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-border rounded-lg p-6 hover:border-foreground transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-wider mb-1">Phone</h3>
                      <a
                        href="tel:+27123456789"
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        +27 12 345 6789
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="border border-border rounded-lg p-6 hover:border-foreground transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-wider mb-1">Location</h3>
                      <p className="text-muted-foreground text-sm">
                        Johannesburg, South Africa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="border border-border rounded-lg p-6 hover:border-foreground transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-wider mb-1">Hours</h3>
                      <p className="text-muted-foreground text-sm">
                        Mon – Fri: 9am – 5pm<br />
                        Sat: 10am – 2pm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4">
                  <h3 className="font-heading text-sm uppercase tracking-wider mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                    >
                      <Instagram size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                    >
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Contact Form */}
              <div className="lg:col-span-3">
                <div className="border border-border rounded-lg p-8 md:p-10">
                  <h2 className="text-2xl font-heading mb-2">Send a Message</h2>
                  <p className="text-muted-foreground text-sm mb-8">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>

                  {submitted && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm font-medium flex items-center gap-2">
                      <Send size={16} />
                      Message sent successfully! We'll be in touch soon.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium mb-2"
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Thabo Mokoena"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium mb-2"
                      >
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="wholesale">Wholesale / Bulk Orders</option>
                        <option value="collab">Collaborations</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind..."
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base group"
                    >
                      <Send
                        size={18}
                        className="mr-2 group-hover:translate-x-1 transition-transform"
                      />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-heading mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How long does shipping take?",
                  a: "Local orders within South Africa typically arrive within 3–5 business days. International shipping takes 7–14 business days depending on the destination.",
                },
                {
                  q: "What is your return policy?",
                  a: "We accept returns within 14 days of delivery, provided the item is unworn, unwashed, and in its original packaging. Contact us to initiate a return.",
                },
                {
                  q: "Do you offer bulk or wholesale orders?",
                  a: "Yes! We offer discounted pricing on bulk orders. Select 'Wholesale / Bulk Orders' in the contact form above or email us directly for a custom quote.",
                },
                {
                  q: "How do I track my order?",
                  a: "Once your order ships, you'll receive a tracking number via email. You can use this to track your parcel on our courier partner's website.",
                },
                {
                  q: "Can I collaborate with Kasi SA Streetwear?",
                  a: "We're always open to collaborations with artists, influencers, and brands that align with our vision. Reach out through the form above!",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg p-6 hover:border-foreground transition-colors"
                >
                  <h3 className="font-heading text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
