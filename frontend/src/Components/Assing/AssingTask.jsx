import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllAdminTask, editTask, deleteTask } from "../../Redux/Action/TaskAction";
import { format } from "date-fns";
import AssingStyle from "../Assing/AssingTask.module.css";

const AssingTask = () => {
    const dispatch = useDispatch();
    const { adminData, loading, error } = useSelector((state) => state?.tasks);

    const [editMode, setEditMode] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [updatedTask, setUpdatedTask] = useState({
        title: "",
        description: "",
        deadline: "",
    });

    useEffect(() => {
        dispatch(GetAllAdminTask());
    }, [dispatch]);

    const handleEdit = (taskId) => {
        const task = adminData.tasks.find((task) => task._id === taskId);
        setTaskToEdit(task);
        setUpdatedTask({
            title: task.title,
            description: task.description,
            deadline: task.deadline,
        });
        setEditMode(true);
    };

    const handleDelete = (taskId) => {
        dispatch(deleteTask(taskId));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       
        dispatch(editTask(taskToEdit._id, updatedTask));
        setEditMode(false); 
    };

    return (
        <div className={AssingStyle.taskListContainer}>
            {loading && (
                <div className={AssingStyle.loading}>
                    <p>Loading tasks...</p> 
                </div>
            )}

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

           
            {editMode && taskToEdit && (
                <div className={AssingStyle.editFormContainer}>
                    <h2>Edit Task</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={updatedTask.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={updatedTask.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Deadline:</label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                value={updatedTask.deadline}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setEditMode(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Task List */}
            {adminData && adminData.tasks && adminData.tasks.length > 0 ? (
                adminData.tasks.map((task) => (
                    <div className={AssingStyle.taskItem} key={task._id}>
                        <div>
                            <h3 className={AssingStyle.taskTitle}>{task.title}</h3>
                            <p className={AssingStyle.taskDescription}>{task.description}</p>
                            <div className={AssingStyle.taskMetadata}>
                                <span className={AssingStyle.taskDeadline}>
                                    Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                                </span>
                                <span className={AssingStyle.assignedUser}>
                                    Assigned to: {task.assignedTo.username}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className={`${AssingStyle.statusBadge} ${AssingStyle[`status${task.status.replace(/ /g, '')}`]}`}>
                                {task.status}
                            </span>
                            <div className={AssingStyle.taskActions}>
                                <button
                                    className={AssingStyle.editButton}
                                    onClick={() => handleEdit(task._id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={AssingStyle.deleteButton}
                                    onClick={() => handleDelete(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                !loading && <p>No tasks available</p> 
            )}
        </div>
    );
};

export default AssingTask;
