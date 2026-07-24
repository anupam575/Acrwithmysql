'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { buildAparPayload } from './aparService'
import AparFormFields from '../components/AparFormFields'
import API from '../../../utils/axiosInstance'
import { getAparDefaultValues } from '../../../constants/aparDefaultValues'

const AparForm = ({ employeeId }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const methods = useForm({
        defaultValues: getAparDefaultValues(),
    })

    const { handleSubmit } = methods

    const onSubmit = async (data) => {
        try {
            setLoading(true)

            const payload = buildAparPayload({
                ...data,
                employeeId,
            })

            const formData = new FormData()

            Object.entries(payload).forEach(([key, value]) => {
                if (value === undefined || value === null) return

                if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value))
                } else {
                    formData.append(key, value)
                }
            })

            if (data.officerSignature instanceof File) {
                formData.append('officerSignature', data.officerSignature)
            }

            const res = await API.post('/reporter/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            toast.success(
                res?.data?.message || 'APAR submitted successfully'
            )

            // ✅ Success hote hi turant redirect
            router.replace('/reporting/allemp')

        } catch (error) {
            console.error(error)

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <AparFormFields
                    loading={loading}
                    buttonText="Submit APAR"
                    isEdit={false}
                />
            </form>
        </FormProvider>
    )
}

export default AparForm