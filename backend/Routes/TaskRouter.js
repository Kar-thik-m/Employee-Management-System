import express from 'express';
import { TaskModel } from '../Models/TaskModel.js';
import { Timemodel } from '../Models/TimeModel.js';
import { usermodel } from '../Models/UserModels.js';
import { authenticateToken, authorized } from '../Middlewares/Authentication.js';

const TaskRouter = express.Router();

////////////////////////  Admin  ////////////////////////////

TaskRouter.post('/create-task', authenticateToken, authorized('admin'), async (req, res) => {
    try {
        const { title, description, deadline, project, status, assignedToEmail } = req.body;


        if (!title || !deadline || !project || !assignedToEmail) {
            return res.status(400).json({
                success: false,
                message: 'Title, Deadline, Project, and AssignedToEmail are required fields.'
            });
        }


        const assignedUser = await usermodel.findOne({ email: assignedToEmail });
        if (!assignedUser) {
            return res.status(404).json({
                success: false,
                message: 'Assigned user not found with the provided email.'
            });
        }


        const newTask = new TaskModel({
            assignedTo: assignedUser._id,
            taskCreator: req.user._id,
            title,
            description,
            status,
            deadline,
            project
        });

        const savedTask = await newTask.save();


        const startTime = new Date();
        const endTime = new Date(savedTask.deadline);
        const totalHours = (endTime - startTime) / (1000 * 60 * 60);

        const newTimeLog = new Timemodel({
            taskId: savedTask._id,
            startTime,
            endTime,
            totalHours,
        });

        const savedTimeLog = await newTimeLog.save();

        return res.status(201).json({
            success: true,
            savedTask,
            savedTimeLog,
            message: 'Task assigned to the user successfully using email.'
        });
    } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not assign task.'
        });
    }
});


TaskRouter.get('/get-all-task-by-creator', authenticateToken, authorized('admin'), async (req, res) => {
    try {
        const creatorId = req.user._id;


        const tasks = await TaskModel.find({ taskCreator: creatorId }).populate('assignedTo', 'username userimage');



        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tasks found for this creator.'
            });
        }

        return res.status(200).json({
            success: true,
            tasks,

            message: 'Tasks retrieved successfully.'
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not fetch tasks.'
        });
    }
});


TaskRouter.put('/update-task/:taskId', authenticateToken, authorized('admin'), async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, deadline, project, status, assignedToEmail } = req.body;


        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }


        if (assignedToEmail) {
            const assignedUser = await usermodel.findOne({ email: assignedToEmail });
            if (assignedUser) {
                task.assignedTo = assignedUser._id;
            } else {
                return res.status(404).json({ success: false, message: 'Assigned user not found.' });
            }
        }


        task.title = title || task.title;
        task.description = description || task.description;
        task.deadline = deadline || task.deadline;
        task.project = project || task.project;
        task.status = status || task.status;

        const updatedTask = await task.save();

        return res.status(200).json({
            success: true,
            updatedTask,
            message: 'Task updated successfully.'
        });
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ success: false, message: 'Server error. Could not update task.' });
    }
});




TaskRouter.delete('/delete-task/:taskId', authenticateToken, authorized('admin'), async (req, res) => {
    try {
        const { taskId } = req.params;


        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }


        await TaskModel.findByIdAndDelete(taskId);


        await Timemodel.deleteMany({ taskId });

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not delete task.'
        });
    }
});


TaskRouter.get('/view-employee-activity', authenticateToken, authorized('admin'), async (req, res) => {
    try {

        const tasks = await TaskModel.find()
            .populate('assignedTo', 'username userimage')
            .populate('taskCreator', 'username userimage');

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tasks found for any employees.'
            });
        }


        const taskIds = tasks.map(task => task._id);
        const timeLogs = await Timemodel.find({ taskId: { $in: taskIds } });


        const performanceData = tasks.map(task => {
            const taskTimeLogs = timeLogs.filter(log => log.taskId.toString() === task._id.toString());
            const totalTimeSpent = taskTimeLogs.reduce((total, log) => total + log.totalHours, 0);

            return {
                taskId: task._id,
                title: task.title,
                status: task.status,
                assignedTo: task.assignedTo,
                taskCreator: task.taskCreator,
                deadline: task.deadline,
                timeLogs: taskTimeLogs,
                totalTimeSpent,
                progress: task.status === 'Completed' ? 'Completed' : 'In Progress',
            };
        });

        return res.status(200).json({
            success: true,
            performanceData,
            message: 'Detailed employee activity data retrieved successfully.'
        });

    } catch (error) {
        console.error('Error retrieving employee activity data:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not retrieve employee activity data.'
        });
    }
});

