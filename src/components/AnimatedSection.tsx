import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "zoom-in" | "flip-up" | "bounce-in" | "rotate-in";
  className?: string;
  delay?: number;
  triggerOnce?: boolean;
}

export const AnimatedSection = ({ 
  children, 
  animation = "fade-up",
  className = "",
  delay = 0,
  triggerOnce = false
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce,
  });

  const getAnimationClass = () => {
    const baseTransition = "transition-all duration-1000 ease-out"; // Increased duration for smoother effect
    
    switch (animation) {
      case "fade-up":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20" // Increased distance
        }`;
      case "fade-in":
        return `${baseTransition} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95" // Added slight scale
        }`;
      case "scale-in":
        return `${baseTransition} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50" // More dramatic scale
        }`;
      case "zoom-in":
        return `${baseTransition} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0" // Full zoom from 0
        }`;
      case "slide-left":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-20" // Increased distance
        }`;
      case "slide-right":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-20" // Increased distance
        }`;
      case "flip-up":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 rotate-x-0 translate-y-0"
            : "opacity-0 rotate-x-90 translate-y-20" // Flip effect
        }`;
      case "rotate-in":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-180 scale-50" // Rotate and scale
        }`;
      case "bounce-in":
         return `${baseTransition} ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-50 translate-y-20" // Bounce-like entry (simplified)
        }`;
      default:
        return baseTransition;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
