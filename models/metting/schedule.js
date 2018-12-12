'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
	desc: String,
	time: String,
	id: Number,
	exhi_id: Number,
	create_time: String
})

ScheduleSchema.index({id: 1});

const Schedule = mongoose.model('Schedule', ScheduleSchema);


export default Schedule
