import {
    taskRequest, taskFailure, taskSuccess, timeUpdateFailure,
    timeUpdateRequest, timeUpdateSuccess, statusUpdateFailure,
    statusUpdateRequest, statusUpdateSuccess,
    employeeActivityRequest,
    employeeActivityFailure,
    employeeActivitySuccess, dashboardFailure, dashboardRequest, dashboardSuccess,
    AdmintaskFailure, AdmintaskRequest, AdmintaskSuccess,
    editTaskFailure, editTaskRequest, editTaskSuccess,
    deleteTaskFailure, deleteTaskRequest, deleteTaskSuccess,
    taskCreateFailure, taskCreateRequest, taskCreateSuccess
} from "../Slice/TaskSlice";
import { Url } from "../../../config";
// Get all tasks for user
export const GetAllTask = () => async (dispatch) => {
    try {
        dispatch(taskRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(taskFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/get-all-task`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(taskFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(taskSuccess(data));
    } catch (error) {
        dispatch(taskFailure(`Network error: ${error.message}`));
    }
};

// Update task deadline
export const updateTaskTime = (id, deadline) => async (dispatch) => {
    try {
        dispatch(timeUpdateRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(timeUpdateFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/update-time/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deadline }),
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(timeUpdateFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(timeUpdateSuccess(data.deadline));
    } catch (error) {
        dispatch(timeUpdateFailure(`Network error: ${error.message}`));
    }
};

// Update task status
export const updateStatus = (id, status) => async (dispatch) => {
    try {
        dispatch(statusUpdateRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(statusUpdateFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/update-status/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(statusUpdateFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(statusUpdateSuccess(data));
    } catch (error) {
        dispatch(statusUpdateFailure(`Network error: ${error.message}`));
    }
};

// Get Dashboard data
export const GetDashboard = () => async (dispatch) => {
    try {
        dispatch(dashboardRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(dashboardFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/dashboard`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(dashboardFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(dashboardSuccess(data));
    } catch (error) {
        dispatch(dashboardFailure(`Network error: ${error.message}`));
    }
};

// Admin - Get all tasks
export const GetAllAdminTask = () => async (dispatch) => {
    try {
        dispatch(AdmintaskRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(AdmintaskFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/get-all-task-by-creator`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(AdmintaskFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(AdmintaskSuccess(data));
    } catch (error) {
        dispatch(AdmintaskFailure(`Network error: ${error.message}`));
    }
};

// Get employee activity
export const GetEmployeeActivity = () => async (dispatch) => {
    try {
        dispatch(employeeActivityRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(employeeActivityFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/view-employee-activity`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(employeeActivityFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(employeeActivitySuccess(data));
    } catch (error) {
        dispatch(employeeActivityFailure(`Network error: ${error.message}`));
    }
};

// Edit task
export const editTask = (id, updatedData) => async (dispatch) => {
    try {
        dispatch(editTaskRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(editTaskFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/update-task/${id}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(editTaskFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(editTaskSuccess(data));
    } catch (error) {
        dispatch(editTaskFailure(`Network error: ${error.message}`));
    }
};

// Delete task
export const deleteTask = (id) => async (dispatch) => {
    try {
        dispatch(deleteTaskRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(deleteTaskFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/delete-task/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(deleteTaskFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(deleteTaskSuccess(data));

    } catch (error) {
        dispatch(deleteTaskFailure(`Network error: ${error.message}`));
    }
};

// Create task
export const createTask = (taskData) => async (dispatch) => {
    try {
        dispatch(taskCreateRequest());

        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(taskCreateFailure('Token is missing. Please log in.'));
            return;
        }

        const response = await fetch(`${Url}/api/task/create-task`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(taskCreateFailure(`Error: ${response.status} - ${error}`));
            return;
        }

        const data = await response.json();
        dispatch(taskCreateSuccess(data));
    } catch (error) {
        dispatch(taskCreateFailure(`Network error: ${error.message}`));
    }
};
