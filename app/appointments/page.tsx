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
import { Appointment, Patient } from "@/types";
import { GET_APPOINTMENTS, DELETE_APPOINTMENT, GET_PATIENTS } from "@/graphql";
import AppointmentForm from "./AppointmentForm";

const { Title } = Typography;
const { Content } = Layout;

interface GetAppointmentsData {
  appointments: Appointment[];
}

interface GetPatientsData {
  patients: Patient[];
}

export default function AppointmentsPage() {
  const { data, loading, error, refetch } =
    useQuery<GetAppointmentsData>(GET_APPOINTMENTS);
  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
  } = useQuery<GetPatientsData>(GET_PATIENTS);

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  if (error || patientsError) {
    message.error("Failed to load data");
  }

  const openAddForm = () => {
    setEditingAppointment(null);
    setDrawerOpen(true);
  };

  const openEditForm = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment({ variables: { id } });
      message.success("Appointment deleted");
      refetch();
    } catch (err) {
      message.error("Failed to delete appointment");
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: ["patient", "name"],
      key: "patientName",
      render: (_: any, record: Appointment) =>
        record.patient?.name || "Unknown",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (dateStr: string) => {
        if (!dateStr) return "N/A";
        try {
          const date = new Date(dateStr);
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
        } catch {
          return "Invalid date";
        }
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Appointment) => (
        <Space size="middle">
          <Button type="link" onClick={() => openEditForm(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this appointment?"
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
  ];

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
              Appointments
            </Title>
          </Col>
          <Col>
            <Button type="primary" onClick={openAddForm}>
              + Add Appointment
            </Button>
          </Col>
        </Row>

        <Table
          loading={loading || patientsLoading}
          dataSource={data?.appointments || []}
          rowKey="id"
          columns={columns}
          scroll={{ x: 500 }}
          pagination={{ pageSize: 5 }}
        />

        <Drawer
          title={editingAppointment ? "Edit Appointment" : "Add Appointment"}
          width={Math.min(window.innerWidth * 0.9, 400)}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          destroyOnClose
          bodyStyle={{ paddingBottom: 80 }}
        >
          <AppointmentForm
            patients={patientsData?.patients || []}
            initialValues={editingAppointment || undefined}
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
