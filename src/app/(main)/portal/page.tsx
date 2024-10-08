"use client";

import { useState, useEffect } from "react";
import { Button, Modal, Input, Table, Form, Space, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getPortals, createPortal, updatePortal, deletePortal } from "@/api";
import type { UploadFile } from "antd/es/upload/interface";

// Define TypeScript interfaces
interface Portal {
  id: number;
  name: string;
  url?: string;
  imageUrl?: string; // New field for image (base64 format)
  createdAt?: string;
  updatedAt?: string;
}

// Main component
export default function PortalsPage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]); // State for file upload
  const [imageBase64, setImageBase64] = useState<string | null>(null); // State to store base64 image

  useEffect(() => {
    fetchPortals();
  }, []);

  const fetchPortals = async () => {
    try {
      const response = await getPortals();
      setPortals(response.data);
    } catch (error) {
      console.error("Error fetching portals:", error);
    }
  };

  const handleAddNewPortal = () => {
    setEditingPortal(null);
    setFileList([]); // Clear file list when adding a new portal
    setImageBase64(null); // Clear base64 image when adding a new portal
    setIsModalVisible(true);
  };

  const handleEditPortal = (portal: Portal) => {
    setEditingPortal(portal);
    form.setFieldsValue(portal);

    // Set the fileList with the existing image (if editing) and use base64 for the preview
    if (portal.imageUrl) {
      setFileList([
        {
          uid: "-1", // unique identifier
          name: "image.png", // use a proper image name if available
          status: "done", // mark as uploaded
          url: portal.imageUrl, // use the base64 image URL
        },
      ]);
      setImageBase64(portal.imageUrl); // Set base64 image from the existing portal
    } else {
      setFileList([]);
      setImageBase64(null);
    }
    setIsModalVisible(true);
  };

  const handleSavePortal = async (values: any) => {
    const payload = {
      ...values,
      imageUrl: imageBase64, // Send the base64 image in the payload
    };

    try {
      if (editingPortal) {
        await updatePortal(editingPortal.id, payload);
      } else {
        await createPortal(payload);
      }
      fetchPortals();
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setImageBase64(null);
    } catch (error) {
      console.error("Error saving portal:", error);
    }
  };

  const handleDeletePortal = async (id: number) => {
    try {
      await deletePortal(id);
      fetchPortals();
    } catch (error) {
      console.error("Error deleting portal:", error);
    }
  };

  // Function to convert file to base64
  const getBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting to base64:", error);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file: File) => {
    // Convert the file to base64
    getBase64(file, (base64Image: string) => {
      setImageBase64(base64Image); // Store base64 string in state
    });
    return false; // Prevent automatic upload
  };

  const columns = [
    {
      title: "Portal Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Portal) => (
        <Space>
          <Button type="link" onClick={() => handleEditPortal(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeletePortal(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl">Portals</h1>
        <Button type="primary" onClick={handleAddNewPortal}>
          Add New Portal
        </Button>
      </div>

      <Table<Portal>
        columns={columns}
        dataSource={portals}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingPortal ? "Edit Portal" : "Create New Portal"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleSavePortal} layout="vertical">
          <Form.Item
            label="Portal Name"
            name="name"
            rules={[{ required: true, message: "Please enter the portal name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: "Please enter the portal URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Image" name="imageUrl">
            <Upload
              accept="image/*"
              fileList={fileList}
              listType="picture-card"
              onChange={handleUploadChange}
              beforeUpload={beforeUpload} // Use the custom beforeUpload handler to get base64
            >
              {fileList.length < 1 && <div><UploadOutlined /> Upload</div>}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
