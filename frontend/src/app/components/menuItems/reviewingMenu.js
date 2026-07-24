import {
  DashboardRounded,
  GroupsRounded,
  RateReviewRounded,
  PendingActionsRounded,
  TaskAltRounded,
} from "@mui/icons-material";

export const reviewingMenu = [
  {
    name: "Dashboard",
    icon: <DashboardRounded fontSize="small" />,
    link: "/reviewing",
  },

  // Single route → Direct link
  {
    name: "Employees",
    icon: <GroupsRounded fontSize="small" />,
    link: "/reviewing/allemp",
  },
 

  // Multiple routes → Children
 
];