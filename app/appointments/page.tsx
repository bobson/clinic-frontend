"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_APPOINTMENTS, DELETE_APPOINTMENT } from "@/graphql";
import {
  Table,
  Button,
  Space,
  message,
  Card,
  Input,
  Flex,
  Tag,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import type { Appointment } from "@/types";
import dayjs from "dayjs";
import { tealPrimary } from "@/styles/colors";

export default function AppointmentsPage() {
  const [searchText, setSearchText] = useState("");
  const { loading, error, data, refetch } = useQuery(GET_APPOINTMENTS);
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT);

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment({ variables: { id } });
      message.success("Appointment deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete appointment");
    }
  };

  const filteredAppointments = data?.appointments?.filter(
    (appt: Appointment) => {
      const searchLower = searchText.toLowerCase();
      const patientName = appt.patient?.name?.toLowerCase() || "";
      const reason = appt.reason?.toLowerCase() || "";
      const dateString = appt.date
        ? dayjs(appt.date).format("MMM D, YYYY h:mm A").toLowerCase()
        : "";

      return (
        patientName.includes(searchLower) ||
        reason.includes(searchLower) ||
        dateString.includes(searchLower)
      );
    }
  );

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? dayjs(date).format("MMM D, YYYY h:mm A") : "N/A",
      sorter: (a: Appointment, b: Appointment) =>
        dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Patient",
      dataIndex: ["patient", "name"],
      key: "patient",
      render: (text: string | null) =>
        text ? <Tag color="blue">{text}</Tag> : "N/A",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text: string | null) => (
        <span className="font-medium">{text || "N/A"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Appointment) => (
        <Space size="middle">
          <Link href={`/appointments/${record.id}/edit`}>
            <Button
              icon={<EditOutlined />}
              style={{ color: tealPrimary, borderColor: tealPrimary }}
            >
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Delete this appointment?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Flex justify="space-between" align="center" className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Appointment Management
          </h1>
          <Link href="/appointments/new">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: tealPrimary, borderColor: tealPrimary }}
              className="hover:opacity-90"
            >
              New Appointment
            </Button>
          </Link>
        </Flex>

        <Card
          className="shadow-md border-0"
          styles={{
            header: { border: "none" },
            body: { paddingTop: 0 },
          }}
          title={
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                Upcoming Appointments
              </span>
              <Input
                placeholder="Search appointments..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full md:w-64 lg:w-80"
              />
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredAppointments || []}
            rowKey="id"
            loading={loading}
            scroll={{ x: true }}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              className: "px-2",
            }}
            className="mt-4"
            rowClassName="hover:bg-[#f0fdfa]"
          />
        </Card>
      </div>
    </div>
  );
}
