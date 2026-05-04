"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Building, MapPin, Phone, Globe, ChevronDown, Trash2 } from "lucide-react";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useAppStore } from "@/utils/store/store";
import { authApis } from "@/utils/api/api";

type RegisterPayload = {
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  businessTypeId: number;
  categoryId: number;
  subcategoryId: number;
  password: string;
};

export default function SignUpForm() {
  const { getBusinessTypes, getCategories, getSubCategories, register } = authApis;
  const { businessTypes, categories, setBusinessTypes, setCategories, isLoading, setLoading, setOrganization, setLoggedIn } = useAppStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    address: "",
    businessTypeId: "",
    categoryId: "",
    subcategoryId: "",
    password: "",
    cpassword: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);

  const formValidation = () => {
    const newErrors: { [key: string]: string } = {};
    const { organizationName, email, phone, address, businessTypeId, categoryId, subcategoryId, password, cpassword } = formData;

    if (!organizationName) newErrors.organizationName = "Required";
    if (!email) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    
    if (!phone) newErrors.phone = "Required";
    else if (isNaN(Number(phone))) newErrors.phone = "Invalid phone";
    else if (phone.length !== 10) newErrors.phone = "Must be 10 digits";

    if (!address) newErrors.address = "Required";
    if (!businessTypeId) newErrors.businessTypeId = "Required";
    if (!categoryId) newErrors.categoryId = "Required";
    if (!subcategoryId) newErrors.subcategoryId = "Required";

    if (!password) newErrors.password = "Required";
    else if (password.length < 6) newErrors.password = "Min 6 chars";

    if (password !== cpassword) newErrors.cpassword = "Passwords don't match";

    if (!isChecked) newErrors.terms = "You must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getBusinessAndCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const [businessTypesData, categoriesData] = await Promise.all([getBusinessTypes(), getCategories()]);
      setBusinessTypes(businessTypesData.data);
      setCategories(categoriesData.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    if (!formData.categoryId) return;
    setIsSubcategoriesLoading(true);
    try {
      const response = await getSubCategories(Number(formData.categoryId));
      const mapped = response?.data?.map((sc: any) => ({
        value: sc.id.toString(),
        label: sc.name,
      })) || [];
      setSubcategoriesOptions(mapped);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setIsSubcategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (formData.categoryId) fetchSubCategories();
    else setSubcategoriesOptions([]);
  }, [formData.categoryId]);

  useEffect(() => {
    getBusinessAndCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "categoryId") {
      const category = categories?.find((c: any) => c.id.toString() === value);
      setSelectedCategory(category);
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      if (errors.logo) setErrors(prev => ({ ...prev, logo: "" }));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValidation()) return;

    setLoading(true);
    const data = new FormData();
    data.append("organizationName", formData.organizationName.trim());
    data.append("email", formData.email.trim());
    data.append("phone", formData.phone.trim());
    data.append("address", formData.address.trim());
    data.append("businessTypeId", formData.businessTypeId);
    data.append("categoryId", formData.categoryId);
    data.append("subcategoryId", formData.subcategoryId);
    data.append("password", formData.password);

    if (logoFile) {
      data.append("logo", logoFile);
    }

    try {
      const response = await register(data);
      const payload = response?.data ?? response;
      const { accessToken, ...rest } = payload;

      setOrganization(rest);
      setLoggedIn(true);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setErrors({ root: error?.message || "Registration failed" });
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
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const businessOptions = (businessTypes || []).map((bt: any) => ({ value: bt.id.toString(), label: bt.name }));
  const categoryOptions = (categories || []).map((c: any) => ({ value: c.id.toString(), label: c.name }));

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
        <div className="mb-10 text-center sm:text-left">
          <motion.h1 
            variants={itemVariants}
            className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            Create Account
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 dark:text-gray-400 font-medium"
          >
            Start managing your nursery with PlantScan today.
          </motion.p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <motion.div variants={itemVariants}>
            <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <Building size={16} className="text-brand-500" />
              Organization Name
            </Label>
            <Input
              name="organizationName"
              placeholder="Your nursery's name"
              value={formData.organizationName}
              onChange={handleInputChange}
              error={!!errors.organizationName}
              hint={errors.organizationName}
              className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                <Mail size={16} className="text-brand-500" />
                Email
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="nursery@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                hint={errors.email}
                className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                <Phone size={16} className="text-brand-500" />
                Phone Number
              </Label>
              <Input
                type="tel"
                name="phone"
                maxLength={10}
                placeholder="10 digits"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                hint={errors.phone}
                className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <MapPin size={16} className="text-brand-500" />
              Address
            </Label>
            <Input
              name="address"
              placeholder="Detailed nursery address"
              value={formData.address}
              onChange={handleInputChange}
              error={!!errors.address}
              hint={errors.address}
              className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <Globe size={16} className="text-brand-500" />
              Organization Logo
            </Label>
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <FileInput
                  key={logoPreview ? "has-file" : "no-file"}
                  onChange={handleFileChange}
                  className="h-12 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 w-full"
                />
              </div>
              {logoPreview && (
                <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 group shadow-sm">
                    <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                  {logoFile && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {logoFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {(logoFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Label className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">Business Type</Label>
              <div className="relative group">
                <Select
                  options={businessOptions}
                  placeholder="Select Type"
                  onChange={(val) => handleSelectChange("businessTypeId", val)}
                  value={formData.businessTypeId}
                  className={errors.businessTypeId ? "border-red-500 h-12" : "h-12 bg-gray-50/50 dark:bg-gray-900/50"}
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
              </div>
              {errors.businessTypeId && <p className="mt-1 text-xs text-red-500">{errors.businessTypeId}</p>}
            </motion.div>
            <motion.div variants={itemVariants}>
              <Label className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">Category</Label>
              <div className="relative group">
                <Select
                  options={categoryOptions}
                  placeholder={isCategoriesLoading ? "Loading..." : "Select Category"}
                  onChange={(val) => handleSelectChange("categoryId", val)}
                  value={formData.categoryId}
                  className={errors.categoryId ? "border-red-500 h-12" : "h-12 bg-gray-50/50 dark:bg-gray-900/50"}
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
              </div>
              {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>}
            </motion.div>
          </div>

          <AnimatePresence>
            {selectedCategory && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                variants={itemVariants}
              >
                <Label className="mb-2 text-gray-700 dark:text-gray-300 font-semibold">Subcategory</Label>
                <div className="relative group">
                  <Select
                    options={subcategoriesOptions}
                    placeholder={isSubcategoriesLoading ? "Loading..." : "Select Subcategory"}
                    onChange={(val) => handleSelectChange("subcategoryId", val)}
                    value={formData.subcategoryId}
                    className={errors.subcategoryId ? "border-red-500 h-12" : "h-12 bg-gray-50/50 dark:bg-gray-900/50"}
                  />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-colors group-focus-within:text-brand-500" />
                </div>
                {errors.subcategoryId && <p className="mt-1 text-xs text-red-500">{errors.subcategoryId}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div variants={itemVariants}>
              <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                <Lock size={16} className="text-brand-500" />
                Password
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  hint={errors.password}
                  className="h-12 bg-gray-50/50 dark:bg-gray-900/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500"
                >
                  {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Label className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
                <Lock size={16} className="text-brand-500" />
                Confirm
              </Label>
              <Input
                name="cpassword"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.cpassword}
                onChange={handleInputChange}
                error={!!errors.cpassword}
                hint={errors.cpassword}
                className="h-12 bg-gray-50/50 dark:bg-gray-900/50"
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex items-start gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} className={errors.terms ? "border-red-500" : ""} />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                I agree to the <span className="text-brand-500 font-bold hover:underline cursor-pointer">Terms</span> and <span className="text-brand-500 font-bold hover:underline cursor-pointer">Privacy Policy</span>
              </p>
              {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
            </div>
          </motion.div>

          <AnimatePresence>
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-sm font-bold text-red-600"
              >
                {errors.root}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="pt-2">
            <Button 
              className="w-full h-12 text-base font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-2xl shadow-xl shadow-brand-500/25 transition-all active:scale-95" 
              disabled={isLoading}
              onClick={handleSignUp}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="mt-10 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="ml-1 font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400 underline-offset-4 hover:underline transition-all"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
