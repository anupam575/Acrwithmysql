"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";

export default function useEmployees(page, setPage, limit, search, assessmentYear) {
    const router = useRouter();

    // 👇 Saare employees (poora data), sirf ek baar / financialYear change hone par fetch hoga
    const [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // 👇 saare distinct financial years (poore database se, kisi bhi page se independent)
    const [allFinancialYears, setAllFinancialYears] = useState([]);

    // ======================
    // FETCH ALL EMPLOYEES (pagination backend se hata di — sab kuch ek saath le lo)
    // ======================
    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (assessmentYear) params.append("financialYear", assessmentYear); // 👈 backend filter

            // 👇 Bahut bada limit bhej rahe hain taaki poora data ek saath aa jaye
            params.append("page", 1);
            params.append("limit", 1000000);

            const res = await API.get(
                `/employees/master-employ?${params.toString()}`
            );

            if (res.data.success) {
                setAllEmployees(res.data.data || []);
            }
        } catch (err) {
            console.log("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 👇 saare financial years ek hi baar fetch karo (dropdown ke liye)
    const fetchAllFinancialYears = async () => {
        try {
            const res = await API.get(`/employees/financial-years`);
            if (res.data.success) {
                setAllFinancialYears(res.data.data || []);
            }
        } catch (err) {
            console.log("Financial years fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAllFinancialYears();
    }, []);

    // 👇 sirf assessmentYear change hone par re-fetch (page/limit se ab matlab nahi)
    useEffect(() => {
        fetchEmployees();
    }, [assessmentYear]);

    // 👇 search ya year change hone par page 1 pe reset
    useEffect(() => {
        setPage(1);
    }, [search, assessmentYear]);

    // ======================
    // FRONTEND SEARCH FILTER (poore allEmployees data par, kisi bhi page se independent)
    // ======================
    const searchFiltered = useMemo(() => {
        const text = search?.toLowerCase().trim();

        if (!text) return allEmployees;

        return allEmployees.filter((emp) => {
            const searchText = [
                emp.code,
                emp.employeeCode,
                emp.employee_name,
                emp.officerName,
                emp.designation?.name,
                emp.category?.name,
                emp.role?.role_name,

                // 👇 EMAIL
                emp.email,

                // 👇 ASSESSMENT / FINANCIAL YEAR
                emp.currentFinancialYear,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchText.includes(text);
        });
    }, [search, allEmployees]);

    // ======================
    // FRONTEND PAGINATION (search-filtered data par)
    // ======================
    const totalPages = Math.max(1, Math.ceil(searchFiltered.length / limit));

    const filteredEmployees = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return searchFiltered.slice(start, end);
    }, [searchFiltered, page, limit]);

    // ======================
    // ACTIONS
    // ======================
    const handleUpdate = (emp) => {
        const key = emp?.category?.category_key?.trim();
        const employeeId = emp?.employeeRefId?._id || emp?.employeeRefId;

        switch (key) {
            case "senior_and_top_managerial_level":
                router.push(`/hr/employee/edit-par/${employeeId}`);
                break;
            case "supervisory_and_below_supervisory_category_employees":
                router.push(`/hr/employee/edit-employee/${employeeId}`);
                break;
            default:
                console.warn("Unknown category_key:", key);
                break;
        }
    };

    const handleView = (emp) => {
        const employeeId = emp?.employeeRefId?._id || emp?.employeeRefId;
        const categoryKey = emp?.category?.category_key;
        router.push(`/hod/employee/view/${employeeId}/${categoryKey}`);
    };

    const handleDelete = async (emp) => {
        if (!confirm("Delete this user?")) return;
        try {
            const employeeId = emp?.employeeRefId?._id || emp?.employeeRefId;
            await API.delete(`/employees/${employeeId}`);
            fetchEmployees();
        } catch (err) {
            console.error(err.message);
        }
    };

    return {
        filteredEmployees,
        loading,
        totalPages,
        allFinancialYears,
        handleUpdate,
        handleView,
        handleDelete,
    };
}