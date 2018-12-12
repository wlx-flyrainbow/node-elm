'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const mettingSchema = new Schema({
	exhi_name: String,
	exhi_topic: String,
	exhi_time: String,
	exhi_date: String,
	id: Number,
	exhi_address: String,
	exhi_is_important: String,
	exhi_schedule: [],
	exhi_city_code: String,
	exhi_city_name: String
})

mettingSchema.index({id: 1});

const Metting = mongoose.model('Metting', mettingSchema);


export default Metting
