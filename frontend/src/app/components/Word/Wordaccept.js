"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import API from "../../../utils/axiosInstance";

import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TextRun,
  HeadingLevel,
  VerticalAlign,
} from "docx";

const AcceptanceDashboard = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) {
      fetchData();
    }
  }, [employeeId]);

  const fetchData = async () => {
    try {
      const res = await API.get(
        `/accept/employee/acceptanceid/${employeeId}`
      );

      setData(res?.data?.data || []);
    } catch (error) {
      console.error(error);
      setData([]);
    }
  };

  const safeValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };
const createRow = (label, value) =>
  new TableRow({
    children: [
      // ================= LABEL CELL =================
      new TableCell({
        width: {
          size: 30,
          type: WidthType.PERCENTAGE,
        },

        verticalAlign: VerticalAlign.CENTER,

        shading: {
          fill: "E8EDF5", // Premium Light Blue Grey
        },

        margins: {
          top: 140,
          bottom: 140,
          left: 160,
          right: 160,
        },

        children: [
          new Paragraph({
            spacing: {
              before: 0,
              after: 0,
            },

            alignment: AlignmentType.LEFT,

            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 22, // 11 pt
                font: "Calibri",
                color: "1F1F1F",
              }),
            ],
          }),
        ],
      }),

      // ================= VALUE CELL =================
      new TableCell({
        width: {
          size: 70,
          type: WidthType.PERCENTAGE,
        },

        verticalAlign: VerticalAlign.CENTER,

        margins: {
          top: 140,
          bottom: 140,
          left: 160,
          right: 160,
        },

        children: [
          new Paragraph({
            spacing: {
              before: 0,
              after: 0,
            },

            alignment: AlignmentType.LEFT,

            children: [
              new TextRun({
                text: safeValue(value),
                size: 22, // 11 pt
                font: "Calibri",
                color: "333333",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  useImperativeHandle(ref, () => ({
    getDocContent: () => {
      const content = [];

      content.push(
        new Paragraph({
          text: "SECTION V – ACCEPTANCE",
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 300,
          },
        })
      );

      if (data.length === 0) {
        content.push(
          new Paragraph({
            text: "No Acceptance Records Found.",
          })
        );

        return content;
      }

      data.forEach((item, index) => {
        content.push(
          new Paragraph({
            text: `Record ${index + 1}`,
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
              after: 200,
            },
          })
        );


        const table = new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },

  alignment: AlignmentType.CENTER,

  borders: {
    top: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "A6A6A6",
    },
    bottom: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "A6A6A6",
    },
    left: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "A6A6A6",
    },
    right: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "A6A6A6",
    },
    insideHorizontal: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "D9D9D9",
    },
    insideVertical: {
      style: BorderStyle.SINGLE,
      size: 1,
      color: "D9D9D9",
    },
  },

  rows: [
    createRow(
      "Overall Grade Consistency",
      item?.overallGradeConsistent
    ),

    createRow(
      "Agreement with Remarks",
      item?.agreeWithRemarks
    ),

    createRow(
      "Difference of Opinion",
      item?.differenceOpinion
    ),

    createRow(
      "Overall Grade",
      item?.overallGrade
    ),

    createRow(
      "Name & Designation",
      item?.acceptingAuthorityNameDesignation
    ),

    createRow(
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
            spacing: {
              after: 300,
            },
          })
        );
      });

      return content;
    },
  }));

  return (
    <div>
      {/* <h2>Section V – Acceptance</h2> */}
    </div>
  );
});

AcceptanceDashboard.displayName = "AcceptanceDashboard";

export default AcceptanceDashboard;