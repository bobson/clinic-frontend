"use client";

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_APPOINTMENT,
  UPDATE_APPOINTMENT,
  GET_PATIENTS,
  GET_APPOINTMENTS,
} from "@/graphql";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Select,
  DatePicker,
  TimePicker,
  Spin,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";
import { tealPrimary } from "@/styles/colors";
import { useEffect } from "react";

const { TextArea } = Input;

export default function EditAppointmentPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Fetch single appointment
  const { loading: queryLoading, data } = useQuery(GET_APPOINTMENT, {
    variables: { id },
    onError: (error) => {
      message.error("Failed to load appointment data");
      console.error("Appointment fetch error:", error);
      router.push("/appointments");
    },
  });

  // Fetch patients for dropdown
  const { data: patientsData } = useQuery(GET_PATIENTS, {
    onError: (error) => {
      console.error("Patients fetch error:", error);
    },
  });

  // Initialize form with appointment data
  useEffect(() => {
    if (data?.appointment) {
      const { date, reason, patient } = data.appointment;
      form.setFieldsValue({
        patientId: patient?.id,
        date: dayjs(date),
        time: dayjs(date),
        reason,
      });
    }
  }, [data, form]);

  const [updateAppointment, { loading: updateLoading }] = useMutation(
    UPDATE_APPOINTMENT,
    {
      refetchQueries: [
        { query: GET_APPOINTMENT, variables: { id } },
        { query: GET_APPOINTMENTS },
      ],
      onError: (error) => {
        message.error(`Update failed: ${error.message}`);
        console.error("Update error:", error);
      },
    }
  );

  const handleSubmit = async (values: any) => {
    try {
      // Combine date and time
      const dateTime = dayjs(values.date)
        .set("hour", values.time.hour())
        .set("minute", values.time.minute())
        .toISOString();

      const result = await updateAppointment({
        variables: {
          input: {
            id,
            date: dateTime,
            reason: values.reason,
            patientId: values.patientId,
          },
        },
      });

      if (result.data?.updateAppointment) {
        message.success("Appointment updated successfully");
        router.push("/appointments");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (queryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading appointment data..." />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Card
          title={
            <span className="text-xl font-semibold">Edit Appointment</span>
          }
          className="shadow-sm border-0 rounded-lg"
          styles={{
            header: {
              borderBottom: "1px solid #f0f0f0",
              padding: "16px 24px",
            },
            body: {
              padding: "24px",
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            initialValues={{ reason: "" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <Form.Item
                label="Patient"
                name="patientId"
                rules={[{ required: true, message: "Please select a patient" }]}
                className="md:col-span-2"
              >
                <Select
                  placeholder="Select patient"
                  size="large"
                  options={patientsData?.patients?.map((patient: any) => ({
                    value: patient.id,
                    label: patient.name,
                  }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              {/* Date Picker */}
              <Form.Item
                label="Date"
                name="date"
                rules={[
                  { required: true, message: "Please select appointment date" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  size="large"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>

              {/* Time Picker */}
              <Form.Item
                label="Time"
                name="time"
                rules={[
                  { required: true, message: "Please select appointment time" },
                ]}
              >
                <TimePicker
                  className="w-full"
                  size="large"
                  format="h:mm A"
                  minuteStep={15}
                  showNow={false}
                  use12Hours
                />
              </Form.Item>

              {/* Reason */}
              <Form.Item
                label="Reason for Appointment"
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Please enter appointment reason",
                  },
                ]}
                className="md:col-span-2"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter the reason for the appointment..."
                  size="large"
                />
              </Form.Item>
            </div>

            {/* Form Actions */}
            <Form.Item className="mt-8 flex justify-end space-x-4">
              <Button
                size="large"
                className="px-8"
                onClick={() => router.push("/appointments")}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={updateLoading}
                style={{
                  backgroundColor: tealPrimary,
                  borderColor: tealPrimary,
                }}
                className="px-8 hover:opacity-90"
              >
                Update Appointment
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
