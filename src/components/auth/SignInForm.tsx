"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useAppStore } from "@/utils/store/store";
import { authApis } from "@/utils/api/api";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; root?: string }>({});

  const router = useRouter();
  const { login } = authApis;
  const { isLoading, setLoading, setLoggedIn, setOrganization } = useAppStore();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const { email, password } = formData;

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, root: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await login(formData);
      const payload = response?.data ?? response;
      const { accessToken, ...rest } = payload;

      setOrganization(rest);
      setLoggedIn(true);
      setFormData({ email: "", password: "" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        root: error?.response?.data?.message || "Invalid email or password"
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors group"
        >
          <ChevronLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none"
      >
        <div className="mb-10 text-center">
          <motion.h1
            variants={itemVariants}
            className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-500 dark:text-gray-400 font-medium"
          >
            Sign in to access your dashboard.
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVariants}>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <Mail size={16} className="text-brand-500" />
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="nursery@example.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              hint={errors.email}
              className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-brand-500/20 transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                <Lock size={16} className="text-brand-500" />
                Password
              </Label>
              <Link
                href="/reset-password"
                className="text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <Input
                id="password"
                name="password"
                value={formData.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handleInputChange}
                error={!!errors.password}
                hint={errors.password}
                className="h-12 pr-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-brand-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-10 transition-colors -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-400 hover:text-brand-500"
              >
                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <Checkbox id="remember" checked={isChecked} onChange={setIsChecked} />
            <label
              htmlFor="remember"
              className="text-sm font-semibold text-gray-600 cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Keep me logged in
            </label>
          </motion.div>

          <AnimatePresence>
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20"
              >
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {errors.root}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="pt-2">
            <Button
              className="w-full h-12 text-base font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/25 transition-all active:scale-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-10 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="ml-1 font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 underline-offset-4 hover:underline transition-all"
            >
              Create one now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
