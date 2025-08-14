"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/Sidebar";
import {
  IconHome,
  IconHeartHandshake,
  IconTruckDelivery,
  IconMapPin,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconShieldCheck,
  IconSalad,
  IconCoinRupee
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Img } from "react-image";
import { cn } from "../../lib/utils";
import { Box, Modal, Fade } from "@mui/material";
import FoodDonationRequestForm from "../ui/RequestForm"; 

export function FoodDistributionSidebar() {
  const [open, setOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/api/placeholder/50/50");
  const [userRole, setUserRole] = useState("guest");

  // Modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const handleOpenRequestModal = () => setIsRequestModalOpen(true);
  const handleCloseRequestModal = () => setIsRequestModalOpen(false);

  useEffect(() => {
    try {
      const userRoleFromStorage = localStorage.getItem("userRole");
      console.log(userRoleFromStorage);
      if (userRoleFromStorage) setUserRole(userRoleFromStorage);

      const user = localStorage.getItem("userData");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.avatar) setUserAvatar(userData.avatar);
      }
    } catch (error) {
      console.error("Error getting user data from storage:", error);
    }
  }, []);

  const commonLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Donate Food",
      href: "/donate",
      icon: <IconHeartHandshake className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Donate Money",
      href: "/donatemoney",
      icon: <IconCoinRupee className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Delivery Status",
      href: "/orderstatus",
      icon: <IconTruckDelivery className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Food Map",
      href: "/map",
      icon: <IconMapPin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Impact Reports",
      href: "/impact",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 group-hover:text-red-500" />,
      className: "group",
      labelClassName: "group-hover:text-red-500",
    },
  ];

  const links = [...commonLinks];

  if (userRole === "NGO" || userRole === "donor") {
    const donorNGOLink = {
      label: "Request for Food",
      onClick: handleOpenRequestModal,
      icon: <IconSalad className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200 group-hover:text-red-500" />,
      labelClassName: "font-medium text-emerald-600 dark:text-emerald-400",
    };

    const dashboardIndex = links.findIndex((link) => link.label === "Dashboard");
    links.splice(dashboardIndex + 1, 0, donorNGOLink);
  }

  if (userRole === "admin") {
    const adminLink = {
      label: "Admin Dashboard",
      href: "/admin",
      icon: <IconShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
      className: "bg-emerald-50 dark:bg-emerald-900/20",
      labelClassName: "font-medium text-emerald-600 dark:text-emerald-400",
    };

    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      links.splice(settingsIndex, 0, adminLink);
    } else {
      links.push(adminLink);
    }
  }

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <FoodShareLogo /> : <FoodShareIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={link.className || ""}
                  labelClassName={link.labelClassName || ""}
                  onClick={link.onClick} // 👈 Support modal-triggering
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userRole.charAt(0).toUpperCase() + userRole.slice(1),
                href: "/profile",
                icon: (
                  <Img
                    src={userAvatar}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Profile Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Modal */}
      <Modal
        open={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        closeAfterTransition
        keepMounted
      >
        <Fade in={isRequestModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "35rem",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <FoodDonationRequestForm handleClose={handleCloseRequestModal} />
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export const FoodShareLogo = () => (
  <Link
    to="/"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600">
      <Img src="/logo.png" className="h-5 w-5 text-white" alt="Logo" />
    </div>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre text-black dark:text-white"
    >
      FoodLoop
    </motion.span>
  </Link>
);

export const FoodShareIcon = () => (
  <Link
    to="/"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600">
      <Img src="/logo.png" className="h-5 w-5 text-white" alt="Logo" />
    </div>
  </Link>
);