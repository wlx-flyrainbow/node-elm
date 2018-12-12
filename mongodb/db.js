'use strict';

import mongoose from 'mongoose';
// config-lite 是一个轻量的读取配置文件的模块
// 会根据环境变量（NODE_ENV）的不同从当前执行进程目录下的 config 目录加载不同的配置文件
import config from 'config-lite';
// chalk.<style>[.<style>...](string,[string...])
import chalk from 'chalk';
console.log(
  chalk.red(config.url)
);
mongoose.connect(config.url, {useMongoClient:true});
// 使用原生promise，mongoose自带promise不再支持了
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open' ,() => {
	console.log(
    chalk.greenBright('连接数据库成功')
  );
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

export default db;
