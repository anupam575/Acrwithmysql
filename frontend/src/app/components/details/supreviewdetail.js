import API from "../../../utils/axiosInstance";
import { useEffect, useState } from "react";

const InfoCard = ({ title, value }) => {
  return (
    <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {title}
      </p>

      <p className="mt-1.5 whitespace-pre-wrap break-words text-sm font-semibold leading-5 text-slate-900">
        {value || "N/A"}
      </p>
    </div>
  );
};

const DetailRow = ({ label, value, valueClass = "text-slate-800" }) => (
  <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
    <span className="text-xs text-slate-500">{label}</span>

    <span
      className={`break-words text-xs font-semibold sm:max-w-[65%] sm:text-right ${valueClass}`}
    >
      {value || "N/A"}
    </span>
  </div>
);

export default function ReviewView({ employeeId }) {
  const [loading, setLoading] = useState(true);

  // All Reviews
  const [reviews, setReviews] = useState([]);

  // Active Card
  const [selectedCard, setSelectedCard] = useState(0);

  // Selected Review
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (employeeId) {
      getReviewDetails();
    }
  }, [employeeId]);

  // Active Card Change
  const handleCardClick = (index) => {
    setSelectedCard(index);
    setCurrentItem(reviews[index]);
  };

  const getReviewDetails = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/review/employeer/${employeeId}`);

      if (res.data.success && Array.isArray(res.data.data)) {
        const data = res.data.data;

        setReviews(data);

        // Default Active Tab
        if (data.length > 0) {
          setSelectedCard(0);
          setCurrentItem(data[0]);
        } else {
          setSelectedCard(0);
          setCurrentItem(null);
        }
      } else {
        setReviews([]);
        setSelectedCard(0);
        setCurrentItem(null);
      }
    } catch (err) {
      console.error(err);
      setReviews([]);
      setSelectedCard(0);
      setCurrentItem(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-800" />

            <h2 className="mt-4 text-base font-bold text-slate-900">
              Loading Review Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while reviewing-officer records are being retrieved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />

          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg font-bold text-slate-500">
              —
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-900">
              No Review Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              No reviewing-officer records are currently available.
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
                  Reviewing Officer Assessment
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm">
                  View financial-year-wise review scores, remarks, place, date,
                  and reviewing-officer information.
                </p>
              </div>

              <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50">
                {reviews.length} Record{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8">
            <span>Home</span>
            <span>/</span>
            <span>Performance Appraisal</span>
            <span>/</span>
            <span className="font-semibold text-blue-800">Review Details</span>
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-bold text-slate-900">
              Review Records
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select a financial-year record to view complete review details.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto p-3 sm:p-4">
            {reviews.map((item, index) => (
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
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      selectedCard === index ? "bg-emerald-400" : "bg-slate-300"
                    }`}
                  />
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
                      Review Date
                    </p>

                    <p className="mt-0.5 font-semibold">
                      {item.reviewDate
                        ? new Date(item.reviewDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wide opacity-75">
                      Action
                    </p>

                    <p className="mt-0.5 font-bold">View Details</p>
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
                      Reviewing Authority Assessment
                    </p>

                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                      Review Information
                    </h2>

                    <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                      Complete review score, officer, department, and remarks
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:min-w-[300px]">
                    <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                        Financial Year
                      </p>

                      <p className="mt-1 text-base font-bold">
                        {currentItem.currentFinancialYear}
                      </p>
                    </div>

                    <div className="rounded-md border border-white/20 bg-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">
                        Total Score
                      </p>

                      <p className="mt-1 text-lg font-bold text-emerald-300">
                        {currentItem.reviewTotalScore}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-4 sm:p-5 lg:p-6">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <InfoCard
                    title="Financial Year"
                    value={currentItem.currentFinancialYear}
                  />

                  <InfoCard
                    title="Review Date"
                    value={new Date(
                      currentItem.reviewDate
                    ).toLocaleDateString()}
                  />

                  <InfoCard
                    title="Review Place"
                    value={currentItem.reviewPlace}
                  />

                  <InfoCard
                    title="Total Score"
                    value={currentItem.reviewTotalScore}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                  <section className="rounded-lg border border-slate-200 bg-white lg:col-span-7">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Reviewing Officer Details
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Officer identity and department information
                      </p>
                    </div>

                    <div className="grid gap-3 p-4 sm:grid-cols-2">
                      <InfoCard
                        title="Officer Name"
                        value={`${
                          currentItem.reviewingOfficerId?.firstName || ""
                        } ${
                          currentItem.reviewingOfficerId?.lastName || ""
                        }`}
                      />

                      <InfoCard
                        title="Department"
                        value={
                          currentItem.reviewingOfficerId?.department
                            ?.department_name || "N/A"
                        }
                      />
                    </div>
                  </section>

                  <section className="rounded-lg border border-slate-200 bg-white lg:col-span-5">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Review Summary
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Key information for the selected review
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 px-4">
                      <DetailRow
                        label="Financial Year"
                        value={currentItem.currentFinancialYear}
                      />

                      <DetailRow
                        label="Review Date"
                        value={
                          currentItem.reviewDate
                            ? new Date(
                                currentItem.reviewDate
                              ).toLocaleDateString()
                            : "N/A"
                        }
                      />

                      <DetailRow
                        label="Review Place"
                        value={currentItem.reviewPlace}
                      />

                      <DetailRow
                        label="Total Score"
                        value={currentItem.reviewTotalScore}
                        valueClass="text-blue-800"
                      />
                    </div>
                  </section>
                </div>

                <section className="rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      Review Remarks
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Remarks entered by the reviewing officer
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {currentItem.reviewRemarks || "No Remarks"}
                    </p>
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
                  No Review Selected
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a financial-year record to view its details.
                </p>
              </div>
            </div>
          )}
        </section>

        <footer className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:text-xs">
          Official Reviewing Officer Record • Performance Appraisal Management
          System
        </footer>
      </div>
    </div>
  );
}