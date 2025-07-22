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
    <header className="w-full bg-[#6559ff] text-white shadow-sm">
      <div className="flex justify-between items-center h-16 px-4 max-w-screen-xl mx-auto">
        <Link
          href="/"
          className="text-lg md:text-xl font-semibold whitespace-nowrap"
        >
          CT Checkout Demo
        </Link>

        <div className="w-full max-w-md flex flex-1 mx-4">
          <QuickSearch />
        </div>

        <div className="flex items-center space-x-4 relative">
          <Link href="/cart" className="relative">
            <button
              className="flex items-center justify-center hover:opacity-90 transition p-2 rounded"
              aria-label="Cart"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <button
              className="flex items-center justify-center hover:opacity-90 transition p-2 rounded"
              onClick={() => setShowUserMenu((prev) => !prev)}
              aria-label="User menu"
            >
              <UserIcon />
            </button>

            {showUserMenu && (
              <div className="absolute top-10 right-0 bg-white text-black w-40 rounded-lg shadow-lg py-2 z-20">
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
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200">
                        <LoginIcon />
                        <span>Login</span>
                      </div>
                    </Link>
                    <Link href="/signup">
                      <div className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
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
    </header>
  );
};

export default Header;
