import { Inter } from "next/font/google";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import Footer from "@/Components/Footer";
import MainContent from "@/Components/MainContent";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Body */}
          <MainContent>{children}</MainContent>

          {/* Footer */}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
