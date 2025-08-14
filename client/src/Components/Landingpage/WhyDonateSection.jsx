import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartHandshake, HelpingHand } from "lucide-react";
import LiveImpactCounter from "./LiveImpactCounter";

gsap.registerPlugin(ScrollTrigger);

const WhyDonateSection = () => {
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  useEffect(() => {
    const title = titleRef.current;
    gsap.fromTo(
      title,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  useEffect(() => {
    const elements = sectionRef.current.querySelectorAll(".stagger-item");

    gsap.fromTo(
      elements,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  
  return (
    <>
      <div>
        <div
          className="w-full bg-center bg-cover bg-no-repeat "
          style={{
            aspectRatio: "960/300",
            backgroundImage: "url('./Layer2.svg')",
          }}
        ></div>
        <section className="relative w-full py-16 px-6 md:px-20 overflow-hidden ">
          <img
            src="./donate.jpg"
            alt="Donation Background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-800/90 to-transparent z-0" />

          <div className="absolute inset-0 bg-gradient-to-b from-gray-800/100 via-transparent to-transparent z-0" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div ref={titleRef} className="text-center mb-12">
              <h2 className="text-8xl font-bold text-colour1 font-Birthstone">
                Why Donate Food?
              </h2>
              <p className="text-lg text-colour2 py-2 font-merriweather mt-2">
                " Because your extra can be someone’s enough. "
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div ref={sectionRef}>
                <p className="text-lg text-colour2 font-merriweather mb-6 stagger-item">
                  Every day, millions go hungry while tons of food go to waste.
                  Your small act can create a ripple of impact, fighting hunger,
                  reducing environmental harm, and inspiring a culture of care.
                  Donating food isn't just kindness—it's humanity in action.
                </p>

                <div className="space-y-4 text-red-400 font-bold md:text-xl  font-merriweather">
                  <div className="flex items-center gap-3 stagger-item">
                    <HelpingHand className="text-green-600 w-6 h-6" />
                    <span>1 in 9 people go to bed hungry every night.</span>
                  </div>
                  <div className="flex items-center gap-3 stagger-item">
                    <HeartHandshake className="text-yellow-500 w-6 h-6" />
                    <span>1/3 of all food produced globally is wasted.</span>
                  </div>
                  <div className="flex items-center gap-3 stagger-item">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Food waste causes 8–10% of global greenhouse emissions.
                    </span>
                  </div>
                </div>

                <div className="mt-8 stagger-item">
                  <blockquote className="italic text-lg font-merriweather text-colour1 border-l-4 border-green-500 pl-4">
                    "The food you save today might be the meal someone prays
                    for"
                  </blockquote>
                  <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition duration-300">
                    Start Donating Now
                  </button>
                </div>
              </div>

              <div className="hidden md:block" />
            </div>
          </div>
        </section>

        <LiveImpactCounter />
      </div>
    </>
  );
};

export default WhyDonateSection;
