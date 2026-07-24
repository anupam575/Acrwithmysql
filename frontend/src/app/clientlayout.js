"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/authslice";

export default function ClientLayout({ children }) {
  const dispatch = useDispatch();

  const { authChecked, loading } = useSelector((state) => state.auth);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && !authChecked) {
      hasFetchedRef.current = true;
      dispatch(fetchUser());
    }
  }, [authChecked, dispatch]);

  return (
    <main>
      {!authChecked && loading ? (
        <div className="p-6 text-center">Checking auth...</div>
      ) : (
        children
      )}
    </main>
  );
}