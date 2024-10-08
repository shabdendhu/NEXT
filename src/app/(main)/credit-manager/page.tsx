"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Card, Input, Form, Select, message } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DollarOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Switch } from "antd"; // Import Switch

interface Credit {
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
  extraCreditsSms?: number;
  extraCreditsWhatsapp?: number;
  extraCreditsVoice?: number;
  validityPeriodDays: number;
  isActive: boolean;
}

const { Option } = Select;

export default function ManageCreditAndPackages() {
  const [credit, setCredit] = useState<Credit | null>(null);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Single modal for packages
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  ); // For editing or creating packages
  const [discountType, setDiscountType] = useState<string | undefined>(); // Track discount type
  const [form] = Form.useForm();
  const [creditsModalVisible, setCreditsModalVisible] =
    useState<boolean>(false); // Modal for updating credits
  const [resaleModalVisible, setResaleModalVisible] = useState<boolean>(false); // Modal for updating resale pricing

  const API_BASE_URL = "http://192.168.31.88:3000/api/credits"; // Replace with your actual API base URL

  useEffect(() => {
    // Fetching initial credit and package data
    const fetchCreditData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/available`);
        const data = await response.json();
        setCredit(data.data);
      } catch (error) {
        console.error("Error fetching credit data:", error);
        message.error("Error fetching credit data.");
      }
    };

    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        const data = await response.json();
        setCreditPackages(data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        message.error("Error fetching credit packages.");
      }
    };

    fetchCreditData();
    fetchPackages();
  }, []);

  // Modal Handlers for Credits and Resale Pricing
  const openModal = (pkg?: CreditPackage) => {
    if (pkg) {
      setSelectedPackage(pkg);
      form.setFieldsValue(pkg); // Prepopulate form if package is selected
      setDiscountType(pkg.discountType); // Set discountType to properly render discount fields
    } else {
      form.resetFields();
      setSelectedPackage(null);
      setDiscountType(undefined); // Reset discount type when creating a new package
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setModalVisible(false);
    setSelectedPackage(null);
    setDiscountType(undefined); // Reset discount type when closing modal
  };

  const openCreditsModal = () => setCreditsModalVisible(true);
  const closeCreditsModal = () => setCreditsModalVisible(false);

  const openResaleModal = () => setResaleModalVisible(true);
  const closeResaleModal = () => setResaleModalVisible(false);

  const handleSavePackage = async (values: any) => {
    try {
      const url = selectedPackage
        ? `${API_BASE_URL}/packages/${selectedPackage.id}/update`
        : `${API_BASE_URL}/packages/create`;
      const method = selectedPackage ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(
          selectedPackage
            ? "Package updated successfully."
            : "Package created successfully."
        );
        setCreditPackages((prev) =>
          selectedPackage
            ? prev.map((pkg) =>
                pkg.id === selectedPackage.id ? data.data : pkg
              )
            : [...prev, data.data]
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving package:", error);
      message.error("Failed to save package.");
    } finally {
      closeModal();
    }
  };

  const handleUpdateCredits = async (values: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(data.message || "Credits updated successfully.");
        setCredit(data.data); // Update the credit in state
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating credits:", error);
      message.error("Failed to update credits.");
    } finally {
      closeCreditsModal();
    }
  };

  const handleUpdateResale = async (values: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(data.message || "Resale pricing updated successfully.");
        setCredit(data.data); // Update the credit in state
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating resale pricing:", error);
      message.error("Failed to update resale pricing.");
    } finally {
      closeResaleModal();
    }
  };
  const handleToggleStatus = async (pkg: CreditPackage) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/packages/${pkg.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !pkg.isActive }), // Toggle the current status
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Package status updated successfully.");
        setCreditPackages((prev) =>
          prev.map((p) =>
            p.id === pkg.id ? { ...p, isActive: !pkg.isActive } : p
          )
        );
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error toggling package status:", error);
      message.error("Failed to update package status.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <Button
          icon={<SyncOutlined />}
          onClick={openCreditsModal}
          type="primary"
        >
          Update Credits
        </Button>
        <Button
          icon={<DollarOutlined />}
          onClick={openResaleModal}
          type="primary"
        >
          Update Resale Pricing
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          type="primary"
        >
          Create Package
        </Button>
      </div>

      {/* Display Package List in Card View */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Credit Packages</h2>
        {creditPackages.length === 0 ? (
          <p>No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditPackages.map((pkg) => (
              <Card
                key={pkg.id}
                title={pkg.name}
                extra={
                  <>
                    <Switch
                      checked={pkg.isActive}
                      onChange={() => handleToggleStatus(pkg)}
                      style={{ marginRight: 8 }} // Add some margin for spacing
                    />
                    <EditOutlined onClick={() => openModal(pkg)} />
                  </>
                }
                className="w-full"
              >
                <p>SMS Quantity: {pkg.smsQuantity}</p>
                <p>WhatsApp Quantity: {pkg.whatsappQuantity}</p>
                <p>Voice Quantity: {pkg.voiceQuantity}</p>
                <p>
                  Discount: {pkg.discountValue} ({pkg.discountType})
                </p>
                <p>Validity: {pkg.validityPeriodDays} days</p>
                <p>Status: {pkg.isActive ? "Active" : "Inactive"}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding/Editing Package */}
      <Modal
        open={modalVisible}
        title={
          selectedPackage ? "Edit Credit Package" : "Create New Credit Package"
        }
        onCancel={closeModal}
        onOk={form.submit}
        okText={selectedPackage ? "Update" : "Create"}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSavePackage}
          // initialValues={selectedPackage || {}}
        >
          <Form.Item
            label="Package Name"
            name="name"
            rules={[{ required: true, message: "Package name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="SMS Quantity"
            name="smsQuantity"
            rules={[{ required: true, message: "SMS Quantity is required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="WhatsApp Quantity"
            name="whatsappQuantity"
            rules={[
              { required: true, message: "WhatsApp Quantity is required" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Voice Quantity"
            name="voiceQuantity"
            rules={[{ required: true, message: "Voice Quantity is required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Discount Type"
            name="discountType"
            rules={[{ required: true, message: "Discount Type is required" }]}
          >
            <Select
              onChange={(value) => {
                setDiscountType(value);
              }}
            >
              <Option value="DIRECT">Direct Discount</Option>
              <Option value="PERCENTAGE">Percentage Discount</Option>
              <Option value="EXTRA_CREDITS">Extra Credits</Option>
            </Select>
          </Form.Item>

          {discountType === "DIRECT" && (
            <Form.Item
              label="Direct Discount Amount"
              name="discountValue"
              rules={[
                { required: true, message: "Direct Discount is required" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          )}

          {discountType === "PERCENTAGE" && (
            <Form.Item
              label="Percentage Discount (%)"
              name="discountValue"
              rules={[
                { required: true, message: "Percentage Discount is required" },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          )}

          {discountType === "EXTRA_CREDITS" && (
            <>
              <Form.Item label="Extra SMS Credits" name="extraCreditsSms">
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label="Extra WhatsApp Credits"
                name="extraCreditsWhatsapp"
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Extra Voice Credits" name="extraCreditsVoice">
                <Input type="number" />
              </Form.Item>
            </>
          )}

          <Form.Item
            label="Validity Period (Days)"
            name="validityPeriodDays"
            rules={[{ required: true, message: "Validity period is required" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Updating Credits */}
      <Modal
        open={creditsModalVisible}
        title="Update Available Credits & Purchase Rate"
        onCancel={closeCreditsModal}
        onOk={form.submit}
        okText="Update"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdateCredits}
          initialValues={credit || {}}
        >
          <Form.Item label="Total Available Credits" name="totalAvailable">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Purchase Rate" name="purchaseRate">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Updating Resale Pricing */}
      <Modal
        open={resaleModalVisible}
        title="Update Resale Pricing"
        onCancel={closeResaleModal}
        onOk={form.submit}
        okText="Update"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdateResale}
          initialValues={credit || {}}
        >
          <Form.Item label="Resale Rate" name="resaleRate">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
