'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const mettingSchema = new Schema({
	metting_name: String,
	metting_time: String,
	id: Number,
	create_time: String,
	metting_address: String,
	metting_schedule: [
		{
			desc: String,
			time: String,
			id: Number,
			metting_id: Number,
			create_time: String
		}
	],
	city: String
})

mettingSchema.index({id: 1});

const Metting = mongoose.model('Metting', mettingSchema);


export default Metting
