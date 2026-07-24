"use client";
import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
  VerticalAlign,
  TableLayoutType,
  BorderStyle,
} from "docx";
import { forwardRef, useImperativeHandle, useEffect, useState } from "react";


import API from "../../../utils/axiosInstance";

const EmployeeDetailsView = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) {
      fetchMOUData();
    }
  }, [employeeId]);
  const fetchMOUData = async () => {
    try {
      const response = await API.get(`/self-appraisal/viewer/${employeeId}`);

      setData(response.data.data || []);
    } catch (error) {
      console.log("MOU API Error:", error);
    }
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
      after: 140,
    },

    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        font: "Calibri",
        color: "1F4E79",
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
        margins: {
          top: 140,
          bottom: 140,
          left: 150,
          right: 150,
        },
        shading: {
          fill: "EAEAEA",
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
                color: "000000",
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
          left: 150,
          right: 150,
        },
        children: [
          new Paragraph({
            spacing: {
              before: 0,
              after: 0,
            },
            children: [
              new TextRun({
                text: String(value ?? "-"),
                size: 22,
                font: "Calibri",
                color: "000000",
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
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 200,
          after: 250,
        },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "SECTION II - MOU / Annual Performance Report",
            bold: true,
            size: 32,
            font: "Calibri",
            color: "1F4E79",
          }),
        ],
      })
    );

    if (!data) {
      children.push(
        new Paragraph({
          text: "No MOU Data Available",
        })
      );

      return children;
    }

    const item = data;

    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 120,
        },
        children: [
          new TextRun({
            text: "MOU Details",
            bold: true,
            size: 28,
            font: "Calibri",
            color: "1F4E79",
          }),
        ],
      })
    );

    const fields = [
      ["Financial Year", item.currentFinancialYear],
      ["Category", item.category?.name],
      ["Responsibilities", item.responsibilities],
      ["MOU Weightage", item.mouWeightage],
      ["MOU Deliverables", item.mouDeliverables],
      ["MOU Achievement", item.mouAchievement],
      ["Total Task Weightage", item.totalTaskWeightage],
      ["Exceptional Contribution", item.exceptionalContribution],
      ["Constraints", item.constraints],
      ["Current Assignment Training", item.currentAssignmentTraining],
      ["Future Career Training", item.futureCareerTraining],
      [
        "Immovable Property Return Filed",
        item.immovablePropertyReturnFiled ? "Yes" : "No",
      ],
      [
        "Medical Checkup Done",
        item.medicalCheckupDone ? "Yes" : "No",
      ],
      [
        "Annual Work Plan Set",
        item.annualWorkPlanSetForOfficers ? "Yes" : "No",
      ],
      [
        "Calculated Task Weightage",
        item.calculatedTotalTaskWeightage,
      ],
      ["Grand Total", item.calculatedGrandTotal],
      ["Reporting Officer", item.reportingOfficerId?.firstName],
      ["Department", item.department?.department_name],
      [
        "Property Return Date",
        item.immovablePropertyReturnDate
          ? new Date(
              item.immovablePropertyReturnDate
            ).toLocaleDateString("en-IN")
          : "-",
      ],
      [
        "Created At",
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-IN")
          : "-",
      ],
    ];

    children.push(
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        layout: TableLayoutType.FIXED,
        borders: tableBorders,
        rows: fields.map(([label, value]) =>
          createRow(label, value)
        ),
      })
    );

    children.push(createHeading("Tasks"));

    if (item.tasks?.length) {
      item.tasks.forEach((task, i) => {
        children.push(
          new Paragraph({
            spacing: {
              before: 180,
              after: 80,
            },
            children: [
              new TextRun({
                text: `Task ${i + 1}`,
                bold: true,
                size: 24,
                font: "Calibri",
                color: "1F4E79",
              }),
            ],
          })
        );

        children.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            layout: TableLayoutType.FIXED,
            borders: tableBorders,
            rows: [
              createRow("Task Name", task.taskName),
              createRow("Weightage", task.weightage),
              createRow("Deliverables", task.deliverables),
              createRow("Achievement", task.achievement),
            ],
          })
        );
      });
    } else {
      children.push(
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          layout: TableLayoutType.FIXED,
          borders: tableBorders,
          rows: [
            createRow("Tasks", "No Tasks Available"),
          ],
        })
      );
    }

    children.push(createHeading("Officer Signature"));

    children.push(
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        layout: TableLayoutType.FIXED,
        borders: tableBorders,
        rows: [
          createRow(
            "Signature File",
            item.officerSignature?.originalName ||
              "Not Uploaded"
          ),
        ],
      })
    );

    children.push(
      new Paragraph({
        spacing: {
          after: 350,
        },
      })
    );

    return children;
  },
}));
  return null;
});

EmployeeDetailsView.displayName = "EmployeeDetailsView ";

export default EmployeeDetailsView;
