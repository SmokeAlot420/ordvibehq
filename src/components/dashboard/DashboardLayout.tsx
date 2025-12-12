import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

/**
 * DashboardLayout - Main wrapper for dashboard views
 * Terminal-style cyberpunk aesthetic
 */
export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #001a0f 50%, #000a05 100%);
          color: #34d399;
          font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }

        .dashboard-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          position: relative;
        }

        /* Scanline overlay effect */
        .dashboard-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-content > * {
          position: relative;
          z-index: 2;
        }

        /* Scrollbar styling */
        .dashboard-content::-webkit-scrollbar {
          width: 8px;
        }

        .dashboard-content::-webkit-scrollbar-track {
          background: rgba(52, 211, 153, 0.05);
        }

        .dashboard-content::-webkit-scrollbar-thumb {
          background: rgba(52, 211, 153, 0.3);
          border-radius: 4px;
        }

        .dashboard-content::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 211, 153, 0.5);
        }

        @media (max-width: 768px) {
          .dashboard-layout {
            flex-direction: column;
          }

          .dashboard-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
