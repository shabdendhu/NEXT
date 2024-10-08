const API_BASE_URL = config.API_BASE_URL;
// Function to create an organization
import axios from "axios";
import config from "./config";
const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  async (config: any) => {
    try {
      const userData = await localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const token = parsedUser.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      console.log("Axios Request Config:", config);
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export const createPredefinedReport = async (reportDetails: any) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/reports`,
      reportDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating predefined report:", error);
    throw error;
  }
};

export const getPredefinedReports = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching predefined reports:", error);
    throw error;
  }
};

export const updatePredefinedReport = async (
  id: number,
  reportDetails: any
) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/reports/${id}`,
      reportDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error updating predefined report:", error);
    throw error;
  }
};

export const deletePredefinedReport = async (id: number) => {
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/reports/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting predefined report:", error);
    throw error;
  }
};
export const loginUser = async ({ email, password }: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login-user`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const createTask = async (reportDetails: any) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/tasks`,
      reportDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task report:", error);
    throw error;
  }
};
export const updateTask = async (id: any, reportDetails: any) => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/tasks/${id}`,
      reportDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task report:", error);
    throw error;
  }
};

export const getTask = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task reports:", error);
    throw error;
  }
};

export const createCredit = async (credits: any) => {
  // const credits = [
  //   {
  //     broadcastChannel: "WhatsApp",
  //     creditType: "WhatsAppCredits",
  //     quantity: 3000,
  //     perCreditDuration: 30
  //   }
  // ];

  try {
    console.log("Creating credit with data:", { credits });
    const response = await axiosInstance.post("/credits/master-credits", {
      credits,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating credit:", error);
    throw error;
  }
};
export const getCredit = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/credits/master-credits`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching credits:", error);
    throw error;
  }
};
export const getPriceDetails = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/pricing/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching price:", error);
    throw error;
  }
};
export const createCreditPackage = async (packageDetails: any) => {
  try {
    const response = await axiosInstance.post(
      "/pricing/package",
      packageDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating credit package:", error);
    throw error;
  }
};
export const updateCreditPackage = async (data: any) => {
  try {
    const response = await axiosInstance.put("/pricing/package", data);
    return response.data;
  } catch (error) {
    console.error("Error creating credit package:", error);
    throw error;
  }
};
export const setCreditPrice = async (data: {
  broadcastChannel: string;
  creditType: string;
  perCreditDuration: number;
  pricePerCredit: number;
}) => {
  try {
    const response = await axiosInstance.post("/pricing/credit", data);
    return response.data;
  } catch (error) {
    console.error("Error creating price:", error);
    throw error;
  }
};

export const getApprovedTemplates = async () => {
  try {
    const response = await axiosInstance.get(`/templates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching templates", error);
    throw error;
  }
};

export const createApprovedTemplate = async (template: any) => {
  try {
    const formData = new FormData();
    formData.append("channel", template.channel);
    formData.append("templateName", template.templateName);
    formData.append("type", template.type);
    formData.append("content", template.content);
    formData.append("transcript", template.transcript);
    if (template.voiceFile) {
      formData.append("voiceFile", template.voiceFile);
    }

    const response = await axiosInstance.post(`/templates`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating template", error);
    throw error;
  }
};

export const updateApprovedTemplate = async (id: number, template: any) => {
  try {
    const formData = new FormData();
    formData.append("channel", template.channel);
    formData.append("templateName", template.templateName);
    formData.append("type", template.type);
    formData.append("content", template.content);
    formData.append("transcript", template.transcript);
    if (template.voiceFile) {
      formData.append("voiceFile", template.voiceFile);
    }

    const response = await axiosInstance.put(`/templates/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating template", error);
    throw error;
  }
};

export const deleteApprovedTemplate = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template", error);
    throw error;
  }
};
export const fetchAudioFile = async (voiceFileId: string): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/fetch-file/${voiceFileId}`, {
      responseType: "blob",
    });

    const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
    const audioFileUrl = URL.createObjectURL(audioBlob);
    return audioFileUrl;
  } catch (error) {
    console.error("Error fetching audio file:", error);
    throw error;
  }
};
export const createQueryTemplate = async (queryDetails: any) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/query-templates`,
      queryDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error creating query:", error);
    throw error;
  }
};

export const updateStatus = async (id: any) => {
  try {
    const response = await axiosInstance.post(`/pricing/update-status`, {
      id: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching templates", error);
    throw error;
  }
};
export const getQueryTemplates = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/query-templates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching query templates:", error);
    throw error;
  }
};
// PUT API call to update the query template
export const updateQueryTemplate = async (id: number, queryDetails: any) => {
  try {
    await axiosInstance.put(
      `${API_BASE_URL}/query-templates/${id}`,
      queryDetails
    );
    console.log("Query template updated successfully");
  } catch (error) {
    console.error("Error updating query template:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

export const deleteQueryTemplate = async (id: number) => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/query-templates/${id}`);
    console.log("Query template deleted successfully");
  } catch (error) {
    console.error("Error deleting query template:", error);
    throw error; // Rethrow error for the caller to handle
  }
};
export const getPortals = async () => {
  try {
    const response = await axiosInstance.get("/portal");
    return response.data;
  } catch (error) {
    console.error("Error fetching portals:", error);
    throw error;
  }
};

export const createPortal = async (portalDetails: any) => {
  try {
    const response = await axiosInstance.post("/portal", portalDetails);
    return response.data;
  } catch (error) {
    console.error("Error creating portal:", error);
    throw error;
  }
};

export const updatePortal = async (id: number, portalDetails: any) => {
  try {
    const response = await axiosInstance.put(`/portal/${id}`, portalDetails);
    return response.data;
  } catch (error) {
    console.error("Error updating portal:", error);
    throw error;
  }
};

export const deletePortal = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/portal/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting portal:", error);
    throw error;
  }
};
