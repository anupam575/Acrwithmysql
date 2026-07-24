"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  ExpandMore,
  Menu,
  HelpOutlined,
} from "@mui/icons-material";
import DashboardHeader from "./section/DashboardHeader";

const SIDEBAR_EXPANDED_WIDTH = 272;
const SIDEBAR_COLLAPSED_WIDTH = 84;

const DashboardLayout = ({
  children,
  menuItems = [],
  title = "Dashboard",
}) => {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({});

  const normalizePath = (path = "") => {
    if (path === "/") return "/";
    return path.replace(/\/+$/, "");
  };

  const currentPath = normalizePath(pathname);

  const isExpanded = sidebarOpen;

  const sidebarWidth = isExpanded
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((previous) => !previous);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const getMenuKey = (item, index) => {
    return (
      item.id ||
      `${item.name}-${index}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
    );
  };

  const isRouteActive = (link, exact = false) => {
    if (!link) return false;

    const normalizedLink = normalizePath(link);

    if (exact || normalizedLink === "/") {
      return currentPath === normalizedLink;
    }

    return (
      currentPath === normalizedLink ||
      currentPath.startsWith(`${normalizedLink}/`)
    );
  };

  const isMenuActive = (item) => {
    if (item.children?.length) {
      return item.children.some((child) =>
        isRouteActive(child.link, child.exact)
      );
    }

    return isRouteActive(item.link, item.exact);
  };

  const handleDropdown = (key) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);

      setOpenDropdown((previous) => ({
        ...previous,
        [key]: true,
      }));

      return;
    }

    setOpenDropdown((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  useEffect(() => {
    const activeDropdowns = {};

    menuItems.forEach((item, index) => {
      if (!item.children?.length) return;

      const key = getMenuKey(item, index);

      const hasActiveChild = item.children.some((child) =>
        isRouteActive(child.link, child.exact)
      );

      if (hasActiveChild) {
        activeDropdowns[key] = true;
      }
    });

    setOpenDropdown((previous) => ({
      ...previous,
      ...activeDropdowns,
    }));
  }, [pathname, menuItems]);

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const renderedMenu = useMemo(() => {
    return menuItems.map((item, index) => {
      const key = getMenuKey(item, index);
      const hasChildren = Boolean(item.children?.length);
      const isDropdownOpen = Boolean(openDropdown[key]);
      const isActive = isMenuActive(item);

      return (
        <li key={key} className="relative">
          {hasChildren ? (
            <>
              <button
                type="button"
                onClick={() => handleDropdown(key)}
                aria-expanded={isDropdownOpen}
                aria-controls={`${key}-submenu`}
                title={!isExpanded ? item.name : undefined}
                className={`sidebar-menu-item group relative flex w-full items-center rounded-xl border px-2.5 py-2 text-left transition-all duration-200 ${
                  isActive
                    ? "border-teal-500/30 bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-lg shadow-black/10"
                    : "border-transparent text-teal-50 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute -left-2 h-7 w-1 rounded-r-full bg-amber-400" />
                )}

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-white/[0.06] text-teal-100 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`ml-3 min-w-0 flex-1 truncate text-sm font-semibold transition-all duration-200 ${
                    isExpanded
                      ? "visible translate-x-0 opacity-100"
                      : "invisible w-0 -translate-x-2 opacity-0"
                  }`}
                >
                  {item.name}
                </span>

                {isExpanded && (
                  <ExpandMore
                    className={`!text-[21px] text-teal-100 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}

                {!isExpanded && (
                  <span className="sidebar-tooltip pointer-events-none absolute left-[72px] z-[100] hidden whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl group-hover:block group-hover:opacity-100">
                    {item.name}
                  </span>
                )}
              </button>

              <div
                id={`${key}-submenu`}
                className={`grid transition-all duration-300 ease-in-out ${
                  isDropdownOpen && isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="relative ml-7 mt-1 space-y-1 border-l border-teal-700/70 pb-1 pl-5 pt-1">
                    {item.children.map((child, childIndex) => {
                      const isChildActive = isRouteActive(
                        child.link,
                        child.exact
                      );

                      return (
                        <li
                          key={
                            child.id ||
                            `${child.name}-${childIndex}-${child.link}`
                          }
                        >
                          <Link
                            href={child.link}
                            onClick={closeMobileSidebar}
                            className={`group/child relative flex min-h-10 items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                              isChildActive
                                ? "bg-white/10 font-semibold text-white shadow-sm"
                                : "text-teal-100 hover:bg-white/[0.06] hover:text-white"
                            }`}
                          >
                            <span
                              className={`absolute -left-[23px] h-2.5 w-2.5 rounded-full border-2 transition-all duration-200 ${
                                isChildActive
                                  ? "border-amber-300 bg-amber-400"
                                  : "border-teal-700 bg-teal-950 group-hover/child:border-teal-400"
                              }`}
                            />

                            {child.icon && (
                              <span className="mr-2 flex shrink-0 items-center">
                                {child.icon}
                              </span>
                            )}

                            <span className="truncate">{child.name}</span>

                            {child.badge && (
                              <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <Link
              href={item.link}
              onClick={closeMobileSidebar}
              title={!isExpanded ? item.name : undefined}
              className={`sidebar-menu-item group relative flex items-center rounded-xl border px-2.5 py-2 transition-all duration-200 ${
                isActive
                  ? "border-teal-500/30 bg-gradient-to-r from-teal-700 to-teal-800 text-white shadow-lg shadow-black/10"
                  : "border-transparent text-teal-50 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute -left-2 h-7 w-1 rounded-r-full bg-amber-400" />
              )}

              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-white/[0.06] text-teal-100 group-hover:bg-white/10 group-hover:text-white"
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`ml-3 min-w-0 flex-1 truncate text-sm font-semibold transition-all duration-200 ${
                  isExpanded
                    ? "visible translate-x-0 opacity-100"
                    : "invisible w-0 -translate-x-2 opacity-0"
                }`}
              >
                {item.name}
              </span>

              {isExpanded && item.badge && (
                <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {item.badge}
                </span>
              )}

              {!isExpanded && (
                <span className="sidebar-tooltip pointer-events-none absolute left-[72px] z-[100] hidden whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl group-hover:block group-hover:opacity-100">
                  {item.name}
                </span>
              )}
            </Link>
          )}
        </li>
      );
    });
  }, [menuItems, pathname, openDropdown, isExpanded]);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={closeMobileSidebar}
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${
          mobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar fixed bottom-0 left-0 top-16 z-50 flex w-[272px] flex-col border-r border-white/10 bg-gradient-to-b from-teal-950 via-teal-950 to-slate-950 text-white shadow-2xl transition-all duration-300 ease-in-out lg:z-40 ${
          isExpanded ? "lg:w-[272px]" : "lg:w-[84px]"
        } ${
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        {/* Sidebar header */}
        <div className="relative flex min-h-[78px] items-center border-b border-white/10 px-3">
          <div
            className={`flex min-w-0 flex-1 items-center gap-3 overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "visible opacity-100"
                : "lg:invisible lg:w-0 lg:opacity-0"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-lg font-black text-teal-950 shadow-lg shadow-amber-500/10">
              {title.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">
                Management Portal
              </p>

              <h2 className="truncate text-base font-bold text-white">
                {title}
              </h2>
            </div>
          </div>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
            }
            className={`hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-teal-100 transition-all duration-200 hover:bg-white/10 hover:text-white lg:flex ${
              !isExpanded ? "mx-auto" : ""
            }`}
          >
            {sidebarOpen ? (
              <ChevronLeft fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )}
          </button>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/10 lg:hidden"
          >
            <Close fontSize="small" />
          </button>
        </div>

        {/* Navigation heading */}
        <div
          className={`relative overflow-hidden px-4 pb-2 pt-5 transition-all duration-300 ${
            isExpanded ? "opacity-100" : "lg:h-4 lg:p-0 lg:opacity-0"
          }`}
        >
          <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-teal-400">
            Main Navigation
          </p>
        </div>

        {/* Navigation menu */}
        <nav className="sidebar-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden px-2.5 pb-5">
          <ul className="space-y-1.5">{renderedMenu}</ul>
        </nav>

        {/* Sidebar footer */}
        <div className="relative border-t border-white/10 p-3">
          <div
            className={`overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] transition-all duration-300 ${
              isExpanded
                ? "max-h-28 p-3 opacity-100"
                : "max-h-0 p-0 opacity-0"
            }`}
          >
            <div className="flex items-start gap-2">
              <HelpOutlined className="mt-0.5 !text-[18px] text-amber-300" />

              <div>
                <p className="text-xs font-semibold text-white">
                  Need assistance?
                </p>

                <p className="mt-1 text-[11px] leading-4 text-teal-200">
                  Contact the system administrator for technical support.
                </p>
              </div>
            </div>
          </div>

          {!isExpanded && (
            <div className="hidden justify-center lg:flex">
              <button
                type="button"
                title="Help and support"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-teal-100 transition hover:bg-white/10 hover:text-white"
              >
                <HelpOutlined fontSize="small" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Dashboard header */}
      <DashboardHeader
        title={title}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Mobile menu button */}
      {/* <button
        type="button"
        onClick={toggleMobileSidebar}
        aria-label="Open sidebar"
        className="fixed left-4 top-[76px] z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 lg:hidden"
      >
        <Menu fontSize="small" />
      </button> */}

      {/* Main page content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ease-in-out ${
          isExpanded ? "lg:ml-[272px]" : "lg:ml-[84px]"
        }`}
      >
        <div className="min-h-[calc(100vh-4rem)] w-full">{children}</div>
      </main>

      <style jsx global>{`
        .dashboard-sidebar {
          will-change: width, transform;
        }

        .sidebar-menu-item {
          min-height: 52px;
        }

        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(94, 234, 212, 0.3) transparent;
        }

        .sidebar-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(94, 234, 212, 0.3);
          border-radius: 999px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 234, 212, 0.5);
        }

        @media (max-width: 1023px) {
          main {
            margin-left: 0 !important;
          }

          .dashboard-sidebar .sidebar-tooltip {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;