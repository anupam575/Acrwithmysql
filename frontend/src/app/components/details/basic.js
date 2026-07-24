"use client";

import { useEffect, useMemo, useState } from "react";
import API from "../../../utils/axiosInstance";

export default function EmployeeProfileing({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (userId) {
      fetchEmployee();
    }
  }, [userId]);

  ////////////////////////////////////////////////////////////

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/employees/full/${userId}`);
      setUser(res.data?.data || null);
    } catch (error) {
      console.log("EMPLOYEE PROFILE ERROR:", error);
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

  const basicInfo = useMemo(
    () => [
      { label: "Employee Code", value: user?.employeeCode },
      { label: "Pay Scale", value: user?.pay_scale },
      { label: "Basic Pay", value: user?.basic_pay },
      { label: "Date Of Birth", value: formatDate(user?.date_of_birth) },
      { label: "Date Of Joining", value: formatDate(user?.date_of_joining) },
      { label: "Date Of Appointment", value: formatDate(user?.date_of_appointment) },
      { label: "Source", value: user?.source },
      { label: "Created At", value: formatDate(user?.createdAt) },
      { label: "Updated At", value: formatDate(user?.updatedAt) },
    ],
    [user]
  );

  ////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />
            <h2 className="mt-4 text-base font-bold text-slate-900">Loading Employee Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while employee profile details are being retrieved.
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
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-lg font-bold text-red-700">
              !
            </div>
            <h2 className="mt-4 text-base font-bold text-red-700">No Employee Data Found</h2>
            <p className="mt-1 text-sm text-slate-500">
              Employee profile data is not currently available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  ////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1440px] min-w-0 space-y-4 sm:space-y-5">
        {/* PROFILE HERO */}
        <section className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="min-w-0 bg-[#0b3a6f] p-4 text-white sm:p-5 lg:p-6">
            <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative mx-auto shrink-0 sm:mx-0">
                  <div className="h-24 w-24 overflow-hidden rounded-lg border-2 border-white/30 bg-slate-100 shadow-md sm:h-28 sm:w-28">
                    <img
                      src={user.profilePic || "/profile.png"}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md border-2 border-[#0b3a6f] bg-emerald-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:left-auto sm:right-[-10px] sm:translate-x-0">
                    Active
                  </span>
                </div>

                <div className="min-w-0 text-center text-white sm:text-left">
                  <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Employee Profile
                  </span>

                  <h1 className="mt-2 break-words text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                    {user.employee_name || "-"}
                  </h1>

                  <p className="mt-1.5 break-all text-xs font-medium text-blue-100 sm:text-sm">
                    {user.email || "-"}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <Badge label="Role" value={user.role?.role_name} color="blue" />
                    <Badge label="Designation" value={user.designation?.name} color="green" />
                    <Badge label="Category" value={user.category?.name} color="purple" />
                  </div>
                </div>
              </div>

              <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[560px]">
                <StatBox label="Employee Code" value={user.employeeCode} />
                <StatBox label="Pay Scale" value={user.pay_scale} />
                <StatBox label="Basic Pay" value={user.basic_pay} />
                <StatBox label="Joined" value={formatDate(user.date_of_joining)} />
              </div>
            </div>
          </div>
        </section>

        {/* BASIC + SUMMARY */}
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="min-w-0 xl:col-span-8">
            <Card title="Basic Information" subtitle="Official employee service details">
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {basicInfo.map((item) => (
                  <InfoTile key={item.label} label={item.label} value={item.value} />
                ))}
              </div>

              <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Other Qualification Details</p>
                <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-800">
                  {user.educationalProfessionalQualifications?.otherDetails || "-"}
                </p>
              </div>
            </Card>
          </div>

          <div className="min-w-0 xl:col-span-4">
            <Card title="Quick Summary" subtitle="Profile status overview">
              <div className="space-y-3">
                <SummaryItem label="Role" value={user.role?.role_name} />
                <SummaryItem label="Designation" value={user.designation?.name} />
                <SummaryItem label="Category" value={user.category?.name} />
                <SummaryItem label="Email" value={user.email} />
              </div>
            </Card>
          </div>
        </div>

        {/* QUALIFICATIONS */}
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <ListCard
            title="Educational Qualifications"
            subtitle="Academic records and institutions"
            data={user.educationalProfessionalQualifications?.education}
            render={(item) => (
              <>
                <Row label="Title" value={item.title} />
                <Row label="Institution" value={item.institution} />
                <Row label="Year" value={item.year} />
              </>
            )}
          />

          <ListCard
            title="Professional Qualifications"
            subtitle="Professional certifications and records"
            data={user.educationalProfessionalQualifications?.professional}
            render={(item) => (
              <>
                <Row label="Title" value={item.title} />
                <Row label="Institution" value={item.institution} />
                <Row label="Year" value={item.year} />
              </>
            )}
          />
        </div>

        {/* TRAININGS / LEAVES */}
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <ListCard
            title="Basic Trainings"
            subtitle="Training programme history"
            data={user.basicTrainings}
            render={(item) => (
              <>
                <Row label="Training Name" value={item.name} />
                <Row label="Institute" value={item.institute} />
                <Row label="From" value={formatDate(item.from)} />
                <Row label="To" value={formatDate(item.to)} />
              </>
            )}
          />

          <ListCard
            title="Basic Leaves"
            subtitle="Leave and absence records"
            data={user.basicLeaves}
            render={(item) => (
              <>
                <Row label="Type" value={item.type} />
                <Row label="Reason" value={item.reason} />
                <Row label="Remarks" value={item.remarks} />
                <Row label="From" value={formatDate(item.from)} />
                <Row label="To" value={formatDate(item.to)} />
              </>
            )}
          />
        </div>

        {/* AUTHORITIES */}
        <Card title="Authorities" subtitle="Reporting, reviewing and accepting authority mapping">
          <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
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

////////////////////////////////////////////////////////////

const Card = ({ title, subtitle, children }) => (
  <section className="w-full min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex min-w-0 items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
      <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />
      <div className="min-w-0">
        <h2 className="break-words text-sm font-bold text-slate-900 sm:text-[15px]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>}
      </div>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

////////////////////////////////////////////////////////////

const InfoTile = ({ label, value }) => (
  <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</p>
    <p className="mt-1.5 break-all text-sm font-semibold leading-5 text-slate-900 sm:break-words">{value ?? "-"}</p>
  </div>
);

////////////////////////////////////////////////////////////

const Row = ({ label, value }) => (
  <div className="grid min-w-0 grid-cols-1 gap-1 border-b border-slate-100 py-2.5 last:border-0 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-4 md:grid-cols-[145px_minmax(0,1fr)]">
    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</span>
    <span className="min-w-0 break-all text-sm font-semibold leading-5 text-slate-800 sm:break-words sm:text-right">{value ?? "-"}</span>
  </div>
);

////////////////////////////////////////////////////////////

const Badge = ({ label, value, color = "blue" }) => {
  const colors = {
    blue: "border-white/20 bg-white/10 text-white",
    green: "border-white/20 bg-white/10 text-white",
    purple: "border-white/20 bg-white/10 text-white",
  };

  return (
    <div className={`inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${colors[color]}`}>
      <span className="shrink-0">{label}:</span>
      <span className="truncate">{value || "-"}</span>
    </div>
  );
};

////////////////////////////////////////////////////////////

const StatBox = ({ label, value }) => (
  <div className="min-w-0 rounded-md border border-white/20 bg-white/10 p-2.5 text-center">
    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-100/70">{label}</p>
    <p className="mt-1 truncate text-xs font-bold text-white sm:text-sm" title={value || "-"}>{value || "-"}</p>
  </div>
);

////////////////////////////////////////////////////////////

const SummaryItem = ({ label, value }) => (
  <div className="flex min-w-0 flex-col gap-1 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</span>
    <span className="min-w-0 break-all text-sm font-semibold text-slate-900 sm:break-words sm:text-right">{value || "-"}</span>
  </div>
);

////////////////////////////////////////////////////////////

const ListCard = ({ title, subtitle, data = [], render }) => (
  <Card title={title} subtitle={subtitle}>
    {data?.length > 0 ? (
      <div className="min-w-0 space-y-3">
        {data.map((item, index) => (
          <div
            key={item._id || index}
            className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-800 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="space-y-0">{render(item)}</div>
          </div>
        ))}
      </div>
    ) : (
      <Empty />
    )}
  </Card>
);

////////////////////////////////////////////////////////////

const AuthoritySection = ({ title, data = [], formatDate }) => (
  <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
      <span className="h-5 w-1 rounded-full bg-blue-800" />
      {title}
    </h3>

    {data?.length > 0 ? (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="min-w-0 rounded-md border border-slate-200 bg-white p-3 shadow-sm">
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

////////////////////////////////////////////////////////////

const Empty = () => (
  <div className="flex min-h-20 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
    <div>
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-bold text-slate-400 shadow-sm">—</div>
      <p className="text-sm font-semibold text-slate-400">No Records Found</p>
    </div>
  </div>
);