'use strict';

import admin from './admin'

export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/admin', admin);
}