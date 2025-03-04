import React from 'react';

const VerificationLevels: React.FC = () => {
  return (
    <div className="css-vurnku">
      <div className="css-vurnku">
        <div className="css-1d6nk9p">
          <div data-bn-type="text" className="css-v9337m"> <h1 className='text-xl lg:text-3xl text-gray-700 dark:text-gray-200'>Verification Levels</h1></div>
        </div>
        <div className="css-nga4y6">
          {/* First Verification Level */}
          <div className="css-4cffwv flex items-center">
            <div className="css-1xtcpig">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" className="css-79z9c8">
                <path fillRule="evenodd" clipRule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-4.934-4.483L10.2 13.383l-2.716-2.716-1.768 1.767 4.484 4.484 7.634-7.634-1.768-1.767z" fill="rgb(14, 203, 129)"></path>
              </svg>
            </div>
            <div className="css-1nkwd9v ml-4 mt-12">
              <div data-bn-type="text" className="css-yf6v6g text-green-500 dark:text-green-400">Verified</div>
              <div data-bn-type="text" className="css-14zn9b2 text-gray-700 dark:text-gray-200">Fiat Limit of 100K USD Daily</div>
              <div data-bn-type="text" className="css-15u79n8 text-gray-500 dark:text-gray-400">Verified:</div>
            </div>
          </div>

          {/* Second Verification Level */}
          <div className="css-4cffwv flex items-center ">
            <div className="css-1xtcpig">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" className="css-5fichw">
                <path fillRule="evenodd" clipRule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-4.934-4.483L10.2 13.383l-2.716-2.716-1.768 1.767 4.484 4.484 7.634-7.634-1.768-1.767z" fill="#5E6673"></path>
              </svg>
            </div>
            <div className="css-1nkwd9v ml-4 mt-12">
              <div data-bn-type="text" className="css-egoftg text-gray-500 dark:text-gray-400">Verified Plus</div>
              <div data-bn-type="text" className="css-14zn9b2 text-gray-700 dark:text-gray-200">Fiat Limit of 4M USD Daily</div>
              <div data-bn-type="text" className="css-15u79n8 text-gray-500 dark:text-gray-400">Required:</div>
            </div>
          </div>

          {/* Third Verification Level */}
          <div className="css-4cffwv flex items-center ">
            <div className="css-1xtcpig">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" className="css-5fichw">
                <path fillRule="evenodd" clipRule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-4.934-4.483L10.2 13.383l-2.716-2.716-1.768 1.767 4.484 4.484 7.634-7.634-1.768-1.767z" fill="#5E6673"></path>
              </svg>
            </div>
            <div className="css-1nkwd9v ml-4 mt-16">
              <div data-bn-type="text" className="css-egoftg text-gray-500 dark:text-gray-400">Verified Plus</div>
              <div data-bn-type="text" className="css-14zn9b2 text-gray-700 dark:text-gray-200">Higher Fiat Limits</div>
              <div data-bn-type="text" className="css-15u79n8 text-gray-500 dark:text-gray-400">Required:</div>
              <div id="StyleWrapper" className="css-h21u74">
                <div data-bn-type="text" className="css-4xllew text-gray-500 dark:text-gray-400">&nbsp;&nbsp;Enhanced due diligence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <hr />
      <br />

      {/* FAQ Section */}
      <div className="css-vurnku">
        <div className="css-8oj9i9">
          <div data-bn-type="text" className="css-v9337m text-gray-700 dark:text-gray-200">FAQ</div>
        </div>
        <div className="css-vurnku">
          <div className="css-jlji81">
            <a data-bn-type="link" target="_blank" href="/faqs" className="css-qfa0d5">
              <div data-bn-type="text" className="css-1cjl26j text-gray-500 dark:text-gray-400">Identity Verification</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationLevels;
