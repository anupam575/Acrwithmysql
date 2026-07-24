"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
} from "docx";
import API from "../../../utils/axiosInstance";
import { AlignmentType } from "docx";
import { VerticalAlign } from "docx";
const AparView = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) {
      fetchApar();
    }
  }, [employeeId]);

  const fetchApar = async () => {
    try {
      const res = await API.get(`/reporter/report/${employeeId}`);

      setData(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
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
            after: 120,
          },
          children: [
            new TextRun({
              text: "SECTION III – Reporting Authority",
              bold: true,
              size: 28, // 14pt
              font: "Calibri",
              color: "1F4E79",
            }),
          ],
        }),
      );

      if (!data.length) {
        children.push(
          new Paragraph({
            text: "No Data Available",
          }),
        );

        return children;
      }

      data.forEach((item, index) => {
        children.push(
          new Paragraph({
            text: `Record ${index + 1}`,
            heading: "Heading2",
          }),
        );

        const fields = [
          ["Financial Year", item?.financialYear],
          ["Section 1", item?.section1],
          ["Section 2", item?.section2],
          ["Section 3", item?.section3],
          ["Section 4", item?.section4],
          ["Section 5", item?.section5],
          ["Pen Picture", item?.penPicture],
          ["Overall Grade", item?.overallGrade],
          // ["Designation", item?.designation],
          [
            "Reporting Officer",
            `${item?.reportingOfficerId?.firstName || ""} ${
              item?.reportingOfficerId?.lastName || ""
            }`,
          ],
          [
            "Department",
            item?.reportingOfficerId?.department?.department_name || "-",
          ],
          [
            "Reporting Date",
            item?.reportingDate
              ? new Date(item.reportingDate).toLocaleDateString("en-IN")
              : "-",
          ],
        ];
        children.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            rows: fields.map(([label, value]) => createRow(label, value)),
          }),
        );
        const mou = item?.section6?.mou || {};
        children.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            rows: [
              createRow("MOU Weightage", mou.weightage),
              createRow("Reporting Absolute", mou.reportingAbsolute),
              createRow("Reporting Weighted", mou.reportingWeighted),
              createRow("Initials", mou.initials),
            ],
          }),
        );

        (item?.section6?.tasks || []).forEach((task, index) => {
          children.push(
            new Paragraph({
              text: `Task ${index + 1}`,
              heading: HeadingLevel.HEADING_3,
            }),
          );

          children.push(
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                createRow("Task Name", task?.taskName),
                createRow("Weightage", task?.weightage),
                createRow("Reporting Absolute", task?.reportingAbsolute),
                createRow("Reporting Weighted", task?.reportingWeighted),
                createRow("Initials", task?.initials),
              ],
            }),
          );
        });

        children.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            rows: [
              createRow("Total Weightage", item.section6?.totalWeightage),
              createRow(
                "Total Reporting Absolute",
                item.section6?.totalReportingAbsolute,
              ),
              createRow(
                "Total Reporting Weighted",
                item.section6?.totalReportingWeighted,
              ),
              createRow("Grand Weightage", item.section6?.grandWeightage),
              createRow(
                "Grand Reporting Absolute",
                item.section6?.grandReportingAbsolute,
              ),
              createRow(
                "Grand Reporting Weighted",
                item.section6?.grandReportingWeighted,
              ),
            ],
          }),
        );

        /* =======================
           INTEGRITY
        ======================= */

        children.push(
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },

            rows: [
              createRow("Beyond Doubt", item.integrity?.beyondDoubt),
              createRow("Doubtful", item.integrity?.doubtful),
              createRow("Nothing Adverse", item.integrity?.nothingAdverse),
            ],
          }),
        );

        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 200,
              after: 120,
            },
            children: [
              new TextRun({
                text: "Section 7 - Competencies",
                bold: true,
                size: 28, // 14pt
                font: "Calibri",
                color: "1F4E79",
              }),
            ],
          }),
        );
        children.push(
          new Table({
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
              // ================= HEADER =================
              new TableRow({
                children: [
                  new TableCell({
                    shading: {
                      fill: "D9EAD3",
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Sl No",
                            bold: true,
                            size: 24,
                            font: "Calibri",
                          }),
                        ],
                      }),
                    ],
                  }),

                  new TableCell({
                    shading: {
                      fill: "D9EAD3",
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Competency",
                            bold: true,
                            size: 24,
                            font: "Calibri",
                          }),
                        ],
                      }),
                    ],
                  }),

                  new TableCell({
                    shading: {
                      fill: "D9EAD3",
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Reporting Authority",
                            bold: true,
                            size: 24,
                            font: "Calibri",
                          }),
                        ],
                      }),
                    ],
                  }),

                  new TableCell({
                    shading: {
                      fill: "D9EAD3",
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Initials",
                            bold: true,
                            size: 24,
                            font: "Calibri",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              // ================= DATA =================
              ...(item?.section7 || []).map(
                (comp) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: String(comp?.slNo ?? "-"),
                                size: 22,
                                font: "Calibri",
                              }),
                            ],
                          }),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: String(comp?.competency ?? "-"),
                                size: 22,
                                font: "Calibri",
                              }),
                            ],
                          }),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: String(comp?.reportingAuthority ?? "-"),
                                size: 22,
                                font: "Calibri",
                              }),
                            ],
                          }),
                        ],
                      }),

                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: String(comp?.initials ?? "-"),
                                size: 22,
                                font: "Calibri",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
              ),
            ],
          }),
        );

        children.push(
          new Table({
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
              createRow("Total", item?.summary?.total),
              createRow("Overall", item?.summary?.overall),
            ],
          }),
        );
        children.push(new Paragraph({ text: "" }));
      });

      return children;
    },
  }));

  return <></>;
});

AparView.displayName = "AparView";

export default AparView;
