import Vue from 'vue';
let vm = new Vue();

export function getDeviceList(params){
	return vm.$u.get('/wechat/api/device', params)
}
