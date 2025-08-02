"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { SignupInfo } from "@/types/types";
import { SignupSchema } from "@/lib/utils/schemas";
import { useMutation } from "@tanstack/react-query";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInfo>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupInfo) => {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign up");
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data?.user));
      window.location.href = "/";
    },
  });

  const onSubmit = (data: SignupInfo) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#f4f5fc] via-[#d8deff] to-[#f6f8fe] flex flex-col justify-center items-center px-2 overflow-hidden">
      <div className="w-full max-w-md mx-auto rounded-xl bg-white shadow-xl px-8 py-10 flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-2 text-[#6559ff] drop-shadow-md tracking-tight">
          Create an Account
        </h3>
        <p className="mb-6 text-gray-500 text-center">
          Get started with your free account
        </p>

        {signupMutation.error && (
          <div className="text-red-600 mb-4 text-center w-full border border-red-200 bg-red-50 p-2 rounded">
            {signupMutation.error instanceof Error
              ? signupMutation.error.message
              : "Failed to sign up. Please try again."}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
        >
          <div>
            <label className="block text-sm font-medium pb-1 ml-1">
              First name
            </label>
            <input
              type="text"
              placeholder="John"
              {...register("firstName")}
              className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.firstName ? "border-red-400" : "border-gray-200"
              }`}
              disabled={signupMutation.isPending}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs pt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium pb-1 ml-1">
              Last name
            </label>
            <input
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.lastName ? "border-red-400" : "border-gray-200"
              }`}
              disabled={signupMutation.isPending}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs pt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium pb-1 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-3 py-2 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
              disabled={signupMutation.isPending}
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
              disabled={signupMutation.isPending}
              autoComplete="new-password"
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
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="w-full my-6 flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-xs font-medium">OR</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <div className="text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#6559ff] hover:underline font-medium"
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
