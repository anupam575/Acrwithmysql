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

const Supaccept = forwardRef(({ employeeId }, ref) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (employeeId) {
            fetchReviewHistory();
        }
    }, [employeeId]);

    const fetchReviewHistory = async () => {
        try {
            const res = await API.get(
                `/accept/employeer/acceptanceid/${employeeId}`
            );

            console.log("API Response:", res.data);

            if (res.data.success) {
                const acceptanceData = Array.isArray(res.data.data)
                    ? res.data.data
                    : res.data.data
                        ? [res.data.data]
                        : [];

                setData(acceptanceData);
            } else {
                setData([]);
            }
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
            console.log("Export Data:", data);

            const content = [];

            content.push(
                new Paragraph({
                    text: "SECTION V – Acceptance Form",
                    heading: HeadingLevel.HEADING_1,
                    spacing: {
                        after: 300,
                    },
                })
            );

            if (data.length === 0) {
                content.push(
                    new Paragraph({
                        text: "No Acceptance Record Found.",
                    })
                );

                return content;
            }

            data.forEach((item, index) => {
                content.push(
                    new Paragraph({
                        text: `Acceptance ${index + 1}`,
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
                        createRow("Financial Year", item.currentFinancialYear),
                        createRow("Acceptance Assessment", item.acceptingAssessment),
                        createRow("Acceptance Total Score", item.acceptingTotalScore),
                        createRow("Acceptance Remarks", item.acceptingRemarks),
                        createRow(
                            "Acceptance Date",
                            item.acceptingDate
                                ? new Date(item.acceptingDate).toLocaleDateString("en-GB")
                                : "-"
                        ),
                        createRow("Acceptance Place", item.acceptingPlace),
                        createRow("Acceptance Name", item.acceptingName),
                        createRow(
                            "Acceptance Designation",
                            item.acceptingDesignation
                        ),
                        createRow(
                            "Accepting Authority ID",
                            item.acceptingAuthorityId
                        ),
                        createRow(
                            "Officer Signature",
                            item.officerSignature?.originalName
                        ),
                        createRow(
                            "Created At",
                            item.createdAt
                                ? new Date(item.createdAt).toLocaleString("en-GB")
                                : "-"
                        ),
                        createRow(
                            "Updated At",
                            item.updatedAt
                                ? new Date(item.updatedAt).toLocaleString("en-GB")
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
            <h2>SECTION V – Acceptance Form</h2>
        </div>
    );
});

Supaccept.displayName = "Supaccept";

export default Supaccept;