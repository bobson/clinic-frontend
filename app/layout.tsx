import "./globals.css";
import { Nunito_Sans } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import AppLayout from "@/components/AppLayout";
import ApolloWrapper from "@/components/ApolloWrapper";

export const metadata = {
  title: "Clinic App",
  description: "Manage Patients and Appointments",
};

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
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
