import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    // RETAINED for Simple Reset
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      // Note: We don't authenticate user here on a simple password reset
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    }
  }
});

export const {
  registerRequest, registerSuccess, registerFailed,
  loginRequest, loginSuccess, loginFailed,
  logoutRequest, logoutSuccess, logoutFailed,
  getUserRequest, getUserSuccess, getUserFailed,
  // Removed: forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailed,
  resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed,
} = authSlice.actions;

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

// ... (register, login, logout, getUser thunks remain the same) ...

export const register = (data) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const res = await axios.post("https://book-hive-mt7z.onrender.com/api/v1/auth/register", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(registerSuccess(res.data));
  } catch (error) {
    dispatch(registerFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await axios.post("https://book-hive-mt7z.onrender.com/api/v1/auth/login", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutRequest());
  try {
    const res = await axios.get("https://book-hive-mt7z.onrender.com/api/v1/auth/logout", {
      withCredentials: true,
    });
    dispatch(logoutSuccess(res.data.message));
    dispatch(resetAuthSlice());
  } catch (error) {
    dispatch(logoutFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const res = await axios.get("https://book-hive-mt7z.onrender.com/api/v1/auth/me", {
      withCredentials: true,
    });
    dispatch(getUserSuccess(res.data));
  } catch (error) {
    dispatch(getUserFailed(error.response.data.message));
  }
};

// REMOVED: forgotPassword thunk (old flow)
// REMOVED: resetPassword thunk (old flow)

// NEW THUNK: Simple Password Reset (email + new password)
export const simpleResetPassword = (data) => async (dispatch) => {
  // data should contain { email, newPassword, confirmNewPassword }
  dispatch(resetPasswordRequest()); // Reusing resetPassword reducers
  try {
    const res = await axios.put(
      "https://book-hive-mt7z.onrender.com/api/v1/auth/password/simple-reset", // NEW ENDPOINT
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Uses resetPasswordSuccess reducer
    dispatch(resetPasswordSuccess(res.data));
  } catch (error) {
    // Uses resetPasswordFailed reducer
    dispatch(resetPasswordFailed(error.response.data.message));
  }
};


export const updatePassword = (data) => async (dispatch) => {
  dispatch(updatePasswordRequest());
  try {
    const res = await axios.put(`https://book-hive-mt7z.onrender.com/api/v1/auth/password/update`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(updatePasswordSuccess(res.data));
  } catch (error) {
    dispatch(updatePasswordFailed(error.response.data.message));
  }
};

export default authSlice.reducer;
