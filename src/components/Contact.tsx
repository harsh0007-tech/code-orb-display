import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Input validation schema
const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  mobileNumber: z.string()
    .trim()
    .max(20, "Mobile number must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message must be less than 5000 characters"),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs before sending to database
      const validatedData = contactSchema.parse({
        name,
        email,
        mobileNumber,
        message,
      });

      const { error } = await supabase
        .from('contact_messages')
        .insert([{ 
          name: validatedData.name, 
          email: validatedData.email, 
          mobile_number: validatedData.mobileNumber || null, 
          message: validatedData.message 
        }]);

      if (error) throw error;

      toast.success("Message sent! I'll get back to you soon.");
      setName("");
      setEmail("");
      setMobileNumber("");
      setMessage("");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
      console.error('Error submitting contact form:', error);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-mono fade-in-up">
          Get in <span className="text-primary">Touch</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="fade-in-up">
            <p className="text-muted-foreground mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              Let's build something amazing together!
            </p>
            
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass w-12 h-12 rounded-full flex items-center justify-center hover:glass-strong hover-glow-primary transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-primary" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  required
                  maxLength={200}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass border-primary/20 focus:border-primary bg-transparent text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass border-primary/20 focus:border-primary bg-transparent text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Your Mobile Number"
                  maxLength={20}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="glass border-primary/20 focus:border-primary bg-transparent text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass border-primary/20 focus:border-primary bg-transparent text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold hover-glow-primary"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
