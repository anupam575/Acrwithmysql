import {
  DashboardRounded,
  AccountCircleRounded,
  AssignmentRounded,
  AssessmentRounded,
} from "@mui/icons-material";

export const empMenu = [
  {
    name: "Dashboard",
    icon: <DashboardRounded fontSize="small" />,
    link: "/employee",
  },

  {
    name: "Profile",
    icon: <AccountCircleRounded fontSize="small" />,
    link: "/employee/basic",
  },

  {
    name: "Self Appraisal Form",
    icon: <AssignmentRounded fontSize="small" />,
    link: "/employee/allapprisal",
  },

  {
    name: "Self Appraisal Status",
    icon: <AssessmentRounded fontSize="small" />,
    link: "/employee/apprisalstatus",
  },
];