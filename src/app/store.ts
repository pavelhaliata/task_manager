import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "./app_reducer";
import {todolistReducer} from "../features/Todolist/todolist-reducer";
import {tasksReducer} from "../features/Task/tasks-reducer";
import {authReducer} from "./auth_reducer";



export type AppStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    authData: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store