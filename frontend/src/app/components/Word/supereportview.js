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
                text: String(value ?? "-"),
                size: 22,
              }),
            ],
          }),
        ],
      }),
    ],
  });

const createHeaderCell = (text) =>
  new TableCell({
    shading: {
      fill: "D9EAD3",
    },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: 22,
          }),
        ],
      }),
    ],
  });

const createCell = (text) =>
  new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: String(text ?? "-"),
            size: 22,
          }),
        ],
      }),
    ],
  });

const ReportingOfficerDetail = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchReportingData = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/reporter/reporter/${employeeId}`
      );

      if (response.data.success) {
        const records = response.data.data || [];
        setData(records[records.length - 1] || {});
      }
    } catch (error) {
      console.error("Error fetching Reporting Officer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchReportingData();
    }
  }, [employeeId]);

  useImperativeHandle(ref, () => ({
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
              text: "SECTION II - Reporting Officer Detail",
              bold: true,
              size: 32,
              color: "1F4E79",
            }),
          ],
        })
      );
const fields = [
  ["Reporting Officer Name", data.reportingOfficerName],
  ["Designation", data.designation],
  [
    "Reporting Officer",
    `${data.reportingOfficerId?.firstName || ""} ${
      data.reportingOfficerId?.lastName || ""
    }`,
  ],
  [
    "Department",
    data.reportingOfficerId?.department?.department_name || "-",
  ],
  ["Financial Year", data.currentFinancialYear],
  ["Training Recommendation", data.trainingRecommendation],
  ["Official Language Work", data.officialLanguageWork],
  ["General Health", data.generalHealth],
  ["Integrity", data.integrity],
  ["Promotion Potential", data.promotionPotential],
  ["Other Career Field", data.otherCareerField],
  ["Total Marks", data.totalMarks],
  ["Place", data.place],
  ["Date", data.date?.split("T")[0]],
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
);children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 300,
      after: 200,
    },
    children: [
      new TextRun({
        text: "Career Development",
        bold: true,
        size: 26,
      }),
    ],
  })
);children.push(
  new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Career Field"),
        ],
      }),

      ...(data.careerDevelopment || []).map((item) =>
        new TableRow({
          children: [
            createCell(item),
          ],
        })
      ),
    ],
  })
);children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 300,
      after: 200,
    },
    children: [
      new TextRun({
        text: "Performance Factors",
        bold: true,
        size: 26,
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
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Factor"),
          createHeaderCell("Weightage"),
          createHeaderCell("Reporting Officer"),
        ],
      }),

      ...(data.performanceFactors || []).map((item) =>
        new TableRow({
          children: [
            createCell(item.label),
            createCell(item.weightage),
            createCell(item.reportingOfficer),
          ],
        })
      ),
    ],
  })
);children.push(
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 300,
      after: 200,
    },
    children: [
      new TextRun({
        text: "Other Aspects",
        bold: true,
        size: 26,
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
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          createHeaderCell("Aspect"),
          createHeaderCell("Weightage"),
          createHeaderCell("Reporting Officer"),
        ],
      }),

      ...(data.otherAspects || []).map((item) =>
        new TableRow({
          children: [
            createCell(item.label),
            createCell(item.weightage),
            createCell(item.reportingOfficer),
          ],
        })
      ),
    ],
  })
);
// children.push(
//   new Table({
//     width: {
//       size: 100,
//       type: WidthType.PERCENTAGE,
//     },
//     layout: TableLayoutType.FIXED,
//     borders: tableBorders,
//     rows: fields.map(([label, value]) =>
//       createRow(label, value)
//     ),
//   })
// );


      children.push(
        new Paragraph({
          spacing: {
            after: 300,
          },
        })
      );

      return children;
    },
  }));

  return null;
});

ReportingOfficerDetail.displayName = "ReportingOfficerDetail";

export default ReportingOfficerDetail;