import { AntdRegistry } from "@ant-design/nextjs-registry";
export const metadata = {
  title: "Clinic App",
  description: "Manage Patients and Appointments",
};

import AppLayout from "@/components/AppLayout";
import ApolloWrapper from "@/components/ApolloWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AntdRegistry>
            <AppLayout>{children}</AppLayout>
          </AntdRegistry>
        </ApolloWrapper>
      </body>
    </html>
  );
}
