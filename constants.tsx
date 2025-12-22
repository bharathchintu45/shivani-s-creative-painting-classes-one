
import React from 'react';
import { Achievement, LearningItem, PricePlan } from './types';
import { Palette, Heart, Brain, Zap, Clock, Calendar, Users, Globe, MessageCircle, Sparkles, CreditCard } from 'lucide-react';

export const ACHIEVEMENTS: Achievement[] = [
  { text: "122K+ organic Instagram followers" },
  { text: "Showcased at India Art Festival (IAF) Hyderabad" },
  { text: "Exhibited at multiple art fairs and flea markets" },
  { text: "4+ years of consistent art practice" },
  { text: "Recognized by various social platforms for creativity" },
  { text: "Conducts free classes at government schools and NGOs" }
];

export const UNIQUE_TEACHING = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "One-on-One Attention",
    desc: "Full personal attention in every session."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "No Pressure of Perfection",
    desc: "No comparison, no forcing, just pure expression."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Emotional Intelligence",
    desc: "Builds confidence and emotional connection through art."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Creative Thinking",
    desc: "Fosters imagination over simple copying."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Learn at Your Own Pace",
    desc: "Nurturing individual growth without a rush."
  }
];

export const CURRICULUM: string[] = [
  "Basic Color Theory",
  "Brush Handling Techniques",
  "Acrylic Painting",
  "Watercolor Painting",
  "Crafts",
  "Fur Art (Unique pet hair art)",
  "Art from Nature",
  "Texture Art",
  "Lippan Art",
  "Theme-based Painting",
  "Storytelling through Art"
];

export const CLASS_STRUCTURE = [
  { icon: <Globe className="w-5 h-5" />, text: "Online one-on-one sessions" },
  { icon: <Calendar className="w-5 h-5" />, text: "Weekend-only (Saturday & Sunday)" },
  { icon: <Users className="w-5 h-5" />, text: "8 classes per month" },
  { icon: <Clock className="w-5 h-5" />, text: "1 hour per class" },
  { icon: <Users className="w-5 h-5" />, text: "English / Telugu instruction" }
];

export const PRICE_PLANS: PricePlan[] = [
  { ageRange: "3 – 6 years", inr: 17000, usd: 269 },
  { ageRange: "7 – 15 years", inr: 16000, usd: 259 },
  { ageRange: "15+ (Adults)", inr: 15000, usd: 249 }
];

export const TESTIMONIALS = [
  {
    name: "Aarav's Mother",
    role: "Parent of 6-year-old",
    text: "Shivani's patience with young children is remarkable. My son looks forward to every weekend session. His focus has improved so much through painting."
  },
  {
    name: "Sneha Reddy",
    role: "Professional",
    text: "As an adult beginner, I was nervous about starting. Shivani's intuitive approach removed all that pressure. It's become my favorite therapeutic activity."
  },
  {
    name: "Priya M.",
    role: "Teen Student",
    text: "The one-on-one attention really helped me master brush techniques I couldn't learn from videos. She doesn't just teach art; she teaches you how to express yourself."
  }
];

export const FAQ_ITEMS = [
  {
    question: "What materials do I need to start?",
    answer: "You'll need basic art supplies like acrylics, watercolors, a set of brushes, and quality paper or canvas. A detailed list tailored to your chosen medium will be provided upon registration."
  },
  {
    question: "Do I need any prior painting experience?",
    answer: "Not at all! These classes are designed for everyone from absolute beginners to those looking to refine their skills. My teaching style is intuitive and focuses on your individual creative journey."
  },
  {
    question: "How are the online sessions conducted?",
    answer: "Classes are held one-on-one via video conferencing tools like Google Meet or Zoom. This allows for real-time feedback and a truly personalized learning environment."
  },
  {
    question: "What is the cancellation or missed class policy?",
    answer: "If you need to reschedule, please inform at least 24 hours in advance. Missed classes without prior notice may not be compensated, but I always try my best to adjust schedules for genuine emergencies."
  },
  {
    question: "Is there a long-term commitment?",
    answer: "No. The course is monthly based. While I recommend at least 3 months to see significant progress in your creative expression, you are free to continue or stop at the end of any monthly cycle."
  }
];

export const ENROLLMENT_STEPS = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Connect",
    desc: "Reach out via WhatsApp or Instagram to discuss your goals and preferred time slots."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Free Demo",
    desc: "Experience the teaching style firsthand with a 30-minute introductory session."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Secure Slot",
    desc: "Complete the payment for the first month to confirm your recurring weekend slot."
  }
];
