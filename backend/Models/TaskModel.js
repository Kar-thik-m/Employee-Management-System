import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['To-Do', 'In Progress', 'Completed'],
        default: 'To-Do'
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required']
    },
    project: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
});


export const TaskModel = mongoose.model('Task', taskSchema);
