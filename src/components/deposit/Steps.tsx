'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
const Steps: React.FC = () => {
  const t = useTranslations();
  return (
    <article className="space-y-6 px-8 py-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="text-left">
        <p className="text-lg text-gray-700">
          {t("depositstepsp1")}
        </p>
      </div>

      <div className="text-left">
        <p></p>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_48e32db2a8">
        {t("depositstepsp2")}
        </h2>
      </div>

      <div className="space-y-3 mt-3">
        <ul className="list-disc pl-6 text-gray-700">
          <li>{t("depositstepsp3")}</li>
          <li>{t("depositstepsp4")}</li>
          <li>{t("depositstepsp5")}</li>
          <li>{t("depositstepsp6")}</li>
        </ul>
      </div>

      <div className="text-left">
        <p className="text-gray-700">
        {t("depositstepsp7")}{' '}
          <a href="https://help.21bitcoin.app/en/articles/6453204-what-are-the-fees-at-21bitcoin" className="text-blue-500 hover:underline">
          {t("depositstepsp8")} 
          </a>.
        </p>
      </div>

      <div className="text-left">
        <p></p>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_46fcd223fc">
          1. {t("depositstepsp9")}
        </h2>
      </div>

      <div className="text-left">
        <p className="text-gray-700">
        {t("depositstepsp10")}
        </p>
      </div>

      <div className="flex flex-col items-center mt-6">
        <a href="#" target="_blank" rel="noreferrer nofollow noopener">
          <img src="/images/deposit/Send.png" width="273" alt="Onboarding Image" className="rounded-lg shadow-md" />
        </a>
      </div>

      <div className="space-y-3 mt-6">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>
            <p>{t("depositstepsp11")} “<b>{t("depositstepsp12")}</b>”.</p>
          </li>
          <li>
            <p>{t("depositstepsp13")}</p>
            <ol className="list-inside pl-4 space-y-2">
              <li>{t("depositstepsp14")}</li>
              <li>{t("depositstepsp15")}</li>
            </ol>
          </li>
          <li>
            <p>{t("depositstepsp16")}{' '}
              <a href="https://21bitcoin.app/en/terms" className="text-blue-500 hover:underline" target="_blank" rel="nofollow noopener noreferrer">
              {t("depositstepsp17")}
              </a> {t("depositstepsp18")}{' '}
              <a href="https://21bitcoin.app/en/privacy" className="text-blue-500 hover:underline" target="_blank" rel="nofollow noopener noreferrer">
              {t("depositstepsp19")} 
              </a>.
            </p>
          </li>
          <li>
            <p>{t("depositstepsp20")} “<b>{t("depositstepsp21")}</b>”.</p>
          </li>
        </ol>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_9bb6a3639d">
          2. {t("depositstepsp22")}
        </h2>
      </div>

      <div className="space-y-3 mt-3">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>
            <p><b>{t("depositstepsp23")}</b> {t("depositstepsp24")}</p>
          </li>
          <li>
            <p>{t("depositstepsp25")}</p>
          </li>
        </ol>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_e12c8c62fd">
          3. {t("depositstepsp26")}
        </h2>
      </div>

      <div className="space-y-3 mt-3">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>{t("depositstepsp27")}</li>
          <li>{t("depositstepsp28")}</li>
          <li>{t("depositstepsp29")}</li>
          <li>{t("depositstepsp30")}</li>
          <li>{t("depositstepsp31")}</li>
          <li>
            <p>{t("depositstepsp32")}</p>
            <ol className="list-inside pl-4 space-y-2">
              <li>{t("depositstepsp33")}</li>
              <li>{t("depositstepsp34")}</li>
              <li>{t("depositstepsp35")}</li>
            </ol>
          </li>
          <li>
            <p>{t("depositstepsp36")} “<b>{t("depositstepsp37")}</b>” {t("depositstepsp38")}</p>
          </li>
        </ol>
      </div>

      <div className="text-left">
        <p className="text-gray-700">
        {t("depositstepsp39")}
        </p>
      </div>

      <div className="text-left">
        <p></p>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_487da0c794">
          4. {t("depositstepsp40")}
        </h2>
      </div>

      <div className="space-y-3 mt-3">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>{t("depositstepsp41")}</li>
          <li>{t("depositstepsp42")}</li>
        </ol>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_aeb30944de">
          5. {t("depositstepsp43")}
        </h2>
      </div>

      <div className="text-left mt-3">
        <p className="text-gray-700">
        {t("depositstepsp44")}
        </p>
      </div>
      <div className="space-y-3 mt-3">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>{t("depositstepsp45")} “<b>+ {t("depositstepsp46")}</b>” {t("depositstepsp47")} “<b>{t("depositstepsp48")}</b>”.</li>
          <li>{t("depositstepsp49")} “<b>{t("depositstepsp50")}</b>”</li>
          <li>{t("depositstepsp51")} <b>{t("depositstepsp54")}</b> {t("depositstepsp55")}</li>
          <li>{t("depositstepsp52")}</li>
          <li>{t("depositstepsp53")}</li>
          
        </ol>
      </div>

      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800 mt-6" id="h_aeb30944de">
          6. {t("depositstepsp56")}
        </h2>
      </div>

      <div className="text-left mt-3">
        <p className="text-gray-700">
        {t("depositstepsp57")}
        </p>
      </div>

      <div className="flex flex-col items-center mt-6">
        <a href="#" target="_blank" rel="noreferrer nofollow noopener">
          <img src="/images/deposit/Send.jpg" width="273" alt="Onboarding Image" className="rounded-lg shadow-md" />
        </a>
      </div>
      <div className="space-y-3 mt-3">
        <ol className="list-decimal pl-6 text-gray-700">
          <li>{t("depositstepsp58")} “<b>{t("depositstepsp59")}</b>” {t("depositstepsp60")} “<b>{t("depositstepsp61")}</b>” {t("depositstepsp62")} “<b>{t("depositstepsp63")}</b>”.</li>
          <li>{t("depositstepsp64")} “<b>{t("depositstepsp65")}</b>” {t("depositstepsp66")}</li>
          <li>{t("depositstepsp67")} <b>{t("depositstepsp68")}</b> </li>
          <li>{t("depositstepsp69")} “<b>{t("depositstepsp71")}</b></li>
          <li>{t("depositstepsp70")}</li>
          
        </ol>
      </div>

      <div className="text-left">
        <p className="text-gray-700">
          <b>{t("depositstepsp72")}</b> 🎉 </p>
      </div>
      <div className="text-left">
        <p className="text-gray-700">
        {t("depositstepsp73")} </p>
      </div>
      <div className="text-left">
        <p className="text-gray-700">
        {t("depositstepsp74")}

</p>
      </div>
    </article>
  );
};

export default Steps;
