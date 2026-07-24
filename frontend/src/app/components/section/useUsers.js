"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";

// =========================
// CUSTOM HOOK - USERS LOGIC
// =========================
const useUsers = () => {
    const router = useRouter();

    const [allUsers, setAllUsers] = useState([]); // 👈 poora data yahan store hoga
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // =========================
    // DEBOUNCE
    // =========================
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // =========================
    // FETCH ALL USERS (ek hi baar, pagination backend se hata di)
    // =========================
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await API.get(
                `/users?page=1&limit=1000000`, // 👈 bada limit — poora data ek saath
                { withCredentials: true }
            );

            setAllUsers(data.users || []);

        } catch (error) {
            console.error("Fetch Users Error:", error.message);
            setAllUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // =========================
    // SEARCH FILTER (poore allUsers data par, kisi page se independent)
    // =========================
    const searchFiltered = useMemo(() => {
        if (!debouncedSearch.trim()) return allUsers;

        const q = debouncedSearch.toLowerCase();

        return allUsers.filter((user) =>
            user.first_name?.toLowerCase().includes(q) ||
            user.last_name?.toLowerCase().includes(q) ||
            user.username?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q) ||
            user.phoneNumber?.toLowerCase().includes(q) ||
            user.department?.department_name?.toLowerCase().includes(q) ||
            user.role?.role_name?.toLowerCase().includes(q)
        );
    }, [allUsers, debouncedSearch]);

    // 👇 search change hote hi page 1 pe reset
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    // =========================
    // FRONTEND PAGINATION (search-filtered data par)
    // =========================
    const totalUsers = searchFiltered.length;
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

    const filteredUsers = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return searchFiltered.slice(start, end);
    }, [searchFiltered, page, limit]);

    // =========================
    // ACTIONS
    // =========================
    const handleUpdate = (id) => {
        router.push(`/admin/allusers/edit/${id}`);
    };

    const handleView = (id) => {
        router.push(`/admin/allusers/${id}`);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;

        try {
            await API.delete(`/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error(err.message);
        }
    };

    return {
        users: allUsers,
        page,
        setPage,
        limit,
        totalUsers,
        totalPages,
        loading,
        search,
        setSearch,
        filteredUsers,
        handleUpdate,
        handleView,
        handleDelete,
    };
};

export default useUsers;