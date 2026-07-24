// "use client";

// import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import API from "../../../utils/axiosInstance";

// /* ===========================
//    EXPORT TEMPLATE COMPONENT
// =========================== */
// const AcceptanceDashboardExport = ({ data }) => {
//   const item = data?.[0] || {};

//   return (
//     <div style={{ fontFamily: "Arial", fontSize: "12px" }}>
//       {/* HEADER */}
//       <table style={{ width: "100%", marginBottom: "15px" }}>
//         <tbody>
//           <tr>
//             <td style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}>
//               Section V – Acceptance by the Accepting Authority
//             </td>
//           </tr>
//           <tr>
//             <td style={{ textAlign: "center", fontSize: "11px", paddingTop: "5px" }}>
//               (Please read the relevant instruction attached to this form before filling up this section)
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Q1 */}
//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
//         <tbody>
//           <tr>
//             <td style={{ padding: "6px" }}>
//               <b>
//                 1. Is the overall grade given by the Reporting/Reviewing Authority consistent with the pen picture?
//               </b>
//             </td>
//           </tr>
//           <tr>
//             <td style={{ padding: "6px", border: "1px solid #000" }}>
//               {item?.overallGradeConsistent || ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Q2 */}
//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
//         <tbody>
//           <tr>
//             <td style={{ padding: "6px" }}>
//               <b>2. Do you agree with the remarks of Reporting/Reviewing Authorities?</b>
//             </td>
//           </tr>
//           <tr>
//             <td style={{ padding: "6px", border: "1px solid #000" }}>
//               {item?.agreeWithRemarks || ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Q3 */}
//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
//         <tbody>
//           <tr>
//             <td style={{ padding: "6px" }}>
//               <b>
//                 3. Difference of opinion (if any) with reasons
//               </b>
//             </td>
//           </tr>
//           <tr>
//             <td
//               style={{
//                 padding: "10px",
//                 border: "1px solid #000",
//                 minHeight: "80px",
//                 whiteSpace: "pre-wrap",
//               }}
//             >
//               {item?.differenceOpinion || ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Q4 */}
//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
//         <tbody>
//           <tr>
//             <td style={{ padding: "6px" }}>
//               <b>
//                 4. Overall grade out of 100 (weighted calculation)
//               </b>
//             </td>
//           </tr>
//           <tr>
//             <td style={{ padding: "6px", border: "1px solid #000" }}>
//               {item?.overallGrade || ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* SIGNATURE */}
//       <table style={{ width: "100%", marginTop: "30px" }}>
//         <tbody>
//           <tr>
//             <td>
//               <b>Signature of Accepting Authority</b>
//               <span style={{ marginLeft: "20px" }}>__________________________</span>
//             </td>
//           </tr>

//           <tr>
//             <td style={{ paddingTop: "15px" }}>
//               <b>Name & Designation</b>
//             </td>
//           </tr>

//           <tr>
//             <td>{item?.acceptingAuthorityNameDesignation || ""}</td>
//           </tr>

//           <tr>
//             <td style={{ paddingTop: "15px" }}>
//               <b>Date:</b>{" "}
//               {item?.createdAt
//                 ? new Date(item.createdAt).toLocaleDateString("en-IN")
//                 : ""}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// /* ===========================
//    MAIN COMPONENT
// =========================== */
// const AcceptanceDashboard = forwardRef(({ employeeId }, ref) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (employeeId) fetchAcceptance();
//   }, [employeeId]);

//   const fetchAcceptance = async () => {
//     try {
//       const res = await API.get(
//         `/accept/employee/acceptanceid/${employeeId}`
//       );
//       setData(res?.data?.data || []);
//     } catch (err) {
//       console.error("Acceptance Fetch Error:", err);
//       setData([]);
//     }
//   };

//   /* ===========================
//      EXPORT FUNCTION (DOCX)
//   =========================== */
//   const handleExport = () => {
//     const htmlContent = document.getElementById("acceptance-export");
//     if (htmlContent) {
//       exportDocx(htmlContent.innerHTML, "Acceptance_Dashboard");
//     }
//   };

//   /* expose function to parent */
//   useImperativeHandle(ref, () => ({
//     exportAcceptance: handleExport,
//   }));

//   return (
//     <div>
//       {/* hidden export container */}
//       <div id="acceptance-export" style={{ display: "none" }}>
//         <AcceptanceDashboardExport data={data} />
//       </div>

//       {/* optional visible UI */}
//       <button onClick={handleExport}>Export DOCX</button>
//     </div>
//   );
// });

// AcceptanceDashboard.displayName = "AcceptanceDashboard";

