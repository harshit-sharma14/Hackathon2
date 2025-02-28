import React from 'react';

// Navigation Bar Component
import Navbar from './Navbar';
// Hero Section Component
const HeroSection = () => (
  <section className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
    <p className="text-lg mb-6 max-w-xl">
      Discover amazing courses, stay ahead in your career, and learn from the best experts.
    </p>
    <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200">
      Get Started
    </a>
  </section>
);

// Features Section Component
const FeaturesSection = () => {
  const features = [
    { title: "Expert Instructors", desc: "Learn from industry leaders and experts." },
    { title: "Flexible Learning", desc: "Study at your own pace, anywhere, anytime." },
    { title: "Hands-on Projects", desc: "Apply knowledge with real-world assignments." }
  ];

  return (
    <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">{feature.title}</h3>
          <p className="text-gray-500">{feature.desc}</p>
        </div>
      ))}
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    "This platform transformed my learning experience!",
    "Amazing courses and great instructors!"
  ];

  return (
    <section className="bg-gray-200 py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">What Our Users Say</h2>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <blockquote key={index} className="bg-white p-6 rounded-lg shadow-md text-gray-700 italic">
            "{testimonial}"
          </blockquote>
        ))}
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white text-center py-6 mt-10">
    <p>&copy; 2025 Our Platform. All Rights Reserved.</p>
  </footer>
);

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}