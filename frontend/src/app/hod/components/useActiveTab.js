import { useState } from "react";

export default function useActiveTab(defaultIndex = 0) {
  const [activeTab, setActiveTab] = useState(defaultIndex);

  return {
    activeTab,
    setActiveTab,   // ✅ FIX HERE
  };
}