"use client";

import React, { useState } from "react";
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

const { Title } = Typography;
const { Content } = Layout;

interface ListPageProps<T, ExtraProps = {}> {
  title: string;
  data: T[];
  loading: boolean;
  error?: Error | null;
  onDelete: (id: string) => Promise<void>;
  columns: any[];
  FormComponent: React.FC<
    {
      initialValues?: T;
      onSuccess: () => void;
      onCancel: () => void;
      extraProps?: any;
    } & ExtraProps
  >;
  extraFormProps?: ExtraProps;
  rowKey?: string;
  drawerWidth?: number;
  refetch: () => void;
}

export default function ListPage<T, ExtraProps>({
  title,
  data,
  loading,
  error,
  onDelete,
  columns,
  FormComponent,
  extraFormProps,
  rowKey = "id",
  drawerWidth = 360,
  refetch,
}: ListPageProps<T, ExtraProps>) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  if (error) {
    message.error(`Failed to load ${title.toLowerCase()}`);
  }

  const openAddForm = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const openEditForm = (item: T) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      message.success(`${title.slice(0, -1)} deleted`);
      refetch();
    } catch {
      message.error(`Failed to delete ${title.slice(0, -1).toLowerCase()}`);
    }
  };

  // Extend columns with actions column
  const extendedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: T & { id: string }) => (
        <Space size="middle">
          <Button type="link" onClick={() => openEditForm(record)}>
            Edit
          </Button>
          <Popconfirm
            title={`Are you sure to delete this ${title
              .slice(0, -1)
              .toLowerCase()}?`}
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
              {title}
            </Title>
          </Col>
          <Col>
            <Button type="primary" onClick={openAddForm}>
              + Add {title.slice(0, -1)}
            </Button>
          </Col>
        </Row>

        <div className="custom-table">
          <Table
            loading={loading}
            dataSource={data}
            rowKey={rowKey}
            columns={extendedColumns}
            scroll={{ x: 500 }}
            pagination={{ pageSize: 5 }}
          />
        </div>

        <Drawer
          title={
            editingItem
              ? `Edit ${title.slice(0, -1)}`
              : `Add ${title.slice(0, -1)}`
          }
          width={drawerWidth}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          styles={{ body: { paddingBottom: 80 } }}
        >
          <FormComponent
            initialValues={editingItem || undefined}
            onSuccess={() => {
              setDrawerOpen(false);
              refetch();
            }}
            onCancel={() => setDrawerOpen(false)}
            {...(extraFormProps as ExtraProps)}
          />
        </Drawer>
      </Content>
    </Layout>
  );
}
