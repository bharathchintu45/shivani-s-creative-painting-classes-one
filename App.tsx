import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Instagram, 
  Mail, 
  Phone as WhatsApp, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  Info, 
  Quote, 
  HelpCircle, 
  Copy, 
  Check,
  X,
  Menu,
  Palette,
  Sparkles,
  Heart
} from 'lucide-react';
import { 
  ACHIEVEMENTS, 
  UNIQUE_TEACHING, 
  CURRICULUM, 
  CLASS_STRUCTURE, 
  PRICE_PLANS, 
  TESTIMONIALS, 
  FAQ_ITEMS, 
  ENROLLMENT_STEPS 
} from './constants';

// IMPORT THE AUTOMATED FORM
import { EnrollmentForm } from './EnrollmentForm';

const ART_SAMPLES = [
  "https://picsum.photos/seed/art1/1200/1200",
  "https://picsum.photos/seed/art2/1200/1200",
  "https://picsum.photos/seed/art3/1200/1200",
  "https://picsum.photos/seed/art4/1200/1200"
];

/**
 * Custom hook to track scroll position for parallax and progress bar.
 */
const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollY;
};

/**
 * Reveal Animation Component
 */
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

const ScrollProgress = () => {
  const scrollY = useScrollPosition();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      setProgress((scrollY / scrollHeight) * 100);
    }
  }, [scrollY]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
      <div 
        className="h-full bg-stone-900 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// --- NEW COMPONENT: Top Fan Banner ---
