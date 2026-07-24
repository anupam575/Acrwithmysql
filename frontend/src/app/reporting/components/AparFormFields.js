'use client'
import Section7CompetencyTable from "./CompetencyTable"
import { useFormContext } from 'react-hook-form'
import { useFieldArray } from "react-hook-form"
import AssessmentForm from "./AssessmentForm"
import { useEffect } from "react"
import React from "react";

export const getCurrentFinancialYear = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`
}

export function useObjectUrl(file) {
  const [url, setUrl] = React.useState(null);
  const [type, setType] = React.useState(null);

  React.useEffect(() => {
    let objectUrl;

    if (!file) {
      setUrl(null);
      setType(null);
      return;
    }

    // Backend object
    if (
      typeof file === "object" &&
      !(file instanceof File) &&
      !(file instanceof Blob)
    ) {
      setUrl(file?.url || null);
      setType(file?.mimeType || null);
      return;
    }

    // String URL
    if (typeof file === "string") {
      setUrl(file);
      setType(null);
      return;
    }

    // File / Blob
    if (file instanceof File || file instanceof Blob) {
      objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      setType(file.type);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return { url, type };
}


const inputClass =
    'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

const textareaClass =
    'w-full min-h-[130px] resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

const tableInputClass =
    'h-9 w-full min-w-[90px] rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100'

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

const SectionCard = ({ number, title, children }) => {
    return (
        <section className='overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm'>
            <div className='flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2.5.5 sm:px-5'>
                <div className='flex h-7 min-w-7 items-center justify-center rounded-md bg-blue-800 px-2 text-xs font-bold text-white'>
                    {number}
                </div>

                <h2 className='text-sm font-bold leading-6 text-slate-900 sm:text-[15px]'>
                    {title}
                </h2>
            </div>

            <div className='p-4 sm:p-5 lg:p-6'>
                {children}
            </div>
        </section>
    )
}

const RHFInput = ({ name, className = '', ...props }) => {
    const { register } = useFormContext()

    return (
        <input
            {...register(name)}
            className={`${inputClass} ${className}`}
            {...props}
        />
    )
}

const RHFTextarea = ({ name, className = '', ...props }) => {
    const { register } = useFormContext()

    return (
        <textarea
            {...register(name)}
            className={`${textareaClass} ${className}`}
            {...props}
        />
    )
}

const RHFTableInput = ({ name, ...props }) => {
    const { register } = useFormContext()

    return (
        <input
            {...register(name)}
            className={tableInputClass}
            {...props}
        />
    )
}

const RadioCard = ({ name, value, label, loading,
    buttonText,
    isEdit = false, }) => {
    const { register } = useFormContext()

    return (
        <label className='flex cursor-pointer items-center gap-3 rounded-md border border-slate-300 bg-white p-3 transition hover:border-blue-600 hover:bg-blue-50'>
            <input
                type='radio'
                value={value}
                {...register(name)}
                className='h-4 w-4'
            />

            <span className='text-sm font-medium text-slate-700'>
                {label}
            </span>
        </label>
    )
}
const AparFormFields = ({
  loading,
  buttonText,
  isEdit = false,
}) => {
const { register, formState, setValue, watch } = useFormContext();

const signatureFile = watch("officerSignature");

  const { url: signatureUrl } = useObjectUrl(signatureFile);

  useEffect(() => {
    setValue("financialYear", getCurrentFinancialYear())
  }, [setValue])

    return (
        <div className='min-h-screen bg-slate-100 px-2 py-3 sm:px-4 sm:py-5 lg:px-6'>
            <div className='mx-auto w-full max-w-[1440px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
                <header className='border-b border-slate-200'>
                    <div className='h-1.5 bg-gradient-to-r from-[#ff9933] via-white to-[#138808]' />

                    <div className='bg-[#0b3a6f] px-4 py-4 text-white sm:px-6 lg:px-8'>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                            <div className='min-w-0'>
                                <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-xs'>
                                    Performance Appraisal Report
                                </p>
                                <h1 className='mt-1 text-xl font-bold leading-tight sm:text-2xl'>
                                    Reporting Authority Assessment
                                </h1>
                                <p className='mt-1 max-w-3xl text-xs leading-5 text-blue-100 sm:text-sm'>
                                    Assessment, competency review, integrity remarks and overall grading.
                                </p>
                            </div>

                            <div className='shrink-0 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-50'>
                                Reporting Officer
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 text-xs text-slate-500 sm:px-6 lg:px-8'>
                        <span>Home</span>
                        <span aria-hidden='true'>/</span>
                        <span>PAR Management</span>
                        <span aria-hidden='true'>/</span>
                        <span className='font-semibold text-blue-800'>Reporting Assessment</span>
                    </div>
                </header>

                <main className='space-y-4 bg-slate-50 p-3 sm:space-y-5 sm:p-5 lg:p-7'>
           <SectionCard number="FY" title="Current Financial Year">
  <RHFInput
    name="financialYear"
    readOnly
    className="bg-gray-100 cursor-not-allowed"
  />
</SectionCard>
            <SectionCard
                number='1'
                title='Please state whether you agree with the responses relating to the accomplishments of the work plan as filled out in Section II. If not, please furnish factual details.'
            >
                <RHFTextarea
                    name='section1'
                    rows={10}
                    placeholder='Enter detailed remarks...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 2 */}
            {/* ====================================================== */}

            <SectionCard
                number='2'
                title='Please comment on the claim (if any) made by the officer reported upon about his exceptional contribution.'
            >
                <RHFTextarea
                    name='section2'
                    rows={10}
                    placeholder='Enter remarks...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 3 */}
            {/* ====================================================== */}

            <SectionCard
                number='3'
                title='Has officer reported upon met with any significant shortfall in achieving the targets? If yes, please furnish factual details.'
            >
                <RHFTextarea
                    name='section3'
                    rows={10}
                    placeholder='Enter factual details...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 4 */}
            {/* ====================================================== */}

            <SectionCard
                number='4'
                title='Do you agree with the constraints mentioned by the officer reported upon that had hindered his performance and, if so, to what extent?'
            >
                <RHFTextarea
                    name='section4'
                    rows={10}
                    placeholder='Enter observations...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 5 */}
            {/* ====================================================== */}

            <SectionCard
                number='5'
                title='Do you agree with the competency up-gradation needs as identified by the officer?'
            >
                <RHFTextarea
                    name='section5'
                    rows={10}
                    placeholder='Enter comments...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 6 */}
            {/* ====================================================== */}

            <SectionCard
                number='6'
                title='Assessment of the achievements made against the targets'
            >

                <AssessmentForm />

            </SectionCard>

            <SectionCard
                number='7'
                title='Assessment of Personal Attributes and Functional Competencies'
            >
                <Section7CompetencyTable />
            </SectionCard>

            <SectionCard
                number='8'
                title='Integrity'
            >

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">

  <div className="mb-3 text-sm leading-6 text-slate-700">
    (Please comment on the integrity of the officer reported upon by
    choosing any one of the following option):
  </div>

  <div className="overflow-x-auto">

    <table className="min-w-[760px] w-full border-collapse bg-white text-sm">

      <tbody>

        <tr>
          <td className="w-[70px] border border-slate-300 px-3 py-2.5 font-medium text-slate-700 align-top">
            i)
          </td>

          <td className="border border-slate-300 px-3 py-2.5 text-slate-700">
            Beyond doubt
          </td>

          <td className="w-[260px] border border-slate-300 p-2">
            <RHFTextarea
              name="integrity.beyondDoubt"
              rows={2}
              placeholder="Enter remarks..."
              className="min-h-[70px] rounded-md border-0 bg-slate-50 focus:ring-0"
            />
          </td>
        </tr>

        <tr className="bg-slate-50/50">
          <td className="w-[70px] border border-slate-300 px-3 py-2.5 font-medium text-slate-700 align-top">
            ii)
          </td>

          <td className="border border-slate-300 px-3 py-2.5 leading-7 text-slate-700">
            Integrity of the officer is doubtful.
            A separate secret note is attached.
          </td>

          <td className="w-[260px] border border-slate-300 p-2">
            <RHFTextarea
              name="integrity.doubtful"
              rows={3}
              placeholder="Enter remarks..."
              className="min-h-[90px] rounded-md border-0 bg-slate-50 focus:ring-0"
            />
          </td>
        </tr>

        <tr>
          <td className="w-[70px] border border-slate-300 px-3 py-2.5 font-medium text-slate-700 align-top">
            iii)
          </td>

          <td className="border border-slate-300 px-3 py-2.5 text-slate-700">
            Nothing adverse has been received about the officer
          </td>

          <td className="w-[260px] border border-slate-300 p-2">
            <RHFTextarea
              name="integrity.nothingAdverse"
              rows={2}
              placeholder="Enter remarks..."
              className="min-h-[70px] rounded-md border-0 bg-slate-50 focus:ring-0"
            />
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</div>

            </SectionCard>

 
            <SectionCard
                number='9'
                title='Pen picture by Reporting Officer'
            >
                <RHFTextarea
                    name='penPicture'
                    rows={12}
                    placeholder='Write approximately 100 words...'
                />
            </SectionCard>

            {/* ====================================================== */}
            {/* SECTION 10 */}
            {/* ====================================================== */}

            <SectionCard
                number='10'
                title='Overall grade out of 100'
            >

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>

                    <div>
                        <label className='mb-1.5 block text-[13px] font-semibold text-slate-700'>
                            Overall Grade
                        </label>

                        <RHFInput
                            type='number'
                            step='0.01'
                            min='0'
                            max='100'
                            name='overallGrade'
                            placeholder='Enter overall grade'
                        />
                    </div>

                    <div>
                        <label className='mb-1.5 block text-[13px] font-semibold text-slate-700'>
                            Date
                        </label>

                        <RHFInput
                            type='date'
                            name='reportingDate'
                        />
                    </div>

                </div>

            </SectionCard>


<section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
  <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5">
    <span className="h-5 w-1 rounded-full bg-blue-800" />
    <h2 className="text-sm font-bold text-slate-900 sm:text-[15px]">
      Reporting Authority Details
    </h2>
  </div>

  <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 md:grid-cols-2 lg:p-6">

    {/* Signature Upload */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Signature
      </label>

      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setValue("officerSignature", file, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
        }}
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {/* Signature Preview */}
      <div className="mt-3 flex justify-start">
        <div className="flex h-20 w-40 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
          {signatureUrl ? (
            <img
              src={signatureUrl}
              alt="Officer Signature"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-gray-400 text-center px-2">
              No Signature
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Name & Designation */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Name & Designation
      </label>

      <RHFInput
        name="acceptingAuthorityNameDesignation"
        placeholder="Enter designation"
      />
    </div>

  </div>
</section>

            <section className='sticky bottom-0 z-10 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur sm:static sm:flex sm:items-center sm:justify-between sm:px-5 sm:py-4'>
                <p className='mb-3 text-xs leading-5 text-slate-500 sm:mb-0'>
                    Please review all assessment remarks, grades and authority details before submitting.
                </p>

                <button
                    type='submit'
                    disabled={loading}
                    className='h-10 w-full rounded-md bg-blue-800 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-40'
                >
                    {loading
                        ? isEdit
                            ? 'Updating...'
                            : 'Submitting...'
                        : buttonText}
                </button>

            </section>
                </main>

                <footer className='border-t border-slate-200 bg-white px-4 py-3 text-center text-[11px] text-slate-500 sm:px-6 sm:text-xs'>
                    Official Performance Appraisal Record • Reporting Authority Assessment
                </footer>
            </div>
        </div>
    )
}

export default AparFormFields