import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { DataFlowBackground } from "../3d/DataFlowBackground";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <DataFlowBackground />
      <div className="flex min-h-screen w-full bg-transparent">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col md:pl-64 z-10 w-full overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 animate-fade-in p-4 md:p-6 lg:p-8 w-full overflow-hidden">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