// export default AcceptanceDashboard;














// "use client";

// import {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";

// import API from "../../../utils/axiosInstance";
// import { Paragraph, TextRun } from "docx";

// const AcceptanceDashboard = forwardRef(({ employeeId }, ref) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (employeeId) {
//       fetchData();
//     }
//   }, [employeeId]);

//   const fetchData = async () => {
//     try {
//       const res = await API.get(
//         `/accept/employee/acceptanceid/${employeeId}`
//       );

//       setData(res?.data?.data || []);
//     } catch (err) {
//       console.error(err);
//       setData([]);
//     }
//   };

//   // Parent ke liye DOCX content expose
//   useImperativeHandle(ref, () => ({
//     getDocContent: () => {
//       const children = [];

//       children.push(
//         new Paragraph({
//           text: "SECTION V – Acceptance",
//           heading: "Heading1",
//         })
//       );

//       data.forEach((item, index) => {
//         children.push(
//           new Paragraph({
//             text: `Record ${index + 1}`,
//             heading: "Heading2",
//           })
//         );

//         const fields = [
//           ["Overall Grade Consistency", item?.overallGradeConsistent],
//           ["Agreement with Remarks", item?.agreeWithRemarks],
//           ["Difference of Opinion", item?.differenceOpinion],
//           ["Overall Grade", item?.overallGrade],
//           [
//             "Name & Designation",
//             item?.acceptingAuthorityNameDesignation,
//           ],
//           [
//             "Date",
//             item?.createdAt
//               ? new Date(item.createdAt).toLocaleDateString("en-IN")
//               : "-",
//           ],
//         ];

//         fields.forEach(([label, value]) => {
//           children.push(
//             new Paragraph({
//               children: [
//                 new TextRun({
//                   text: `${label}: `,
//                   bold: true,
//                 }),
//                 new TextRun({
//                   text: value || "-",
//                 }),
//               ],
//             })
//           );
//         });

//         children.push(new Paragraph({ text: "" }));
//       });

//       return children;
//     },
//   }));

//   return (
//     <div>
//       <h2>Section V – Acceptance</h2>
//     </div>
//   );
// });

// AcceptanceDashboard.displayName = "AcceptanceDashboard";

// export default AcceptanceDashboard;





"use client";

import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import API from "../../../utils/axiosInstance";

import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TextRun,
  AlignmentType,
} from "docx";

const AcceptanceDashboard = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) fetchData();
  }, [employeeId]);

  const fetchData = async () => {
    try {
      const res = await API.get(
        `/accept/employee/acceptanceid/${employeeId}`
      );
      setData(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  // 🔥 SAFE VALUE CONVERTER (IMPORTANT FIX)
  const safeValue = (val) => {
    if (val === null || val === undefined) return "-";
    return String(val);
  };

  // 🔥 PROFESSIONAL ROW DESIGN
  const makeRow = (label, value) => {
    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: "F2F2F2" },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: safeValue(label),
                  bold: true,
                  size: 22,
                }),
              ],
            }),
          ],
        }),

        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: safeValue(value),   // 🔥 FIX HERE (IMPORTANT)
                  size: 22,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  useImperativeHandle(ref, () => ({
    getDocContent: () => {
      const content = [];

      // 🔥 TITLE
      content.push(
        new Paragraph({
          text: "SECTION V – ACCEPTANCE",
          heading: "Heading1",
          spacing: { after: 300 },
        })
      );

      data.forEach((item, index) => {
        content.push(
          new Paragraph({
            text: `Record ${index + 1}`,
            heading: "Heading2",
            spacing: { after: 200, before: 200 },
          })
        );

        const table = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },

          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 },
          },

          rows: [
            makeRow("Overall Grade Consistency", item?.overallGradeConsistent),
            makeRow("Agreement with Remarks", item?.agreeWithRemarks),
            makeRow("Difference of Opinion", item?.differenceOpinion),

            // 🔥 MAIN FIX HERE
            makeRow("Overall Grade", item?.overallGrade),

            makeRow(
              "Name & Designation",
              item?.acceptingAuthorityNameDesignation
            ),

            makeRow(
              "Date",
              item?.createdAt
                ? new Date(item.createdAt).toLocaleDateString("en-IN")
                : "-"
            ),
          ],
        });

        content.push(table);

        content.push(
          new Paragraph({
            text: "",
            spacing: { after: 300 },
          })
        );
      });

      return content;
    },
  }));

  return (
    <div>
      <h2>Section V – Acceptance</h2>
    </div>
  );
});

AcceptanceDashboard.displayName = "AcceptanceDashboard";

export default AcceptanceDashboard;