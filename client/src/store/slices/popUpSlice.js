import { createSlice } from "@reduxjs/toolkit";


const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    // REMOVED: recordBookPopup: false,
    // REMOVED: returnBookPopup: false,
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
    // REMOVED: toggleRecordBookPopup
    // REMOVED: toggleReturnBookPopup
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    closeAllPopup(state) {
      state.addBookPopup = false;
        state.addNewAdminPopup = false;
        state.readBookPopup = false;
        // REMOVED: state.recordBookPopup = false;
        // REMOVED: state.returnBookPopup = false;
        state.settingPopup = false;
    },

  },
});


export const { closeAllPopup, toggleAddBookPopup, toggleAddNewAdminPopup, toggleReadBookPopup, toggleSettingPopup } = popupSlice.actions; // Export list updated

export default popupSlice.reducer;
