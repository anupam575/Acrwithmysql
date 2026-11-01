import API from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

// 🔧 Backend base URL (hardcoded, no env variable used)
const BACKEND_URL = "http://localhost:4000";

export default function currentItemView({ employeeId }) {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(0);
  const [loading, setLoading] = useState(true);

  const InfoCard = ({ title, value, highlight = false }) => {
    return (
      <div
        className={`min-w-0 rounded-md border p-3 transition ${
          highlight
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
        }`}
      >
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.08em] ${
            highlight ? "text-emerald-700" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1.5 break-words text-sm font-semibold leading-5 ${
            highlight ? "text-emerald-800" : "text-slate-900"
          }`}
        >
          {value || "N/A"}
        </p>
      </div>
    );
  };

  useEffect(() => {
    if (employeeId) {
      getcurrentItemDetails();
    }
  }, [employeeId]);

  const getcurrentItemDetails = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/accept/employeer/acceptanceid/${employeeId}`
      );

      if (res.data.success) {
        const data = res.data.data || [];

        setCurrentItems(data);

        if (data.length > 0) {
          setSelectedCard(0);
          setCurrentItem(data[0]);
        } else {
          setCurrentItem(null);
        }
      } else {
        setCurrentItems([]);
        setCurrentItem(null);
      }
    } catch (error) {
      console.error("Error fetching currentItem details:", error);
      setCurrentItems([]);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setSelectedCard(index);
    setCurrentItem(currentItems[index]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Acceptance Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while acceptance records are being retrieved.
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
              No Acceptance Data Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No acceptance records are currently available for this employee.
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
                  Acceptance Authority Record
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View financial-year-wise acceptance assessment, score, remarks,
                  place, and acceptance date.
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
            <span className="font-semibold text-blue-800">
              Acceptance Details
            </span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Acceptance Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a financial-year record to view complete acceptance details.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {currentItems.map((item, index) => (
              <button
                type="button"
                key={item._id}
                onClick={() => handleCardClick(index)}
                className={`min-w-[245px] rounded-md border p-3 text-left transition ${
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
                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                      selectedCard === index
                        ? "bg-white/15 text-white"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {item.acceptingAssessment}
                  </span>
                </div>

                <div
                  className={`mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-xs ${
                    selectedCard === index
                      ? "border-white/20 text-blue-100"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wide opacity-75">
                      Total Score
                    </p>

                    <p className="mt-0.5 font-bold">
                      {item.acceptingTotalScore}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide opacity-75">
                      Acceptance Date
                    </p>

                    <p className="mt-0.5 font-semibold">
                      {item.acceptingDate
                        ? new Date(item.acceptingDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
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
                      Acceptance Authority Assessment
                    </p>

                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                      Acceptance Details
                    </h2>

                    <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                      Complete acceptance information and authority remarks
                    </p>
                  </div>

                  <div className="rounded-md border border-white/20 bg-white/10 px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-blue-200">
                      Financial Year
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {currentItem.currentFinancialYear}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-12">
                <div className="space-y-4 p-4 sm:p-5 lg:col-span-8 lg:p-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoCard
                      title="Assessment"
                      value={currentItem.acceptingAssessment || "N/A"}
                    />

                    <InfoCard
                      title="Total Score"
                      value={currentItem.acceptingTotalScore ?? 0}
                      highlight
                    />

                    <InfoCard
                      title="Place"
                      value={currentItem.acceptingPlace || "N/A"}
                    />

                    <InfoCard
                      title="Acceptance Date"
                      value={
                        currentItem.acceptingDate
                          ? new Date(
                              currentItem.acceptingDate
                            ).toLocaleDateString()
                          : "N/A"
                      }
                    />
                  </div>

                  <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3 border-b border-slate-200 pb-3">
                      <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Acceptance Remarks
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Remarks recorded by the accepting authority
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {currentItem.acceptingRemarks ||
                        "No remarks available."}
                    </p>
                  </section>

                  {/* 👇 ADDED: Accepting Authority Signature Section */}
                  <section className="overflow-hidden rounded-md border border-slate-200 bg-white">
                    <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="mt-0.5 h-5 w-1 shrink-0 rounded-full bg-blue-800" />

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Accepting Authority Signature
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Digitally uploaded signature of the accepting authority
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center p-4">
                      <div className="flex min-h-40 w-full max-w-md items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                        {currentItem?.officerSignature?.url ? (
                          <img
                            src={`${BACKEND_URL}${currentItem.officerSignature.url}`}
                            alt="Accepting Authority Signature"
                            className="max-h-32 max-w-full object-contain"
                          />
                        ) : (
                          <p className="text-sm font-medium text-slate-500">
                            Signature not available
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-6">
                  <div className="space-y-4 lg:sticky lg:top-4">
                    <div className="rounded-md bg-blue-800 p-4 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-200">
                        Current Score
                      </p>

                      <p className="mt-1 text-3xl font-bold">
                        {currentItem.acceptingTotalScore ?? 0}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-4">
                      <h3 className="text-sm font-bold text-slate-900">
                        Record Summary
                      </h3>

                      <div className="mt-3 divide-y divide-slate-100">
                        <div className="flex items-start justify-between gap-3 py-2.5">
                          <span className="text-xs text-slate-500">Status</span>

                          <span className="break-words text-right text-xs font-bold text-emerald-700">
                            {currentItem.acceptingAssessment}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 py-2.5">
                          <span className="text-xs text-slate-500">Place</span>

                          <span className="break-words text-right text-xs font-semibold text-slate-800">
                            {currentItem.acceptingPlace || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 py-2.5">
                          <span className="text-xs text-slate-500">Updated</span>

                          <span className="break-words text-right text-xs font-semibold text-slate-800">
                            {currentItem.acceptingDate
                              ? new Date(
                                  currentItem.acceptingDate
                                ).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <div className="flex min-h-72 items-center justify-center p-4">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
                  —
                </div>

                <h2 className="mt-3 text-base font-bold text-slate-900">
                  No Acceptance Selected
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a financial-year record to view its details.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Acceptance Authority Record • Performance Appraisal
          Management System
        </footer>
      </div>
    </div>
  );
}
