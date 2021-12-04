import Vue from 'vue';
let vm = new Vue();

export function getDeviceList(params){
	return vm.$u.get('/wechat/api/device', params)
}

export function deleteDevice(params){
	return vm.$u.delete('/wechat/api/device', params)
}