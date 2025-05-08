"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartIcon from "@/icons/CartIcon";
import Cookies from "js-cookie";
import { User } from "@/types/types.be";

interface UserWithProfile extends User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart?.lineItems?.length || 0;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserWithProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const userCookies = Cookies.get("user");
    if (userCookies) {
      try {
        const parsedUser = JSON.parse(userCookies);
        if(parsedUser?.customerId) {
          setIsLoggedIn(true);
        }
        setUserData(parsedUser?.customerId);
       
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      Cookies.remove("user");
      
      setIsLoggedIn(false);
      setUserData(null);
      
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  console.log(isLoggedIn)
  console.log(userData)

  return (
    <div className="flex justify-between items-center h-12 p-4 w-full bg-black text-white">
      <Link href="/">
        <div className="text-lg font-semibold">CT Checkout Demo</div>
      </Link>

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
        
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm">
              Hi, {userData?.firstName || userData?.email?.split('@')[0] || 'User'}
            </span>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer underline"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer underline">
                Login
              </button>
            </Link>
            <span>or</span>
            <Link href="/signup">
              <button className="bg-transparent border-0 text-white px-3 py-1 rounded font-medium cursor-pointer underline">
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
