"use client";

import { useMutation } from "@apollo/client";
import { ADD_PATIENT, GET_PATIENTS } from "@/graphql";
import { Form, Input, Button, Card, message } from "antd";
import { useRouter } from "next/navigation";

const tealPrimary = "#20c9ac";

export default function AddPatientPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [addPatient, { loading }] = useMutation(ADD_PATIENT, {
    refetchQueries: [{ query: GET_PATIENTS }], // Auto-refresh patient list
  });

  const onFinish = async (values: any) => {
    try {
      await addPatient({ variables: values });
      message.success("Patient added successfully");
      router.push("/patients");
    } catch (error) {
      message.error("Failed to add patient");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card
          title={<span className="text-xl font-semibold">Add New Patient</span>}
          className="shadow-md border-0"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter patient name" }]}
            >
              <Input placeholder="John Doe" className="py-2" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="john@example.com" className="py-2" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input placeholder="+1234567890" className="py-2" />
            </Form.Item>

            <Form.Item className="mt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  backgroundColor: tealPrimary,
                  borderColor: tealPrimary,
                }}
                className="w-full md:w-auto px-6 h-10 font-medium hover:opacity-90"
              >
                Add Patient
              </Button>
              <Button
                className="ml-2 w-full md:w-auto px-6 h-10 mt-2 md:mt-0"
                onClick={() => router.push("/patients")}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
