"use client";
import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  VerticalAlign,
} from "docx";
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import API from "../../../utils/axiosInstance";

const DetailProfile = forwardRef(({ userId }, ref) => {
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
      console.log(err);
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
    alignment: AlignmentType.CENTER,
    spacing: {
      before: 200,
      after: 250,
    },
    children: [
      new TextRun({
        text: "SECTION I – Basic Information",
        bold: true,
        size: 32,
        font: "Calibri",
        color: "1F4E79",
      }),
    ],
  })
);

      if (!profile) {
       children.push(
  new Paragraph({
    children: [
      new TextRun({
        text: "No Profile Data Available",
        italics: true,
        color: "808080",
        size: 22,
        font: "Calibri",
      }),
    ],
  })
);

        return children;
      }

     const fields = [
  ["Employee Code", profile.employeeCode],
  ["Employee Name", profile.EmployeeName],
  ["Email", profile.email],
  ["Phone Number", profile.phoneNumber],
  [
    "Date of Birth",
    profile.dateOfBirth
      ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN")
      : "-"
  ],
  ["Academic Qualification", profile.academicProfessionalQualifications],

  ["Current Grade", profile.currentPost?.grade],
  ["Current Pay Scale", profile.currentPost?.payScale],
  [
    "Current Appointment Date",
    profile.currentPost?.nsfdcAppointmentDate
      ? new Date(profile.currentPost.nsfdcAppointmentDate).toLocaleDateString("en-IN")
      : "-"
  ],

  [
    "First Public Enterprise Appointment",
    profile.firstPublicEnterpriseAppointment?.date
      ? new Date(profile.firstPublicEnterpriseAppointment.date).toLocaleDateString("en-IN")
      : "-"
  ],
  [
    "First Public Enterprise Pay Scale",
    profile.firstPublicEnterpriseAppointment?.payScale
  ],

  ["Designation", profile.designation?.name],
  ["Category", profile.category?.name],

  ["Officers Not Reported PAR", profile.officersNotReportedPAR],
  ["Property Return Year", profile.propertyReturnYear],
  [
    "Property Return Date",
    profile.propertyReturnDate
      ? new Date(profile.propertyReturnDate).toLocaleDateString("en-IN")
      : "-"
  ],
];
      children.push(createHeading("Employee Details"));

children.push(
  new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },

    alignment: AlignmentType.CENTER,

    borders: tableBorders,

    rows: fields.map(([label, value]) =>
      createRow(label, value)
    ),
  })
);

children.push(
  new Paragraph({
    spacing: {
      after: 250,
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

DetailProfile.displayName = "DetailProfile";

export default DetailProfile;