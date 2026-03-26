const DEFAULT_API_BASE_URL = "http://localhost:3000/api";

const readEnv = (value: string | undefined, fallback: string): string => {
  if (value === undefined) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export default {
  apiBaseUrl: readEnv(import.meta.env.VITE_API_URL, DEFAULT_API_BASE_URL),
} as const;
