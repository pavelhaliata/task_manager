import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError,} from "../utils/error-utils";
import {currentAuthData, isLoginIn} from "./auth_reducer";
import {authAPI} from "../api/todolist-api";
import {AxiosError} from "axios/index";

export enum StatusRequest {
    idle = "idle",
    loading = "loading",
    succeeded = "succeeded",
    failed = " failed",
}

const initialState = {
    error: null as string | null,
    status: StatusRequest.idle as StatusRequest,
    isInitialization: false as boolean,
};

export const appInitializationAsync = createAsyncThunk(
    "app/initialization",
    async (_, {rejectWithValue, dispatch}) => {
        try {
            const response = await authAPI.getAuthData();
            if (response.data.resultCode === 0) {
                dispatch(isLoginIn({isLoggedIn: true}));
                dispatch(currentAuthData(response.data.data));
            } else {
                handleServerAppError(response.data, dispatch);
            }
            return {isAuthorized: true};
        } catch (err) {
            let error = err as AxiosError;
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(error);

        }
    }
);

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setAppStatusRequest: (
            state,
            action: PayloadAction<{ status: StatusRequest }>
        ) => {
            state.status = action.payload.status;
        },
        setAppInitialization: (
            state,
            action: PayloadAction<{ isAuthorized: boolean }>
        ) => {
            state.isInitialization = action.payload.isAuthorized;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(appInitializationAsync.pending, (state, action) => {

            })
            .addCase(appInitializationAsync.fulfilled, (state, action) => {
                state.isInitialization = action.payload.isAuthorized
            })
            .addCase(appInitializationAsync.rejected, (state, action) => {
                if (action.error.message)
                    state.error = action.error.message
            })
    },
});

export const appReducer = slice.reducer;
export const {setAppError, setAppStatusRequest} = slice.actions;

// export const appReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
//     switch (action.type) {
//         case "APP/SET_ERROR":
//             return {
//                 ...state,
//                 error: action.payloadType
//             }
//         case "APP/SET_STATUS":
//             return {
//                 ...state,
//                 status: action.payloadType
//             }
//         case "APP/IS_AUTHORIZED":
//         return {
//             ...state,
//             isInitialization: action.payloadType
//         }
//         default:
//             return state
//     }
// }

// actions
// export const setAppError = (error: string | null) => ({type: "APP/SET_ERROR", payloadType: error} as const)
// export const setAppStatusRequest = (status: StatusRequest) => ({type: "APP/SET_STATUS", payloadType: status} as const)
// export const setAppInitialization = (isAuthorized: boolean) => ({type: "APP/IS_AUTHORIZED", payloadType: isAuthorized} as const)

// thunks


// export const _appInitializationAsync = () => (dispatch: AppDispatch) => {
//   authAPI
//     .getAuthData()
//     .then((response) => {
//       if (response.data.resultCode === 0) {
//         dispatch(isLoginIn({ isLoggedIn: true }));
//         dispatch(currentAuthData(response.data.data));
//       } else {
//         handleServerAppError(response.data, dispatch);
//       }
//       dispatch(setAppInitialization({ isAuthorized: true }));
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch);
//     });
// };

// types


// type ErrorActionType = ReturnType<typeof setAppError>
// type StatusRequestActionType = ReturnType<typeof setAppStatusRequest>
// type IsAuthorizedType = ReturnType<typeof setAppInitialization>

// type ActionType =
//     | ErrorActionType
//     | StatusRequestActionType
//     | IsAuthorizedType
