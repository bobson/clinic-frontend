"use client";

import React from "react";
import { Form, Input, DatePicker, Button, Typography } from "antd";

const { Title } = Typography;

export interface FieldConfig {
  name: string;
  label: string;
  required: boolean;
  type?: "text" | "email" | "phone" | "date" | "textarea";
}

interface ClinicFormProps<T = any> {
  title?: string;
  fields: FieldConfig[];
  initialValues?: Partial<T>;
  onFinish: (values: T) => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  loading?: boolean;
}

export default function ClinicForm<T = any>({
  title,
  fields,
  initialValues,
  onFinish,
  onCancel,
  submitText = "Submit",
  loading = false,
}: ClinicFormProps<T>) {
  const [form] = Form.useForm<T>();

  return (
    <Form<T>
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {title && (
        <Form.Item>
          <Title level={4}>{title}</Title>
        </Form.Item>
      )}

      {fields.map((field) => {
        const commonProps = {
          label: field.label,
          name: field.name as any,
          key: field.name,
        };

        switch (field.type) {
          case "date":
            return (
              <Form.Item {...commonProps}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            );

          case "textarea":
            return (
              <Form.Item {...commonProps}>
                <Input.TextArea rows={4} />
              </Form.Item>
            );

          default:
            return (
              <Form.Item {...commonProps}>
                <Input type={field.type || "text"} />
              </Form.Item>
            );
        }
      })}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {submitText}
        </Button>
      </Form.Item>

      {onCancel && (
        <Form.Item>
          <Button onClick={onCancel} block>
            Cancel
          </Button>
        </Form.Item>
      )}
    </Form>
  );
}
