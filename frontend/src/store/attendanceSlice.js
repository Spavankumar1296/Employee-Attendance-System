import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
    attendance: [],
    todayStatus: null,
    summary: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const checkIn = createAsyncThunk(
    'attendance/checkIn',
    async (_, thunkAPI) => {
        try {
            const response = await api.post('/attendance/checkin');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const checkOut = createAsyncThunk(
    'attendance/checkOut',
    async (_, thunkAPI) => {
        try {
            const response = await api.post('/attendance/checkout');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getTodayStatus = createAsyncThunk(
    'attendance/getTodayStatus',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/attendance/today');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getMyHistory = createAsyncThunk(
    'attendance/getMyHistory',
    async (page = 1, thunkAPI) => {
        try {
            const response = await api.get(`/attendance/my-history?page=${page}`);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkIn.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.todayStatus = action.payload;
            })
            .addCase(checkIn.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(checkOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.todayStatus = action.payload;
            })
            .addCase(checkOut.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getTodayStatus.fulfilled, (state, action) => {
                state.todayStatus = action.payload;
            })
            .addCase(getMyHistory.fulfilled, (state, action) => {
                state.attendance = action.payload.attendance;
            });
    },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
