import Vue from 'vue';
let vm = new Vue();

export function getDeviceList(params){
	return vm.$u.get('/wechat/api/device', params)
}

export function deleteDevice(params){
	return vm.$u.delete('/wechat/api/device', params)
}

export function updateDeviceName(params){
	return vm.$u.put('/wechat/api/device', params)
}

export function getDeviceAddCode(params){
	return vm.$u.get('/wechat/api/device/deviceAddCode', params)
}

export function checkDeviceCreate(params){
	return vm.$u.get('/wechat/api/device/checkDeviceCreate', params)
}

export function sendDeviceOrder(params){
	return vm.$u.post('/wechat/api/device/operateDevice', params)
}

export function queryDeviceLog(params){
	return vm.$u.get('/wechat/api/log', params)
}

export function insertDevice(params){
	return vm.$u.post('/wechat/api/device/insertDevice', params)
}
