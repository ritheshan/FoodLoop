import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KUTE from "kute.js";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  useEffect(() => {
    const tween = KUTE.fromTo(
      "#blob1",
      { path: "#blob1" },
      { path: "#blob2" },
      { repeat: 999, duration: 3000, yoyo: true }
    ).start();
  }, []);
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    gsap.fromTo(
      element,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  return (
    <>
      <div ref={sectionRef} id="about">
        <div
          className="w-full bg-center bg-cover bg-no-repeat"
          style={{
            aspectRatio: "960/300",
            backgroundImage: "url('./Layer1.svg')",
          }}
        ></div>

        <div className="flex flex-col items-center text-center mx-auto p-4 bg-colour3 text-gray-800">
          <h2 className="text-6xl md:text-9xl font-bold font-Birthstone">
            About Us
          </h2>

          <div className="mt-8 flex flex-col gap-6 md:flex-row items-center p-6 md:items-start justify-between w-full max-w-7xl">
            <div className=" w-full md:w-2/5 flex top-2 justify-center">
              <img
                src="./About us page.gif"
                alt="About Us"
                className="w-full max-w-sm md:max-w-md lg:max-w-lg "
              />
            </div>

            <div className="relative w-full md:w-3/5 text-left p-6 max-w-xl">
              <div className="absolute inset-0 flex items-center justify-center opacity-75 ">
                <svg
                  id="visual"
                  viewBox="0 0 960 540"
                  width="960"
                  height="540"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                >
                  <g transform="translate(479.8445761767938 266.2280810523356)">
                    <path
                      id="blob1"
                      d="M171.2 -134.9C212.7 -84.6 230.6 -13.9 217.7 52.5C204.8 118.9 161 181.1 102.4 207.1C43.9 233.1 -29.3 223 -90.9 192.1C-152.5 161.1 -202.5 109.4 -217 48.8C-231.4 -11.9 -210.3 -81.4 -168.2 -131.8C-126.1 -182.3 -63.1 -213.6 0.9 -214.4C64.9 -215.1 129.8 -185.2 171.2 -134.9"
                      fill="#a0baa2"
                    ></path>
                  </g>
                  <g transform="translate(519.4338175524267 288.30797915668626)">
                    <path
                      id="blob2"
                      d="M98.6 -101.1C120.5 -51.1 126.1 -10.5 120.6 33.1C115.1 76.8 98.5 123.5 60.6 151.7C22.7 179.9 -36.6 189.5 -89.4 170.1C-142.2 150.6 -188.6 102.1 -199.1 47.8C-209.5 -6.4 -184.1 -66.5 -145 -120.4C-105.8 -174.4 -52.9 -222.2 -7.3 -216.4C38.3 -210.6 76.6 -151.1 98.6 -101.1"
                      fill="#a0baa2"
                    ></path>
                  </g>
                </svg>
              </div>

              <span className="absolute -top-4 -left-5 md:-left-20 text-9xl text-gray-400">
                <img
                  className="h-12 w-12 md:h-20 md:w-20"
                  src="right.png"
                  alt="Quote"
                />
              </span>

              <p className="text-lg md:text-2xl font-merriweather  leading-relaxed relative ">
                FoodLoop is an AI-driven platform connecting food donors with
                NGOs in real time, reducing waste and maximizing impact. With
                smart matching, blockchain transparency, and predictive
                analytics, it ensures efficient redistribution. Optimized
                logistics and CSR partnerships make food donation seamless,
                sustainable, and transparent—turning surplus into opportunity.
              </p>

              <span className="absolute  -right-5 md:-right-1 text-9xl text-gray-400">
                <img
                  className="h-12 w-12 md:h-20 md:w-20"
                  src="left.png"
                  alt="Quote"
                />
              </span>

              <div className="mt-6">
                <div className="h-1 w-16 bg-white mb-2"></div>
                <div className="h-1 w-10 bg-white"></div>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
};

export default AboutSection;
