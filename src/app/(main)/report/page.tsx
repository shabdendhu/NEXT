"use client";

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Modal,
  Input,
  Form,
  Switch,
  Select,
  Row,
  Col,
  message,
} from 'antd';
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
  getPortals,
} from '@/api'; // Make sure you import the getPortals function

// Interfaces
interface Report {
  id: number;
  reportName: string;
  portalId: number;
  manualSync: boolean;
}

interface Portal {
  id: number;
  name: string;
}

const { Option } = Select;

export default function ReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [portals, setPortals] = useState<Portal[]>([]); // State for portals
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReports();
    fetchPortals(); // Fetch portals when the component mounts
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response);
    } catch (error) {
      console.error('Error fetching reports:', error);
      message.error('Failed to fetch reports');
    }
  };

  const fetchPortals = async () => {
    try {
      const response = await getPortals();
      setPortals(response); // Store portals data in state
    } catch (error) {
      console.error('Error fetching portals:', error);
      message.error('Failed to fetch portals');
    }
  };

  const handleAddNewReport = () => {
    setEditingReport(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    form.setFieldsValue(report);
    setIsModalVisible(true);
  };

  const handleDeleteReport = async (id: number) => {
    try {
      await deleteReport(id);
      message.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      message.error('Failed to delete report');
    }
  };

  const handleSaveReport = async (values: any) => {
    try {
      if (editingReport) {
        await updateReport(editingReport.id, values);
        message.success('Report updated successfully');
      } else {
        await createReport(values);
        message.success('Report created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
      message.error('Failed to save report');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Reports</h1>
        <Button type="primary" onClick={handleAddNewReport}>
          Create Report
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {reports.map((report) => (
          <Col key={report.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={report.reportName}
              extra={
                <Button type="link" onClick={() => handleEditReport(report)}>
                  Edit
                </Button>
              }
              actions={[
                <Button
                  key="delete"
                  danger
                  onClick={() => handleDeleteReport(report.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <p>Manual Sync: {report.manualSync ? 'Yes' : 'No'}</p>
              <p>
                Portal: {portals.find((p) => p.id === report.portalId)?.name || 'Unknown'}
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingReport ? 'Edit Report' : 'Create New Report'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSaveReport} layout="vertical">
          <Form.Item
            name="reportName"
            label="Report Name"
            rules={[{ required: true, message: 'Please enter the report name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="manualSync" label="Manual Sync" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="portalId"
            label="Portal"
            rules={[{ required: true, message: 'Please select a portal' }]}
          >
            <Select placeholder="Select a portal">
              {portals.map((portal) => (
                <Option key={portal.id} value={portal.id}>
                  {portal.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
