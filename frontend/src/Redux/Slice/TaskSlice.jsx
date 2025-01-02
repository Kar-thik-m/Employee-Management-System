import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    tasks: [],            
    employeeActivity: null,
    dashboard: null,
    adminData: null,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        taskRequest(state) {
            state.loading = true;
            state.error = null;
        },
        taskSuccess(state, action) {
            state.loading = false;
            state.tasks = action.payload; // Assuming payload is an array of tasks
        },
        taskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        taskCreateRequest(state) {
            state.loading = true;
        },
        taskCreateSuccess(state, action) {
            state.loading = false;
            state.tasks.push(action.payload); // Push the newly created task to the tasks array
        },
        taskCreateFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        AdmintaskRequest(state) {
            state.loading = true;
            state.error = null;
        },
        AdmintaskSuccess(state, action) {
            state.loading = false;
            state.adminData = action.payload;
        },
        AdmintaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        statusUpdateRequest(state) {
            state.statusUpdateLoading = true;
            state.error = null;
        },
        statusUpdateSuccess(state, action) {
            state.statusUpdateLoading = false;
            if (state.tasks) {
                const task = state.tasks.find((task) => task._id === action.payload._id);
                if (task) task.status = action.payload.status;
            }
        },
        statusUpdateFailure(state, action) {
            state.statusUpdateLoading = false;
            state.error = action.payload;
        },

        timeUpdateRequest(state) {
            state.timeUpdateLoading = true;
            state.error = null;
        },
        timeUpdateSuccess(state, action) {
            state.timeUpdateLoading = false;
            if (state.tasks) {
                const task = state.tasks.find((task) => task._id === action.payload._id);
                if (task) task.timeLog = action.payload.timeLog;
            }
        },
        timeUpdateFailure(state, action) {
            state.timeUpdateLoading = false;
            state.error = action.payload;
        },

        employeeActivityRequest(state) {
            state.loading = true;
            state.error = null;
        },
        employeeActivitySuccess(state, action) {
            state.loading = false;
            state.employeeActivity = action.payload;
        },
        employeeActivityFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        dashboardRequest(state) {
            state.loading = true;
            state.error = null;
        },
        dashboardSuccess(state, action) {
            state.loading = false;
            state.dashboard = action.payload;
        },
        dashboardFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // Action to edit a task
        editTaskRequest(state) {
            state.loading = true;
            state.error = null;
        },
        editTaskSuccess(state, action) {
            state.loading = false;
            const updatedTask = action.payload;
            const index = state.tasks.findIndex((task) => task._id === updatedTask._id);
            if (index !== -1) {
                state.tasks[index] = updatedTask; // Update the task in the tasks array
            }
        },
        editTaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // Action to delete a task
        deleteTaskRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteTaskSuccess(state, action) {
            state.loading = false;
            const taskId = action.payload;
            state.tasks = state.tasks.filter((task) => task._id !== taskId); // Remove task from tasks array
        },
        deleteTaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    taskRequest,
    taskSuccess,
    taskFailure,
    taskCreateRequest,
    taskCreateSuccess,
    taskCreateFailure,
    AdmintaskFailure,
    AdmintaskRequest,
    AdmintaskSuccess,
    statusUpdateRequest,
    statusUpdateSuccess,
    statusUpdateFailure,
    timeUpdateRequest,
    timeUpdateSuccess,
    timeUpdateFailure,
    employeeActivityRequest,
    employeeActivitySuccess,
    employeeActivityFailure,
    dashboardRequest,
    dashboardSuccess,
    dashboardFailure,
    editTaskRequest,
    editTaskSuccess,
    editTaskFailure,
    deleteTaskRequest,
    deleteTaskSuccess,
    deleteTaskFailure,
} = taskSlice.actions;

export default taskSlice.reducer;
