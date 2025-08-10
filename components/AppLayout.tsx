"use client";

import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: "patients",
      icon: <UserOutlined />,
      label: <Link href="/patients">Patients</Link>,
    },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: <Link href="/appointments">Appointments</Link>,
    },
  ];

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true); // auto-close on route change (mobile only)
    }
  }, [pathname, isMobile]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
          setIsMobile(broken);
        }}
        onCollapse={(collapse) => setCollapsed(collapse)}
        collapsed={collapsed}
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "16px",
            fontWeight: "bold",
          }}
        >
          🏥 ClinicApp
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname.split("/")[1] || "dashboard"]}
          items={menuItems}
          onClick={() => {
            if (isMobile) {
              setCollapsed(true); // collapse on mobile after click
            }
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
          }}
        >
          <Link href="/" style={{ color: "#000", textDecoration: "none" }}>
            Clinic Admin Panel
          </Link>
        </Header>
        <Content style={{ margin: "24px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
