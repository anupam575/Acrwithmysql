// export const buildAparPayload = (data) => {
//   const rows = [
//     "Effective communication skills",
//     "Strategic orientation and Decision making ability",
//     "Problem solving and Analytical ability",
//     "Ability to develop and motivate team members",
//     "Ability to coordinate and develop collaborative partnerships",
//     "Innovation and change orientation",
//     "Planning and Organizing",
//     "Result orientation",
//     "Business Acumen",
//     "Role based functional competency",
//   ];

//   const roman = [
//     "i.",
//     "ii.",
//     "iii.",
//     "iv.(b)",
//     "v.(b)",
//     "vi.",
//     "vii.",
//     "viii.",
//     "ix.",
//     "x.",
//   ];

//   const mouReportingWeighted =
//     (Number(data?.section6?.mou?.weightage || 0) *
//       Number(data?.section6?.mou?.reportingAbsolute || 0)) / 100;

//   const tasks = data?.section6?.tasks || [];

//   const totalWeightage = tasks.reduce(
//     (sum, task) => sum + Number(task?.weightage || 0),
//     0
//   );

//   const totalReportingAbsolute = tasks.reduce(
//     (sum, task) => sum + Number(task?.reportingAbsolute || 0),
//     0
//   );

//   const totalReportingWeighted = tasks.reduce(
//     (sum, task) =>
//       sum +
//       (Number(task?.weightage || 0) *
//         Number(task?.reportingAbsolute || 0)) /
//         10,
//     0
//   );

//   const grandWeightage =
//     Number(data?.section6?.mou?.weightage || 0) + totalWeightage;

//   const grandReportingAbsolute =
//     Number(data?.section6?.mou?.reportingAbsolute || 0) +
//     totalReportingAbsolute;

//   const grandReportingWeighted =
//     mouReportingWeighted + totalReportingWeighted;

//   const total = (data?.section7 || []).reduce(
//     (sum, item) => sum + Number(item?.reportingAuthority || 0),
//     0
//   );

//   const overall = Number((total / 4).toFixed(2));

//   return {
//     employeeId: data?.employeeId,   // 👈 IMPORTANT

//     section1: data?.section1,
//     section2: data?.section2,
//     section3: data?.section3,
//     section4: data?.section4,
//     section5: data?.section5,

//     section6: {
//       mou: {
//         weightage: data?.section6?.mou?.weightage,
//         reportingAbsolute: data?.section6?.mou?.reportingAbsolute,
//         initials: data?.section6?.mou?.initials,
//         reportingWeighted: mouReportingWeighted,
//       },

//       tasks: tasks.map((task) => ({
//         taskName: task.taskName,
//         weightage: task.weightage,
//         reportingAbsolute: task.reportingAbsolute,
//         initials: task.initials,
//         reportingWeighted:
//           (Number(task.weightage) * Number(task.reportingAbsolute)) / 10,
//       })),

//       totalWeightage,
//       totalReportingAbsolute,
//       totalReportingWeighted,

//       grandWeightage,
//       grandReportingAbsolute,
//       grandReportingWeighted,
//     },

//     section7: (data?.section7 || []).map((item, index) => ({
//       slNo: roman[index],
//       competency: rows[index],
//       reportingAuthority: Number(item?.reportingAuthority || 0),
//       initials: item?.initials || "",
//     })),

//     summary: {
//       total: Number(total.toFixed(2)),
//       overall,
//     },

//     integrity: {
//       beyondDoubt: data?.integrity?.beyondDoubt || "",
//       doubtful: data?.integrity?.doubtful || "",
//       nothingAdverse: data?.integrity?.nothingAdverse || "",
//     },

//     penPicture: data?.penPicture || "",
//     overallGrade: Number(data?.overallGrade || 0),
//     reportingDate: data?.reportingDate || "",
//     signature: data?.signature || "",
//     designation: data?.designation || "",
//   };
// };

export const buildAparPayload = (data) => {
  return {
    employeeId: data?.employeeId,

    section1: data?.section1,
    section2: data?.section2,
    section3: data?.section3,
    section4: data?.section4,
    section5: data?.section5,

    section6: {
      mou: {
        weightage: data?.section6?.mou?.weightage,
        reportingAbsolute: data?.section6?.mou?.reportingAbsolute,
        initials: data?.section6?.mou?.initials,
      },

      tasks: (data?.section6?.tasks || []).map((task) => ({
        taskName: task.taskName,
        weightage: task.weightage,
        reportingAbsolute: task.reportingAbsolute,
        initials: task.initials,
      })),
    },

    section7: (data?.section7 || []).map((item) => ({
reportingAuthority: Number(item?.reportingAuthority || 0),
      initials: item?.initials || "",
    })),

    summary: {},

    integrity: {
      beyondDoubt: data?.integrity?.beyondDoubt || "",
      doubtful: data?.integrity?.doubtful || "",
      nothingAdverse: data?.integrity?.nothingAdverse || "",
    },

    penPicture: data?.penPicture || "",
    overallGrade: data?.overallGrade || 0,
    reportingDate: data?.reportingDate || null,
    signature: data?.signature || "",
    designation: data?.designation || "",
  };
};