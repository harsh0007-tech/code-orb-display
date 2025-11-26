import Contact from "@/components/Contact";
import MobileNav from "@/components/MobileNav";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import FloatingCrystals from "@/components/FloatingCrystals";

const ContactPage = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundOrbs />
      <FloatingCrystals />
      <MobileNav />
      <main className="pt-20 pb-32">
        <Contact />
      </main>
    </div>
  );
};

export default ContactPage;
