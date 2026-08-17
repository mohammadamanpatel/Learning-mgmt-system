import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";
const storedData = localStorage.getItem("data");
console.log("storedData", localStorage.getItem("data"));
let parsedData = {};

try {
  parsedData = storedData ? JSON.parse(storedData) : {};
  console.log("parserData", parsedData);
} catch (error) {
  console.error("Error parsing stored data:", error);
  parsedData = {}; // Ensure parsedData is an object even in case of an error
}

const storedRole = localStorage.getItem("role") || "";

// A session is only trusted when the role came back with it. Older builds could
// persist isLoggedIn without a role, which reads as "logged in but authorized
// for nothing" and bounces every protected route to /denied.
const hasValidSession =
  localStorage.getItem("isLoggedIn") === "true" &&
  ["USER", "ADMIN"].includes(storedRole);

if (!hasValidSession) {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("data");
}

const initialState = {
  isLoggedIn: hasValidSession,
  role: hasValidSession ? storedRole : "",
  data: hasValidSession ? parsedData : {},
};
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const response = axiosInstance.post("user/register", data);
    toast.promise(response, {
      loading: "Wait! creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create your account",
    });
    console.log("await response",await response);
    return await response;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const request = axiosInstance.post("/user/login", data);

      await toast.promise(request, {
        loading: "Loading...",
        success: (res) => res?.data?.message,
        error: (err) => err?.response?.data?.message || "Failed to log in",
      });

      // getting response resolved here
      const res = await request;
      return res.data.data;
    } catch (error) {
      // Must reject: returning undefined here would resolve the thunk and mark
      // the user as logged in with no role.
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Failed to log in"
      );
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.get("/user/logout");

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log out",
    });

    // getting response resolved here
    res = await res;
    console.log("response of logout in authSlice", res.data);
    return res.data;
  } catch (error) {
    toast.error(error.message);
  }
});
export const updateProfile = createAsyncThunk(
  "/auth/updateProfile",
  async (data) => {
    console.log("data",data);
    try {
      const response = axiosInstance.put(`/user/update/${data[0]}`, data[1]);
      toast.promise(response, {
        loading: "Wait! updating your account",
        success: (data) => {
          console.log(data);
          return data?.data?.message;
        },
        error: "Failed to update your account",
      });
      const res = await response;
      console.log("res in profileUpdate thunk", res?.data?.data);
      return res?.data?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

export const getUserData = createAsyncThunk("/auth/getData", async () => {
  try {
    const response = axiosInstance.get("/user/me");
    const data = await response;
    console.log("data", data);
    return data.data.data
  } catch (error) {
    toast.error(error?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // for user login
      .addCase(login.fulfilled, (state, action) => {
        if (!action?.payload?.role) return;
        localStorage.setItem("data", JSON.stringify(action.payload));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action.payload.role);
        state.isLoggedIn = true;
        state.data = action.payload;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state) => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("data");
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(logout.fulfilled, (state, action) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action?.payload?.role) return;
        localStorage.setItem("data", JSON.stringify(action.payload));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action.payload.role);
        state.isLoggedIn = true;
        state.data = action.payload;
        state.role = action.payload.role;
      });
  },
});
export default authSlice.reducer;
