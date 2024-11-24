import { createSlice } from "@reduxjs/toolkit";

    
const initialState = {
    currentInput: "",
    currentPage: 1,
    loading: true,
    inputShowing: false,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setCurrentInput(state, action) {
            state.currentInput = action.payload;
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setInputShowing(state, action) {
            state.inputShowing = action.payload;
        }
    }
});


export const {setCurrentInput, setCurrentPage, setLoading, setInputShowing} = searchSlice.actions;

export default searchSlice.reducer;