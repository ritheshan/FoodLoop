import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: "/hall1.svg",
    title: "Smart Food Matching",
    description:
      "A rule-based engine integrates geolocation and proximity data to match surplus food with the most suitable NGO, optimizing resource allocation",
  },
  {
    icon: "/hall2.svg",
    title: "AI Assistant Integration",
    description:
      "A built-in chatbot (using fine tuned LLMs) assists users by fetching real-time routes and donation data, enhancing user experience",
  },
  {
    icon: "/hall3.svg",
    title: "Image Analysis via Google Vision API Food Type Detection",
    description:
      "Leveraging label detection, the system classifies uploaded images into food categories",
  },
  {
    icon: "/hall4.svg",
    title: "Spoilage Detection",
    description:
      "Using image properties analysis, the platform assesses food freshness by comparing dominant color metrics against defined spoilage thresholds",
  },
];

const Hallmark = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current.querySelectorAll(".stagger-item");

    gsap.fromTo(
      elements,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        delay: 0.3,
        stagger: 0.6,
        ease: "back.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 30%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <div>
      <div
        className="w-full  bg-center bg-cover bg-no-repeat "
        style={{
          aspectRatio: "960/300",
          backgroundImage: "url('./Layer3.png')",
        }}
      ></div>

      <section id="hallmark" ref={sectionRef} className="py-16 bg-[#143D60] ">
        <div className="max-w-6xl mx-auto ">
          <div className="flex flex-wrap justify-center gap-28 ">
            {features.map((feature, index) => (
              <div
                key={index}
                className="w-full sm:w-[45%] md:w-[30%] p-1 font-merriweather text-justify mx-9 transition-transform duration-300 stagger-item "
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className=" h-25 mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  {feature.title}
                </h3>
                <p className="text-white text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hallmark;
