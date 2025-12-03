import { createSlice } from "@reduxjs/toolkit";


const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    downloadBookPopup: false, // <-- ADDED: State for Download Popup
    addNewAdminPopup: false,
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    // ADDED: Reducer for Download Popup
    toggleDownloadBookPopup(state) {
      state.downloadBookPopup = !state.downloadBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    closeAllPopup(state) {
      state.addBookPopup = false;
        state.addNewAdminPopup = false;
        state.readBookPopup = false;
        state.downloadBookPopup = false; // <-- ADDED: Close Download Popup
        state.settingPopup = false;
    },

  },
});


export const {
    closeAllPopup,
    toggleAddBookPopup,
    toggleAddNewAdminPopup,
    toggleReadBookPopup,
    toggleDownloadBookPopup, // <-- ADDED: Export the new action
    toggleSettingPopup
} = popupSlice.actions;

export default popupSlice.reducer;
