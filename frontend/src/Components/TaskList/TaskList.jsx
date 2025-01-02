import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllTask, updateTaskTime, updateStatus } from "../../Redux/Action/TaskAction";
import { format } from "date-fns";
import taskstyles from "../TaskList/TaskList.module.css";

const TaskList = () => {
    const dispatch = useDispatch();
    const { task, loading, error } = useSelector((state) => state?.tasks);
console.log(task)
    const [selectedTime, setSelectedTime] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        dispatch(GetAllTask());
    }, [dispatch]);

    const handleTimeChange = (taskId, newTime) => {
        setSelectedTime((prevState) => ({
            ...prevState,
            [taskId]: newTime,
        }));
    };

    const handleUpdateTime = (taskId) => {
        const newEndTime = selectedTime[taskId];
        if (!newEndTime) {
            alert("Please select a date and time before updating!");
            return;
        }
        dispatch(updateTaskTime(taskId, newEndTime));
    };

    const handleStatusChange = (taskId, newStatus) => {
        setSelectedStatus((prevState) => ({
            ...prevState,
            [taskId]: newStatus,
        }));
        dispatch(updateStatus(taskId, newStatus));
    };

    return (
        <div className={taskstyles.taskListContainer}>
            <h2 className={taskstyles.heading}>Task List</h2>
            {loading && <p className={taskstyles.loading}>Loading tasks...</p>}
            {error && <p className={taskstyles.error}>Error: {error}</p>}
            {task?.tasks?.length > 0 ? (
                <ul className={taskstyles.taskList}>
                    {task.tasks.map((t) => (
                        <li key={t._id} className={taskstyles.taskItem}>

                            <h3 className={taskstyles.taskTitle}>{t.title}</h3>
                            <p className={taskstyles.taskDescription}>
                                {t.description}
                            </p>
                            <p className={taskstyles.taskProject}>
                                Project: {t.project}
                            </p>
                            <p className={taskstyles.taskDeadline}>
                                Deadline: {format(new Date(t.deadline), "PPPpp")}
                            </p>
                            <p className={taskstyles.taskStatus}>
                                Status: <strong>{t.status}</strong>
                            </p>

                            
                            <div className={taskstyles.statusSelect}>
                                <label htmlFor={`status-${t._id}`} className={taskstyles.statusLabel}>
                                    Update  Status:
                                </label>
                                <select
                                    id={`status-${t._id}`}
                                    value={selectedStatus[t._id] || t.status}
                                    onChange={(e) => handleStatusChange(t._id, e.target.value)}
                                    className={taskstyles.statusDropdown}
                                >
                                    <option value="To-Do">To-Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className={taskstyles.updatetime}>
                                <label className={taskstyles.updateTimeLabel}>
                                    Update Time:
                                    <input
                                        type="datetime-local"
                                        className={taskstyles.updateTimeInput}
                                        value={selectedTime[t._id] || ""}
                                        onChange={(e) =>
                                            handleTimeChange(t._id, e.target.value)
                                        }
                                    />
                                </label>

                                <button
                                    onClick={() => handleUpdateTime(t._id)}
                                    className={taskstyles.updateTimeButton}
                                >
                                    Update Time
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p className={taskstyles.noTasks}>No tasks available.</p>
            )}
        </div>
    );
};

export default TaskList;
