import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonialsData = [
  {
    quote: "Outstanding experience, would definitely recommend!",
    name: "Holden Caulfield",
    role: "UI DEVELOPER",
    image: "./Avatar1.png",
  },
  {
    quote: "Professional, timely and exceeded expectations.",
    name: "Cory Booker",
    role: "PRODUCT MANAGER",
    image: "./Avatar2.png",
  },
  {
    quote: "Absolutely loved the design and attention to detail.",
    name: "Alper Kamu",
    role: "DESIGNER",
    image: "./Avatar1.png",
  },
  {
    quote: "A seamless experience from start to finish.",
    name: "Jane Doe",
    role: "MARKETING HEAD",
    image: "./Avatar2.png",
  },
  {
    quote: "Their work speaks volumes! Highly impressed.",
    name: "John Smith",
    role: "DEVELOPER",
    image: "./Avatar1.png",
  },
];

const TestimonialCard = ({ quote, name, role, image }) => (
  <div  className="min-w-[300px] max-w-[300px] bg-[#9fff9f] p-6 font-merriweather mx-4 rounded shadow-md flex-shrink-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="block w-5 h-5 text-green-950 mb-4"
        viewBox="0 0 975.036 975.036"
      >
        <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
      </svg>
    <p className="leading-relaxed mb-4 text-black">{quote}</p>
    <div className="flex items-center">
      <img
        alt={name}
        src={image}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4">
        <h3 className="text-gray-900 font-bold">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    gsap.fromTo(
      element,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 35%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  return(
    <>
    <div
        id="testimonials"
        className="w-full  bg-center bg-cover bg-no-repeat "
        style={{
          aspectRatio: "960/300",
          backgroundImage: "url('./Layer4.svg')",
        }}
      ></div>
  <section  className="text-gray-600 body-font bg-[#75e63c] overflow-hidden">
    <div className="container mx-auto px-5 py-5">
      <h1 className="md:text-9xl text-7xl font-Birthstone  font-bold title-font text-gray-900 mb-12 text-center">
        Testimonials
      </h1>
      <div ref={sectionRef} className="relative w-full border-x-green-900 border-y-transparent border-[10px] overflow-hidden">
        <div className="flex animate-scroll-left">
          {testimonialsData.concat(testimonialsData).map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  </section>
  </>
  );
}

export default TestimonialsSection;
