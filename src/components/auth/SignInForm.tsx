"use client"; // ✅ Ensures this file runs on the client-side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ For redirection
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Alert from "../ui/alert/Alert";
import { useTranslations } from "next-intl";
export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
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
  // ✅ Store email in sessionStorage
  useEffect(() => {
    if (email) {
      sessionStorage.setItem("userEmail", email);
    }
  }, [email]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const response = await fetch("https://server.coinance.co/auth/login-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe: isChecked }),
        credentials: 'include', // This will ensure cookies are sent

      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Login failed");
        
      sessionStorage.setItem("auth-token", data.token);
      sessionStorage.setItem("role", data.role);

      if (data.redirect) {
        setAlert({
          variant: "success",
          title: "Login successful",
          message: "",
          show: true
        });
        // ✅ Add timeout for stability
        setTimeout(() => {
          router.replace(data.redirect);
        }, 500);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
       
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
      {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
      <br/>
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          {t("back")}
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
       
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {t("signin")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("signinp1")} 
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>{t("signinemail")} <span className="text-error-500">*</span></Label>
                <Input 
                  placeholder="info@mail.com" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div>
                <Label>{t("signinpass")} <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  {t("signinkeepme")}
                  </span>
                </div>
                <Link
                  href="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {t("signinforgot")}
                </Link>
              </div>

              {error && <p className="text-error-500 text-sm">{error}</p>}

              <div>
                <button
                  type="submit" disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  {loading ? `${t("Signing in...")}` : `${t("signin")}` }
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            {t("signindonthave")}{" "}
              <Link
                href="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                {t("signup")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
