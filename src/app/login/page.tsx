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
        headers: { "Content-Type": "application/json" },
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
    <div className="min-h-screen bg-gradient-to-br from-[#f4f5fc] via-[#d8deff] to-[#f6f8fe] flex items-center justify-center px-2">
      <div className="w-full max-w-md mx-auto rounded-xl bg-white shadow-xl px-8 py-10 flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-2 text-[#6559ff] drop-shadow-md tracking-tight">
          Welcome Back
        </h3>
        <p className="mb-6 text-gray-500 text-center">
          Log in to your account to continue
        </p>

        {loginMutation.error && (
          <div className="text-red-600 mb-4 text-center w-full border border-red-200 bg-red-50 p-2 rounded">
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
              type="email"
              placeholder="you@email.com"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              disabled={loginMutation.isPending}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs pt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium pb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              disabled={loginMutation.isPending}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs pt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-[#6559ff] text-white p-2 rounded-lg font-semibold shadow hover:bg-[#574ad6] transition disabled:opacity-60"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="w-full my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <div className="text-sm text-gray-600">
          Don&apos;t have an account yet?{" "}
          <a
            href="/signup"
            className="text-[#6559ff] hover:underline font-medium"
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
