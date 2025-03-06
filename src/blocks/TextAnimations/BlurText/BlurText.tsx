/*
	jsrepo 1.41.2
	Installed from https://reactbits.dev/ts/tailwind/
	27-2-2025
*/

import { useRef, useEffect, useState } from "react";
import {
  useSprings,
  animated,
  config as springConfig,
  SpringValue,
} from "@react-spring/web";

// Define animation props type
type AnimationProps = {
  filter: string;
  opacity: number;
  transform: string;
};

type SpringAnimationNext = (props: Partial<AnimationProps>) => Promise<void>;

type AnimatedStyles = {
  filter: SpringValue<string>;
  opacity: SpringValue<number>;
  transform: SpringValue<string>;
};

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Partial<AnimationProps>;
  animationTo?: Partial<AnimationProps>[];
  easing?: keyof typeof springConfig | ((t: number) => number);
  onAnimationComplete?: () => void;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = "easeOutCubic",
  onAnimationComplete,
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const animatedCount = useRef(0);

  // Default animations based on direction
  const defaultFrom: AnimationProps = {
    filter: "blur(10px)",
    opacity: 0,
    transform:
      direction === "top" ? "translate3d(0,-50px,0)" : "translate3d(0,50px,0)",
  };

  const defaultTo: AnimationProps[] = [
    {
      filter: "blur(5px)",
      opacity: 0.5,
      transform:
        direction === "top" ? "translate3d(0,5px,0)" : "translate3d(0,-5px,0)",
    },
    {
      filter: "blur(0px)",
      opacity: 1,
      transform: "translate3d(0,0,0)",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const springs = useSprings(
    elements.length,
    elements.map((_, i) => ({
      from: animationFrom || defaultFrom,
      to: async (next: SpringAnimationNext) => {
        if (inView) {
          for (const step of animationTo || defaultTo) {
            await next(step);
          }
          animatedCount.current += 1;
          if (
            animatedCount.current === elements.length &&
            onAnimationComplete
          ) {
            onAnimationComplete();
          }
        }
      },
      delay: i * delay,
      config:
        typeof easing === "string" && easing in springConfig
          ? springConfig[easing as keyof typeof springConfig]
          : { easing: easing as (t: number) => number },
    }))
  );

  const AnimatedSpan = animated("span");

  return (
    <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
      {springs.map((style, index) => (
        <AnimatedSpan
          key={index}
          style={style as unknown as AnimatedStyles}
          className="inline-block transition-transform will-change-[transform,filter,opacity]"
        >
          {elements[index] === " " ? "\u00A0" : elements[index]}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </AnimatedSpan>
      ))}
    </p>
  );
};

export default BlurText;
