import Carousel from "./Carousal";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const carousalRef = useRef(null);
  useEffect(() => {
    const elementleft = sectionRef.current;
    const elementright = carousalRef.current;
    gsap.fromTo(
      elementleft,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementleft,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
    gsap.fromTo(
      elementright,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementright,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  return (
    <section className="relative flex flex-col md:flex-row items-center bg-colour1 justify-between px-2 md:px-16 py-5 text-white overflow-hidden">
      <div
        ref={sectionRef}
        className="relative w-full md:w-1/2 text-center md:text-left  p-6 rounded-lg"
      >
        <div className="relative p-6 rounded-lg ">
          <h1 className="text-8xl md:text-[10vw] font-bold leading-tight font-Birthstone">
            FoodLoop
          </h1>
          <p className="mt-4 text-2xl md:text-[3vw] text-gray-900 font-merriweather leading-normal">
            Where Surplus meets Purpose !
          </p>
          <button
      onClick={() => navigate("/login")}
      style={{
        clipPath:
          "polygon(75% 0%, 94% 50%, 75% 100%, 0% 100%, 19% 50%, 0% 0%)",
      }}
      className="mt-6 px-6 shadow-md z-3 py-3 w-48 bg-colour3 hover:bg-colour4 hover:text-white hover:shadow-md text-black rounded-lg text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
    >
      Get Started
    </button>
        </div>
      </div>
      <div
        ref={carousalRef}
        className="relative w-full md:w-1/2 mt-10 md:mt-0 flex justify-center z-1 max-h-[400px]"
      >
        <Carousel />
      </div>
    </section>
  );
};

export default HeroSection;
