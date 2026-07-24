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

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";

import API from "../../../utils/axiosInstance";

const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1 },
  bottom: { style: BorderStyle.SINGLE, size: 1 },
  left: { style: BorderStyle.SINGLE, size: 1 },
  right: { style: BorderStyle.SINGLE, size: 1 },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
  insideVertical: { style: BorderStyle.SINGLE, size: 1 },
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
        shading: {
          fill: "EAEAEA",
        },
        margins: {
          top: 140,
          bottom: 140,
          left: 150,
          right: 150,
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label,
                bold: true,
                size: 22,
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
            children: [
              new TextRun({
                text: String(value ?? "-"),
                size: 22,
              }),
            ],
          }),
        ],
      }),
    ],
  });
const SupDetailsView = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSupervisorDetails = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/supervisors/details/${employeeId}`
      );

      if (response.data.success) {
        setData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching supervisor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchSupervisorDetails();
    }
  }, [employeeId]);

  useImperativeHandle(
    ref,
    () => ({
      getData: () => data,

      getDocContent: () => {
        const children = [];

        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 200,
              after: 250,
            },
            children: [
              new TextRun({
                text: "SECTION II - Supervisor Details",
                bold: true,
                size: 32,
                color: "1F4E79",
              }),
            ],
          })
        );

        if (!data.length) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "No Supervisor Details Available",
                  size: 22,
                }),
              ],
            })
          );

          return children;
        }

        data.forEach((item, index) => {
          children.push(
            createHeading(`Supervisor Details ${index + 1}`)
          );

          const fields = [
            ["Name", item.name],
            ["Designation", item.designation],
            ["Reporting Officer", item.reportingOfficer],
            ["Department", item.department],
            ["Financial Year", item.financialYear],
            ["Tasks", item.tasks],
            ["Achievements", item.achievements],
            ["Shortfalls", item.shortfalls],
            ["Higher Achievements", item.higherAchievements],
            ["Place", item.place],
            ["Date", item.date ? item.date.split("T")[0] : "-"],
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

          children.push(
            new Paragraph({
              spacing: {
                after: 300,
              },
            })
          );
        });

        return children;
      },
    }),
    [data]
  );

  return null;
});

SupDetailsView.displayName = "SupDetailsView";

export default SupDetailsView;