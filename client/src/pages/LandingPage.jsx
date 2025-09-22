import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import ArrowScroll from "../components/ArrowScroll";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Add padding top to account for fixed navbar */}
      <div className="pt-16">
        <HeroSection />
        <StatsSection />
        <ArrowScroll />
        <FeaturesSection />
        <TestimonialsSection />
      </div>
    </div>
  );
}
