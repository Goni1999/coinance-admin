'use client';
import { useState } from "react";

const FAQW = () => {
  const faqs1 = [
    {
        question: "How do I schedule an appointment for verification?",
        answer: "You can easily schedule an appointment using our calendar system. Once you’ve initiated the verification process with **21Bitcoin**, you’ll be prompted to select a suitable time for your verification appointment. It's very important that you follow this step to ensure a smooth process for unfreezing your assets."
      },
      {
        question: "What happens if I have an unpaid invoice? Can I still unfreeze my assets?",
        answer: "If you have an unpaid invoice, you must take responsibility for settling it before you can proceed with the unfreezing of your assets. We strongly advise checking for any outstanding invoices, as resolving them is essential before proceeding with the verification and asset recovery process."
      },
      
      {
        question: "How does **21Bitcoin**'s proof-of-work system benefit my asset recovery?",
        answer: "The proof-of-work system used by **21Bitcoin** ensures that all transactions, including asset recovery verifications, are recorded immutably in the blockchain. This system prevents double-spending and fraud, making sure that only the rightful owner can access their assets, providing you with peace of mind and security during the recovery process."
      },
      {
        question: "What should I do if I miss my appointment for verification?",
        answer: "If you miss your appointment, you can reschedule through the calendar system. However, it's crucial to complete the verification promptly to ensure the timely recovery of your assets. Delays may result in extended waiting periods or complications in the recovery process."
      },
  ];

  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-4 mx-auto max-w-7xl md:p-6">
      <div className="space-y-6">
        

        {/* FAQ Section 2 */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              FAQ’s 2
            </h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-1">
              {faqs1.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl bg-gray-100 dark:bg-white/[0.03]"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between px-6 py-4"
                    onClick={() => toggleFAQ(index + faqs1.length)}
                  >
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {faq.question}
                    </h4>
                    <button
                      className={`duration-200 transition-transform ease-linear ${
                        openIndex === index + faqs1.length ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 12.9995C6.44772 12.9995 6 13.4472 6 13.9995C6 14.5518 6.44772 14.9995 7 14.9995V12.9995ZM21.0008 14.9995C21.5531 14.9995 22.0008 14.5518 22.0008 13.9995C22.0008 13.4472 21.5531 12.9995 21.0008 12.9995V14.9995ZM7 14.9995H21.0008V12.9995H7V14.9995Z" />
                      </svg>
                    </button>
                  </div>
                  {openIndex === index + faqs1.length && faq.answer && (
                    <div className="p-6 border-t border-brand-100 dark:border-brand-200">
                      <p className="text-base text-gray-800">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQW;
