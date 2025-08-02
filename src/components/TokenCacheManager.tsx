"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

interface TokenData {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  anonymousId?: string;
  customerId?: string;
  expires_at?: number;
}

const isTokenExpired = (tokenData: TokenData): boolean => {
  if (!tokenData.expires_at) return false;
  const now = Date.now();
  const buffer = 5 * 60 * 1000;
  return now >= tokenData.expires_at - buffer;
};

const TokenCacheManager = () => {
  useEffect(() => {
    if (!sessionStorage.getItem("siteCacheCleared")) {
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove("user");
      sessionStorage.setItem("siteCacheCleared", "true");
      return;
    }

    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) return;

      const tokenData: TokenData = JSON.parse(userCookie);

      if (isTokenExpired(tokenData)) {
        Cookies.remove("user");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("[TokenCacheManager] Error parsing token data:", err);
      Cookies.remove("user");
      localStorage.removeItem("user");
    }
  }, []);

  return null;
};

export default TokenCacheManager;
