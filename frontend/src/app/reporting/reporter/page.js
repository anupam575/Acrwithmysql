'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'

import AparFormFields from '../components/AparFormFields'

// CREATE / UPDATE API
export const submitAparForm = async (data) => {
  try {
    // agar id hai => UPDATE
    if (data.id) {
      console.log('UPDATE API', data)

      // UPDATE API CALL
      // await axios.put(`/api/apar/${data.id}`, data)
    } else {
      console.log('CREATE API', data)

      // CREATE API CALL
      // await axios.post('/api/apar', data)
    }
  } catch (error) {
    console.log(error)
  }
}

const AparForm = ({ editData }) => {

  const [loading, setLoading] = useState(false)

  const methods = useForm({
    defaultValues: {
      id: editData?.id || '',

      section1: editData?.section1 || '',
      section2: editData?.section2 || '',
      section3: editData?.section3 || '',
      section4: editData?.section4 || '',
      section5: editData?.section5 || '',

      mouAbsoluteReporting: editData?.mouAbsoluteReporting || '',
      mouWeightedReporting: editData?.mouWeightedReporting || '',
      mouAbsoluteReviewing: editData?.mouAbsoluteReviewing || '',
      mouWeightedReviewing: editData?.mouWeightedReviewing || '',

      task1: editData?.task1 || '',
      task2: editData?.task2 || '',
      task3: editData?.task3 || '',
      task4: editData?.task4 || '',
      task5: editData?.task5 || '',
      task6: editData?.task6 || '',
      task7: editData?.task7 || '',
      task8: editData?.task8 || '',
      task9: editData?.task9 || '',
      task10: editData?.task10 || '',

      communicationReporting: editData?.communicationReporting || '',
      communicationReviewing: editData?.communicationReviewing || '',

      strategicReporting: editData?.strategicReporting || '',
      strategicReviewing: editData?.strategicReviewing || '',

      problemReporting: editData?.problemReporting || '',
      problemReviewing: editData?.problemReviewing || '',

      teamReporting: editData?.teamReporting || '',
      teamReviewing: editData?.teamReviewing || '',

      collaborationReporting: editData?.collaborationReporting || '',
      collaborationReviewing: editData?.collaborationReviewing || '',

      innovationReporting: editData?.innovationReporting || '',
      innovationReviewing: editData?.innovationReviewing || '',

      planningReporting: editData?.planningReporting || '',
      planningReviewing: editData?.planningReviewing || '',

      resultReporting: editData?.resultReporting || '',
      resultReviewing: editData?.resultReviewing || '',

      businessReporting: editData?.businessReporting || '',
      businessReviewing: editData?.businessReviewing || '',

      roleReporting: editData?.roleReporting || '',
      roleReviewing: editData?.roleReviewing || '',

      integrity: editData?.integrity || '',

      penPicture: editData?.penPicture || '',
      overallGrade: editData?.overallGrade || '',
    },
  })

  const { handleSubmit, register } = methods

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      await submitAparForm(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* hidden field for update */}
        <input
          type='hidden'
          {...register('id')}
        />

        <AparFormFields
          loading={loading}
          buttonText={editData ? 'Update APAR' : 'Create APAR'}
          isEdit={!!editData}
        />

      </form>
    </FormProvider>
  )
}

export default AparForm