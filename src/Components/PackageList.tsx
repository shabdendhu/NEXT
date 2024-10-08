// components/PackageList.tsx

import { CreditPackage } from "./ManageCredits";

interface PackageListProps {
  packageList: CreditPackage[];
  deletePackage: (id: number) => void;
}

export default function PackageList({
  packageList,
  deletePackage,
}: PackageListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Credit Packages</h2>
      {packageList.length === 0 ? (
        <p>No packages available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packageList.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col justify-between"
              style={{ minHeight: "200px" }}
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm">SMS Quantity: {pkg.smsQuantity}</p>
                <p className="text-sm">
                  WhatsApp Quantity: {pkg.whatsappQuantity}
                </p>
                <p className="text-sm">Voice Quantity: {pkg.voiceQuantity}</p>
                <p className="text-sm">
                  Discount: {pkg.discountValue} ({pkg.discountType})
                </p>
                <p className="text-sm">
                  Validity: {pkg.validityPeriodDays} days
                </p>
                <p className="text-sm">
                  Status: {pkg.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <button
                onClick={() => deletePackage(pkg.id!)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Package
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
