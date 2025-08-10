"use client";

import { useMutation, useQuery } from "@apollo/client";
import { ADD_APPOINTMENT, GET_PATIENTS, GET_APPOINTMENTS } from "@/graphql";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { tealPrimary } from "@/styles/colors";

const { TextArea } = Input;

export default function AddAppointmentPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [addAppointment, { loading }] = useMutation(ADD_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS }],
  });

  const { data: patientsData } = useQuery(GET_PATIENTS);

  const onFinish = async (values: any) => {
    try {
      await addAppointment({
        variables: {
          input: {
            date: dayjs(values.date).format(),
            reason: values.reason,
            patientId: values.patientId,
          },
        },
      });
      message.success("Appointment added successfully");
      router.push("/appointments");
    } catch (error) {
      message.error("Failed to add appointment");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card
          title={<span className="text-xl font-semibold">New Appointment</span>}
          className="shadow-md border-0"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Patient"
              name="patientId"
              rules={[{ required: true, message: "Please select a patient" }]}
            >
              <Select
                placeholder="Select patient"
                options={patientsData?.patients?.map((patient: any) => ({
                  value: patient.id,
                  label: patient.name,
                }))}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                { required: true, message: "Please select appointment date" },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Time"
              name="time"
              rules={[
                { required: true, message: "Please select appointment time" },
              ]}
            >
              <TimePicker
                className="w-full"
                format="h:mm A"
                minuteStep={15}
                showNow={false}
              />
            </Form.Item>

            <Form.Item
              label="Reason"
              name="reason"
              rules={[
                { required: true, message: "Please enter appointment reason" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Brief reason for the appointment"
              />
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
                Schedule Appointment
              </Button>
              <Button
                className="ml-2 w-full md:w-auto px-6 h-10 mt-2 md:mt-0"
                onClick={() => router.push("/appointments")}
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
