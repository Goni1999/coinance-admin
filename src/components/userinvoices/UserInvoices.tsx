import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Alert from '../ui/alert/Alert';
import Label from '../form/Label';
import Input from '../form/input/InputField';


type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  invoices: Invoice[];
  address: string; 
};

type Invoice = {
  id: number;
  user_id: string;
  issued_date: string;
  sub_total: number;
  vat: number;
  total: number;
  link_of_pdf: string;
  status: string; 
};

const Invoices = () => {
    const token = sessionStorage.getItem("auth-token");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const [InvoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null); 
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
const [isModalOpen, setIsModalOpen] = useState(false); 

const [formData, setFormData] = useState({
    id: '',
    sub_total: '',
    vat: '',
    link_of_pdf: '',
    status: 'unpaid',
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
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('auth-token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      try {
        const usersResponse = await fetch('https://server.capital-trust.eu/api/users-admin', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData: User[] = await usersResponse.json();

        const invoicesResponse = await fetch('https://server.capital-trust.eu/api/admin-invoices', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!invoicesResponse.ok) throw new Error('Failed to fetch invoices');
        const invoicesData: Invoice[] = await invoicesResponse.json();

        const usersWithInvoices = usersData.map((user) => {
          user.invoices = invoicesData.filter((invoice) => invoice.user_id === user.id);
          return user;
        });

        setUsers(usersWithInvoices);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user === selectedUser ? null : user); 
    setSelectedInvoice(null); 
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInvoiceStatusClass = (status: string) => {
    if (status === 'paid') return 'bg-green-50 dark:green-500/15 text-green-500 pr-2 pl-2';
    if (status === 'unpaid') return 'bg-red-50 dark:bg-red-500/15 text-red-500 pr-2 pl-2';
    return '';
  };

  const getSelectedUserClass = (user: User) => {
    return user === selectedUser ? 'bg-blue-400 text-white' : '';
  };

  const getSelectedInvoiceClass = (invoice: Invoice) => {
    return invoice === selectedInvoice ? 'text-blue-500 bg-gray-500' : '';
  };


  const handleEditInvoice = () => {
    console.log(`Editing invoice: ${selectedInvoice?.id}`);
  };

  const openDeleteModal = (invoice: Invoice) => {
    setInvoiceToDelete(invoice); 
    setIsDeleteModalOpen(true); 
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false); 
    setInvoiceToDelete(null); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};




const calculateTotal = () => {
    const subTotal = parseFloat(formData.sub_total || '0');
    const vat = parseFloat(formData.vat || '0');
    return (subTotal + subTotal * (vat / 100)).toFixed(2);
};
const handleAddInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
        setAlert({
            variant: "error",
            title: "No user selected",
            message: "Please select a user to associate the invoice.",
            show: true,
        });
        return;
    }

    const newInvoice = {
        user_id: selectedUser.id,
        issued_date: new Date().toISOString().split('T')[0],
        sub_total: parseFloat(formData.sub_total),
        vat: parseFloat(formData.vat),
        total: parseFloat(calculateTotal()),
        link_of_pdf: formData.link_of_pdf || '',
        status: formData.status,
    };

    try {
        const token = sessionStorage.getItem('auth-token');
        if (!token) {
            setAlert({
                variant: "error",
                title: "Authentication Error",
                message: "No authentication token found.",
                show: true,
            });
            return;
        }

        const response = await fetch('https://server.capital-trust.eu/api/admin-invoices-create', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newInvoice),
        });

        if (!response.ok) {
            throw new Error('Failed to create invoice');
        }

        const createdInvoice = await response.json();

        const updatedUsers = users.map((user) => {
            if (user.id === selectedUser.id) {
                user.invoices.push(createdInvoice); // Add the new invoice to the user's invoices array
            }
            return user;
        });

        setUsers(updatedUsers);

        setIsModalOpen(false);
        setAlert({
            variant: "success",
            title: "Invoice Created",
            message: "The invoice has been created successfully.",
            show: true,
        });

    } catch (error) {
        console.error('Error creating invoice:', error);
        setAlert({
            variant: "error",
            title: "Failed to Create Invoice",
            message: "Please try again.",
            show: true,
        });
    }
};


  const handleDeleteInvoice = async () => {
    if (!InvoiceToDelete?.id) {
      setAlert({
        variant: "error",
        title: "No id for this Invoice",
        message: "",
        show: true,

      });
      return;
    }
  
    try {
      const response = await fetch(`https://server.capital-trust.eu/api/admin-invoices-delete`, {
        method: "POST", // Keep the DELETE method
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: InvoiceToDelete.id, // Send transactionId in the request body
        }),
      });
  
      if (response.ok) {
        // Refresh the user data after the transaction is deleted
        const updatedUsers = users.map(user => {
          if (user.id === selectedUser?.id) {
            user.invoices = user.invoices.filter(
              Invoices => Invoices.id !== InvoiceToDelete?.id
            );
          }
          return user;
        });
  
        setUsers(updatedUsers);
        setAlert({
          variant: "success",
          title: "Invoice deleted successfully!",
          message: "",
          show: true,

        });
        setTimeout(() => {
            window.location.reload();
          }, 5000);
      } else {
        setAlert({
          variant: "error",
          title: "Failed to delete Invoice.",
          message: "Please try again!",
          show: true,

        });
        setTimeout(() => {
            window.location.reload();
          }, 5000);
      }
    } catch (error) {
      console.error('Error deleting Invoice:', error);
      setAlert({
        variant: "error",
        title: "Error deleting Invoice.",
        message: "Please try again!",
        show: true,

      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  
    closeDeleteModal(); // Close the modal after deletion
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
           {alert.show   &&  (
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
              showLink={false} 
            />
          )}
           <button
                onClick={() => setIsModalOpen(true)}

                  className="self-center px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Invoice
                </button>
      <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row">
        {/* Left Panel: User List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] xl:w-1/5">
          <div className="space-y-1">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${getSelectedUserClass(user)}`}
                onClick={() => handleUserClick(user)}
              >
                <div>
                  <span className="mb-0.5 block text-sm font-medium text-gray-800 dark:text-white/90">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Invoice List and Details */}
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-4/5 flex flex-col">
          {selectedUser && (
            <>
            <div className="flex flex-row justify-center">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
           
                <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">
                  User: {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
                  Address: {selectedUser.address}
                </h4>
                </div>

               
              </div>
              <div className="flex gap-6 p-5 xl:p-8">
                {/* Left Column: Invoices List */}
                <div className="flex flex-col w-1/3 space-y-3">
                  {selectedUser.invoices.length === 0 ? (
                    <div className="text-gray-500 dark:text-gray-400">
                      No invoices for {selectedUser.first_name} {selectedUser.last_name}.
                    </div>
                  ) : (
                    selectedUser.invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className={`cursor-pointer flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03] ${getSelectedInvoiceClass(invoice)}`}
                        onClick={() => handleInvoiceClick(invoice)}
                      >
                        <div>
                          <span className={`block rounded-tl-lg rounded-tr-lg pt-2 text-sm font-medium ${getInvoiceStatusClass(invoice.status)}`}>
                            Invoice #{invoice.id} - {formatDate(invoice.issued_date)}
                          </span>
                          <span className={`block rounded-bl-lg rounded-br-lg pb-2 ${getInvoiceStatusClass(invoice.status)}`}>{invoice.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Right Panel: Selected Invoice Details */}
                {selectedInvoice && (
                  <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-4/5">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">
                        Invoice Details
                      </h3>
                      <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">
                        ID: #{selectedInvoice.id}
                      </h4>
                    </div>

                    <div className="p-5 xl:p-8">
                      <div className="pb-6 my-6 text-right border-b border-gray-100 dark:border-gray-800">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          Subtotal: $ {selectedInvoice.sub_total}
                        </p>
                        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                          VAT ({selectedInvoice.vat}%): $ {selectedInvoice.sub_total * (selectedInvoice.vat / 100)}
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white/90">
                          Total: $ {selectedInvoice.total}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3">
                      <button
                                    onClick={() => openDeleteModal(selectedInvoice)}
                                    className="flex items-center gap-2 px-4 py-3 justify-center  rounded-lg font-medium bg-red-500 text-white hover:text-red-600 text-sm"
                                >
                                    Delete Invoice
                                </button>
                        <button
                          onClick={handleEditInvoice}
                          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-blue-500 shadow-theme-xs hover:bg-blue-600"
                        >
                          Edit Invoice
                        </button>
                       
                        <button
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-gray-500 shadow-theme-xs hover:bg-gray-600"
                      onClick={() => window.open(selectedInvoice.link_of_pdf, '_blank')}
                             >
                            Download        
                    </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      
            {/* Delete Confirmation Modal */}
            <Modal  className="max-w-[700px] m-4" isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
            <div className="relative w-1/2 mx-auto p-4 pt-16 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Are you sure you want to delete this Invoice?
                </h3>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={closeDeleteModal}
                    className="mr-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteInvoice}              
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                            >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </Modal>

 {/* Modal for adding invoice */}
 <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 pt-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Add Invoice</h4>
                    <form onSubmit={handleAddInvoiceSubmit}>
                        <div className="space-y-5">
                            {/* User selection */}
                            <div>
                        <Label>Select User <span className="text-red-500">*</span></Label>
                        <select
                            onChange={(e) => {
                                const selectedUserId = e.target.value;
                                setSelectedUser(users.find((user) => user.id === selectedUserId) || null);
                            }}
                            value={selectedUser ? selectedUser.id : ''}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {`${user.first_name} ${user.last_name}`}
                                </option>
                            ))}
                        </select>
                    </div>

                                {/* Sub Total */}
                                <div>
                                <Label>Invoice ID <span className="text-red-500">*</span></Label>
                                <Input
                                    type="text"
                                    id="id"
                                    name="id"
                                    placeholder="Enter Inv ID"
                                    value={formData.id}
                                    onChange={handleChange}
                                />
                            </div>


                            {/* Sub Total */}
                            <div>
                                <Label>Sub Total <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    id="sub_total"
                                    name="sub_total"
                                    placeholder="Enter Sub Total"
                                    value={formData.sub_total}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* VAT */}
                            <div>
                                <Label>VAT <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    id="vat"
                                    name="vat"
                                    placeholder="Enter VAT percentage"
                                    value={formData.vat}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* PDF Link */}
                            <div>
                                <Label>PDF Link</Label>
                                <Input
                                    type="text"
                                    id="link_of_pdf"
                                    name="link_of_pdf"
                                    placeholder="Enter PDF link"
                                    value={formData.link_of_pdf}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Status */}
                            <div>
                            <Label>Status</Label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange} // handleChange will receive the event
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>


                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full px-4 py-3 text-white bg-blue-500 rounded-lg"
                            >
                                Add Invoice
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            
    </div>
  );
};

export default Invoices;
