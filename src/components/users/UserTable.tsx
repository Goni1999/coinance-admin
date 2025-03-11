'use client';
import React, { useEffect, useState, ChangeEvent } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useTranslations } from "next-intl";
import Label from "../form/Label";
import { useRouter } from "next/navigation";
import Alert from "../../components/ui/alert/Alert";
import Radio from "../form/input/Radio";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Select from "../form/Select";
import Checkbox from "../form/input/Checkbox";
interface User {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  identification_documents_type: string | null;
  identification_documents: string | null;
  kyc_verification: boolean;
  email: string;
  phone: string | null;
  position: string | null;
  card_id: string | null;
  facebook_link: string | null;
  xcom_link: string | null;
  linkedin_link: string | null;
  instagram_link: string | null;
  two_factor_enabled: boolean;
  role: string;
  gender: string | null;
}


export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const t = useTranslations();
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
const token = sessionStorage.getItem("auth-token");


  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    fetch(`https://server.capital-trust.eu/api/users-admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },    })
    
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data); // Ensure that data is an array before updating the state
        } else {
          console.error("Expected an array, but got:", data);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    setIsModalOpen(true);
  };

  const openModal1 = () => {
    setIsModalOpen1(true);

  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedUser) {
      const { name, value, type } = e.target;
      let newValue: unknown;

      // For radio buttons, handle them as booleans
      if (type === "radio") {
        newValue = value === "true"; // Convert "true" or "false" string to boolean
      } else if (type === "select-one") {
        newValue = value; // For select dropdowns
      } else {
        newValue = value; // For text inputs
      }

      setEditedUser({ ...editedUser, [name]: newValue });
    }
  };

  const handleSave = () => {
    if (!editedUser) return;
  
    // Prepare the body with the email as part of the data
    const requestBody = {
      ...editedUser,
      email: editedUser.email,  // Add email explicitly in the request body
    };
  
    fetch(`https://server.capital-trust.eu/api/users-admin`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers(users.map((user) => (user.email === updatedUser.email ? updatedUser : user)));
        closeModal();
      })
      .catch((error) => console.error("Error updating user:", error));
  };
  
  
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
    
    const handleChange1 = (e: ChangeEvent<HTMLInputElement>) => {
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
        const response = await fetch('https://server.capital-trust.eu/auth/register-admin', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setAlert({
            variant: "success",
            title: "Registred successfully",
            message: "You can login now!",
            show: true,
          });
          router.push("/users");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <Button
  className="ml-4 inline-flex items-center mt-4 gap-2 rounded-lg border border-gray-300 bg-white text-blue-600 px-7 py-2.5 font-medium shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
  onClick={() => openModal1()}
>
  + Add user
</Button>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b text-center   border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader >ID</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Name</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Email</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Phone</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Address</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Role</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow  key={user.id}>
                  <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{user.id}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{user.first_name} {user.last_name}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{user.phone}</TableCell>
                  <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">{user.address}, {user.city}, {user.zip_code}, {user.state}</TableCell>

                  <TableCell>
                    <Badge color={user.role === "admin" ? "success" : "warning"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openModal(user)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedUser && (
        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit User
            </h4>
            <form className="flex flex-col">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4">
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >First Name</label>
                  <Input type="text" name="first_name" value={editedUser?.first_name || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Last Name</label>
                  <Input type="text" name="last_name" value={editedUser?.last_name || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Birthday</label>
                  <Input type="text" name="date_of_birth" value={editedUser?.date_of_birth || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Email</label>
                  <Input type="email" name="email" value={editedUser?.email || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Phone</label>
                  <Input type="text" name="phone" value={editedUser?.phone || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Address</label>
                  <Input type="text" name="address" value={editedUser?.address || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >City</label>
                  <Input type="text" name="city" value={editedUser?.city || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >State</label>
                  <Input type="text" name="state" value={editedUser?.state || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Zip Code</label>
                  <Input type="text" name="zip_code" value={editedUser?.zip_code || ""} onChange={handleChange} />
                </div>
                <div>
                        <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Role</label>
                        <select
                            name="role"
                            value={editedUser?.role || ""}
                            onChange={handleChange}
                        >
                            <option value="unverified">Unverified</option>
                            <option value="emailverified">Email Verified</option>
                            <option value="pending">Pending</option>
                            <option value="user">User</option>
                        </select>
                        </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Gender</label>
                  <Input type="text" name="gender" value={editedUser?.gender || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Card id</label>
                  <Input type="text" name="card_id" value={editedUser?.card_id || ""} onChange={handleChange} />
                </div>
              
              

                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >ID type</label>
                  <Input type="text" name="identification_documents_type" value={editedUser?.identification_documents_type || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Facebook</label>
                  <Input type="text" name="facebook_link" value={editedUser?.facebook_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >LinkedIn</label>
                  <Input type="text" name="linkedin_link" value={editedUser?.linkedin_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >Instagram</label>
                  <Input type="text" name="instagram_link" value={editedUser?.instagram_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400" >X - Twitter</label>
                  <Input type="text" name="xcom_link" value={editedUser?.xcom_link || ""} onChange={handleChange} />
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400"  size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button className="px-4 py-3 font-normal text-gray-500  text-theme-sm dark:text-gray-400"  size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

         {/* Edit Modal */}
         {isModalOpen1 && (
        <Modal isOpen={isModalOpen1} onClose={closeModal1} className="max-w-[700px] m-4">
          <div className="relative w-full  p-4 pt-[900px] overflow-y-auto lg:pt-[500px] bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          {alert.show && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          showLink={false} 
        />
      )}
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add User
            </h4>
            <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* First Name */}
              <div className="sm:col-span-1">
                <Label>
                {t("signupfn")}<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange1}
                />
              </div>

              {/* Last Name */}
              <div className="sm:col-span-1">
                <Label>
                {t("signupln")}<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange1}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label>
              {t("signupphone")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange1}
              />
            </div>


            {/* Email */}
            <div>
              <Label>
              {t("signupemail")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange1}
              />
            </div>
            <Label>
            {t("gender")}<span className="text-red-500">*</span>
              </Label>
            <div className="grid grid-cols-3 gap-5 sm:grid-cols-">
              
             < Radio id="male" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleRadioChange} label="Male" />
          <Radio id="female" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleRadioChange} label="Female" />
          <Radio id="other" name="gender" value="Other" checked={formData.gender === "Other"} onChange={handleRadioChange} label="Other" />
            </div>
         
           {/* Birthday */}
           <div>
              <Label>
              {t("bday")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange1}
              />
            </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Password */}
            <div className="sm:col-span-1">
              <Label>
              {t("pass")}<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange1}
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
              {t("cpass")}<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange1}
                
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
              {t("address")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange1}
              />
            </div>

            {/* City */}
            <div>
              <Label>
              {t("city")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleChange1}
              />
            </div>
             {/* Zip Code */}
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Password */}
                <div className="sm:col-span-1">
                <Label>
                {t("zipcode")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="zip_code"
                name="zip_code"
                placeholder="Enter your zip code"
                value={formData.zip_code}
                onChange={handleChange1}
              />
            </div>
            {/* State */}
                <div className="sm:col-span-1">
              <Label>
              {t("state")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="state"
                name="state"
                placeholder="Enter your state"
                value={formData.state}
                onChange={handleChange1}
              />
            </div>
            </div>
           
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* ID Document Type */}
            <div className="sm:col-span-1">
              <Label>
              {t("idtype")}<span className="text-red-500">*</span>
              </Label>
              <Select options={options} onChange={handleSelectChange}  />

            </div>
            <div className="sm:col-span-1">
                <Label>
                {t("idnumber")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="card_id"
                name="card_id"
                placeholder="Enter your id number"
                value={formData.card_id}
                onChange={handleChange1}
              />
            </div>
                  </div>
            
            
            {/* Position */}
            <div>
              <Label>
              {t("position")}<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="position"
                name="position"
                placeholder="Enter your position"
                value={formData.position}
                onChange={handleChange1}
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
              {t("youagree")} {" "}
                <span className="text-gray-800 dark:text-white/90">
                {t("termsandconditions")} 
                </span>{" "}
                {t("andour")}{" "}
                <span className="text-gray-800 dark:text-white">
                {t("privacypolicy")}Privacy Policy
                </span>
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Add user
              </button>
            </div>
          </div>
        </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
