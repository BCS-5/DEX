import { createSlice } from "@reduxjs/toolkit";

export interface eventState {
  onClickOutside: boolean;
}

export const eventsSlice = createSlice({
  name: "events",
  initialState: {
    onClickOutside: false,
  } as eventState,
  reducers: {
    onClickOutside: (state) => {
      state.onClickOutside = !state.onClickOutside;
    },
  },
});

export const { onClickOutside } = eventsSlice.actions;

export default eventsSlice.reducer;
