import Vue from 'vue';
let vm = new Vue();

export function create(params){
	return vm.$u.post('/wechat/api/quartz', params)
}

export function getAllByDeviceId(params){
	return vm.$u.get('/wechat/api/quartz', params)
}

export function deleteQuartz(params){
	return vm.$u.delete('/wechat/api/quartz', params)
}