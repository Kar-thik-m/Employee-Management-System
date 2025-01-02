import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
  
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    totalHours: {
        type: Number,
        required: true
    },
});

export const Timemodel = mongoose.model('TimeLog', timeLogSchema);
