import { NavLink, useLocation } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "OVERVIEW",
    icon: "◈",
    description: "System status",
  },
  {
    path: "/dashboard/holders",
    label: "HOLDERS",
    icon: "◉",
    description: "Token analytics",
  },
  {
    path: "/dashboard/trading",
    label: "TRADING",
    icon: "◆",
    description: "Charts & movers",
  },
  {
    path: "/dashboard/swap",
    label: "SWAP",
    icon: "⇄",
    description: "Token exchange",
  },
];

/**
 * DashboardSidebar - Terminal-style navigation
 */
export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      {/* Logo/Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">⬡</div>
        <div className="brand-text">
          <span className="brand-name">BITPLEX</span>
          <span className="brand-tag">SPARK://L2</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">
          <span className="nav-section-icon">▸</span>
          NAVIGATION
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          const isExactDashboard = item.path === "/dashboard" && location.pathname === "/dashboard";
          const active = item.path === "/dashboard" ? isExactDashboard : isActive;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-desc">{item.description}</span>
              </div>
              {active && <span className="nav-indicator">◂</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-row">
            <span className="status-dot online" />
            <span className="status-label">MAINNET</span>
          </div>
          <div className="status-row">
            <span className="status-label dim">v1.0.0</span>
          </div>
        </div>
        <NavLink to="/" className="back-link">
          <span className="back-icon">←</span>
          EXIT_TERMINAL
        </NavLink>
      </div>

      <style>{`
        .dashboard-sidebar {
          width: 240px;
          background: rgba(0, 0, 0, 0.6);
          border-right: 1px solid rgba(52, 211, 153, 0.2);
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(10px);
        }

        .sidebar-brand {
          padding: 20px 16px;
          border-bottom: 1px solid rgba(52, 211, 153, 0.15);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          font-size: 28px;
          color: #34d399;
          text-shadow: 0 0 20px rgba(52, 211, 153, 0.5);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 700;
          color: #34d399;
          letter-spacing: 2px;
        }

        .brand-tag {
          font-size: 9px;
          color: rgba(52, 211, 153, 0.5);
          letter-spacing: 1px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }

        .nav-section-title {
          padding: 8px 16px;
          font-size: 10px;
          color: rgba(52, 211, 153, 0.4);
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-section-icon {
          color: rgba(52, 211, 153, 0.3);
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          text-decoration: none;
          color: rgba(52, 211, 153, 0.6);
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
          gap: 12px;
        }

        .nav-item:hover {
          background: rgba(52, 211, 153, 0.05);
          color: #34d399;
        }

        .nav-item.active {
          background: rgba(52, 211, 153, 0.1);
          color: #34d399;
          border-left-color: #34d399;
        }

        .nav-icon {
          font-size: 16px;
          width: 24px;
          text-align: center;
        }

        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .nav-desc {
          font-size: 9px;
          opacity: 0.5;
          margin-top: 2px;
        }

        .nav-indicator {
          font-size: 10px;
          color: #34d399;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(52, 211, 153, 0.15);
        }

        .system-status {
          margin-bottom: 12px;
        }

        .status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          margin-bottom: 4px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          animation: pulse 2s infinite;
        }

        .status-label {
          color: rgba(52, 211, 153, 0.7);
          letter-spacing: 1px;
        }

        .status-label.dim {
          color: rgba(52, 211, 153, 0.4);
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 4px;
          color: #f87171;
          font-size: 10px;
          text-decoration: none;
          letter-spacing: 1px;
          transition: all 0.2s ease;
        }

        .back-link:hover {
          background: rgba(248, 113, 113, 0.2);
          border-color: rgba(248, 113, 113, 0.4);
        }

        .back-icon {
          font-size: 12px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(52, 211, 153, 0.2);
          }

          .sidebar-nav {
            display: flex;
            flex-wrap: wrap;
            padding: 8px;
            gap: 8px;
          }

          .nav-section-title {
            display: none;
          }

          .nav-item {
            flex: 1;
            min-width: calc(50% - 8px);
            padding: 12px;
            border-left: none;
            border-radius: 4px;
            justify-content: center;
          }

          .nav-item.active {
            border-left: none;
            border: 1px solid rgba(52, 211, 153, 0.4);
          }

          .nav-desc, .nav-indicator {
            display: none;
          }

          .sidebar-footer {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
