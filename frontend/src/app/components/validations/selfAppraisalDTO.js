export const selfAppraisalDTO = (data = {}) => {
  return {
    responsibilities:
      data?.responsibilities || "",

    mouWeightage:
      data?.mouWeightage || "",

    mouDeliverables:
      data?.mouDeliverables || "",

    mouAchievement:
      data?.mouAchievement || "",
// 👇 ADD THIS
    totalTaskWeightage:
      data?.totalTaskWeightage || "",

    finalMouScore:
      data?.finalMouScore || "",

    tasks:
      data?.tasks?.length > 0
        ? data.tasks.map((task) => ({
            taskName:
              task?.taskName || "",

            weightage:
              task?.weightage || "",

            deliverables:
              task?.deliverables || "",

            achievement:
              task?.achievement || "",
          }))
        : [
            {
              taskName: "",
              weightage: "",
              deliverables: "",
              achievement: "",
            },
          ],

    exceptionalContribution:
      data?.exceptionalContribution || "",

    constraints:
      data?.constraints || "",

    currentAssignmentTraining:
      data?.currentAssignmentTraining || "",

    futureCareerTraining:
      data?.futureCareerTraining || "",

    immovablePropertyReturnFiled:
      data?.immovablePropertyReturnFiled
        ? "yes"
        : "no",

    immovablePropertyReturnDate:
      data?.immovablePropertyReturnDate
        ? data.immovablePropertyReturnDate.split(
            "T"
          )[0]
        : "",

    medicalCheckupDone:
      data?.medicalCheckupDone
        ? "yes"
        : "no",

    annualWorkPlanSetForOfficers:
      data?.annualWorkPlanSetForOfficers
        ? "yes"
        : "no",
  };
};