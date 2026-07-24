const normalizeDate = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

const deepNormalize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(deepNormalize);
  }

  const newObj = {};

  for (const key in obj) {
    if (key === "createdAt" || key === "updatedAt" || key === "lastSeen") {
      newObj[key] = normalizeDate(obj[key]);
    } else {
      newObj[key] = deepNormalize(obj[key]);
    }
  }

  return newObj;
};

export const serializableFixMiddleware =
  (store) => (next) => (action) => {
    if (action?.payload) {
      action.payload = deepNormalize(action.payload);
    }

    return next(action);
  };
