// "use client";

// import {
//   forwardRef,
//   useImperativeHandle,
//   useEffect,
//   useState,
// } from "react";

// import { Paragraph, TextRun } from "docx";
// import API from "../../../utils/axiosInstance";

// const EmployeeProfile = forwardRef(({ userId }, ref) => {
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     if (userId) {
//       fetchProfile();
//     }
//   }, [userId]);

//   const fetchProfile = async () => {
//     try {
//               const res = await API.get(`/employees/full/${userId}`);

//       setProfile(res.data.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     getDocContent: () => {
//       const children = [];

//       children.push(
//         new Paragraph({
//           text: "SECTION I – Basic Information",
//           heading: "Heading1",
//         })
//       );

//       if (!profile) {
//         children.push(
//           new Paragraph({
//             text: "No Profile Data",
//           })
//         );

//         return children;
//       }
// const fields = [
//   ["Employee Code", profile.employeeCode],
//   ["Employee Name", profile.employee_name],
//   ["Email", profile.email],
//   ["Phone Number", profile.phoneNumber],

//   [
//     "Date of Birth",
//     profile.date_of_birth
//       ? new Date(profile.date_of_birth).toLocaleDateString("en-IN")
//       : "-"
//   ],

//   [
//     "Date of Joining",
//     profile.date_of_joining
//       ? new Date(profile.date_of_joining).toLocaleDateString("en-IN")
//       : "-"
//   ],

//   [
//     "Date of Appointment",
//     profile.date_of_appointment
//       ? new Date(profile.date_of_appointment).toLocaleDateString("en-IN")
//       : "-"
//   ],

//   ["Pay Scale", profile.pay_scale],
//   ["Basic Pay", profile.basic_pay],

//   [
//     "Education Qualification",
//     profile.educationalProfessionalQualifications?.education
//       ?.map(
//         (item) =>
//           `${item.title} (${item.institution}, ${item.year})`
//       )
//       .join(", ")
//   ],

//   [
//     "Professional Qualification",
//     profile.educationalProfessionalQualifications?.professional
//       ?.map(
//         (item) =>
//           `${item.title} (${item.institution}, ${item.year})`
//       )
//       .join(", ")
//   ],

//   [
//     "Other Qualification Details",
//     profile.educationalProfessionalQualifications?.otherDetails
//   ],

//   [
//     "Basic Trainings",
//     profile.basicTrainings
//       ?.map(
//         (item) =>
//           `${item.name} - ${item.institute} (${new Date(
//             item.from
//           ).toLocaleDateString("en-IN")} to ${new Date(
//             item.to
//           ).toLocaleDateString("en-IN")})`
//       )
//       .join(", ")
//   ],

//   ["Role", profile.role?.role_name],
//   ["Category", profile.category?.name],
//   ["Designation", profile.designation?.name],

//   [
//     "Reporting Authority",
//     profile.authorities?.reporting
//       ?.map(
//         (item) =>
//           `${item.name} (${item.designation}, ${item.department})`
//       )
//       .join(", ")
//   ],

//   [
//     "Reviewing Authority",
//     profile.authorities?.reviewing
//       ?.map(
//         (item) =>
//           `${item.name} (${item.designation}, ${item.department})`
//       )
//       .join(", ")
//   ],

//   [
//     "Accepting Authority",
//     profile.authorities?.accepting
//       ?.map(
//         (item) =>
//           `${item.name} (${item.designation}, ${item.department})`
//       )
//       .join(", ")
//   ],

//   [
//     "Basic Leaves",
//     profile.basicLeaves
//       ?.map(
//         (item) =>
//           `${item.type} - ${item.reason} (${new Date(
//             item.from
//           ).toLocaleDateString("en-IN")} to ${new Date(
//             item.to
//           ).toLocaleDateString("en-IN")})`
//       )
//       .join(", ")
//   ],

//   ["Created By", profile.createdBy],
//   ["Updated By", profile.updatedBy],

//   [
//     "Created At",
//     profile.createdAt
//       ? new Date(profile.createdAt).toLocaleDateString("en-IN")
//       : "-"
//   ],

//   [
//     "Updated At",
//     profile.updatedAt
//       ? new Date(profile.updatedAt).toLocaleDateString("en-IN")
//       : "-"
//   ],
// ];
//       fields.forEach(([label, value]) => {
//         children.push(
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: `${label}: `,
//                 bold: true,
//               }),
//               new TextRun({
//                 text: value || "-",
//               }),
//             ],
//           })
//         );
//       });

    
//   const tableBorders = {
//     top: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//     bottom: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//     left: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//     right: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//     insideHorizontal: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//     insideVertical: {
//       style: BorderStyle.SINGLE,
//       size: 1,
//     },
//   };
  
//   const createHeading = (text) =>
//     new Paragraph({
//       heading: HeadingLevel.HEADING_2,
  
//       spacing: {
//         before: 220,
//         after: 140,
//       },
  
//       children: [
//         new TextRun({
//           text,
//           bold: true,
//           size: 28,
//           font: "Calibri",
//           color: "1F4E79",
//         }),
//       ],
//     });
//     const createRow = (label, value) =>
//     new TableRow({
//       children: [
//         new TableCell({
//           width: {
//             size: 30,
//             type: WidthType.PERCENTAGE,
//           },
//           verticalAlign: VerticalAlign.CENTER,
//           margins: {
//             top: 140,
//             bottom: 140,
//             left: 150,
//             right: 150,
//           },
//           shading: {
//             fill: "EAEAEA",
//           },
//           children: [
//             new Paragraph({
//               spacing: {
//                 before: 0,
//                 after: 0,
//               },
//               children: [
//                 new TextRun({
//                   text: label,
//                   bold: true,
//                   size: 22,
//                   font: "Calibri",
//                   color: "000000",
//                 }),
//               ],
//             }),
//           ],
//         }),
  
//         new TableCell({
//           width: {
//             size: 70,
//             type: WidthType.PERCENTAGE,
//           },
//           verticalAlign: VerticalAlign.CENTER,
//           margins: {
//             top: 140,
//             bottom: 140,
//             left: 150,
//             right: 150,
//           },
//           children: [
//             new Paragraph({
//               spacing: {
//                 before: 0,
//                 after: 0,
//               },
//               children: [
//                 new TextRun({
//                   text: String(value ?? "-"),
//                   size: 22,
//                   font: "Calibri",
//                   color: "000000",
//                 }),
//               ],
//             }),
//           ],
//         }),
//       ],
//     });

//       children.push(new Paragraph({ text: "" }));

//       return children;
//     },
//   }));

//   return (
//     <div>
//       {/* Existing UI */}
//     </div>
//   );
// });

// EmployeeProfile.displayName = "EmployeeProfile";

// export default EmployeeProfile;












"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";

import API from "../../../utils/axiosInstance";

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  VerticalAlign,
} from "docx";

