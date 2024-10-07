"use client";
import { useState, useEffect } from "react";

interface CreditTransaction {
  id: number;
  organizationName: string;
  smsQuantity: number;
  whatsappQuantity: number;
  voiceQuantity: number;
  totalQuantity: number;
}

interface Credit {
  totalAvailable: number;
}

const sampleData = {
  data: [
    {
      id: 1,
      organizationName: "ABC Corp",
      smsQuantity: 500,
      whatsappQuantity: 200,
      voiceQuantity: 300,
      totalQuantity: 1000,
    },
    {
      id: 2,
      organizationName: "XYZ Ltd",
      smsQuantity: 700,
      whatsappQuantity: 300,
      voiceQuantity: 400,
      totalQuantity: 1400,
    },
    {
      id: 3,
      organizationName: "Sample Organization",
      smsQuantity: 300,
      whatsappQuantity: 150,
      voiceQuantity: 250,
      totalQuantity: 700,
    },
    {
      id: 4,
      organizationName: "Global Enterprises",
      smsQuantity: 1000,
      whatsappQuantity: 500,
      voiceQuantity: 600,
      totalQuantity: 2100,
    },
  ],
  availableCredits: {
    totalAvailable: 100,
    purchaseRate: 5,
    resaleRate: 10,
  },
};

export default function CreditTransactions() {
  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >(sampleData.data);
  const [availableCredits, setAvailableCredits] = useState<Credit | null>(
    sampleData.availableCredits
  );
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch available credits
    fetchAvailableCredits();

    // Fetch credit transactions
    fetchCreditTransactions();
  }, []);

  const fetchAvailableCredits = async () => {
    // Replace with API call to get available credits
    const response = await fetch("http://localhost:3000/api/credits/available");
    const data = await response.json();
    setAvailableCredits(sampleData.availableCredits);
  };

  const fetchCreditTransactions = async () => {
    // Replace with API call to get credit transactions
    const response = await fetch(
      "http://localhost:3000/api/credits/transactions"
    );
    const data = await response.json();
    setCreditTransactions(sampleData.data);

    // Check if any transaction exceeds available credits
    const exceeds = data.data.some(
      (transaction: CreditTransaction) =>
        transaction.totalQuantity > (availableCredits?.totalAvailable ?? 0)
    );
    setShowAlert(exceeds);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Ribbon Bar */}
      {showAlert && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          Warning: One or more orders exceed the available credits!
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Credit Transactions</h2>

      {/* Transaction Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Organization
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SMS Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                WhatsApp Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Voice Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Quantity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {creditTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.organizationName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.smsQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.whatsappQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.voiceQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.totalQuantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
