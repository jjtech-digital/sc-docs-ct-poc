"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { LoginInfo } from "@/types/types";
import { LoginSchema } from "@/lib/utils/schemas";
import { useMutation } from "@tanstack/react-query";

const LoginPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInfo) => {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to login");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data?.user));
      window.location.href = "/";
    },
  });

  const onSubmit = (data: LoginInfo) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="border border-gray-50 rounded-md shadow-md p-4 w-full md:w-[400px] mx-auto -mt-10 flex flex-col items-center justify-center ">
      <h3 className="text-lg mb-3 font-bold">Login</h3>
      {loginMutation.error && (
        <div className="text-red-500 mb-4 text-center w-full">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "Failed to login. Please try again."}
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <div>
          <label className="block text-sm font-medium pb-1 ml-1">Email</label>
          <input
            type="text"
            placeholder="johndoe@gmail.com"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full px-3 py-2 border rounded"
            disabled={loginMutation.isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium pb-1 ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="********"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full px-3 py-2 border rounded"
            disabled={loginMutation.isPending}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-black text-white p-2 rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Log In"}
        </button>
      </form>
      <div className="mt-4 text-sm">
        {"Don't have an account yet?"}{" "}
        <a href="/signup" className="text-blue-600 underline">
          Sign up here
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
