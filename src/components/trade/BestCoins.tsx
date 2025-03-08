'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
type Coin = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

const BestCoins = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations();
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('https://pro-api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 4,
            page: 1,
            sparkline: false,
          },
          headers: {
            "x-cg-pro-api-key": "CG-nqfeGL8o6Ky2ngtB3FSJ2oNu"
          }
        });

        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the coins data", error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  if (loading) {
    return <div>{t("trade1")}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {coins.map((coin) => (
        <div key={coin.id} className="rounded-2xl border border-gray-200 bg-white px-6 pb-5 pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10">
              <img alt={coin.name} loading="lazy" width="40" height="40" decoding="async" className="w-full" src={coin.image} style={{ color: 'transparent' }} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{coin.name}</h3>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">${coin.current_price.toFixed(2)}</h4>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm ${
                coin.price_change_percentage_24h > 0
                  ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                  : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
              }`}
            >
              <span className="mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" fill="none">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M6.065 1.624a.75.75 0 0 1 .558-.25h.001c.192 0 .384.073.531.22l3 2.998a.75.75 0 1 1-1.06 1.06l-1.722-1.72v6.193a.75.75 0 0 1-1.5 0v-6.19L4.155 5.654a.75.75 0 0 1-1.06-1.061z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BestCoins;
