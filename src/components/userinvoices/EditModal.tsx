    import React, { useState, useEffect } from "react";
    import { Modal } from "../ui/modal"; // Ensure Modal component is correctly imported
    import Label from "../form/Label"; // Ensure Label component is correctly imported
    import Input from "../form/input/InputField"; // Ensure Input component is correctly imported
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

    type EditModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedInvoice: Invoice | null; // Pass selected invoice to edit
    onSubmit: (updatedData: {
        id: number;
        issued_date: string;
        sub_total: number;
        vat: number;
        link_of_pdf: string;
        status: string;
    }) => void;
    };

    const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, selectedInvoice, onSubmit }) => {
    // Local state for managing form data
    const [updateData, setUpdateData] = useState({
        id: "",
        issued_date: "",
        sub_total: "",
        vat: "",
        link_of_pdf: "",
        status: "unpaid",
    });

    // Update form when modal opens with selected invoice data
    useEffect(() => {
        if (isOpen && selectedInvoice) {
        setUpdateData({
            id: selectedInvoice.id.toString(),
            issued_date: selectedInvoice.issued_date || "", // Use existing or empty string
            sub_total: selectedInvoice.sub_total.toString(),
            vat: selectedInvoice.vat.toString(),
            link_of_pdf: selectedInvoice.link_of_pdf,
            status: selectedInvoice.status,
        });
        }
    }, [isOpen, selectedInvoice]);

    // Handle input field changes
    const handleEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdateData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedData = {
        id: parseInt(updateData.id),
        issued_date: updateData.issued_date, // Pass issued_date from the form
        sub_total: parseFloat(updateData.sub_total),
        vat: parseFloat(updateData.vat),
        link_of_pdf: updateData.link_of_pdf,
        status: updateData.status,
        };
        onSubmit(updatedData); // Submit updated data to parent
    };

    return (
        <>
        {selectedInvoice && (
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full p-4 pt-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Edit Invoice</h4>
                <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                    {/* Invoice ID */}
                    <div>
                            <Label>
                            Issued Date<span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="issued_date"
                                name="issued_date"
                                value={updateData.issued_date}
                                onChange={handleEdit}
                            />
                            </div>

                    {/* Sub Total */}
                    <div>
                    <Label>
                        Sub Total <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="sub_total"
                        name="sub_total"
                        placeholder="Enter Sub Total"
                        value={updateData.sub_total}
                        onChange={handleEdit}
                    />
                    </div>

                    {/* VAT */}
                    <div>
                    <Label>
                        VAT <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="number"
                        id="vat"
                        name="vat"
                        placeholder="Enter VAT percentage"
                        value={updateData.vat}
                        onChange={handleEdit}
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
                        value={updateData.link_of_pdf}
                        onChange={handleEdit}
                    />
                    </div>

                    {/* Status */}
                    <div>
                    <Label>Status</Label>
                    <select
                        name="status"
                        value={updateData.status}
                        onChange={handleEdit} // handleChange will receive the event
                        className="w-full p-3 rounded-lg border-gray-300 dark:border-gray-600"
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
                    Update Invoice
                    </button>
                </div>
                </form>
            </div>
            </Modal>
        )}
        </>
    );
    };

    export default EditModal;