///////////////////////  user //////////////////////////////////



TaskRouter.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());


        const tasks = await TaskModel.find({ assignedTo: userId })
            .populate('assignedTo', 'username userimage')
            .populate('taskCreator', 'username userimage');

        const taskStatusSummary = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});


        const timeLogs = await Timemodel.find({
            taskId: { $in: tasks.map(task => task._id) },
            startTime: { $gte: startOfWeek }
        });


        const totalTimeThisWeek = timeLogs.reduce((acc, log) => acc + log.totalHours, 0);


        const tasksThisMonth = tasks.filter(task => {
            const taskDate = new Date(task.deadline);
            return taskDate >= startOfMonth;
        });

        // Calculate task completion (tasks completed vs. remaining)
        const completedTasks = tasks.filter(task => task.status === 'Completed');
        const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
        const toDoTasks = tasks.filter(task => task.status === 'To-Do');

        return res.status(200).json({
            success: true,
            taskStatusSummary,
            totalTimeThisWeek,
            tasksThisMonth,
            completedTasks: completedTasks.length,
            inProgressTasks: inProgressTasks.length,
            toDoTasks: toDoTasks.length,
            message: 'Dashboard data retrieved successfully.'
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not fetch dashboard data.'
        });
    }
});


TaskRouter.get('/get-all-task', authenticateToken, async (req, res) => {
    try {

        const tasks = await TaskModel.find({ assignedTo: req.user._id }).populate('assignedTo', 'username userimage');


        const times = await Timemodel.find({ taskId: { $in: tasks.map(task => task._id) } });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tasks found.'
            });
        }

        return res.status(200).json({
            success: true,
            tasks,
            times,
            message: 'Tasks retrieved successfully.'
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not fetch tasks.'
        });
    }
});


TaskRouter.get('/get-bytask/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const task = await TaskModel.findById(id);
        const time = await Timemodel.find({ taskId: id })

        if (!task || !time) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        return res.status(200).json({
            success: true,
            task,
            time,
            message: 'Task retrieved successfully.'
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not fetch task.'
        });
    }
});






TaskRouter.put('/update-time/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { deadline } = req.body;


        if (!deadline) {
            return res.status(400).json({
                success: false,
                message: 'Deadline is required to update the task and time log.'
            });
        }


        const parsedDeadline = new Date(deadline);


        if (isNaN(parsedDeadline)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please provide a valid deadline.'
            });
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: id },
            { $set: { deadline: parsedDeadline } },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or you are not authorized to update this task.'
            });
        }


        const startTime = new Date();
        const endTime = parsedDeadline;
        const totalHours = (endTime - startTime) / (1000 * 60 * 60);

        const updatedTimeLog = await Timemodel.findOneAndUpdate(
            { taskId: id },
            { startTime, endTime, totalHours },
            { new: true }
        );

        if (!updatedTimeLog) {
            return res.status(404).json({
                success: false,
                message: 'Time log not found for this task.'
            });
        }

        return res.status(200).json({
            success: true,
            updatedTask,
            updatedTimeLog,
            message: 'Task deadline and time log updated successfully.'
        });

    } catch (error) {
        console.error('Error updating task and time log:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not update task and time log.'
        });
    }
});

TaskRouter.put('/update-status/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['To-Do', 'In Progress', 'Completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values are: ${validStatuses.join(', ')}.`
            });
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: id },
            { $set: { status } },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or you are not authorized to update this task.'
            });
        }

        return res.status(200).json({
            success: true,
            updatedTask,
            message: 'Task status updated successfully.'
        });
    } catch (error) {
        console.error('Error updating task status:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Could not update task status.'
        });
    }
});




export default TaskRouter;
