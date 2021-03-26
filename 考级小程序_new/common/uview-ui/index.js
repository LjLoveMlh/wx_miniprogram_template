// 引入全局mixin
import mixin from './libs/mixin/mixin.js'
// 引入关于是否mixin集成小程序分享的配置
// import wxshare from './libs/mixin/mpShare.js'
// 全局挂载引入http相关请求拦截插件
import http from './libs/request'

function wranning(str) {
	// 开发环境进行信息输出,主要是一些报错信息
	// 这个环境的来由是在程序编写时候,点击hx编辑器运行调试代码的时候,详见:
	// 	https://uniapp.dcloud.io/frame?id=%e5%bc%80%e5%8f%91%e7%8e%af%e5%a2%83%e5%92%8c%e7%94%9f%e4%ba%a7%e7%8e%af%e5%a2%83
	if (process.env.NODE_ENV === 'development') {
		console.warn(str)
	}
}

// 尝试判断在根目录的/store中是否有$u.mixin.js，此文件uView默认为需要挂在到全局的vuex的state变量
// HX2.6.11版本,放到try中,控制台依然会警告,暂时不用此方式，
// let vuexStore = {};
// try {
// 	vuexStore = require("@/store/$u.mixin.js");
// } catch (e) {
// 	//TODO handle the exception
// }

// post类型对象参数转为get类型url参数
import queryParams from './libs/function/queryParams.js'
// 路由封装
import route from './libs/function/route.js'
// 时间格式化
import timeFormat from './libs/function/timeFormat.js'
// 时间戳格式化,返回多久之前
import timeFrom from './libs/function/timeFrom.js'



// 根据type获取图标名称
import type2icon from './libs/function/type2icon.js'
// 打乱数组的顺序
import randomArray from './libs/function/randomArray.js'
// 对象和数组的深度克隆
import deepClone from './libs/function/deepClone.js'
// 对象深度拷贝
import deepMerge from './libs/function/deepMerge.js'
// 添加单位
import addUnit from './libs/function/addUnit.js'

// 规则检验
import test from './libs/function/test.js'
// 随机数
import random from './libs/function/random.js'
// 去除空格
import trim from './libs/function/trim.js'

// 获取sys()和os()工具方法
// 获取设备信息，挂载到$u的sys()(system的缩写)属性中，
// 同时把安卓和ios平台的名称"ios"和"android"挂到$u.os()中，方便取用
import {sys, os} from './libs/function/sys.js'
// 防抖方法
import debounce from './libs/function/debounce.js'
// 节流方法
import throttle from './libs/function/throttle.js'



const $u = {
	queryParams: queryParams,
	route: route,
	timeFormat: timeFormat,
	date: timeFormat, // 另名date
	timeFrom,
	sys,
	os,
	type2icon,
	randomArray,
	wranning,
	get: http.get,
	post: http.post,
	put: http.put,
	'delete': http.delete,
	test,
	random,
	deepClone,
	deepMerge,
	addUnit,
	trim,
	http,
	debounce,
	throttle,
}

const install = Vue => {
	Vue.mixin(mixin) 
	if (Vue.prototype.openShare) {
		Vue.mixin(mpShare);
	}
	// Vue.mixin(vuexStore);
	// 时间格式化，同时两个名称，date和timeFormat
	Vue.filter('timeFormat', (timestamp, format) => {
		return timeFormat(timestamp, format)
	})
	Vue.filter('date', (timestamp, format) => {
		return timeFormat(timestamp, format)
	})
	// 将多久以前的方法，注入到全局过滤器
	Vue.filter('timeFrom', (timestamp, format) => {
		return timeFrom(timestamp, format)
	})
	Vue.prototype.$u = $u
}

export default {
	install
}