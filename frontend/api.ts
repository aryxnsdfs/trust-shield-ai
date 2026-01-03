// 1. Get the API URL from the environment (or default to localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 2. Helper function to make requests
export const api = {
  // Example: Check if the backend is online
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return await response.json();
    } catch (error) {
      console.error("Backend offline:", error);
      return { status: "offline" };
    }
  },

  // Example: Scan a URL (Use this in your Index.tsx)
  scanUrl: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/scan-url?url=${encodeURIComponent(url)}`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Scan failed");
    return response.json();
  }
};