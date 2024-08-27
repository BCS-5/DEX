import { useRef, useEffect, useCallback } from "react";

const useScrollFadeIn = (
  direction: "up" | "down" | "left" | "right" = "up",
  duration: number = 1,
  delay: number = 0
) => {
  const dom = useRef<HTMLDivElement | null>(null);

  const handleDirection = (name: string) => {
    switch (name) {
      case "up":
        return "translate3d(0, 30%, 0)";
      case "down":
        return "translate3d(0, -30%, 0)";
      case "left":
        return "translate3d(30%, 0, 0)";
      case "right":
        return "translate3d(-30%, 0, 0)";
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  const handleScroll = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const { current } = dom;
      const entry = entries[0];

      if (current) {
        if (entry.isIntersecting) {
          current.style.transitionProperty = "all";
          current.style.transitionDuration = `${duration}s`;
          current.style.transitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)";
          current.style.transitionDelay = `${delay}s`;
          current.style.opacity = "1";
          current.style.transform = "translate3d(0, 0, 0)";
        } else {
          // 요소가 뷰포트에서 벗어났을 때 애니메이션 초기화
          current.style.opacity = "0";
          current.style.transform = handleDirection(direction);
        }
      }
    },
    [delay, duration, direction]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    const { current } = dom;

    if (current) {
      observer = new IntersectionObserver(handleScroll, { threshold: 0.2 });
      observer.observe(current);
    }

    return () => observer && observer.disconnect();
  }, [handleScroll]);

  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: handleDirection(direction),
    },
  };
};

export default useScrollFadeIn;
