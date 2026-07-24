"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

import EmployeeForm from "@/components/EmployeeForm";
import PARFormFields from "@/components/PARFormFields";

export default function EditEmployee() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH EMPLOYEE =================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employee/${id}`);
        const data = await res.json();

        setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  // ================= CATEGORY DECISION LOGIC =================
  const formType = useMemo(() => {
    if (!employee?.category?.name) return "EMPLOYEE";

    const category = employee.category.name.toLowerCase();

    // 🔥 DECISION RULE
    if (
      category.includes("senior") ||
      category.includes("top") ||
      category.includes("par") ||
      category.includes("level")
    ) {
      return "PAR";
    }

    return "EMPLOYEE";
  }, [employee]);

  if (loading) return <p>Loading...</p>;

  if (!employee) return <p>No Employee Found</p>;

  // ================= RENDER =================
  return (
    <div>
      {formType === "PAR" ? (
        <PARFormFields employee={employee} />
      ) : (
        <EmployeeForm employee={employee} />
      )}
    </div>
  );
}