const FanBanner = () => (
  <div className="fixed top-0 left-0 w-full bg-stone-900 text-stone-200 py-2.5 px-4 text-center text-xs md:text-sm font-medium tracking-wide border-b border-white/10 z-[120]">
    <span className="flex items-center justify-center gap-2 animate-pulse">
      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
      Developed by a fan inspired by every brushstroke
      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
    </span>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <nav 
        // Pushed down to top-9 to avoid covering the FanBanner
        className={`fixed top-9 w-full z-[100] transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-white shadow-md py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a 
            href="#" 
            onClick={closeMenu}
            className="text-xl md:text-2xl font-serif font-bold tracking-tight text-stone-800 z-[110]"
          >
            SHIVANI'S <span className="text-stone-400 font-light">ART</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 text-sm font-medium text-stone-600 items-center">
            <a href="#about" className="hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-sm">Who Am I?</a>
            <a href="#curriculum" className="hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-sm">Curriculum</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-sm">Pricing</a>
            <a 
              href="#enroll" 
              className="bg-stone-900 text-white px-6 py-2.5 rounded-full hover:bg-stone-700 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
            >
              Enroll Now
            </a>
          </div>

          {/* Hamburger Toggle */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-stone-800 focus:outline-none z-[110] bg-stone-50/50 backdrop-blur rounded-full active:bg-stone-200 transition-colors"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[90] md:hidden flex flex-col pt-24 transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-full invisible pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center space-y-10 px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-stone-100 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col items-center space-y-8 w-full">
            <a 
              href="#about" 
              onClick={closeMenu}
              className="text-4xl font-serif text-stone-900 hover:text-stone-500 transition-all text-center w-full"
            >
              Who Am I?
            </a>
            <a 
              href="#curriculum" 
              onClick={closeMenu}
              className="text-4xl font-serif text-stone-900 hover:text-stone-500 transition-all text-center w-full"
            >
              Curriculum
            </a>
            <a 
              href="#pricing" 
              onClick={closeMenu}
              className="text-4xl font-serif text-stone-900 hover:text-stone-500 transition-all text-center w-full"
            >
              Pricing
            </a>
            <a 
              href="#enroll" 
              onClick={closeMenu}
              className="bg-stone-900 text-white px-12 py-5 rounded-full text-2xl font-serif hover:bg-stone-700 transition-all active:scale-95 shadow-xl shadow-stone-200"
            >
              Enroll Now
            </a>
          </div>

          <div className="flex space-x-8 pt-6">
            <a href="https://www.instagram.com/cuddlingupmybrush" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-full shadow-md text-stone-500 hover:text-stone-900 transition-colors border border-stone-100">
              <Instagram className="w-7 h-7" />
            </a>
            <a href="https://wa.me/918555947314" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-full shadow-md text-stone-500 hover:text-stone-900 transition-colors border border-stone-100">
              <WhatsApp className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const Hero = () => {
  const scrollY = useScrollPosition();
  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.12}px)`,
    transition: 'transform 0.1s linear'
  };

  return (
    // Increased top padding to accommodate Banner + Navbar
    <section className="pt-40 pb-20 px-6 art-bg relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.12] grayscale contrast-125 brightness-110"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-colorful-ink-in-water-43306-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-stone-50/20 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-3 py-1 bg-stone-100/80 backdrop-blur text-stone-600 text-xs font-semibold rounded-full uppercase tracking-widest">
                122K+ Organic Followers
              </div>
              <h1 className="text-5xl md:text-7xl font-serif leading-tight text-stone-900">
                Creative <br />
                <span className="italic text-stone-500 underline decoration-stone-200 decoration-4">Painting</span> Classes
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                One-on-One | Monthly Based | Online Classes.
                Experience an emotional, expressive, and intuitive art journey with @cuddlingupmybrush.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#enroll" className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2">
                  Book a Demo Session <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#about" className="px-8 py-4 border border-stone-200 text-stone-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-200 focus-visible:ring-offset-2">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative group mt-12 md:mt-0">
              <div className="absolute -inset-4 bg-stone-200/50 rounded-[2rem] rotate-3 transition-transform group-hover:rotate-1"></div>
              <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[400px] md:h-[500px]">
                <img 
                  src="https://picsum.photos/seed/painting-art/800/1000" 
                  alt="Shivani's Artwork" 
                  className="relative object-cover w-full h-full"
                  style={parallaxStyle}
                />
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-stone-100 shadow-lg max-w-[200px]">
                <p className="text-xs italic text-stone-500">"Art is my language, a way to express, connect, and inspire."</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-24 bg-white">
    <Reveal>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://picsum.photos/seed/artist-shivani/800/800" 
              alt="Shivani at work" 
              className="rounded-3xl shadow-xl rotate-[-2deg] w-full"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-4xl font-serif text-stone-900">Who Am I?</h2>
            <div className="space-y-4 text-stone-600 leading-relaxed text-lg">
              <p>
                I'm <strong>Shivani</strong>, a professional artist and content creator sharing my visual journey through <strong>@cuddlingupmybrush</strong>.
              </p>
              <p>
                From childhood, art has been my language. Since June 2020, I’ve been turning my passion into a profession, creating art that speaks, moves, and tells stories beyond words.
              </p>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{ach.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  </section>
);

const UniqueValue = () => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <Reveal>
        <h2 className="text-4xl font-serif mb-16 text-stone-900">What Makes My Teaching Unique</h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-8">
        {UNIQUE_TEACHING.map((item, idx) => (
          <Reveal key={idx} delay={idx * 150}>
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow text-left h-full">
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-600 mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 text-stone-800">{item.title}</h3>
              <p className="text-stone-600">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const ArtistJourney = () => (
  <section id="journey" className="py-24 bg-white relative overflow-hidden">
    <Reveal>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-stone-400 uppercase tracking-widest text-[10px] font-bold">
              <Palette className="w-3.5 h-3.5" />
              The Artist's Narrative
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
              A Journey of <span className="italic text-stone-500">Self-Discovery</span> through the Brush
            </h2>
            <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
              <p>
                My artistic journey isn't just a career; it's a lifelong dialogue between my inner world and the outer world. What began as private sketches in school margins has blossomed into a professional practice that seeks to capture the intangible—emotions, whispers of nature, and the quiet beauty of existence.
              </p>
              <p>
                In <strong>June 2020</strong>, I took a leap of faith. I founded <strong>@cuddlingupmybrush</strong> to share this language of intuition with a wider audience. Since then, it has evolved into a thriving community of over 122,000 souls, connected by a shared appreciation for art that breathes and feels.
              </p>
              
              <div className="relative p-8 bg-stone-50 rounded-2xl border border-stone-100 group">
                <Quote className="w-12 h-12 text-stone-200 absolute -top-4 -left-4 -z-10 transition-transform group-hover:scale-110" />
                <p className="italic font-serif text-stone-700 text-xl leading-relaxed">
                  "I believe art isn't just about what you see on the canvas, but the transformation that happens within you while you hold the brush."
                </p>
              </div>

              <p>
                From exhibiting at the <strong>India Art Festival</strong> in Hyderabad to conducting workshops for NGOs and government schools, my mission has always been the same: to democratize creativity. I don't teach you how to paint a perfect portrait; I teach you how to find yourself in the strokes.
              </p>
              
              <div className="pt-6 flex flex-col gap-1">
                <span className="font-serif italic text-2xl text-stone-800">Shivani</span>
                <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Founder & Lead Artist</span>
              </div>
            </div>

            <div className="flex items-center gap-10 pt-8">
              <div className="text-center">
                <span className="block text-3xl font-serif font-bold text-stone-900">4+</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Years Practice</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-serif font-bold text-stone-900">122k</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Followers</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-serif font-bold text-stone-900">1k+</span>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Mentored</span>
              </div>
            </div>
          </div>
          
          <div className="relative mt-12 md:mt-0">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center animate-pulse z-20 shadow-inner">
               <Sparkles className="w-10 h-10 text-stone-300" />
            </div>
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl group border-[12px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&h=1000&auto=format&fit=crop" 
                alt="Shivani in her element" 
                className="w-full h-[500px] md:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                <p className="text-white font-serif text-lg italic leading-relaxed">
                  "Every piece I create is a page from my diary, written in colors and textures."
                </p>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 w-full h-full border-2 border-stone-200 rounded-[3rem] -z-10 translate-x-4 translate-y-4" />
          </div>
        </div>
      </div>
    </Reveal>
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-stone-50 rounded-full blur-3xl -z-10 opacity-60" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-100/50 rounded-full blur-3xl -z-10" />
  </section>
);

const Lightbox = ({ index, onClose, onPrev, onNext }: { index: number, onClose: () => void, onPrev: () => void, onNext: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-full bg-stone-900/50"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      <button 
        onClick={onPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-full bg-stone-900/50"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div className="max-w-4xl max-h-[80vh] relative group">
        <img 
          src={ART_SAMPLES[index]} 
          alt={`Artwork sample ${index + 1}`} 
          className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-500"
        />
        <div className="absolute -bottom-10 left-0 w-full text-center text-stone-400 font-serif">
          Sample {index + 1} of {ART_SAMPLES.length}
        </div>
      </div>

      <button 
        onClick={onNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-full bg-stone-900/50"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

const Curriculum = () => {
  const scrollY = useScrollPosition();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const imageClasses = "rounded-2xl w-full h-full object-cover transition-all duration-500 cursor-pointer hover:scale-[1.03] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-400 focus-visible:ring-offset-4";
  
  const getParallaxStyle = (speed: number) => {
    if (isMobile) return {};
    return {
      transform: `translateY(${(scrollY - 2000) * speed}px)`,
      transition: 'transform 0.1s linear'
    };
  };

  const nextImg = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % ART_SAMPLES.length);
    }
  }, [selectedIdx]);

  const prevImg = useCallback(() => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + ART_SAMPLES.length) % ART_SAMPLES.length);
    }
  }, [selectedIdx]);

  return (
    <section id="curriculum" className="py-24 bg-white">
      <Reveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-stone-900 text-white rounded-[3rem] p-8 md:p-20 relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-8">What will you learn?</h2>
                <ul className="grid grid-cols-1 gap-4">
                  {CURRICULUM.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-stone-300 text-sm md:text-base">
                      <div className="w-1.5 h-1.5 bg-stone-500 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 p-6 bg-stone-800/50 rounded-2xl border border-stone-700">
                  <div className="flex items-start gap-4">
                    <Info className="w-6 h-6 text-stone-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-stone-400 italic leading-relaxed">
                      "I’m happy to guide you in anything you’re curious about – <strong>except portraits</strong>, they’re not my cup of tea. My art focuses more on feelings and expression than faces and perfection."
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-0 min-h-[300px] md:min-h-0">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl" onClick={() => setSelectedIdx(0)}>
                  <img tabIndex={0} src={ART_SAMPLES[0]} className={imageClasses} alt="Art Sample 1" style={getParallaxStyle(0.04)} />
                </div>
                <div className={`aspect-[4/5] overflow-hidden rounded-2xl ${isMobile ? '' : 'mt-8'}`} onClick={() => setSelectedIdx(1)}>
                  <img tabIndex={0} src={ART_SAMPLES[1]} className={imageClasses} alt="Art Sample 2" style={getParallaxStyle(0.08)} />
                </div>
                <div className={`aspect-[4/5] overflow-hidden rounded-2xl ${isMobile ? '' : '-mt-8'}`} onClick={() => setSelectedIdx(2)}>
                  <img tabIndex={0} src={ART_SAMPLES[2]} className={imageClasses} alt="Art Sample 3" style={getParallaxStyle(0.06)} />
                </div>
                <div className="aspect-[4/5] overflow-hidden rounded-2xl" onClick={() => setSelectedIdx(3)}>
                  <img tabIndex={0} src={ART_SAMPLES[3]} className={imageClasses} alt="Art Sample 4" style={getParallaxStyle(0.1)} />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32" />
          </div>
        </div>
      </Reveal>

      {selectedIdx !== null && (
        <Lightbox 
          index={selectedIdx} 
          onClose={() => setSelectedIdx(null)} 
          onPrev={prevImg}
          onNext={nextImg}
        />
      )}
    </section>
  );
};

const Structure = () => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div>
            <h2 className="text-4xl font-serif mb-6 text-stone-900">Class Structure</h2>
            <div className="space-y-6">
              {CLASS_STRUCTURE.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-stone-700">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-stone-100 text-stone-500">
                    {item.icon}
                  </div>
                  <span className="text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="p-10 bg-white rounded-[2rem] shadow-xl border border-stone-100 space-y-6">
            <h3 className="text-2xl font-serif text-stone-900">Monthly Based Course</h3>
            <ul className="space-y-4 text-stone-600">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span>Pay only for the months you attend</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span>No fixed long-term commitment required</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span>Pause or resume anytime</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span>Progress-based & comfort-based learning</span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const Pricing = () => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif mb-4 text-stone-900">Fee Structure</h2>
            <div className="inline-flex bg-stone-100 p-1 rounded-full">
              <button 
                onClick={() => setCurrency('INR')}
                aria-pressed={currency === 'INR'}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${currency === 'INR' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                INR
              </button>
              <button 
                onClick={() => setCurrency('USD')}
                aria-pressed={currency === 'USD'}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${currency === 'USD' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                USD
              </button>
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {PRICE_PLANS.map((plan, idx) => (
            <Reveal key={idx} delay={idx * 100}>
              <div className="flex items-center justify-between p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-stone-300 transition-colors group">
                <span className="text-xl font-medium text-stone-800">{plan.ageRange}</span>
                <div className="text-right">
                  <span className="text-3xl font-serif font-bold text-stone-900">
                    {currency === 'INR' ? `₹${plan.inr.toLocaleString()}` : `$${plan.usd}`}
                  </span>
                  <span className="block text-stone-400 text-sm">per month</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        
        <Reveal delay={400}>
          <p className="mt-8 text-center text-sm text-stone-400 italic">
            * A one-month fee must be paid in advance at the time of joining. Thereafter, the fee is payable at the end of each month.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

// MODIFIED: Updated Registration to use Automated Form
const Registration = () => {
  return (
    <section id="enroll" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          <div className="md:col-span-3 space-y-12">
            <Reveal>
              <div>
                <h2 className="text-4xl font-serif mb-4 text-stone-900">How to Enroll</h2>
                <p className="text-stone-600">Join the creative journey in 3 simple steps.</p>
              </div>
            </Reveal>
            
            <div className="space-y-8">
              {ENROLLMENT_STEPS.map((step, idx) => (
                <Reveal key={idx} delay={idx * 150}>
                  <div className="flex gap-6 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900 flex-shrink-0 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-serif font-bold text-stone-900">Step {idx + 1}: {step.title}</h4>
                      <p className="text-stone-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Reveal delay={300}>
               {/* REPLACED STATIC CONTENT WITH AUTOMATED FORM */}
               <EnrollmentForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section className="py-24 bg-stone-50">
    <div className="max-w-6xl mx-auto px-6">
      <Reveal>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif mb-4 text-stone-900">Student Stories</h2>
          <p className="text-stone-600">What my students and their parents have to say.</p>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((item, idx) => (
          <Reveal key={idx} delay={idx * 200}>
            <div className="bg-white p-10 rounded-[2rem] border border-stone-100 shadow-sm relative group hover:shadow-md transition-shadow h-full flex flex-col">
              <Quote className="w-10 h-10 text-stone-100 absolute top-8 right-8 group-hover:text-stone-200 transition-colors" />
              <p className="text-stone-600 leading-relaxed mb-8 relative z-10 italic flex-grow">
                "{item.text}"
              </p>
              <div className="mt-auto">
                <h4 className="font-serif font-bold text-stone-900">{item.name}</h4>
                <p className="text-stone-400 text-sm">{item.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-24 bg-stone-900 text-white overflow-hidden relative">
    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif mb-4">Let’s Paint, Imagine & Grow Together</h2>
          <p className="text-stone-400">Ready to start your creative journey? Get in touch for enquiries & registrations.</p>
        </div>
      </Reveal>
      
      <div className="grid md:grid-cols-3 gap-8">
        <Reveal delay={100}>
          <a href="https://www.instagram.com/cuddlingupmybrush" target="_blank" rel="noopener noreferrer" className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
            <Instagram className="w-10 h-10 mb-4 text-pink-400" />
            <h4 className="text-lg font-medium mb-1">Instagram</h4>
            <p className="text-stone-400 text-sm">@cuddlingupmybrush</p>
          </a>
        </Reveal>
        <Reveal delay={250}>
          <a href="https://wa.me/918555947314" target="_blank" rel="noopener noreferrer" className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
            <WhatsApp className="w-10 h-10 mb-4 text-green-400" />
            <h4 className="text-lg font-medium mb-1">WhatsApp</h4>
            <p className="text-stone-400 text-sm">+91 85559 47314</p>
          </a>
        </Reveal>
        <Reveal delay={400}>
          <a href="mailto:workwith.shivanitheartist@gmail.com" className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
            <Mail className="w-10 h-10 mb-4 text-blue-400" />
            <h4 className="text-lg font-medium mb-1">Email</h4>
            <p className="text-stone-400 text-sm">workwith.shivanitheartist@gmail.com</p>
          </a>
        </Reveal>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <HelpCircle className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <h2 className="text-4xl font-serif mb-4 text-stone-900">Frequently Asked Questions</h2>
            <p className="text-stone-600">Everything you need to know about the classes.</p>
          </div>
        </Reveal>
        
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <Reveal key={idx} delay={idx * 50}>
              <div 
                className="border border-stone-100 rounded-2xl overflow-hidden bg-stone-50 transition-all"
              >
                <button 
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-content-${idx}`}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-100 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset"
                >
                  <span className="font-medium text-stone-800">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  id={`faq-content-${idx}`}
                  role="region"
                  aria-labelledby={`faq-btn-${idx}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-200/50">
                    {item.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// MODIFIED: Added Highlighted Fan Signature
const Footer = () => (
  <footer className="bg-stone-900 py-12 border-t border-white/5">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-xs">
      <div className="flex flex-col gap-1 items-center md:items-start">
        <p className="text-stone-400 font-serif font-bold text-sm tracking-tight">SHIVANI'S ART</p>
        <p>© {new Date().getFullYear()} Shivani's Creative Painting Classes. All rights reserved.</p>
        
        {/* Highlighted Fan Signature */}
        <div className="mt-3 px-3 py-1 bg-white/5 rounded-full border border-white/10 inline-flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
           <p className="text-stone-300 italic">
             Developed by a fan inspired by every brushstroke
           </p>
        </div>
      </div>
      <div className="flex gap-8">
        <a href="https://www.instagram.com/cuddlingupmybrush" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded-sm">Instagram</a>
        <a href="https://wa.me/918555947314" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded-sm">WhatsApp</a>
        <a href="#" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 rounded-sm">Privacy Policy</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white">
      <ScrollProgress />
      
      {/* 1. Added Fan Banner Component */}
      <FanBanner />
      
      <Navbar />
      <Hero />
      <About />
      <UniqueValue />
      <ArtistJourney />
      <Curriculum />
      <Structure />
      <Pricing />
      <Registration />
      <Testimonials />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
};

export default App;