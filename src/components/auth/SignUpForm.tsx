'use client';
import React, { useState, ChangeEvent } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    birthday: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    identification_documents_type: '',
    phone: '',
    position: '',
    card_id: '',
  });

  // Handle change for each input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the form data for submission (e.g., send to your backend)
    console.log(formData);

    // Send data to server (using fetch or axios)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result); // handle success
    } catch (error) {
      console.error('Error submitting form:', error); // handle error
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Back
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-xl dark:text-white/90">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill out the form below to create your account!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* First Name */}
              <div className="sm:col-span-1">
                <Label>
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div className="sm:col-span-1">
                <Label>
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label>
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <Label>
                Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Birthday */}
            <div>
              <Label>
                Birthday<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div>
              <Label>
                Address<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* City */}
            <div>
              <Label>
                City<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            {/* State */}
            <div>
              <Label>
                State<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="state"
                name="state"
                placeholder="Enter your state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            {/* Zip Code */}
            <div>
              <Label>
                Zip Code<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="zip_code"
                name="zip_code"
                placeholder="Enter your zip code"
                value={formData.zip_code}
                onChange={handleChange}
              />
            </div>

            {/* ID Document Type */}
            <div>
              <Label>
                ID Document Type<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="identification_documents_type"
                name="identification_documents_type"
                placeholder="Enter your identification document type"
                value={formData.identification_documents_type}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div>
              <Label>
                Phone<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Position */}
            <div>
              <Label>
                Position<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="position"
                name="position"
                placeholder="Enter your position"
                value={formData.position}
                onChange={handleChange}
              />
            </div>

            {/* Card ID */}
            <div>
              <Label>
                Card ID<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="card_id"
                name="card_id"
                placeholder="Enter your card ID"
                value={formData.card_id}
                onChange={handleChange}
              />
            </div>

            {/* Checkbox for Terms and Conditions */}
            <div className="flex items-center gap-3">
              <Checkbox
                className="w-5 h-5"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                By creating an account, you agree to the{" "}
                <span className="text-gray-800 dark:text-white/90">
                  Terms and Conditions
                </span>{" "}
                and our{" "}
                <span className="text-gray-800 dark:text-white">
                  Privacy Policy
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
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
  );
}
