import { useEffect, useState } from "react";

/**
 * // useWindowDimension.ts
 * * This hook returns the viewport/window height and width
 */

type WindowDimentions = {
  isMobile: boolean;
  isMobileLarge: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWidescreen: boolean;
};

const useWindowDimensionsNew = (): WindowDimentions => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileLarge, setIsMobileLarge] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWidescreen, setIsWidescreen] = useState(false);

  useEffect(() => {
    function handleResize(): void {
      if (window.innerWidth < 768) {
        setIsMobile(true);

        setIsMobileLarge(false);
        setIsTablet(false);
        setIsDesktop(false);
        setIsWidescreen(false);
      }
      if (window.innerWidth >= 768 && window.innerWidth < 800) {
        setIsMobileLarge(true);

        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(false);
        setIsWidescreen(false);
      }
      if (window.innerWidth >= 800 && window.innerWidth < 1020) {
        setIsTablet(true);

        setIsMobile(false);
        setIsMobileLarge(false);
        setIsDesktop(false);
        setIsWidescreen(false);
      }
      if (window.innerWidth >= 1020 && window.innerWidth < 1460) {
        setIsDesktop(true);

        setIsMobile(false);
        setIsMobileLarge(false);
        setIsTablet(false);
        setIsWidescreen(false);
      }
      if (window.innerWidth >= 1460) {
        setIsWidescreen(true);

        setIsMobile(false);
        setIsMobileLarge(false);
        setIsTablet(false);
        setIsDesktop(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return {
    isMobile,
    isMobileLarge,
    isTablet,
    isDesktop,
    isWidescreen,
  };
};

export default useWindowDimensionsNew;
