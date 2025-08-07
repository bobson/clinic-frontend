"use client";

import { Typography, Card, Space, Button } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

export default function DashboardPage() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={2}>Clinic Dashboard</Title>
      <Text type="secondary">
        Welcome! Use the dashboard to manage patients and appointments.
      </Text>

      <Space size="large" wrap>
        <Card
          title="Patients"
          style={{ width: 300 }}
          actions={[
            <Link key="view" href="/patients">
              <Button type="link">Go to Patients</Button>
            </Link>,
          ]}
        >
          <p>Manage all patient records from one place.</p>
        </Card>

        <Card
          title="Appointments"
          style={{ width: 300 }}
          actions={[
            <Link key="view" href="/appointments">
              <Button type="link">Go to Appointments</Button>
            </Link>,
          ]}
        >
          <p>Schedule, update, or cancel appointments.</p>
        </Card>
      </Space>
    </Space>
  );
}
