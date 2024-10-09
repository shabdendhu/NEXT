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

export default function CreditTransactions() {
  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >([]);
  const [availableCredits, setAvailableCredits] = useState<Credit | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch available credits
    fetchAvailableCredits();

    // Fetch credit transactions
    fetchCreditTransactions();
  }, []);

  const fetchAvailableCredits = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/credits/available"
      );
      const data = await response.json();
      setAvailableCredits(data.availableCredits);
    } catch (error) {
      console.error("Error fetching available credits:", error);
    }
  };

  const fetchCreditTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/credits/transactions"
      );
      const data = await response.json();
      console.log("====================================");
      console.log(data);
      console.log("====================================");
      const transactions = data.data.map((transaction: any) => ({
        id: transaction.id,
        organizationName: transaction.organization.name,
        smsQuantity:
          transaction.broadcastType === "SMS" ? transaction.creditsUsed : 0,
        whatsappQuantity:
          transaction.broadcastType === "WHATSAPP"
            ? transaction.creditsUsed
            : 0,
        voiceQuantity:
          transaction.broadcastType === "VOICE" ? transaction.creditsUsed : 0,
        totalQuantity: transaction.creditsUsed,
      }));

      setCreditTransactions(transactions);

      // Check if any transaction exceeds available credits
      const exceeds = transactions.some(
        (transaction: CreditTransaction) =>
          transaction.totalQuantity > (availableCredits?.totalAvailable ?? 0)
      );
      setShowAlert(exceeds);
    } catch (error) {
      console.error("Error fetching credit transactions:", error);
    }
  };
  useEffect(() => {
    console.log(creditTransactions);
  }, [creditTransactions]);

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
