"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon, ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { authApis } from "@/utils/api/api"
import { useAppStore } from "@/utils/store/store";

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
  const { businessTypes, categories, setBusinessTypes, setCategories, isLoading, setLoading, setOrganization } = useAppStore();

  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
    businessTypeId: "",
    categoryId: "",
    subcategoryId: "",
    password: "",
    cpassword: "",
  });

  const formValidation = () => {
    const { organizationName, email, phone, address, businessTypeId, categoryId, subcategoryId, password, cpassword } = formData

    if (!organizationName || !email || !phone || !address || !businessTypeId || !categoryId || !subcategoryId || !password || !cpassword) {
      alert("All fields are required")
      return false
    }

    if (password !== cpassword) {
      alert("Passwords do not match")
      return false
    }

    if (isNaN(Number(formData.phone))) {
      alert("Phone number is not valid")
      return false
    }

    return true

  }

  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  //get categories and business and subcategories types --> start
  const getBusinessAndCategories = async () => {
    setLoading(true);
    try {
      const [businessTypesData, categoriesData] = await Promise.all([getBusinessTypes(), getCategories()]);
      setBusinessTypes(businessTypesData.data);
      setCategories(categoriesData.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setLoading(false);
    }
  };

  const subCategories = async () => {
    if (!formData.categoryId) return;
    try {
      const response = await getSubCategories(Number(formData.categoryId));
      const mappedSubcategories = response?.data?.map((sc: any) => ({
        value: sc.id.toString(),
        label: sc.name,
      })) || [];
      setSubcategoriesOptions(mappedSubcategories);
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    if (formData.categoryId) {
      subCategories();
    } else {
      setSubcategoriesOptions([]);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    getBusinessAndCategories();
  }, []);

  //get categories and business types --> end

  //Authentication --> start

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    // e.preventDefault();
    setLoading(true)
    const isValidForm = formValidation();
    if (!isValidForm) {
      setLoading(false);
      return;
    }

    const payload: RegisterPayload = {
      organizationName: formData.organizationName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      businessTypeId: Number(formData.businessTypeId),
      categoryId: Number(formData.categoryId),
      subcategoryId: Number(formData.subcategoryId),
      password: formData.password,
    };

    if (formData.logoUrl.trim()) {
      payload.logoUrl = formData.logoUrl.trim();
    }

    try {
      const response = await register(payload);
      setOrganization(response);
      setFormData({ organizationName: "", 
        email: "", 
        phone: "", 
        address: "", 
        logoUrl: "", 
        businessTypeId: "", 
        categoryId: "", 
        subcategoryId: "", 
        password: "", 
        cpassword: "" });
    } catch (error: any) {
      console.log(error);
      alert(error?.message || "Registration failed");
    } finally {
      setLoading(false)
    }
  };

  //Authentication --> end


  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "categoryId") {
      const category = categories?.find((c: any) => c.id.toString() === value);
      setSelectedCategory(category);
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  };

  const businessOptions = Array.isArray(businessTypes) ? businessTypes.map((bt: any) => ({
    value: bt.id.toString(),
    label: bt.name,
  })) : [];

  const categoryOptions = Array.isArray(categories) ? categories.map((c: any) => ({
    value: c.id.toString(),
    label: c.name,
  })) : [];

  const subCategoryOptions = Array.isArray(selectedCategory?.subcategories) ? selectedCategory.subcategories.map((sc: any) => ({
    value: sc.id.toString(),
    label: sc.name,
  })) : [];

  if (!Array.isArray(businessTypes) || !Array.isArray(categories) || businessTypes.length === 0 || categories.length === 0) {
    return (
      <>
        <div className="flex flex-1 items-center justify-center p-5 text-brand-500">
          <span className="animate-pulse">Loading form data...</span>
        </div>
      </>
    )
  }


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form >
              <div className="space-y-5">
                {/* Organization Name */}
                <div>
                  <Label>
                    Organization Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="organizationName"
                    placeholder="Enter organization name"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Email */}
                  <div className="sm:col-span-1">
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* Phone */}
                  <div className="sm:col-span-1">
                    <Label>
                      Phone Number<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label>
                    Address<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    type="text"
                    name="logoUrl"
                    placeholder="Enter logo URL"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Business Type */}
                  <div className="sm:col-span-1">
                    <Label>
                      Business Type<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        options={businessOptions}
                        placeholder="Select Business Type"
                        onChange={(value) => handleSelectChange("businessTypeId", value)}
                        value={formData.businessTypeId}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-1">
                    <Label>
                      Category<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        options={categoryOptions}
                        placeholder="Select Category"
                        onChange={(value) => handleSelectChange("categoryId", value)}
                        value={formData.categoryId}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subcategory */}
                {selectedCategory && (
                  <div>
                    <Label>
                      Subcategory<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Select
                        options={subcategoriesOptions}
                        placeholder="Select Subcategory"
                        onChange={(value) => handleSelectChange("subcategoryId", value)}
                        value={formData.subcategoryId}
                      />
                      <span className="absolute text-foreground -translate-y-1/2 pointer-events-none right-3 top-1/2">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="cpassword"
                      placeholder="Re-enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.cpassword}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-foreground">
                    By creating an account means you agree to the{" "}
                    <span className="text-foreground">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-foreground">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                {/* Button */}
                {
                  !isLoading ?
                    <div>
                      <button
                        type="button"
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        onClick={handleSignUp}
                      >
                        Sign Up
                      </button>
                    </div>
                    :
                    <div>
                      <button
                        type="button"
                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        disabled={true}
                      >
                        Registering...
                      </button>
                    </div>
                }
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-foreground sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
