import { useSelector } from "react-redux";

export const useMasterData = () => {

  // ============================================
  // MASTER STATE
  // ============================================
  const {
    roles = [],
    designations = [],
    categories = [],
    departments = [],

    loading = false,
    error = null,

  } = useSelector((state) => state.master || {});

  // ============================================
  // RETURN ALL MASTER DATA
  // ============================================
  return {
    roles,
    designations,
    categories,
    departments,

    loading,
    error,
  };
};