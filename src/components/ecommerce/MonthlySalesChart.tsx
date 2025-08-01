
 "use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useTranslations } from 'next-intl';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Transaction {
  time: string;
  amount: string;
}

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => {
          return `$${val.toFixed(2)}`;  // Format the value with the dollar sign
        },
      },
    },
  };
  const t = useTranslations();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [series, setSeries] = useState([
    {
      name: "Transfers",
      data: Array(12).fill(0), // Default empty data
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const fetchTransactions = async () => {
    const storedTransactions = sessionStorage.getItem("transactions");

    if (storedTransactions) {
      // If transactions are stored in session, parse and use them
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // If no transactions are found in session, fetch from API
      try {
        const token = sessionStorage.getItem("auth-token"); // Get stored auth token

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("https://server.coinance.co/api/transactions-admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data = await response.json();
        sessionStorage.setItem("transactions", JSON.stringify(data)); // Store in sessionStorage
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Update chart data based on transactions
    if (transactions.length > 0) {
      const monthlyTransfers = new Array(12).fill(0);

      // Aggregate transaction amounts by month (assuming time is a string like "2025-03-01")
      transactions.forEach((transaction) => {
        const month = new Date(transaction.time).getMonth(); // Get month index (0-11)
        const amount = parseFloat(transaction.amount);
        if (!isNaN(amount)) {
          monthlyTransfers[month] += amount;
        }
      });

      setSeries([
        {
          name: "Transfers",
          data: monthlyTransfers,
        },
      ]);
    }
  }, [transactions]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
         {t("transaction2")} 
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            {t("transaction3")} 
            </DropdownItem>
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            {t("transaction4")} 
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
