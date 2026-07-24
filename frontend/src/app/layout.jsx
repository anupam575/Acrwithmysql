import "./globals.css";
import Providers from "./providers/providers";
import ClientLayout from "./clientlayout";

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            top: 20,
            right: 20,
            zIndex: 999999,
          }}
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}