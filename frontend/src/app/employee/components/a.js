
      <Card title="3 During the period under report, do you believe that you have made any exceptional contribution, e.g. successful completion of an extraordinarily challenging task or major systemic improvement (resulting in significant benefits to the Company and/or reduction 
      in time and costs)?  If so, please give a verbal description (within 100 words):">
        <TextArea
          {...register("exceptionalContribution")}
          className="h-28"
          placeholder="Write exceptional contribution..."
        />
      </Card>

      {/* ================= SECTION 4 ================= */}

      <Card title="4. Constraints">
        <TextArea
          {...register("constraints")}
          className="h-28"
          placeholder="Write constraints..."
        />
      </Card>

      {/* ================= SECTION 5 ================= */}

      <Card title="5. Training Requirements">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register("currentAssignmentTraining")}
            placeholder="Current Assignment Training"
          />

          <Input
            {...register("futureCareerTraining")}
            placeholder="Future Career Training"
          />
        </div>
      </Card>

      {/* ================= SECTION 6 ================= */}

      <Card title="6. Declaration">
        {[
          {
            text: "Immovable Property Return filed?",
            name: "immovablePropertyReturnFiled",
            date: "immovablePropertyReturnDate",
          },
          {
            text: "Medical checkup done?",
            name: "medicalCheckupDone",
          },
          {
            text: "Annual work plan set?",
            name: "annualWorkPlanSetForOfficers",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
          >
            <p className="text-sm text-gray-600">{item.text}</p>

            <div className="flex gap-3">
              <Select {...register(item.name)}>
                <option value="">Select</option>

                <option value="yes">Yes</option>

                <option value="no">No</option>
              </Select>

              {item.date && <Input type="date" {...register(item.date)} />}
            </div>
          </div>
        ))}
      </Card>

     
<select
  {...register("currentFinancialYear")}
  className="w-full border border-gray-300 rounded-lg p-3"
>

  {getFinancialYears().map((year) => (

    <option
      key={year}
      value={year}
    >
      {year}
    </option>

  ))}

</select>