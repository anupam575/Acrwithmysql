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
  HeadingLevel,
  VerticalAlign,
} from "docx";

const EmployeeReviewHistory = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) {
      fetchReviewHistory();
    }
  }, [employeeId]);

  const fetchReviewHistory = async () => {
    try {
      const res = await API.get(`/review/employee/${employeeId}`);
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
            top: 120,
            bottom: 120,
            left: 120,
            right: 120,
          },
          children: [
            new Paragraph({
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
            top: 120,
            bottom: 120,
            left: 120,
            right: 120,
          },
          children: [
            new Paragraph({
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
      const content = [];

      content.push(
        new Paragraph({
          text: "SECTION IV – Review History",
          heading: HeadingLevel.HEADING_1,
          spacing: {
            after: 300,
          },
        })
      );

      if (data.length === 0) {
        content.push(
          new Paragraph({
            text: "No Review History Found.",
          })
        );

        return content;
      }

      data.forEach((item, index) => {
        content.push(
          new Paragraph({
            text: `Review ${index + 1}`,
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

          borders: {
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
          },

          rows: [
            createRow(
              "Reviewing Officer",
              `${item?.reviewingOfficerId?.firstName || ""} ${
                item?.reviewingOfficerId?.lastName || ""
              }`.trim()
            ),

            createRow(
              "Department",
              item?.reviewingOfficerId?.department?.department_name
            ),

            createRow(
              "Current Financial Year",
              item?.currentFinancialYear
            ),

            createRow(
              "Assessment Agree 1",
              item?.assessmentAgree1
            ),

            createRow(
              "Assessment Agree 2",
              item?.assessmentAgree2
            ),

            createRow(
              "Difference Reason",
              item?.differenceReason
            ),

            createRow(
              "Pen Picture Comments",
              item?.penPictureComments
            ),

            createRow(
              "Overall Grade",
              item?.overallGrade
            ),

            createRow(
              "Name & Designation",
              item?.nameDesignation
            ),

            createRow(
              "Created Date",
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
      <h2>SECTION IV – Review History</h2>
    </div>
  );
});

EmployeeReviewHistory.displayName = "EmployeeReviewHistory";

export default EmployeeReviewHistory;