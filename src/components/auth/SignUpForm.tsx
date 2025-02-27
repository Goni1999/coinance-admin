
'use client';
import React, { useState, ChangeEvent } from "react";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Radio from "../form/input/Radio";
import Select from "../form/Select";
import { useRouter } from "next/navigation";
import Alert from "../../components/ui/alert/Alert";


export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    identification_documents_type: '',
    card_id: '',
    position: '',
  });

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    show: boolean;
  }>({
    variant: "success",
    title: "",
    message: "",
    show: false,
  });
  

  const options = [
    { value: "id_card", label: "ID Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" }
  ];
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      identification_documents_type: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value, // Directly set the selected gender
    }));
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key as keyof typeof formData].trim() === "") {
        setAlert({
          variant: "error",
          title: "Fields empty",
          message: "Please fill all fields!",
          show: true
        });
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
       setAlert({
      variant: "error",
      title: "Password Mismatch",
      message: "Passwords do not match. Please try again.",
      show: true
    });
      return;
    }

    try {
      const response = await fetch('https://server.capital-trust.eu/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setAlert({
          variant: "success",
          title: "Registred successfully",
          message: "You can login now!",
          show: true,
        });
        router.push("/signin");
      } else {
        const result = await response.json();
        console.error(result);
        setAlert({
          variant: "error",
          title: "Error registering.",
          message: "Please try again.",
          show: true
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlert({
        variant: "error",
        title: "Network error.",
        message: "Please try again later.",
        show: true
      });
    }
  };
  return (
      
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
       
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
      {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
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
            <Label>
                Gender<span className="text-red-500">*</span>
              </Label>
            <div className="grid grid-cols-3 gap-5 sm:grid-cols-">
              
             < Radio id="male" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleRadioChange} label="Male" />
          <Radio id="female" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleRadioChange} label="Female" />
          <Radio id="other" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleRadioChange} label="Other" />
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Password */}
            <div className="sm:col-span-1">
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

           {/* Password */}
           <div className="sm:col-span-1">
              <Label>
                Confirm Password<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
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
             {/* Zip Code */}
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Password */}
                <div className="sm:col-span-1">
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
            {/* State */}
                <div className="sm:col-span-1">
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
            </div>
           
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* ID Document Type */}
            <div className="sm:col-span-1">
              <Label>
                ID Document Type<span className="text-red-500">*</span>
              </Label>
              <Select options={options} onChange={handleSelectChange}  />

            </div>
            <div className="sm:col-span-1">
                <Label>
                ID Document Number<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="idnumber"
                name="idnumber"
                placeholder="Enter your id number"
                value={formData.zip_code}
                onChange={handleChange}
              />
            </div>
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
