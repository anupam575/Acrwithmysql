import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";

const InfoCard = ({ title, value }) => {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {title}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, badge }) => (
  <div className="mb-3 flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />

      <div>
        <h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>

    {badge && (
      <span className="w-fit rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-800">
        {badge}
      </span>
    )}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
      {title}
    </p>

    <p className="mt-1.5 break-words text-base font-bold text-slate-900">
      {value || "N/A"}
    </p>
  </div>
);

export default function Reportingpage({ employeeId }) {
  const [currentItems, setcurrentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Card Index
  const [selectedCard, setSelectedCard] = useState(0);

  // Selected Card Data
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (employeeId) {
      getReportingOfficercurrentItems();
    }
  }, [employeeId]);

  const getReportingOfficercurrentItems = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/reporter/reporter/${employeeId}`);

      if (response.data.success) {
        const data = response.data.data || [];

        setcurrentItems(data);

        // First card active by default
        if (data.length > 0) {
          setSelectedCard(0);
          setCurrentItem(data[0]);
        } else {
          setSelectedCard(0);
          setCurrentItem(null);
        }
      } else {
        setcurrentItems([]);
        setSelectedCard(0);
        setCurrentItem(null);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setcurrentItems([]);
      setSelectedCard(0);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setCurrentItem(currentItems[index]); // <-- currentItems use karo
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Performance Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while reporting-officer records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
              —
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-900">
              No Performance Report Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No reporting-officer performance records are currently available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
      <div className="mx-auto max-w-[1440px] space-y-4 sm:space-y-5">
        <header className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs">
                  Performance Appraisal Management
                </p>

                <h1 className="mt-1 text-xl font-bold leading-tight sm:text-2xl">
                  Reporting Officer Performance Review
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View financial-year-wise performance factors, assessment areas,
                  career development, and reporting-officer details.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                {currentItems.length} Record
                {currentItems.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Performance Appraisal</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Reporting View</span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Financial Year Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a financial year to view the complete performance report.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {currentItems.map((item, index) => (
              <button
                type="button"
                key={item._id}
                onClick={() => handleCardClick(index)}
                className={`min-w-[225px] rounded-md border p-3 text-left transition ${
                  selectedCard === index
                    ? "border-blue-800 bg-blue-800 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.1em] ${
                        selectedCard === index
                          ? "text-blue-200"
                          : "text-slate-500"
                      }`}
                    >
                      Financial Year
                    </p>

                    <h2 className="mt-1 text-base font-bold">
                      {item.currentFinancialYear}
                    </h2>
                  </div>

                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      selectedCard === index ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
                </div>

                <div
                  className={`mt-3 border-t pt-3 text-xs font-semibold ${
                    selectedCard === index
                      ? "border-white/20 text-blue-100"
                      : "border-slate-200 text-blue-800"
                  }`}
                >
                  View Details
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {currentItem ? (
            <>
              <div className="bg-[#0b3a6f] px-4 py-4 text-white sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-200">
                      Performance Evaluation Report
                    </p>

                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                      Employee Performance Review
                    </h2>

                    <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                      Financial Year: {currentItem.currentFinancialYear}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:min-w-[300px]">
                    <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-200">
                        Total Score
                      </p>

                      <p className="mt-1 text-xl font-bold text-white">
                        {currentItem.totalMarks}
                      </p>
                    </div>

                    <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-200">
                        Integrity
                      </p>

                      <p className="mt-1 break-words text-base font-bold text-white">
                        {currentItem.integrity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-5 lg:p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Promotion Potential"
                    value={currentItem.promotionPotential || "N/A"}
                  />

                  <StatCard
                    title="General Health"
                    value={currentItem.generalHealth || "N/A"}
                  />

                  <StatCard
                    title="Official Language"
                    value={currentItem.officialLanguageWork || "N/A"}
                  />

                  <StatCard
                    title="Training Required"
                    value={currentItem.trainingRecommendation || "N/A"}
                  />
                </div>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <SectionHeader
                    title="Performance Factors"
                    subtitle="Core evaluation factors recorded by the reporting officer"
                    badge="Core Evaluation"
                  />

                  <div className="overflow-hidden rounded-md border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-sm">
                        <thead>
                          <tr className="bg-[#0b3a6f] text-white">
                            <th className="px-3 py-3 text-left text-xs font-bold">
                              Factor
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold">
                              Weightage
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold">
                              Score
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentItem.performanceFactors?.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-slate-200 transition hover:bg-blue-50 ${
                                index % 2 === 0 ? "bg-slate-50" : "bg-white"
                              }`}
                            >
                              <td className="px-3 py-3 font-semibold text-slate-800">
                                {item.label}
                              </td>

                              <td className="px-3 py-3 text-center text-slate-700">
                                {item.weightage}
                              </td>

                              <td className="px-3 py-3 text-center font-bold text-blue-800">
                                {item.reportingOfficer}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <SectionHeader
                    title="Other Assessment Areas"
                    subtitle="Additional aspects considered in the performance assessment"
                  />

                  <div className="overflow-hidden rounded-md border border-slate-200">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-sm">
                        <thead>
                          <tr className="bg-[#0b3a6f] text-white">
                            <th className="px-3 py-3 text-left text-xs font-bold">
                              Aspect
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold">
                              Weightage
                            </th>
                            <th className="px-3 py-3 text-center text-xs font-bold">
                              Score
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentItem.otherAspects?.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-slate-200 transition hover:bg-blue-50 ${
                                index % 2 === 0 ? "bg-slate-50" : "bg-white"
                              }`}
                            >
                              <td className="px-3 py-3 font-semibold text-slate-800">
                                {item.label}
                              </td>

                              <td className="px-3 py-3 text-center text-slate-700">
                                {item.weightage}
                              </td>

                              <td className="px-3 py-3 text-center font-bold text-emerald-700">
                                {item.reportingOfficer}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <SectionHeader
                    title="Career Development Areas"
                    subtitle="Recommended areas for future professional development"
                  />

                  {currentItem.careerDevelopment?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {currentItem.careerDevelopment.map((item, index) => (
                        <span
                          key={index}
                          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-400">
                      No Career Development Areas
                    </div>
                  )}
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <SectionHeader
                    title="Additional Information"
                    subtitle="Location, date, career, integrity, and score information"
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <InfoCard title="Place" value={currentItem.place} />

                    <InfoCard
                      title="Date"
                      value={new Date(currentItem.date).toLocaleDateString()}
                    />

                    <InfoCard
                      title="Other Career Field"
                      value={currentItem.otherCareerField}
                    />

                    <InfoCard
                      title="Integrity"
                      value={currentItem.integrity}
                    />

                    <InfoCard
                      title="Promotion Potential"
                      value={currentItem.promotionPotential}
                    />

                    <InfoCard
                      title="Total Marks"
                      value={currentItem.totalMarks}
                    />
                  </div>
                </section>

                <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h2 className="text-sm font-bold text-slate-900">
                      Reporting Officer Details
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Officer identity, department, and designation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
                    <InfoCard
                      title="Officer Name"
                      value={`${currentItem.reportingOfficerId?.firstName || ""} ${
                        currentItem.reportingOfficerId?.lastName || ""
                      }`.trim()}
                    />

                    <InfoCard
                      title="Department"
                      value={
                        currentItem.reportingOfficerId?.department
                          ?.department_name || "N/A"
                      }
                    />

                    <InfoCard
                      title="Designation"
                      value={currentItem.designation}
                    />
                  </div>
                </section>
              </div>
            </>
          ) : (
            <div className="flex min-h-72 items-center justify-center p-4">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
                  —
                </div>

                <h2 className="mt-3 text-base font-bold text-slate-900">
                  No Performance Report Selected
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a financial-year record to view its details.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Reporting Officer Performance Record • Performance Appraisal
          Management System
        </footer>
      </div>
    </div>
  );
}