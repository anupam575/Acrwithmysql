import {
  DashboardRounded,
  GroupsRounded,
  EventBusyRounded,
  PendingActionsRounded,
  TaskAltRounded,
} from "@mui/icons-material";

export const hrMenu = [
  {
    name: "Dashboard",
    icon: <DashboardRounded fontSize="small" />,
    link: "/hr",
  },

  // Single route → Direct link
  {
    name: "Employees",
    icon: <GroupsRounded fontSize="small" />,
    link: "/hr/employee",
  },

  
];