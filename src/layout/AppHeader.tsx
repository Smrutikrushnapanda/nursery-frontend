"use client";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main header container with premium borders */}
      <div className="relative bg-white shadow-theme-sm">
        {/* Multi-layer borders */}
        <div className="absolute inset-0 border-b-2 border-brand-200/40" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent" />
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300" />
        
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-25/30 via-transparent to-brand-25/20" />

        <div className="relative flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          {/* Left section with toggle and logo */}
          <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:px-0 lg:py-4">
            {/* Sidebar Toggle Button */}
            <button
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-brand-200 bg-white text-brand-700 transition-all hover:border-brand-300 hover:bg-brand-50 hover:shadow-md lg:h-11 lg:w-11"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {isMobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.75 1C0.75 0.585786 1.08579 0.25 1.5 0.25H18.5C18.9142 0.25 19.25 0.585786 19.25 1C19.25 1.41421 18.9142 1.75 18.5 1.75H1.5C1.08579 1.75 0.75 1.41421 0.75 1ZM0.75 7C0.75 6.58579 1.08579 6.25 1.5 6.25H18.5C18.9142 6.25 19.25 6.58579 19.25 7C19.25 7.41421 18.9142 7.75 18.5 7.75H1.5C1.08579 7.75 0.75 7.41421 0.75 7ZM1.5 12.25C1.08579 12.25 0.75 12.5858 0.75 13C0.75 13.4142 1.08579 13.75 1.5 13.75H12C12.4142 13.75 12.75 13.4142 12.75 13C12.75 12.5858 12.4142 12.25 12 12.25H1.5Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>

            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 shadow-md">
                <Image
                  width={24}
                  height={24}
                  className="brightness-0 invert"
                  src="/images/logo/logo.png"
                  alt="Logo"
                />
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleApplicationMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-brand-200 bg-white text-brand-700 transition-all hover:border-brand-300 hover:bg-brand-50 lg:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block">
              <form>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="text-brand-500"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search or type command..."
                    className="h-11 w-full rounded-xl border-2 border-brand-200 bg-white py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 transition-all focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/20 xl:w-[430px]"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <div className="flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-25 px-2 py-1 text-xs font-medium text-brand-700">
                      <span>⌘</span>
                      <span>K</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right section with notifications and user dropdown */}
          <div
            className={`${
              isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:py-0`}
          >
            <div className="flex items-center gap-3">
              <NotificationDropdown />
            </div>
            <div className="h-8 w-px bg-brand-200/60 hidden lg:block" />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;