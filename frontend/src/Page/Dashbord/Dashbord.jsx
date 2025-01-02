import DashStyle from "../Dashbord/Dashbord.module.css";
import { GetDashboard } from "../../Redux/Action/TaskAction";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
    const { dashboard, loading, error } = useSelector((state) => state?.tasks);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetDashboard());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={DashStyle.dashboardContainer}>
            <h1 className={DashStyle.title}>Employee Dashboard</h1>
            <div className={DashStyle.statsContainer}>
                <div className={DashStyle.statCard}>
                    <h2 className={DashStyle.statTitle}>Tasks Completed</h2>
                    <p className={DashStyle.statValue}>{dashboard?.completedTasks || 0}</p>
                </div>
                <div className={DashStyle.statCard}>
                    <h2 className={DashStyle.statTitle}>Hours Logged</h2>
                    <p className={DashStyle.statValue}>{dashboard?.totalTimeThisWeek || 0}</p>
                </div>
                <div className={DashStyle.statCard}>
                    <h2 className={DashStyle.statTitle}>Pending Tasks</h2>
                    <p className={DashStyle.statValue}>{dashboard?.taskStatusSummary['To-Do'] || 0}</p>
                </div>
            </div>
            <div className={DashStyle.tasksContainer}>
                <h2 className={DashStyle.subTitle}>Tasks This Month</h2>
                {dashboard?.tasksThisMonth?.map((task) => (
                    <div key={task._id} className={DashStyle.taskCard}>
                        <h3 className={DashStyle.taskTitle}>{task.title}</h3>
                        <p className={DashStyle.taskDescription}>{task.description}</p>
                        <p className={DashStyle.taskAssigned}>Assigned to: {task.assignedTo.username}</p>
                        <p className={DashStyle.taskStatus}>Status: {task.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
