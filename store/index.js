import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['token','userInfo','navUrl'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
// 从缓存中取得相同的key进行覆盖操作
let lifeData = uni.getStorageSync('lifeData') || {};

const store = new Vuex.Store({
	state: {
		/**
		 * 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		 *  
		 * 	取值方法  this.$store.state.token  或者 Vue.prototype.$store.state.token
			设置方法  this.$u.vuex('user.name', '史诗')
		 */
		token: lifeData.token ? lifeData.token : '',
		userInfo: lifeData.userInfo ? lifeData.userInfo : '',
		navUrl: lifeData.navUrl ? lifeData.lifeData : ''
		// 如果token无需保存到本地永久存储，无需lifeData.token方式
		// token: ''
	},
	getters: {

	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		}
	},
	actions: {

	},
	modules: {

	},
})


for (let key in lifeData) {
	if (store.state.hasOwnProperty(key)) {
		store.commit('$uStore', {
			name: key,
			value: lifeData[key]
		})
	}
}

export default store;
