"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Card, Input, Form, Select, message } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DollarOutlined,
  SyncOutlined,
} from "@ant-design/icons";

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
  const [modalVisible, setModalVisible] = useState<string | null>(null); // To handle modal visibility
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  ); // For editing
  const [discountType, setDiscountType] = useState<string | undefined>(); // Track discount type
  const [form] = Form.useForm();

  const API_BASE_URL = "http://localhost:3000/api/credits"; // Replace with your actual API base URL

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

  // Modal Handlers
  const openModal = (modalType: string, pkg?: CreditPackage) => {
    form.resetFields(); // Ensure form fields are reset on modal open

    if (pkg) {
      setSelectedPackage(pkg);
      form.setFieldsValue(pkg); // Prepopulate form if package is selected
      setDiscountType(pkg.discountType); // Set discountType to properly render discount fields
    } else {
      form.resetFields();
      setSelectedPackage(null);
      setDiscountType(undefined); // Reset discount type when creating a new package
    }
    setModalVisible(modalType);
  };

  const closeModal = () => {
    setModalVisible(null);
    setSelectedPackage(null);
    form.resetFields();
    setDiscountType(undefined); // Reset discount type when closing modal
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
      closeModal();
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
      closeModal();
    }
  };

  const handleCreatePackage = async (values: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Package created successfully.");
        setCreditPackages((prev) => [...prev, data.data]); // Add new package to list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error creating package:", error);
      message.error("Failed to create package.");
    } finally {
      closeModal();
    }
  };

  const handleEditPackage = async (values: any) => {
    if (!selectedPackage) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/packages/${selectedPackage.id}/update`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Package updated successfully.");
        setCreditPackages((prev) =>
          prev.map((pkg) => (pkg.id === selectedPackage.id ? data.data : pkg))
        ); // Update the package in the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      message.error("Failed to update package.");
    } finally {
      closeModal();
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen space-y-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <Button
          icon={<SyncOutlined />}
          onClick={() => openModal("updateCredits")}
          type="primary"
        >
          Update Credits
        </Button>
        <Button
          icon={<DollarOutlined />}
          onClick={() => openModal("updateResale")}
          type="primary"
        >
          Update Resale Pricing
        </Button>
        <Button
          icon={<PlusOutlined />}
          onClick={() => openModal("createPackage")}
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
                  <EditOutlined onClick={() => openModal("editPackage", pkg)} />
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

      {/* Modals */}
      <Modal
        open={modalVisible === "updateCredits"}
        title="Update Available Credits & Purchase Rate"
        onCancel={closeModal}
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

      <Modal
        open={modalVisible === "updateResale"}
        title="Update Resale Pricing"
        onCancel={closeModal}
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

      <Modal
        open={modalVisible === "createPackage"}
        title="Create New Credit Package"
        onCancel={closeModal}
        onOk={form.submit}
        okText="Create"
      >
        <Form layout="vertical" form={form} onFinish={handleCreatePackage}>
          <Form.Item label="Package Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="SMS Quantity" name="smsQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="WhatsApp Quantity" name="whatsappQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Voice Quantity" name="voiceQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Discount Type" name="discountType">
            <Select onChange={(value) => setDiscountType(value)}>
              <Option value="DIRECT">Direct Discount</Option>
              <Option value="PERCENTAGE">Percentage Discount</Option>
              <Option value="EXTRA_CREDITS">Extra Credits</Option>
            </Select>
          </Form.Item>

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

          <Form.Item label="Validity Period (Days)" name="validityPeriodDays">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={modalVisible === "editPackage"}
        title="Edit Credit Package"
        onCancel={closeModal}
        onOk={form.submit}
        okText="Update"
      >
        <Form
          form={form}
          onFinish={handleEditPackage}
          initialValues={selectedPackage || {}}
          layout="vertical"
        >
          <Form.Item label="Package Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="SMS Quantity" name="smsQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="WhatsApp Quantity" name="whatsappQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Voice Quantity" name="voiceQuantity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Discount Type" name="discountType">
            <Select onChange={(value) => setDiscountType(value)}>
              <Option value="DIRECT">Direct Discount</Option>
              <Option value="PERCENTAGE">Percentage Discount</Option>
              <Option value="EXTRA_CREDITS">Extra Credits</Option>
            </Select>
          </Form.Item>

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

          <Form.Item label="Discount Value" name="discountValue">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Validity Period (Days)" name="validityPeriodDays">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
