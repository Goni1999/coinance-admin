'use client';
import { useState, useEffect } from 'react';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  changeType: 'success' | 'error';
};

const Watchlist = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    // Fetch the coin data from the API
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
        const data = await response.json();
        // Map the fetched data to match the Coin type
        const formattedCoins = data.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          changeType: coin.price_change_percentage_24h >= 0 ? 'success' : 'error',
        }));
        setCoins(formattedCoins);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchCoins();

    // Shuffle coins every 5 seconds
    const shuffleInterval = setInterval(() => {
      setCoins(prevCoins => shuffleArray(prevCoins));
    }, 5000);

    // Clear interval on cleanup
    return () => clearInterval(shuffleInterval);
  }, []);

  // Shuffle function for randomizing the coins array
  const shuffleArray = (array: Coin[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    // Check if we are at the bottom of the scroll container
    const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
    
    // If we are at the bottom and there are more coins to load, increase the visible count
    if (bottom && visibleCount < coins.length) {
      setVisibleCount(prevCount => Math.min(prevCount + 5, coins.length));  // Increment by 5, but not beyond the total coin count
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">My Watchlist</h3>
      </div>
      <div className="flex h-[372px] flex-col">
        <div className="flex flex-col h-auto pr-3 overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
          {coins.slice(0, visibleCount).map((coin, index) => (
            <div
              key={coin.id}  // Use 'id' as the key for better performance and stability
              className="flex items-center justify-between pt-4 pb-4 border-b border-gray-200 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10">
                  <img
                    alt={coin.name}
                    loading="lazy"
                    width="40"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    src={coin.image}
                    style={{ color: 'transparent' }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{coin.symbol}</h3>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{coin.name}</span>
                </div>
              </div>
              <div>
                <h4 className="mb-1 font-medium text-right text-gray-700 text-theme-sm dark:text-gray-400">
                  ${coin.current_price.toFixed(2)}
                </h4>
                <span
                  className={`flex items-center justify-end gap-1 font-medium text-theme-xs ${
                    coin.changeType === 'success' ? 'text-success-600 dark:text-success-500' : 'text-error-600 dark:text-error-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" fill="none">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M6.065 1.624a.75.75 0 0 1 .558-.25h.001c.192 0 .384.073.531.22l3 2.998a.75.75 0 1 1-1.06 1.06l-1.722-1.72v6.193a.75.75 0 0 1-1.5 0v-6.19L4.155 5.654a.75.75 0 0 1-1.06-1.061z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
