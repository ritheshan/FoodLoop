import React from "react";
import Navbar from "../Components/Landingpage/Navbar";
import HeroSection from "../Components/Landingpage/Herosection";
import AboutSection from "../Components/Landingpage/AboutSection";
import WhyDonateSection from "../Components/Landingpage/WhyDonateSection";
import Hallmark from "../Components/Landingpage/Hallmark";
import TestimonialsSection from "../Components/Landingpage/Testimonials";
import FaqSection from "../Components/Landingpage/FAQ";
import Footer from "../Components/Landingpage/Footer";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
const Landingpage = () => {
  const comp = useRef(null);

  useLayoutEffect(() => {
    const introEl = comp.current;

    introEl.classList.add("scroll-lock");

    const ctx = gsap.context(() => {
      const t1 = gsap.timeline({
        onComplete: () => {
          introEl.style.display = "none";
          introEl.classList.remove("scroll-lock");
        },
      });

      t1.from("#intro-slider", {
        xPercent: "-100",
        duration: 1.3,
        delay: 0.8,
      })
        .from(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "+=30",
          stagger: 0.2,
        })
        .to(["#title-1", "#title-2", "#title-3"], {
          opacity: 0,
          y: "-=30",
          delay: 0.1,
          stagger: 0.2,
        })
        .to("#intro-slider", {
          xPercent: "-100",
          duration: 0.8,
          opacity: 0,
        });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div id="intro" className="relative z-50" ref={comp}>
        <div
          id="intro-slider"
          className="h-screen p-10 bg-gray-900 text-yellow-50 absolute top-0 left-0 font-merriweather font-bold w-full flex flex-col gap-10 tracking-tight justify-center items-center"
        >
          <h1 className="text-9xl" id="title-1">
            Made
          </h1>
          <h1 className="text-9xl" id="title-2">
            with
          </h1>
          <h1 className="text-9xl" id="title-3">
            ❤️
          </h1>
        </div>
        <div className="h-screen flex bg-colour1 justify-center items-center">
          <h1
            id="welcome"
            className=" font-bold text-gray-100 font-merriweather "
          >
            <img src="./favicon.png" />
          </h1>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <WhyDonateSection />
        <Hallmark />
        <TestimonialsSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
};

export default Landingpage;
