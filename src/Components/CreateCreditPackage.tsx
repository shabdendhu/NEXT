// components/CreateCreditPackage.tsx

import { CreditPackage } from "./ManageCredits";

interface CreateCreditPackageProps {
  creditPackages: CreditPackage;
  handleCreditPackageChange: any;
  saveCreditPackage: () => void;
}

export default function CreateCreditPackage({
  creditPackages,
  handleCreditPackageChange,
  saveCreditPackage,
}: CreateCreditPackageProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1">
      <h2 className="text-2xl font-bold mb-4">Create New Credit Package</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Package Name</label>
          <input
            type="text"
            name="name"
            value={creditPackages.name}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={creditPackages.description}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Quantities */}
        <div>
          <label className="block text-sm font-medium">SMS Quantity</label>
          <input
            type="number"
            name="smsQuantity"
            value={creditPackages.smsQuantity}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">WhatsApp Quantity</label>
          <input
            type="number"
            name="whatsappQuantity"
            value={creditPackages.whatsappQuantity}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Voice Quantity</label>
          <input
            type="number"
            name="voiceQuantity"
            value={creditPackages.voiceQuantity}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Discount */}
        <div>
          <label className="block text-sm font-medium">Discount Type</label>
          <select
            name="discountType"
            value={creditPackages.discountType}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="DIRECT">Direct Discount</option>
            <option value="PERCENTAGE">Percentage Discount</option>
            <option value="EXTRA_CREDITS">Extra Credits</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Discount Value</label>
          <input
            type="number"
            name="discountValue"
            value={creditPackages.discountValue || 0}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Validity Period (Days)
          </label>
          <input
            type="number"
            name="validityPeriodDays"
            value={creditPackages.validityPeriodDays}
            onChange={handleCreditPackageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={creditPackages.isActive}
            onChange={() =>
              handleCreditPackageChange({
                target: {
                  name: "isActive",
                  value: !creditPackages.isActive,
                },
              })
            }
            className="mr-2"
          />
          <label className="text-sm font-medium">Is Active</label>
        </div>
        <button
          onClick={saveCreditPackage}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Credit Package
        </button>
      </div>
    </div>
  );
}
