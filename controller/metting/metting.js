'use strict';

import MettingModel from '../../models/metting/metting'
import ScheduleModel from '../../models/metting/schedule'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Metting extends BaseComponent{
	constructor(){
		super();
		this.defaultData = [{
			name: '热销榜',
			description: '大家喜欢吃，才叫真好吃。', 
			icon_url: "5da3872d782f707b4c82ce4607c73d1ajpeg",
			is_selected: true,
			type: 1,
			foods: [],
		}, {
			name: '优惠',
			description: '美味又实惠, 大家快来抢!', 
			icon_url: "4735c4342691749b8e1a531149a46117jpeg",
			type: 1,
			foods: [],
		}]
		// this.initData = this.initData.bind(this);
		this.addSchedule = this.addSchedule.bind(this);
		this.getMetting = this.getMetting.bind(this);
		this.getAllMetting = this.getAllMetting.bind(this);
		this.addMetting = this.addMetting.bind(this);
		this.getSpecfoods = this.getSpecfoods.bind(this);
		this.updateFood = this.updateFood.bind(this);
	}
	/* async initData(metting_id){
		for (let i = 0; i < this.defaultData.length; i++) {
			let metting_id;
			try{
				metting_id = await this.getId('metting_id');
			}catch(err){
				console.log('获取metting_id失败');
				throw new Error(err);
			}
			const defaultData = this.defaultData[i];
			const Metting = {...defaultData, id: metting_id};
			const newFood = new MenuModel(Metting);
			try{
				await newFood.save();
				console.log('初始化食品数据成功');
			}catch(err){
				console.log('初始化食品数据失败');
				throw new Error(err);
			}
		}
	} */
	async addMetting(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			try{
				if (!fields.metting_name) {
					throw new Error('必须填写会议名称');
				}else if(!fields.metting_time){
					throw new Error('必须填写会议时间');
				}else if(!fields.metting_address){
					throw new Error('必须填写会议地址');
				}else if(!fields.city){
					throw new Error('必须填写会议城市');
				}
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: err.message
				})
				return
			}
			let metting_id;
			try{
				metting_id = await this.getId('metting_id');
			}catch(err){
				console.log('获取metting_id失败');
				res.send({
					type: 'ERROR_DATA',
					message: '获取数据失败'
				})
				return
			}
			const mettingObj = {
				metting_name: fields.metting_name,
				metting_time: fields.metting_time,
				id: metting_id,
				create_time: dtime().format('YYYY-MM-DD HH:mm'),
				metting_address: fields.metting_address,
				metting_schedule: [],
				city: fields.city
			}
			const newMetting = new MettingModel(mettingObj);
			// await MettingModel.create(newMetting)
			try{
				await newMetting.save();
				res.send({
					status: 1,
					success: '添加会议成功',
				})
			}catch(err){
				console.log('保存数据失败');
				res.send({
					status: 0,
					type: 'ERROR_IN_SAVE_DATA',
					message: '保存数据失败',
				})
			}
		})
	}
	async getAllMetting(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const allAdmin = await MettingModel.find({}).sort({id: -1}).skip(Number(offset)).limit(Number(limit))
			res.send({
				status: 1,
				data: allAdmin,
			})
		}catch(err){
			console.log('获取会议列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_ADMIN_LIST',
				message: '获取会议列表失败'
			})
		}
	}
	async getMetting(req, res, next){
		const metting_id = req.params.metting_id;
		try{
			const Metting_list = await MettingModel.find({metting_id});
			res.send({
				status: 1,
				Metting_list,
			})
		}catch(err){
			console.log('获取会议列表失败');
			res.send({
				status: 0,
				type: 'ERROR_GET_DATA',
				message: '获取数据失败'
			})
		}
	}
	async addSchedule(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			try{
				if (!fields.desc) {
					throw new Error('必须填写日程名称');
				}else if(!fields.metting_id){
					throw new Error('会议ID错误');
				}else if(!fields.time){
					throw new Error('必须填写日程时间');
				}
			}catch(err){
				console.log('前台参数错误', err.message);
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: err.message
				})
				return
			}
			let Metting;
			let restaurant;
			try{
				Metting = await MettingModel.findOne({id: fields.metting_id});
			}catch(err){
				console.log('获取会议ID失败');
				res.send({
					status: 0,
					type: 'ERROR_DATA',
					message: '添加日程失败'
				})
				return
			}
			let schedule_id;
			try{
				schedule_id = await this.getId('schedule_id');
			}catch(err){
				console.log('获取schedule_id失败');
				res.send({
					status: 0,
					type: 'ERROR_DATA',
					message: '添加日程失败'
				})
				return
			}
			const newSchedule = {
				metting_id: fields.metting_id,
				id: schedule_id,
				desc: fields.desc,
				create_time: dtime().format('YYYY-MM-DD HH:mm'),
				time: fields.time
			}
			try{
				const scheduleEntity = await ScheduleModel.create(newSchedule);
				Metting.metting_schedule.push(scheduleEntity);
				Metting.markModified('metting_schedule');
				await Metting.save();
				res.send({
					status: 1,
					success: '添加日程成功',
				});
			}catch(err){
				console.log('保存日程到数据库失败', err);
				res.send({
					status: 0,
					type: 'ERROR_DATA',
					message: '添加日程失败'
				})
			}
		})
	}
	async getSpecfoods(fields, item_id){
		let specfoods = [], specifications = [];
		if (fields.specs.length < 2) {
			let food_id, sku_id;
			try{
				sku_id = await this.getId('sku_id');
				food_id = await this.getId('food_id');
			}catch(err){
				throw new Error('获取sku_id、food_id失败')
			}
			specfoods.push({
				packing_fee: fields.specs[0].packing_fee,
				price: fields.specs[0].price,
				specs: [],
				specs_name: fields.specs[0].specs,
				name: fields.name,
				item_id,
				sku_id,
				food_id,
				restaurant_id: fields.restaurant_id,
				recent_rating: (Math.random()*5).toFixed(1),
				recent_popularity: Math.ceil(Math.random()*1000),
			})
		}else{
			specifications.push({
				values: [],
				name: "规格"
			})
			for (let i = 0; i < fields.specs.length; i++) {
				let food_id, sku_id;
				try{
					sku_id = await this.getId('sku_id');
					food_id = await this.getId('food_id');
				}catch(err){
					throw new Error('获取sku_id、food_id失败')
				}
				specfoods.push({
					packing_fee: fields.specs[i].packing_fee,
					price: fields.specs[i].price,
					specs: [{
						name: "规格",
						value: fields.specs[i].specs
					}],
					specs_name: fields.specs[i].specs,
					name: fields.name,
					item_id,
					sku_id,
					food_id,
					restaurant_id: fields.restaurant_id,
					recent_rating: (Math.random()*5).toFixed(1),
					recent_popularity: Math.ceil(Math.random()*1000),
				})
				specifications[0].values.push(fields.specs[i].specs);
			}
		}
		return [specfoods, specifications]
	}
	async getMenu(req, res, next){
		const restaurant_id = req.query.restaurant_id;
		const allMenu = req.query.allMenu;
		if (!restaurant_id || !Number(restaurant_id)) {
			console.log('获取餐馆参数ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '餐馆ID参数错误',
			})
			return
		}
		let filter;
		if (allMenu) {
			filter = {restaurant_id}
		}else{
			filter = {restaurant_id, $where: function(){return this.foods.length}};
		}
		try{
			const menu = await MenuModel.find(filter, '-_id');
			res.send(menu);
		}catch(err){
			console.log('获取食品数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取食品数据失败'
			})
		}
	}
	async getMenuDetail(req, res, next){
		const metting_id = req.params.metting_id;
		if (!metting_id || !Number(metting_id)) {
			console.log('获取Menu详情参数ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'Menu ID参数错误',
			})
			return
		}
		try{
			const menu = await MenuModel.findOne({id: metting_id}, '-_id');
			res.send(menu)
		}catch(err){
			console.log('获取Menu详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取Menu详情失败'
			})
		}
	}
	async getFoods(req, res, next){
		const {restaurant_id, limit = 20, offset = 0} = req.query;
		try{
			let filter = {};
			if (restaurant_id && Number(restaurant_id)) {
				filter = {restaurant_id}
			}

			const foods = await FoodModel.find(filter, '-_id').sort({item_id: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(foods);
		}catch(err){
			console.log('获取食品数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取食品数据失败'
			})
		}
	}
	async getFoodsCount(req, res, next){
		const restaurant_id = req.query.restaurant_id;
		try{
			let filter = {};
			if (restaurant_id && Number(restaurant_id)) {
				filter = {restaurant_id}
			}

			const count = await FoodModel.find(filter).count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取食品数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_COUNT',
				message: '获取食品数量失败'
			})
		}
	}
	async updateFood(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取食品信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			const {name, item_id, description = "", image_path, metting_id, new_metting_id} = fields;
			try{
				if (!name) {
					throw new Error('食品名称错误');
				}else if(!item_id || !Number(item_id)){
					throw new Error('食品ID错误');
				}else if(!metting_id || !Number(metting_id)){
					throw new Error('食品分类ID错误');
				}else if(!image_path){
					throw new Error('食品图片地址错误');
				}
				const [specfoods, specifications] = await this.getSpecfoods(fields, item_id);
				let newData;
				if (new_metting_id !== metting_id) {
					newData = {name, description, image_path, metting_id: new_metting_id, specfoods, specifications};
					const food = await FoodModel.findOneAndUpdate({item_id}, {$set: newData});

					const menu = await MenuModel.findOne({id: metting_id})
					const targetmenu = await MenuModel.findOne({id: new_metting_id})

					let subFood = menu.foods.id(food._id);
					subFood.set(newData)
					targetmenu.foods.push(subFood)
					targetmenu.markModified('foods');
					await targetmenu.save()
					await subFood.remove()
					await menu.save()
				}else{
					newData = {name, description, image_path, specfoods, specifications};
					const food = await FoodModel.findOneAndUpdate({item_id}, {$set: newData});

					const menu = await MenuModel.findOne({id: metting_id})
					let subFood = menu.foods.id(food._id);
					subFood.set(newData)
					await menu.save()
				}

				res.send({
					status: 1,
					success: '修改食品信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_FOOD',
					message: '更新食品信息失败',
				})
			}
		})
	}
	async deleteFood(req, res, next){
		const food_id = req.params.food_id;
		if (!food_id || !Number(food_id)) {
			console.log('food_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'food_id参数错误',
			})
			return 
		}
		try{
			const food = await FoodModel.findOne({item_id: food_id});
			const menu = await MenuModel.findOne({id: food.metting_id})
			let subFood = menu.foods.id(food._id);
			await subFood.remove()
			await menu.save()
			await food.remove()
			res.send({
				status: 1,
				success: '删除食品成功',
			})
		}catch(err){
			console.log('删除食品失败', err);
			res.send({
				status: 0,
				type: 'DELETE_FOOD_FAILED',
				message: '删除食品失败',
			})
		}
	}
}

export default new Metting()