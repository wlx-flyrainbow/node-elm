'use strict';

import admin from './admin'
import metting from './metting'

export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/admin', admin);
	app.use('/metting', metting);
}