"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
} from "@/icons/index";
import { BoxIcon, Settings, BarChart2, Workflow } from "lucide-react";
import { masterApis, subscriptionApis } from "@/utils/api/api";
import { useAppStore } from "@/utils/store/store";
import { Crown, ArrowUpCircle } from "lucide-react";

type NavItem = {
  id?: number | string;
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { id?: number | string; name: string; path: string; pro?: boolean; new?: boolean }[];
};

const othersItems: NavItem[] = [
  {
    id: "charts",
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { id: "line-chart", name: "Line Chart", path: "/line-chart", pro: false },
      { id: "bar-chart", name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    id: "ui-elements",
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { id: "alerts", name: "Alerts", path: "/alerts", pro: false },
      { id: "avatars", name: "Avatar", path: "/avatars", pro: false },
      { id: "badge", name: "Badge", path: "/badge", pro: false },
      { id: "buttons", name: "Buttons", path: "/buttons", pro: false },
      { id: "images", name: "Images", path: "/images", pro: false },
      { id: "videos", name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    id: "auth",
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { id: "signin", name: "Sign In", path: "/signin", pro: false },
      { id: "signup", name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const setMenu = useAppStore((state) => state.setMenu);
  const menuData = useAppStore((state) => state.menu);
  const { getMenu } = masterApis;

  const [subscription, setSubscription] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  //getting menus
  const fetchMenus = async () => {
    try {
      const response = await getMenu();
      setMenu(response.data);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    }
  };

  const fetchSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const response = await subscriptionApis.getActiveSubscription();
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchSubscription();
  }, []);

  const getIconForMenu = (menuName: string) => {
    switch (menuName) {
      case "Dashboard":
        return <GridIcon />;
      case "Master":
        return <BoxIcon />;
      case "Workflow":
        return <Workflow />;
      case "Report":
        return <BarChart2 />;
      default:
        return <Settings />;
    }
  };

  const navItems: NavItem[] = React.useMemo(() => {
    if (!menuData || !Array.isArray(menuData)) return [];

    // Deduplicate menuData by ID just in case the API returns duplicates or store has duplicates
    const uniqueMenuMap = new Map();
    menuData.forEach((item: any) => {
      if (item && item.id) {
        uniqueMenuMap.set(item.id, item);
      }
    });
    const uniqueMenuData = Array.from(uniqueMenuMap.values());

    const parents = uniqueMenuData
      .filter((item: any) => item.parentId === null)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

    return parents.map((parent: any) => {
      const children = uniqueMenuData
        .filter((item: any) => item.parentId === parent.id)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      const navItem: NavItem = {
        id: parent.id,
        name: parent.menuName,
        icon: getIconForMenu(parent.menuName),
        path: parent.path,
      };

      if (children.length > 0) {
        navItem.subItems = children.map((child: any) => ({
          id: child.id,
          name: child.menuName,
          path: child.path,
          pro: false,
        }));
      }

      return navItem;
    });
  }, [menuData]);

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {navItems.map((nav, index) => (
        <li key={nav.id || `${nav.name}-${index}`}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${nav.subItems?.some((subItem) => isActive(subItem.path))
                ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-md"
                : "text-gray-700 hover:bg-brand-25 hover:text-brand-800"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
            >
              {/* Left accent bar on hover */}
              <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 opacity-0 transition-all group-hover:h-6 group-hover:opacity-100" />
              <span
                className={`${nav.subItems?.some((subItem) => isActive(subItem.path))
                  ? "text-white"
                  : "text-brand-600 group-hover:text-brand-700"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="flex-1 text-left">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "rotate-180"
                    : ""
                    } ${nav.subItems?.some((subItem) => isActive(subItem.path))
                      ? "text-white"
                      : "text-gray-400 group-hover:text-brand-600"
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive(nav.path)
                  ? "bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-md"
                  : "text-gray-700 hover:bg-brand-25 hover:text-brand-800"
                  } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-brand-500 opacity-0 transition-all group-hover:h-6 group-hover:opacity-100" />
                <span
                  className={`${isActive(nav.path) ? "text-white" : "text-brand-600 group-hover:text-brand-700"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="flex-1 text-left">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-9 mt-1 space-y-0.5 border-l-2 border-brand-200/50 pl-3">
                {nav.subItems.map((subItem, subIndex) => (
                  <li key={subItem.id || `${subItem.name}-${subIndex}`}>
                    <Link
                      href={subItem.path}
                      className={`group relative flex items-center rounded-lg px-3 py-2 text-sm transition-all ${isActive(subItem.path)
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-gray-600 hover:bg-brand-25/50 hover:text-brand-700"
                        }`}
                    >
                      <span className="absolute -left-[17px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-200 transition-all group-hover:scale-110 group-hover:bg-brand-400" />
                      {subItem.name}
                      {subItem.new && (
                        <span className="ml-2 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          pro
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col transition-all duration-300 ease-in-out 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main sidebar container with premium borders */}
      <div className="relative flex h-full flex-col bg-white shadow-theme-md">
        {/* Multi-layer borders */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-brand-300 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-[1px] w-px bg-brand-200/30" />

        {/* Right accent bar */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 via-brand-400 to-brand-300 opacity-0 transition-opacity duration-300 group-hover/sidebar:opacity-100" />

        {/* Subtle background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, #346739 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-25/40 via-transparent to-transparent" />

        {/* Logo section */}
        <div className="relative z-10 px-5 py-6">
          <div
            className={`flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
          >
            <Link href="/" className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-brand-400/20 to-transparent opacity-0 blur transition-opacity group-hover:opacity-100" />
              {isExpanded || isHovered || isMobileOpen ? (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 shadow-md">
                    <Image
                      src="/images/logo/logo.png"
                      alt="Logo"
                      width={24}
                      height={24}
                      className="brightness-0 invert"
                    />
                  </div>
                  <span className="text-lg font-bold text-brand-800">PlantNest</span>
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 shadow-md">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex-1 overflow-y-auto px-3 custom-scrollbar">
          <nav className="py-2">
            <div>
              <h2
                className={`mb-3 flex text-xs font-semibold uppercase tracking-wider text-brand-600 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start px-2"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-1 rounded-full bg-brand-400" />
                    Menu
                  </span>
                ) : (
                  <HorizontaLDots className="text-brand-400" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </nav>
        </div>

        {/* Subscription section */}
        <div className="relative z-10 border-t border-brand-100 bg-brand-25/30 px-3 py-4">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-brand-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                      Active Plan
                    </span>
                    <span className="text-sm font-bold text-brand-900">
                      {isLoadingSubscription
                        ? "Loading..."
                        : (subscription?.plan?.name || "No active plan")}
                    </span>
                  </div>
                </div>
              </div>

              {subscription?.plan?.name !== "PREMIUM" && (
                <Link
                  href="/pricing"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-brand-200"
                >
                  <ArrowUpCircle className="h-4 w-4" />
                  Upgrade Plan
                </Link>
              )}

              <div className="px-1 text-[10px] text-gray-500">
                Next billing: {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : "-"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/pricing"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 transition-colors hover:bg-brand-100"
                title={isLoadingSubscription ? "Loading..." : `Active Plan: ${subscription?.plan?.name || "None"}`}
              >
                <Crown className="h-5 w-5" />
              </Link>
              {subscription?.plan?.name !== "PREMIUM" && (
                <Link
                  href="/pricing"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm"
                  title="Upgrade Plan"
                >
                  <ArrowUpCircle className="h-5 w-5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;