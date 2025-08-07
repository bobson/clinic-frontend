import "./globals.css";
import "antd/dist/reset.css";

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
          <AppLayout>{children}</AppLayout>
        </ApolloWrapper>
      </body>
    </html>
  );
}
