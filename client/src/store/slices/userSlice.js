import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    // ADDED: State to track errors and messages for cleanup
    error: null,
    message: null,
  },
  reducers: {
    fetchAllUsersRequest(state){
      state.loading = true;
      state.error = null; // Clear error on new request
    },
    fetchAllUsersSuccess(state, action){
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed(state, action){
      state.loading = false;
      state.error = action.payload; // Capture error message
    },
    addNewAdminRequest(state){
      state.loading= true;
      state.error = null; // Clear error on new request
    },
    addNewAdminSuccess(state){
      state.loading = false;
    },
    addNewAdminFailed(state, action){ // Action added to receive error message
      state.loading = false;
      state.error = action.payload; // Capture error message
    },
    // ADDED: The missing reset reducer
    resetUserSlice(state) {
        state.error = null;
        state.message = null;
        state.loading = false;
    }
  },

});

// EXPORTED: The missing action creator
export const { resetUserSlice } = userSlice.actions;

export const fetchAllUsers = () => async(dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await axios.get("https://book-hive-mt7z.onrender.com/api/v1/user/all", {withCredentials: true}).then(res => {
    dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users))
  }).catch(err =>{
    // Passed error message to failed action
    dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
  });
};


export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const res = await axios.post(
      "https://book-hive-mt7z.onrender.com/api/v1/user/add/new-admin",
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
    // Passed error message to failed action
    const errorMessage = err.response?.data?.message || "Something went wrong";
    dispatch(userSlice.actions.addNewAdminFailed(errorMessage));
    toast.error(errorMessage);
  }
};


export default userSlice.reducer;
