"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Table,
  Form,
  Divider,
  Radio,
} from "antd";
import { createTask, getTask, updateTask } from "@/api";

// Define TypeScript interfaces
interface Task {
  id: number;
  name: string;
  taskJson?: TaskJson;
  variables?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

interface TaskJson {
  pages: Page[];
}

interface Page {
  url: string;
  steps: Step[];
}

interface KeyValuePair {
  key: string;
  value: string;
}

interface Step {
  action: string;
  location: string;
  variable?: string;
  keyValuePairs: KeyValuePair[];
}

interface Variable {
  key: string;
  value: string;
}

// Main component
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [inputType, setInputType] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState<string>('');

  const [pages, setPages] = useState<Page[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTask();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsModalVisible(true);
    form.resetFields();
    setPages([]);
    setVariables([]);
    setInputType('form');
    setJsonInput('');
  };
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    if (inputType === 'form') {
      const updatedPages =
        task.taskJson?.pages.map((page) => ({
          ...page,
          steps: page.steps.map((step) => ({
            action: step.action,
            location: step.location,
            variable: step.variable,
            keyValuePairs: step.variable
              ? [{ key: step.variable, value: step.variable }]
              : [],
          })),
        })) || [];
      setPages(updatedPages);
      setVariables(
        Object.entries(task.variables || {}).map(([key, value]) => ({
          key,
          value,
        }))
      );
      form.setFieldsValue(task);
    } else {
      setJsonInput(JSON.stringify(task, null, 2));
    }
    setIsModalVisible(true);
  };

  const handleSaveTask = async (values: any) => {
    let payload;
    if (inputType === 'form') {
      payload = {
        ...values,
        taskJson: { pages },
        variables: variables.reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        ),
      };
    } else {
      try {
        payload = JSON.parse(jsonInput);
      } catch (error) {
        console.error("Invalid JSON input:", error);
        return;
      }
    }
    
    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }
      fetchTasks();
      setIsModalVisible(false);
      form.resetFields();
      setPages([]);
      setVariables([]);
      setJsonInput('');
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Methods to add/remove pages, steps, and variables
  const addPage = () => setPages([...pages, { url: "", steps: [] }]);
  const removePage = (index: number) =>
    setPages(pages.filter((_, i) => i !== index));

  const addStepToPage = (pageIndex: number) => {
    const newPages = [...pages];
    newPages[pageIndex].steps.push({
      action: "",
      location: "",
      keyValuePairs: [],
    });
    setPages(newPages);
  };

  const updateStepInPage = (
    pageIndex: number,
    stepIndex: number,
    field: keyof Step,
    value: string
  ) => {
    const newPages = [...pages];
    newPages[pageIndex].steps[stepIndex] = {
      ...newPages[pageIndex].steps[stepIndex],
      [field]: value,
    };
    setPages(newPages);
  };

  const addKeyValuePairToStep = (pageIndex: number, stepIndex: number) => {
    const newPages = [...pages];
    newPages[pageIndex].steps[stepIndex].keyValuePairs.push({
      key: "",
      value: "",
    });
    setPages(newPages);
  };

  const updateKeyValuePairInStep = (
    pageIndex: number,
    stepIndex: number,
    pairIndex: number,
    field: "key" | "value",
    value: string
  ) => {
    const newPages = [...pages];
    newPages[pageIndex].steps[stepIndex].keyValuePairs[pairIndex][field] =
      value;
    setPages(newPages);
  };

  const removeKeyValuePairFromStep = (
    pageIndex: number,
    stepIndex: number,
    pairIndex: number
  ) => {
    const newPages = [...pages];
    newPages[pageIndex].steps[stepIndex].keyValuePairs.splice(pairIndex, 1);
    setPages(newPages);
  };

  const removeStepFromPage = (pageIndex: number, stepIndex: number) => {
    const newPages = [...pages];
    newPages[pageIndex].steps = newPages[pageIndex].steps.filter(
      (_, i) => i !== stepIndex
    );
    setPages(newPages);
  };

  const addVariable = () =>
    setVariables([...variables, { key: "", value: "" }]);
  const removeVariable = (index: number) =>
    setVariables(variables.filter((_, i) => i !== index));

  const columns = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Button type="link" onClick={() => handleEditTask(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h1 className="text-2xl">Tasks</h1>
        <Button type="primary" onClick={handleAddNewTask}>
          Add New Task
        </Button>
      </div>

      <Table<Task>
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingTask ? "Edit Task" : "Create New Task"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} onFinish={handleSaveTask} layout="vertical">
          <Form.Item
            label="Task Name"
            name="name"
            rules={[{ required: true, message: "Please enter the task name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item >
            <Radio.Group
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
            >
              <Radio value="form">Form</Radio>
              <Radio value="json">JSON</Radio>
            </Radio.Group>
          </Form.Item>

          {inputType === 'form' ? (
            <>

          {/* Pages Section */}
          <Divider style={{ borderColor: "#333333" }}>Pages</Divider>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={addPage}
              type="primary"
              style={{ marginBottom: 15, borderColor: "#4C75E7" }}
            >
              Add Page
            </Button>
          </div>
          {pages.map((page, pageIndex) => (
            <div
              key={pageIndex}
              style={{
                padding: 10,
                marginBottom: 10,
                borderColor: "green",
                // backgroundColor:'green',
                borderRadius: 10,
                border: "2px solid black",
              }}
            >
              {/* Page URL */}
              <label style={{ fontWeight: 600, marginLeft: 5 }}>Page URL</label>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingInline: 5,
                }}
              >
                <Input
                  placeholder="Page URL"
                  value={page.url}
                  onChange={(e) =>
                    setPages(
                      pages.map((p, i) =>
                        i === pageIndex ? { ...p, url: e.target.value } : p
                      )
                    )
                  }
                  style={{ marginTop: 5 }}
                />
                <Button
                  onClick={() => addStepToPage(pageIndex)}
                  type="primary"
                  style={{ marginTop: 5 }}
                >
                  + Step
                </Button>
              </div>
              {page.steps.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    gap: 10,
                    marginTop: 15,
                    paddingInline: 10,
                    border: "1px solid grey",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                      gap: 10,
                      marginTop: 10,
                      padding: 10,
                    }}
                  >
                    <Input
                      placeholder="Action"
                      value={step.action}
                      onChange={(e) =>
                        updateStepInPage(
                          pageIndex,
                          stepIndex,
                          "action",
                          e.target.value
                        )
                      }
                      className="mb-2"
                    />
                    <Input
                      placeholder="Location"
                      value={step.location}
                      onChange={(e) =>
                        updateStepInPage(
                          pageIndex,
                          stepIndex,
                          "location",
                          e.target.value
                        )
                      }
                      className="mb-2"
                    />
                    <Button
                      onClick={() =>
                        addKeyValuePairToStep(pageIndex, stepIndex)
                      }
                      type="default"
                      style={{ border: "1px solid #4C75E7" }}
                    >
                      Add K-V
                    </Button>
                  </div>

                  {step.keyValuePairs.map((pair, pairIndex) => (
                    <div
                      key={pairIndex}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        paddingInline: 20,
                      }}
                    >
                      <Input
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) =>
                          updateKeyValuePairInStep(
                            pageIndex,
                            stepIndex,
                            pairIndex,
                            "key",
                            e.target.value
                          )
                        }
                        className="w-1/2"
                      />
                      <Input
                        placeholder="Value"
                        value={pair.value}
                        onChange={(e) =>
                          updateKeyValuePairInStep(
                            pageIndex,
                            stepIndex,
                            pairIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="w-1/2"
                      />
                      <Button
                        danger
                        onClick={() =>
                          removeKeyValuePairFromStep(
                            pageIndex,
                            stepIndex,
                            pairIndex
                          )
                        }
                        type="default"
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Button
                      danger
                      onClick={() => removeStepFromPage(pageIndex, stepIndex)}
                      type="dashed"
                    >
                      Remove Step
                    </Button>
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 15,
                }}
              >
                <Button
                  danger
                  onClick={() => removePage(pageIndex)}
                  type="primary"
                >
                  Remove Page
                </Button>
              </div>
            </div>
          ))}

          {/* Variables Section */}
          <Divider style={{ borderColor: "#333333" }}>Variables</Divider>
          <div  style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}>

          <Button
            onClick={addVariable}
            type="primary"
            style={{ marginBottom: 10 }}
          >
            Add Variable
          </Button>
          </div>
          {variables.map((variable, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                gap: 10,
                marginTop: 10,
                paddingInline: 10,
              }}
            >
              <Input
                placeholder="Key"
                value={variable.key}
                onChange={(e) =>
                  setVariables(
                    variables.map((v, i) =>
                      i === index ? { ...v, key: e.target.value } : v
                    )
                  )
                }
              />
              <Input
                placeholder="Value"
                value={variable.value}
                onChange={(e) =>
                  setVariables(
                    variables.map((v, i) =>
                      i === index ? { ...v, value: e.target.value } : v
                    )
                  )
                }
              />
              <Button danger onClick={() => removeVariable(index)} type="default">
               X
              </Button>
            </div>
          ))}
           </>
          ) : (
            <Form.Item label="JSON Input">
              <Input.TextArea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
       
}
