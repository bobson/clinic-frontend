"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_PATIENTS, DELETE_PATIENT } from "@/graphql";
import { Table, Button, Space, message, Card, Input, Flex } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const [searchText, setSearchText] = useState("");
  const { loading, error, data, refetch } = useQuery(GET_PATIENTS);
  const [deletePatient] = useMutation(DELETE_PATIENT);

  const handleDelete = async (id: string) => {
    try {
      await deletePatient({ variables: { id } });
      message.success("Patient deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete patient");
    }
  };

  const filteredPatients = data?.patients?.filter((patient: Patient) => {
    const searchLower = searchText.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Patient) => (
        <Space size="middle">
          <Link href={`/patients/${record.id}/edit`}>
            <Button icon={<EditOutlined />}>Edit</Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" className="mb-4">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link href="/patients/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Patient
          </Button>
        </Link>
      </Flex>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search patients..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients || []}
          rowKey="id"
          loading={loading}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
