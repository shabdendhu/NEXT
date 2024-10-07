"use client";
import { useState, useEffect } from "react";

interface Credit {
  id?: number;
  totalAvailable: number;
  purchaseRate: number;
  resaleRate: number;
}

interface CreditPackage {
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

export default function ManageCreditAndPackages() {
  const [credit, setCredit] = useState<Credit | null>(null);
  const [creditPackages, setCreditPackages] = useState<CreditPackage>({
    name: "",
    description: "",
    smsQuantity: 0,
    whatsappQuantity: 0,
    voiceQuantity: 0,
    discountType: "DIRECT",
    discountValue: 0,
    validityPeriodDays: 0,
    isActive: true,
  });
  const [packageList, setPackageList] = useState<CreditPackage[]>([]);

  const [loadingCredit, setLoadingCredit] = useState<boolean>(false);
  const [loadingPackages, setLoadingPackages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000/api/credits"; // Replace with your actual API base URL

  // Fetch credit data
  useEffect(() => {
    const fetchCreditData = async () => {
      setLoadingCredit(true);
      try {
        const response = await fetch(`${API_BASE_URL}/available`);
        if (!response.ok) {
          throw new Error("Failed to fetch credit data");
        }
        const data = await response.json();
        if (data.data) {
          setCredit(data.data);
        } else {
          setCredit(null);
        }
      } catch (error) {
        console.error("Error fetching credit data:", error);
        setError("Error fetching credit data");
      } finally {
        setLoadingCredit(false);
      }
    };

    fetchCreditData();
  }, []);

  // Fetch package list
  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        if (data.data) {
          setPackageList(data.data);
        } else {
          setPackageList([]);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError("Error fetching packages");
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (credit) {
      setCredit((prev) => ({ ...prev!, [name]: Number(value) }));
    } else {
      setCredit(
        (prev) =>
          ({
            ...prev,
            [name]: Number(value),
          } as Credit)
      );
    }
  };
  const handleCreditPackageChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCreditPackages((prev) => ({
      ...prev,
      [name]: [
        "smsQuantity",
        "whatsappQuantity",
        "voiceQuantity",
        "validityPeriodDays",
        "discountValue",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const saveCredit = async () => {
    if (!credit) {
      console.log("No credit data to save");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credit),
      });
      if (!response.ok) {
        throw new Error("Failed to save credit data");
      }
      const data = await response.json();
      alert(data.message || "Credit saved successfully");
    } catch (error) {
      console.error("Error saving credit data:", error);
      alert("Error saving credit data");
    }
  };

  const saveCreditPackage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creditPackages),
      });
      if (!response.ok) {
        throw new Error("Failed to save credit package");
      }
      const data = await response.json();
      alert(data.message || "Credit Package saved successfully");
      // Update the package list
      setPackageList((prev) => [...prev, data.data]);
      // Reset the form
      setCreditPackages({
        name: "",
        description: "",
        smsQuantity: 0,
        whatsappQuantity: 0,
        voiceQuantity: 0,
        discountType: "DIRECT",
        discountValue: 0,
        validityPeriodDays: 0,
        isActive: true,
      });
    } catch (error) {
      console.error("Error saving credit package:", error);
      alert("Error saving credit package");
    }
  };

  // Handle delete package
  const deletePackage = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete package");
      }
      const data = await response.json();
      alert(data.message || "Package deleted successfully");
      // Update the package list
      setPackageList((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package");
    }
  };

  return (
    <div className="space-y-8 p-8 bg-gray-100 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {/* Loading indicators */}
      {loadingCredit && <p>Loading credit data...</p>}
      {loadingPackages && <p>Loading packages...</p>}

      <div className="flex flex-col lg:flex-row justify-evenly gap-5">
        {/* Manage Credits Section */}
        {credit && (
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
                <label className="block text-sm font-medium">
                  Purchase Rate
                </label>
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
        )}

        {/* Manage Credit Packages Section */}
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
            {/* Description Field */}
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
              <label className="block text-sm font-medium">
                WhatsApp Quantity
              </label>
              <input
                type="number"
                name="whatsappQuantity"
                value={creditPackages.whatsappQuantity}
                onChange={handleCreditPackageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Voice Quantity
              </label>
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
              <label className="block text-sm font-medium">
                Discount Value
              </label>
              <input
                type="number"
                name="discountValue"
                value={creditPackages.discountValue || 0}
                onChange={handleCreditPackageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Validity */}
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
            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={creditPackages.isActive}
                onChange={() =>
                  setCreditPackages((prev) => ({
                    ...prev,
                    isActive: !prev.isActive,
                  }))
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
      </div>

      {/* Display Package List in Card View */}
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
    </div>
  );
}
