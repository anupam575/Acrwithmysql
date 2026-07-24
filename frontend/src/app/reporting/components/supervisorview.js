"use client";

import { forwardRef, useImperativeHandle, useEffect, useState } from "react";

import { Paragraph, TextRun } from "docx";

import API from "../../../utils/axiosInstance";

const SupervisorDetailsView = forwardRef(({ employeeId }, ref) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (employeeId) {
      fetchDetails();
    }
  }, [employeeId]);

  const fetchDetails = async () => {
    try {
        const response = await API.get(`/supervisors/view/${employeeId}`);

      setData(res.data.data || []);
    } catch (err) {
      console.log("Details API Error:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    getDocContent: () => {
      const children = [];

      children.push(
        new Paragraph({
          text: "SECTION III - Achievement / Performance Details",

          heading: "Heading1",
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
          ["Financial Year", item.financialYear],

          ["Category", item.category?.name],

          ["Tasks", item.tasks],

          ["Name", item.name],

          ["Designation", item.designation],

          ["Achievements", item.achievements],

          ["Shortfalls", item.shortfalls],

          ["Higher Achievements", item.higherAchievements],

          ["Place", item.place],

          [
            "Date",
            item.date ? new Date(item.date).toLocaleDateString("en-IN") : "-",
          ],

          [
            "Reporting Officer",
            item.reportingOfficerId?.firstName || item.reportingOfficer || "-",
          ],

          ["Department", item.department || "-"],

          [
            "Created At",
            item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-IN")
              : "-",
          ],

          [
            "Updated At",
            item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString("en-IN")
              : "-",
          ],
        ];

        fields.forEach(([label, value]) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${label}: `,

                  bold: true,
                }),

                new TextRun({
                  text: String(value ?? "-"),
                }),
              ],
            }),
          );
        });

        // Officer Signature

        if (item.officerSignature?.originalName) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Officer Signature: ${item.officerSignature.originalName}`,

                  bold: true,
                }),
              ],
            }),
          );
        }

        children.push(
          new Paragraph({
            text: "",
          }),
        );
      });

      return children;
    },
  }));

  return null;
});

SupervisorDetailsView.displayName = "SupervisorDetailsView";

export default SupervisorDetailsView;
