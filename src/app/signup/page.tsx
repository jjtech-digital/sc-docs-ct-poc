"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { SignupInfo } from "@/types/types";
import { SignupSchema } from "@/lib/utils/schemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      return res.json();
    },
    onSuccess: () => {
      window.location.href = "/";
      router.push("/");
    },
  });

  const onSubmit = (data: SignupInfo) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="border border-gray-50 rounded-md shadow-md p-4 w-full md:w-[400px] mx-auto -mt-10 flex flex-col items-center justify-center ">
      <h3 className="text-lg mb-3 font-bold">Signup</h3>

      {signupMutation.error && (
        <div className="text-red-500 mb-4 text-center w-full">
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
            Firstname
          </label>
          <input
            type="text"
            placeholder="John"
            {...register("firstName")}
            className="w-full px-3 py-2 border rounded"
            disabled={signupMutation.isPending}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium pb-1 ml-1">
            Lastname
          </label>
          <input
            type="text"
            placeholder="Doe"
            {...register("lastName")}
            className="w-full px-3 py-2 border rounded"
            disabled={signupMutation.isPending}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium pb-1 ml-1">Email</label>
          <input
            type="text"
            placeholder="johndoe@gmail.com"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full px-3 py-2 border rounded"
            disabled={signupMutation.isPending}
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
            disabled={signupMutation.isPending}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-black text-white p-2 rounded border hover:bg-white hover:text-black hover:border hover:border-black transition cursor-pointer font-semibold"
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Signing up..." : "Signup"}
        </button>
      </form>
      <div className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Login here
        </a>
      </div>
    </div>
  );
};

export default SignupPage;
