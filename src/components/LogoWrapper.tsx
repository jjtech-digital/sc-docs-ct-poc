"use client";
import { useEffect } from "react";

export default function LogoWrapper() {
  useEffect(() => {
    const wrapLogoWithLink = () => {
      const logoImg = document.querySelector('img[alt="logo"]');
      if (logoImg && !logoImg.closest("a")) {
        const link = document.createElement("a");
        link.href = "/";
        link.style.display = "inline-block";
        logoImg.parentNode?.insertBefore(link, logoImg);
        link.appendChild(logoImg);
      }
    };

    wrapLogoWithLink();

    const observer = new MutationObserver(wrapLogoWithLink);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
