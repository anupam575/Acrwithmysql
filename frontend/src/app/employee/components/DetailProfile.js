// components/DetailProfiling.jsx

"use client";

import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function DetailProfiling({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (userId) {
      fetchEmployeeProfile();
    }
  }, [userId]);

  ////////////////////////////////////////////////////////////

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/employees/full/${userId}`);
      setUser(res.data?.data || null);
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  ////////////////////////////////////////////////////////////

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  ////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />
            <h2 className="text-base font-bold text-slate-900">Loading Employee Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while employee details are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-lg font-bold text-red-700">
              !
            </div>
            <h2 className="text-base font-bold text-red-700">No Profile Found</h2>
            <p className="mt-1 text-sm text-slate-500">
              Employee profile details are not currently available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        {/* HEADER */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="border-b border-slate-200 bg-[#0b3a6f] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <img
                    src={
                      user.recentPhotograph?.url
                        ? `http://localhost:4000${user.recentPhotograph.url}`
                        : "/profile.png"
                    }
                    alt="profile"
                    className="h-24 w-24 rounded-lg border-2 border-white/30 object-cover shadow-md sm:h-28 sm:w-28"
                  />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-[#0b3a6f] bg-emerald-400" />
                </div>

                <div className="min-w-0 text-white">
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active Employee Profile
                  </div>

                  <h1 className="mt-2 break-words text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                    {user.EmployeeName  ?? "-"}
                  </h1>

                  <p className="mt-1.5 break-all text-xs text-blue-100 sm:text-sm">
                    {user.email ?? "-"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge label="Role" value={user.role?.role_name} />
                    <Badge label="Designation" value={user.designation?.name} />
                    <Badge label="Category" value={user.category?.name} />
                  </div>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-2 rounded-lg border border-white/20 bg-white/10 p-3 text-white lg:w-[340px]">
                <MiniStat label="Employee Code" value={user.employeeCode} />
                <MiniStat label="Department" value={user.department?.name || user.department || "N/A"} />
                <MiniStat label="Status" value="Active" accent="text-emerald-300" />
                <MiniStat label="Updated" value={formatDate(user.updatedAt)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4 lg:p-6">
            <SummaryCard title="Employee Code" value={user.employeeCode} />
            <SummaryCard title="Employee Name" value={user.EmployeeName} />
            <SummaryCard title="Pay Scale" value={user.currentPost?.payScale} />
            <SummaryCard title="Property Return Year" value={user.propertyReturnYear} />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:items-start">
          <div className="space-y-4 xl:col-span-8">
            {/* BASIC */}
            <Card title="Basic Information" subtitle="Personal and service record details">
              <Row label="Employee Code" value={user.employeeCode} />
              <Row label="Date Of Birth" value={formatDate(user.dateOfBirth)} />
              <Row label="Academic Qualification" value={user.academicProfessionalQualifications} />
              <Row label="Officers Not Reported PAR" value={user.officersNotReportedPAR} />
              <Row label="Property Return Date" value={formatDate(user.propertyReturnDate)} />
              <Row label="Property Return Year" value={user.propertyReturnYear} />
              <Row
                label="Officer Signature"
                value={
                  user.officerSignature?.url ? (
                    <img
                      src={`http://localhost:4000${user.officerSignature.url}`}
                      alt="Officer Signature"
                      className="inline-block h-auto w-28 rounded-md border border-slate-200 bg-white p-2"
                    />
                  ) : (
                    "N/A"
                  )
                }
              />
              <Row label="Source" value={user.source} />
              <Row label="Created At" value={formatDate(user.createdAt)} />
              <Row label="Updated At" value={formatDate(user.updatedAt)} />
            </Card>

            {/* CURRENT POST */}
            <Card title="Current Post" subtitle="Present posting and appointment information">
              <Row label="Pay Scale" value={user.currentPost?.payScale} />
              <Row label="Grade" value={user.currentPost?.grade} />
              <Row label="NMDFC Appointment" value={formatDate(user.currentPost?.nsfdcAppointmentDate)} />
              {/* <Row label="Continuous Appointment" value={formatDate(user.currentPost?.continuousAppointmentDate)} /> */}
            </Card>

          

            {/* TRAININGS */}
            <ListCard
              title="Training Programs"
              subtitle="Training, institute and duration details"
              data={user.trainingPrograms}
              render={(item) => (
                <>
                  <Row label="Institute" value={item.institute} />
                  <Row label="Subject" value={item.subject} />
                  <Row label="From" value={formatDate(item.from)} />
                  <Row label="To" value={formatDate(item.to)} />
                </>
              )}
            />

            {/* ABSENCE */}
            <ListCard
              title="Absence Records"
              subtitle="Leave and absence details"
              data={user.absenceRecords}
              render={(item) => (
                <>
                  <Row label="Category" value={item.category} />
                  <Row label="Leave Type" value={item.leaveType} />
                  <Row label="Specify" value={item.specify} />
                  <Row label="Remarks" value={item.remarks} />
                  <Row label="From" value={formatDate(item.from)} />
                  <Row label="To" value={formatDate(item.to)} />
                </>
              )}
            />
          </div>

          <aside className="space-y-4 xl:sticky xl:top-4 xl:col-span-4">
            {/* FIRST APPOINTMENT */}
            <Card title="First Public Enterprise Appointment" subtitle="Initial appointment record">
              <Row label="Pay Scale" value={user.firstPublicEnterpriseAppointment?.payScale} />
              <Row label="Date" value={formatDate(user.firstPublicEnterpriseAppointment?.date)} />
            </Card>

            {/* PERSONNEL */}
            {/* <Card title="Personnel Officer" subtitle="Assigned personnel officer details">
              <Row label="Name" value={user.personnelOfficer?.name} />
              <Row label="Designation" value={user.personnelOfficer?.designation} />
            </Card> */}

            {/* MEDICAL */}
            {/* <Card title="Medical Examination" subtitle="Medical verification details">
              <Row label="Report Summary" value={user.medicalExamination?.reportSummary} />
              <Row label="Date" value={formatDate(user.medicalExamination?.date)} />
              <Row
                label="Medical Report"
                value={
                  user.medicalExamination?.reportDocument?.url ? (
                    <a
                      href={`http://localhost:4000${user.medicalExamination.reportDocument.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800"
                    >
                      View Report (PDF)
                    </a>
                  ) : (
                    "N/A"
                  )
                }
              />
            </Card> */}

            {/* AWARDS */}
            <ListCard
              title="Awards"
              subtitle="Awards and recognition"
              data={user.awards}
              render={(item) => (
                <>
                  <Row label="Title" value={item.title} />
                  <Row label="Description" value={item.description} />
                  <Row label="Year" value={item.year} />
                </>
              )}
            />
          </aside>
        </div>

        {/* AUTHORITIES */}
        <Card title="Authorities" subtitle="Reporting, reviewing and accepting authority mapping">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <AuthoritySection title="Reporting Authority" data={user.authorities?.reporting} formatDate={formatDate} />
            <AuthoritySection title="Reviewing Authority" data={user.authorities?.reviewing} formatDate={formatDate} />
            <AuthoritySection title="Accepting Authority" data={user.authorities?.accepting} formatDate={formatDate} />
          </div>
        </Card>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Employee Profile Record • Performance Appraisal Management System
        </footer>
      </div>
    </div>
  );
}

const Card = ({ title, subtitle, children }) => (
  <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
      <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>}
      </div>
    </div>

    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

const Row = ({ label, value }) => (
  <div className="grid grid-cols-1 gap-1 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-12 sm:gap-4">
    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:col-span-5">
      {label}
    </span>
    <span className="min-w-0 break-words text-sm font-semibold leading-5 text-slate-900 sm:col-span-7 sm:text-right">
      {value ?? "-"}
    </span>
  </div>
);

const Badge = ({ label, value }) => (
  <div className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold text-white">
    <span className="text-blue-100/80">{label}:</span>
    <span>{value || "-"}</span>
  </div>
);

const ListCard = ({ title, subtitle, data = [], render }) => (
  <Card title={title} subtitle={subtitle}>
    {data.length > 0 ? (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white"
          >
            <div className="mb-2 inline-flex rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Record {index + 1}
            </div>
            {render(item)}
          </div>
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </Card>
);

const AuthoritySection = ({ title, data = [], formatDate }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
      {title}
    </h3>

    {data.length > 0 ? (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
            <Row label="Name" value={item.name} />
            <Row label="Designation" value={item.designation} />
            <Row label="From" value={formatDate(item.from)} />
            <Row label="To" value={formatDate(item.to)} />
          </div>
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </div>
);

const Empty = () => (
  <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-400">
    No Records Found
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white">
    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-blue-800 ring-1 ring-slate-200">
      {title?.charAt(0)}
    </div>
    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">{title}</div>
    <div className="mt-1.5 min-h-6 break-words text-base font-bold text-slate-950">{value || "-"}</div>
  </div>
);

const MiniStat = ({ label, value, accent = "text-white" }) => (
  <div className="min-w-0 rounded-md bg-white/5 p-2.5">
    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-100/70">{label}</div>
    <div className={`mt-1 break-words text-xs font-bold ${accent}`}>{value || "-"}</div>
  </div>
);