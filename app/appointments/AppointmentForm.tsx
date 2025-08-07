"use client";

import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import moment from "moment";
import { ADD_APPOINTMENT, UPDATE_APPOINTMENT } from "@/graphql";
import { Appointment, Patient } from "@/types";

const { Option } = Select;

interface AppointmentFormProps {
  patients: Patient[];
  initialValues?: Partial<Appointment>;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AppointmentForm({
  patients,
  initialValues,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const [form] = Form.useForm();

  const [addAppointment, { loading: adding }] = useMutation(ADD_APPOINTMENT);
  const [updateAppointment, { loading: updating }] =
    useMutation(UPDATE_APPOINTMENT);

  useEffect(() => {
    if (initialValues?.date) {
      form.setFieldsValue({
        ...initialValues,
        date: moment(initialValues.date),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const isEdit = Boolean(initialValues && initialValues.id);

  const handleFinish = async (values: any) => {
    const input = {
      patientId: values.patientId,
      date: values.date.toISOString(),
      reason: values.reason,
    };
    try {
      if (isEdit && initialValues?.id) {
        await updateAppointment({
          variables: { input: { id: initialValues.id, ...input } },
        });
        message.success("Appointment updated successfully");
      } else {
        await addAppointment({ variables: { input } });
        message.success("Appointment added successfully");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error("Failed to save appointment");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      requiredMark="optional"
    >
      <Form.Item
        label="Patient"
        name="patientId"
        rules={[{ required: true, message: "Please select a patient" }]}
      >
        <Select
          placeholder="Select a patient"
          showSearch
          optionFilterProp="children"
          allowClear
        >
          {patients.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Date & Time"
        name="date"
        rules={[{ required: true, message: "Please select date and time" }]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Reason"
        name="reason"
        rules={[{ required: true, message: "Please enter a reason" }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={adding || updating}>
          {isEdit ? "Update" : "Add"} Appointment
        </Button>
      </Form.Item>
    </Form>
  );
}
