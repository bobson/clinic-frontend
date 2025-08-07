"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Button,
  Table,
  Typography,
  Space,
  Layout,
  Popconfirm,
  message,
  Drawer,
  Row,
  Col,
} from "antd";
import { Patient } from "@/types";
import { GET_PATIENTS, DELETE_PATIENT } from "@/graphql";
import PatientForm from "./PatientForm";

const { Title } = Typography;
const { Content } = Layout;

interface GetPatientsData {
  patients: Patient[];
}

export default function PatientsPage() {
  const { data, loading, error, refetch } =
    useQuery<GetPatientsData>(GET_PATIENTS);
  const [deletePatient] = useMutation(DELETE_PATIENT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  if (error) {
    message.error("Failed to load patients");
  }

  const openAddForm = () => {
    setEditingPatient(null);
    setDrawerOpen(true);
  };

  const openEditForm = (patient: Patient) => {
    setEditingPatient(patient);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePatient({ variables: { id } });
      message.success("Patient deleted");
      refetch();
    } catch (err) {
      message.error("Failed to delete patient");
    }
  };

  return (
    <Layout style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <Content>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Patients
            </Title>
          </Col>
          <Col>
            <Button type="primary" onClick={openAddForm}>
              + Add Patient
            </Button>
          </Col>
        </Row>

        <Table
          loading={loading}
          dataSource={data?.patients || []}
          rowKey="id"
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Phone", dataIndex: "phone", key: "phone" },
            {
              title: "Actions",
              key: "actions",
              render: (_: any, record: Patient) => (
                <Space size="middle">
                  <Button type="link" onClick={() => openEditForm(record)}>
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this patient?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger type="link">
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          scroll={{ x: 400 }}
          pagination={{ pageSize: 5 }}
        />

        <Drawer
          title={editingPatient ? "Edit Patient" : "Add Patient"}
          width={Math.min(window.innerWidth * 0.9, 360)}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          destroyOnClose
          bodyStyle={{ paddingBottom: 80 }}
        >
          <PatientForm
            initialValues={editingPatient || undefined}
            onSuccess={() => {
              setDrawerOpen(false);
              refetch();
            }}
            onCancel={() => setDrawerOpen(false)}
          />
        </Drawer>
      </Content>
    </Layout>
  );
}
