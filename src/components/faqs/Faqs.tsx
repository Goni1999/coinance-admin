'use client';
import { useState } from "react";

const FAQPage = () => {
  const faqs1 = [
    {
        question: "Why do I need to verify myself through **21Bitcoin** to unfreeze my assets?",
        answer: "We are not a payment provider, but a platform dedicated to managing and recovering frozen cryptocurrency assets. **21Bitcoin** provides the secure infrastructure to verify and authenticate your identity through a trusted third-party system. This process ensures that only the rightful owner can access their assets, preventing fraud and unauthorized access."
      },
      {
        question: "Why should I use **21Bitcoin** for verification instead of another method?",
        answer: "We use **21Bitcoin** because it offers a decentralized, peer-to-peer verification system that is secure and trustworthy. **21Bitcoin** eliminates the need for intermediaries, reducing the risk of double-spending and fraud. The proof-of-work system ensures that all transactions and verifications are transparent and immutable, providing the highest level of security for your assets."
      },
      {
        question: "What is the process to get my frozen assets back?",
        answer: "To recover your frozen assets, you must first verify your identity through **21Bitcoin**. After verification, you will schedule an appointment with us via our calendar, ensuring we can confirm your details. Before proceeding, make sure any unpaid invoices are settled, as unpaid debts must be cleared to proceed with the unfreezing process."
      },
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
      {
        question: "How does the peer-to-peer network of **21Bitcoin** help with my asset recovery?",
        answer: "The peer-to-peer network of **21Bitcoin** provides a decentralized verification system, meaning that transactions and asset recoveries are validated without relying on any central authority. This ensures that your identity is securely verified through a transparent and immutable process, reducing the risk of unauthorized access to your assets."
      },
      {
        question: "Why is it important to follow all the steps for asset recovery with **21Bitcoin**?",
        answer: "Following each step, including verifying your identity through **21Bitcoin**, scheduling your appointment, and clearing any unpaid invoices, is crucial for ensuring the security and integrity of the asset recovery process. Skipping any steps could delay your recovery or result in complications, so it’s important to treat the process with the highest level of attention."
      },
       
        {
          question: "Can I recover my frozen assets without using **21Bitcoin**?",
          answer: "Yes, there are other methods available for asset recovery. While **21Bitcoin** offers a secure and streamlined way to verify your identity, you may choose alternative options for asset recovery. To explore these, you will need to discuss your situation with your personal consultant, who can guide you through the available methods."
        },
        {
          question: "What happens if I don’t want to use **21Bitcoin** for verification?",
          answer: "If you prefer not to use **21Bitcoin**, you can still recover your frozen assets through other methods. These options are available, but they require a detailed discussion with your consultant. Your consultant will guide you through the process and help you choose the best solution for your situation."
        },
        {
          question: "What are the alternative methods for asset recovery if I don’t want to use **21Bitcoin**?",
          answer: "There are various alternative methods available for asset recovery, but each option may come with different requirements and processes. We recommend that you consult with your personal consultant to discuss the best approach for your specific situation. They will provide guidance and help you determine the most suitable recovery method."
        },
        {
          question: "Why is **21Bitcoin** used for asset recovery, and are there other methods?",
          answer: "We use **21Bitcoin** because it provides a secure, decentralized platform for verifying identity and recovering assets. However, we understand that each user’s situation is unique. If you prefer to explore other options, you can discuss these with your consultant. They will help you understand all available methods and decide the best course of action."
        },
        {
          question: "What if I don’t want to schedule an appointment with **21Bitcoin** for verification?",
          answer: "Scheduling an appointment with **21Bitcoin** is the most direct and secure way to recover your assets. However, if you would like to explore other recovery options, these can be discussed with your consultant. Your consultant will explain the alternative methods and help you make an informed decision based on your preferences."
        },
        {
          question: "Is the verification process through **21Bitcoin** the only way to recover assets?",
          answer: "No, **21Bitcoin** is a secure and effective method for verifying your identity and recovering assets, but there are alternative methods available. These alternatives require consultation with your personal asset recovery consultant, who will discuss your options and help you choose the best path for asset recovery."
        },
        
        {
          question: "Why should I use **21Bitcoin** for verification instead of other methods?",
          answer: "The reason we recommend **21Bitcoin** is its secure, decentralized, and transparent system for verifying identity and recovering frozen assets. However, we understand that you may have specific preferences, and if **21Bitcoin** does not align with your needs, alternative methods are available. These options can be discussed directly with your consultant to find the best solution for your case."
        },
        {
          question: "How do I know if using **21Bitcoin** for verification is the best method for me?",
          answer: "The decision to use **21Bitcoin** for verification is ultimately up to you. While it is the most secure and streamlined method, there are other methods you can consider. We recommend discussing your specific situation with your consultant, who will provide a detailed overview of all available options and help you determine the best approach for your asset recovery."
        }
      
      
  ];

  

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-4 mx-auto max-w-7xl md:p-6">
      <div className="space-y-6">
        {/* FAQ Section 1 */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              FAQ’s
            </h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-4">
              {faqs1.map((faq, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between py-3 pl-6 pr-3 bg-gray-50 dark:bg-white/[0.03]"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {faq.question}
                    </h4>
                    <button
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 duration-200 transition-transform ease-linear dark:bg-white/[0.03] ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4.792 7.396 10 12.604l5.208-5.208"
                        />
                      </svg>
                    </button>
                  </div>
                  {openIndex === index && faq.answer && (
                    <div className="px-6 py-7">
                      <p className="text-base text-gray-500 dark:text-gray-400">
                        {faq.answer}
                      </p>
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

export default FAQPage;
