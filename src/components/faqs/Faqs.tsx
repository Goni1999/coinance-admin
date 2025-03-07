'use client';
import { useTranslations } from "next-intl";
import { useState } from "react";

const FAQPage = () => {
  const t = useTranslations();
  const faqs1 = [
    {
      question: t("faqquestion1"),
      answer: t("faqanswer1")
    },
    {
      question: t("faqquestion2"),
      answer: t("faqanswer2")
    },
    {
      question: t("faqquestion3"),
      answer: t("faqanswer3")
    },
    {
      question: t("faqquestion4"),
      answer: t("faqanswer4")
    },
    {
      question: t("faqquestion5"),
      answer: t("faqanswer5")
    },
    {
      question: t("faqquestion6"),
      answer: t("faqanswer6")
    },
    {
      question: t("faqquestion7"),
      answer: t("faqanswer7")
    },
    {
      question: t("faqquestion8"),
      answer: t("faqanswer8")
    },
    {
      question: t("faqquestion9"),
      answer: t("faqanswer9")
    },
    {
      question: t("faqquestion10"),
      answer: t("faqanswer10")
    },
    {
      question: t("faqquestion11"),
      answer: t("faqanswer11")
    },
    {
      question: t("faqquestion12"),
      answer: t("faqanswer12")
    },
    {
      question: t("faqquestion13"),
      answer: t("faqanswer13")
    },
    {
      question: t("faqquestion14"),
      answer: t("faqanswer14")
    },
    {
      question: t("faqquestion15"),
      answer: t("faqanswer15")
    },
    {
      question: t("faqquestion16"),
      answer: t("faqanswer16")
    },
    {
      question: t("faqquestion17"),
      answer: t("faqanswer17")
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
