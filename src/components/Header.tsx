"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/icons/CartIcon";
import Cookies from "js-cookie";
import UserIcon from "@/icons/UserIcon";
import LoginIcon from "@/icons/LoginIcon";
import SignupIcon from "@/icons/SignupIcon";
import QuickSearch from "./QuickSearch";

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart?.lineItems?.length || 0;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userDataFromLS =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const parsedUserData = userDataFromLS ? JSON.parse(userDataFromLS) : null;

  useEffect(() => {
    const userCookies = Cookies.get("user");
    if (userCookies) {
      try {
        const parsedUser = JSON.parse(userCookies);
        if (parsedUser?.customerId) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      Cookies.remove("user");
      localStorage.removeItem("user");
      setIsLoggedIn(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex justify-between items-center h-12 p-4 w-full bg-[#7795fe] text-white">
      <Link href="/">
        <div className="text-sm md:text-lg font-semibold white-nowrap">CT Checkout Demo</div>
      </Link>
      <div className="w-full max-w-md">
        <QuickSearch />
      </div>
      <div className="flex items-center space-x-2">
        <Link href="/cart">
          <div className="relative inline-block">
            <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer ">
              <CartIcon />
            </button>
            {itemCount > 0 && (
              <span className="absolute top-0 right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </Link>
        <div
          className="relative"
          onMouseEnter={() => setShowUserMenu(true)}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer">
            <UserIcon />
          </button>

          {showUserMenu && (
            <div
              className="absolute w-[150px] h-auto bg-white top-10 right-0 rounded-lg shadow-lg text-black py-2 z-10"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium">
                      Hi {parsedUserData?.firstName || "User"} 👋
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex gap-2 items-center border-b border-gray-200">
                      <LoginIcon />
                      <span>Login</span>
                    </div>
                  </Link>

                  <Link href="/signup">
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                      <SignupIcon />
                      <span>Signup</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
