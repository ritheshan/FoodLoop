import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    question: "What is FoodLoop and how does it work?",
    answer:
      "FoodLoop is a platform that connects food donors with NGOs to ensure surplus food reaches those in need. We use a smart tracking system to optimize pickups and deliveries.",
  },
  {
    question: "Is FoodLoop free to use?",
    answer:
      "Yes! FoodLoop is completely free for both donors and NGOs. Our mission is to eliminate food waste and fight hunger through seamless technology.",
  },
  {
    question: "How does FoodLoop ensure food safety?",
    answer:
      "We work with certified partners and volunteers who follow strict hygiene protocols during collection, storage, and distribution.",
  },
  {
    question: "Can I track the impact of my donations?",
    answer:
      "Absolutely. Our dashboard gives real-time stats on meals donated, areas served, and the environmental impact of your contributions.",
  },
  {
    question: "Why did the tomato join FoodLoop?",
    answer:
      "Because it didn’t want to ketchup with waste! (Okay, that was a fun one—but hey, even veggies deserve a second chance!)",
  },
];

const FaqSection = () => {
  const TextRef = useRef(null);
  const BoxRef = useRef(null);
  useEffect(() => {
    const elementleft = TextRef.current;
    const elementright = BoxRef.current;
    gsap.fromTo(
      elementleft,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementleft,
          start: "top 50%",
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
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: elementright,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  return (
    <>
     <div
        className="w-full bg-center bg-cover bg-no-repeat "
        style={{
          aspectRatio: "960/300",
          backgroundImage: "url('./Layer5.svg')",
        }}
      ></div>
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div  id="faqs" ref={TextRef} className="max-w-sm">
            <h2 className=" font-bold text-7xl md:leading-tight font-Birthstone text-black">
              Frequently<br />asked questions
            </h2>
            <p className="mt-1 hidden md:block font-merriweather text-gray-900">
              Answers to the most common questions about FoodLoop.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div ref={BoxRef} className="divide-y divide-gray-200 font-merriweather bg-orange-400 px-2 py-2 border-black border-[3px] rounded-md dark:divide-neutral-700">
            {faqData.map((faq, index) => (
              <details key={index} className="group py-6 cursor-pointer">
                <summary className="flex items-center justify-between text-left font-semibold md:text-lg text-orange-900  group-open:text-gray-950 transition-all">
                  {faq.question}
                  <svg
                    className="size-5 text-gray-200 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-gray-950 ">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FaqSection;
