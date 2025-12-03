import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    fetchAllUsersRequest(state){
      state.loading = true;
      state.error = null;
    },
    fetchAllUsersSuccess(state, action){
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state, action){
      state.loading = false;
      state.error = action.payload;
    },
    addNewAdminRequest(state){
      state.loading= true;
      state.error = null;
    },
    addNewAdminSuccess(state){
      state.loading = false;
    },
    addNewAdminFailed(state, action){
      state.loading = false;
      state.error = action.payload;
    },
    // 🚀 NEW REDUCERS FOR USER DELETION
    deleteUserRequest(state) {
        state.loading = true;
        state.error = null;
        state.message = null;
    },
    deleteUserSuccess(state, action) {
        state.loading = false;
        state.message = action.payload;
    },
    deleteUserFailed(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    // END NEW REDUCERS
    resetUserSlice(state) {
        state.error = null;
        state.message = null;
        state.loading = false;
    }
  },

});

export const { resetUserSlice } = userSlice.actions;

export const fetchAllUsers = () => async(dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await axios.get("http://localhost:4000/api/v1/user/all", {withCredentials: true}).then(res => {
    dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users))
  }).catch(err =>{
    dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
  });
};


export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const res = await axios.post(
      "http://localhost:4000/api/v1/user/add/new-admin",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.addNewAdminSuccess());
    toast.success(res.data.message);
    dispatch(toggleAddNewAdminPopup());
    dispatch(fetchAllUsers());
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Something went wrong";
    dispatch(userSlice.actions.addNewAdminFailed(errorMessage));
    toast.error(errorMessage);
  }
};

// 🚀 NEW THUNK: Admin Delete User
export const deleteUser = (userId) => async (dispatch) => {
    dispatch(userSlice.actions.deleteUserRequest());
    try {
        const res = await axios.delete(
            `http://localhost:4000/api/v1/user/admin/delete/${userId}`,
            { withCredentials: true }
        );

        const successMessage = res.data.message || "User deleted successfully!";

        dispatch(userSlice.actions.deleteUserSuccess(successMessage));
        // Refresh the list of users after successful deletion
        dispatch(fetchAllUsers());
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete user.";
        toast.error(errorMessage);
        dispatch(userSlice.actions.deleteUserFailed(errorMessage));
    }
};


export default userSlice.reducer;