const EmployeeProfile = forwardRef(({ userId }, ref) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/employees/full/${userId}`);
      setProfile(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const safeValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  const tableBorders = {
    top: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
    bottom: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
    left: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
    right: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
    insideHorizontal: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
    insideVertical: {
      style: BorderStyle.SINGLE,
      size: 1,
    },
  };

  const createHeading = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 220,
        after: 180,
      },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28,
          color: "1F4E79",
          font: "Calibri",
        }),
      ],
    });

  const createRow = (label, value) =>
    new TableRow({
      children: [
        new TableCell({
          width: {
            size: 30,
            type: WidthType.PERCENTAGE,
          },
          verticalAlign: VerticalAlign.CENTER,
          shading: {
            fill: "EAEAEA",
          },
          margins: {
            top: 140,
            bottom: 140,
            left: 140,
            right: 140,
          },
          children: [
            new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),

        new TableCell({
          width: {
            size: 70,
            type: WidthType.PERCENTAGE,
          },
          verticalAlign: VerticalAlign.CENTER,
          margins: {
            top: 140,
            bottom: 140,
            left: 140,
            right: 140,
          },
          children: [
            new Paragraph({
              spacing: {
                before: 0,
                after: 0,
              },
              children: [
                new TextRun({
                  text: safeValue(value),
                  size: 22,
                  font: "Calibri",
                }),
              ],
            }),
          ],
        }),
      ],
    });

  useImperativeHandle(ref, () => ({
    getDocContent: () => {
      const children = [];

      children.push(
        new Paragraph({
          text: "SECTION I – Basic Information",
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 250,
          },
        })
      );

      if (!profile) {
        children.push(
          new Paragraph({
            text: "No Profile Data",
          })
        );

        return children;
      }


            const fields = [
        ["Employee Code", profile.employeeCode],
        ["Employee Name", profile.employee_name],
        ["Email", profile.email],
        ["Phone Number", profile.phoneNumber],

        [
          "Date of Birth",
          profile.date_of_birth
            ? new Date(profile.date_of_birth).toLocaleDateString("en-IN")
            : "-",
        ],

        [
          "Date of Joining",
          profile.date_of_joining
            ? new Date(profile.date_of_joining).toLocaleDateString("en-IN")
            : "-",
        ],

        [
          "Date of Appointment",
          profile.date_of_appointment
            ? new Date(profile.date_of_appointment).toLocaleDateString("en-IN")
            : "-",
        ],

        ["Pay Scale", profile.pay_scale],
        ["Basic Pay", profile.basic_pay],

        [
          "Education Qualification",
          profile.educationalProfessionalQualifications?.education
            ?.map(
              (item) =>
                `${item.title} (${item.institution}, ${item.year})`
            )
            .join(", "),
        ],

        [
          "Professional Qualification",
          profile.educationalProfessionalQualifications?.professional
            ?.map(
              (item) =>
                `${item.title} (${item.institution}, ${item.year})`
            )
            .join(", "),
        ],

        [
          "Other Qualification Details",
          profile.educationalProfessionalQualifications?.otherDetails,
        ],

        [
          "Basic Trainings",
          profile.basicTrainings
            ?.map(
              (item) =>
                `${item.name} - ${item.institute} (${new Date(
                  item.from
                ).toLocaleDateString("en-IN")} to ${new Date(
                  item.to
                ).toLocaleDateString("en-IN")})`
            )
            .join(", "),
        ],

        ["Role", profile.role?.role_name],
        ["Category", profile.category?.name],
        ["Designation", profile.designation?.name],

        [
          "Reporting Authority",
          profile.authorities?.reporting
            ?.map(
              (item) =>
                `${item.name} (${item.designation}, ${item.department})`
            )
            .join(", "),
        ],

        [
          "Reviewing Authority",
          profile.authorities?.reviewing
            ?.map(
              (item) =>
                `${item.name} (${item.designation}, ${item.department})`
            )
            .join(", "),
        ],

        [
          "Accepting Authority",
          profile.authorities?.accepting
            ?.map(
              (item) =>
                `${item.name} (${item.designation}, ${item.department})`
            )
            .join(", "),
        ],

        [
          "Basic Leaves",
          profile.basicLeaves
            ?.map(
              (item) =>
                `${item.type} - ${item.reason} (${new Date(
                  item.from
                ).toLocaleDateString("en-IN")} to ${new Date(
                  item.to
                ).toLocaleDateString("en-IN")})`
            )
            .join(", "),
        ],

        ["Created By", profile.createdBy],
        ["Updated By", profile.updatedBy],

        [
          "Created At",
          profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("en-IN")
            : "-",
        ],

        [
          "Updated At",
          profile.updatedAt
            ? new Date(profile.updatedAt).toLocaleDateString("en-IN")
            : "-",
        ],
      ];

      children.push(createHeading("Employee Details"));

      const table = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        borders: tableBorders,
        rows: fields.map(([label, value]) =>
          createRow(label, value)
        ),
      });

      children.push(table);

      children.push(
        new Paragraph({
          text: "",
          spacing: {
            after: 300,
          },
        })
      );

      return children;
    },
  }));

  return (
    <div>
      {/* Existing UI */}
    </div>
  );
});

EmployeeProfile.displayName = "EmployeeProfile";

export default EmployeeProfile;