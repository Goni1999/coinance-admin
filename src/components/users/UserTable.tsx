'use client';
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

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

  useEffect(() => {
    fetch("https://server.capital-trust.eu/api/users-admin")
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
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader >ID</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Name</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Email</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Phone</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Address</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Role</TableCell>
              <TableCell className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>Actions</TableCell>
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
                  <label>First Name</label>
                  <Input type="text" name="first_name" value={editedUser?.first_name || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Last Name</label>
                  <Input type="text" name="last_name" value={editedUser?.last_name || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Birthday</label>
                  <Input type="text" name="date_of_birth" value={editedUser?.date_of_birth || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Email</label>
                  <Input type="email" name="email" value={editedUser?.email || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Phone</label>
                  <Input type="text" name="phone" value={editedUser?.phone || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Address</label>
                  <Input type="text" name="address" value={editedUser?.address || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>City</label>
                  <Input type="text" name="city" value={editedUser?.city || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>State</label>
                  <Input type="text" name="state" value={editedUser?.state || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Zip Code</label>
                  <Input type="text" name="zip_code" value={editedUser?.zip_code || ""} onChange={handleChange} />
                </div>
                <div>
                        <label>Role</label>
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
                  <label>Gender</label>
                  <Input type="text" name="gender" value={editedUser?.gender || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Card id</label>
                  <Input type="text" name="card_id" value={editedUser?.card_id || ""} onChange={handleChange} />
                </div>
              
              

                <div>
                  <label>ID type</label>
                  <Input type="text" name="identification_documents_type" value={editedUser?.identification_documents_type || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Facebook</label>
                  <Input type="text" name="facebook_link" value={editedUser?.facebook_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>LinkedIn</label>
                  <Input type="text" name="linkedin_link" value={editedUser?.linkedin_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Instagram</label>
                  <Input type="text" name="instagram_link" value={editedUser?.instagram_link || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>X - Twitter</label>
                  <Input type="text" name="xcom_link" value={editedUser?.xcom_link || ""} onChange={handleChange} />
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
