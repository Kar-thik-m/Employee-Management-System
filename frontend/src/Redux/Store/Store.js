
import { configureStore } from '@reduxjs/toolkit';
import TaskSliceRouter from '../Slice/TaskSlice';


const store = configureStore({
    devTools: true,
    reducer: {
        tasks: TaskSliceRouter
    },
});

export default store;