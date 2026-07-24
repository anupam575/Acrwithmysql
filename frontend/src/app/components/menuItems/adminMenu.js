import {
  DashboardRounded,
  AdminPanelSettingsRounded,
  BadgeRounded,
  SecurityRounded,
  WorkOutlineRounded,
  CategoryRounded,
  ApartmentRounded,
  GroupsRounded,
} from "@mui/icons-material";

export const adminMenu = [
  {
    name: "Dashboard",
    icon: <DashboardRounded fontSize="small" />,
    link: "/admin",
  },

  {
    name: "Admin Setup",
    icon: <AdminPanelSettingsRounded fontSize="small" />,
    children: [
      {
        name: "Role Master",
        icon: <SecurityRounded fontSize="small" />,
        link: "/admin/role",
      },
      {
        name: "Designation Master",
        icon: <BadgeRounded fontSize="small" />,
        link: "/admin/designation",
      },
      {
        name: "Category Level",
        icon: <CategoryRounded fontSize="small" />,
        link: "/admin/create-category",
      },
      {
        name: "Department Level",
        icon: <ApartmentRounded fontSize="small" />,
        link: "/admin/department",
      },
    ],
  },

  {
    name: "Users",
    icon: <GroupsRounded fontSize="small" />,
    link: "/admin/allusers",
  },
];