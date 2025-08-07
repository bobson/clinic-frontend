"use client";

import { Form, Input, Button, message } from "antd";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { ADD_PATIENT, UPDATE_PATIENT } from "@/graphql";
import { Patient } from "@/types";

interface PatientFormProps {
  initialValues?: Partial<Patient>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PatientForm({
  initialValues,
  onSuccess,
  onCancel,
}: PatientFormProps) {
  const [form] = Form.useForm();

  const [addPatient, { loading: adding }] = useMutation(ADD_PATIENT);
  const [updatePatient, { loading: updating }] = useMutation(UPDATE_PATIENT);

  useEffect(() => {
    form.resetFields();
  }, [initialValues, form]);

  const isEdit = Boolean(initialValues && initialValues.id);

  const handleFinish = async (values: Partial<Patient>) => {
    try {
      if (isEdit && initialValues?.id) {
        await updatePatient({ variables: { id: initialValues.id, ...values } });
        message.success("Patient updated successfully");
      } else {
        await addPatient({ variables: values });
        message.success("Patient added successfully");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error("Failed to save patient");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      requiredMark="optional"
    >
      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: "Please enter name" }]}
      >
        <Input placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="john@example.com" />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please enter phone" }]}
      >
        <Input placeholder="+1234567890" />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={adding || updating}>
          {isEdit ? "Update" : "Add"} Patient
        </Button>
      </Form.Item>
    </Form>
  );
}
