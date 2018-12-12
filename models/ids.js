'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	admin_id: Number,
	exhi_id: Number,
	schedule_id: Number,
	statis_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			admin_id: 0,
			exhi_id: 0,
			schedule_id: 0,
			statis_id: 0
		});
		newIds.save();
	}
})
export default Ids