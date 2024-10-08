// components/ManageCredits.tsx

export interface Credit {
  id?: number;
  totalAvailable: number;
  purchaseRate: number;
  resaleRate: number;
}

export interface CreditPackage {
  id?: number;
  name: string;
  description?: string;
  smsQuantity: number;
  whatsappQuantity: number;
  voiceQuantity: number;
  discountType: "DIRECT" | "PERCENTAGE" | "EXTRA_CREDITS";
  discountValue?: number;
  validityPeriodDays: number;
  isActive: boolean;
}

interface ManageCreditsProps {
  credit: Credit | null;
  handleCreditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveCredit: () => void;
}

export default function ManageCredits({
  credit,
  handleCreditChange,
  saveCredit,
}: ManageCreditsProps) {
  if (!credit) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
      <h2 className="text-2xl font-bold mb-4">Manage Credits</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Total Available Credits
          </label>
          <input
            type="number"
            name="totalAvailable"
            value={credit.totalAvailable}
            onChange={handleCreditChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Purchase Rate</label>
          <input
            type="number"
            name="purchaseRate"
            value={credit.purchaseRate}
            onChange={handleCreditChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Resale Rate</label>
          <input
            type="number"
            name="resaleRate"
            value={credit.resaleRate}
            onChange={handleCreditChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={saveCredit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Credit
        </button>
      </div>
    </div>
  );
}
