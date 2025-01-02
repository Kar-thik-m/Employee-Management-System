import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contextApi/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { GetEmployeeActivity, createTask } from '../../Redux/Action/TaskAction';
import Astyles from './AdminDashboard.module.css';
import { format } from 'date-fns';

const Admindashboard = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const employeeActivity = useSelector((state) => state?.tasks.employeeActivity);
    const loading = useSelector((state) => state?.tasks.loading);
    const error = useSelector((state) => state?.tasks.error);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        deadline: '',
        project: '',
        assignedToEmail: ''
    });


    const handleCreateTaskClick = () => {
        setIsFormVisible(!isFormVisible);
    };


    const handleCloseForm = () => {
        setIsFormVisible(false);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle task form submission
    const handleCreateTask = (e) => {
        e.preventDefault();
        dispatch(createTask(taskData));
        setIsFormVisible(false);
    };


    useEffect(() => {
        dispatch(GetEmployeeActivity());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={Astyles.adminDashboard}>
            <div className={Astyles.createbutton} onClick={handleCreateTaskClick}>
                Create Task
            </div>

            {isFormVisible && (
                <div className={Astyles.createTaskForm}>
                    <h2>Create New Task</h2>
                    <form onSubmit={handleCreateTask}>
                        <div>
                            <label htmlFor="title">Task Title:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={taskData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={taskData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="deadline">Deadline:</label>
                            <input
                                type="datetime-local"
                                id="deadline"
                                name="deadline"
                                value={taskData.deadline}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="project">Project:</label>
                            <input
                                type="text"
                                id="project"
                                name="project"
                                value={taskData.project}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="assignedToEmail">Assigned To (Email):</label>
                            <input
                                type="email"
                                id="assignedToEmail"
                                name="assignedToEmail"
                                value={taskData.assignedToEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <button type="submit">Create Task</button>
                        </div>
                    </form>

                    <div className={Astyles.closeButton} onClick={handleCloseForm}>
                        Close
                    </div>
                </div>
            )}

            <div className={Astyles.dashboardContent}>
                <h1>Admin Dashboard</h1>

                <div className={Astyles.adminStyle}>
                    <h2>Employee Activity</h2>
                    <table className={Astyles.activityTable}>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Task Title</th>
                                <th>Total Hours Spent</th>
                                <th>Status</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeActivity && employeeActivity.performanceData && employeeActivity.performanceData.length > 0 ? (
                                employeeActivity.performanceData.map((activity) => (
                                    <tr key={activity.taskId}>
                                        <td>{activity.assignedTo.username}</td>
                                        <td>{activity.title}</td>
                                        <td>
                                            {activity.timeLogs && activity.timeLogs.length > 0
                                                ? activity.timeLogs[0]?.totalHours?.toFixed(2) + ' hrs'
                                                : 'N/A'}
                                        </td>
                                        <td>{activity.status}</td>
                                        <td>{format(new Date(activity.deadline), 'yyyy-MM-dd')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No activity data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admindashboard;
