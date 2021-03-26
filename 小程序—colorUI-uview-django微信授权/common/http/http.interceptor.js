// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
import token from 'common/http/http.token.js'
const auth_header = 'Bearer '
const install = (Vue, vm) => {
    Vue.prototype.$u.http.setConfig({
        baseUrl: 'https://lztec.mynatapp.cc',
        loadingText: '努力加载中~',
        loadingTime: 800,
        originalData: true,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    });
    // 请求拦截，配置Token等参数
    Vue.prototype.$u.http.interceptor.request = (config) => {
        // const lifeData = uni.getStorageSync('lifeData');
        config.header = {
            'Authorization': auth_header + vm.vuex_token,
        };

        return config;
    }
    // 响应拦截，判断状态码是否通过
    Vue.prototype.$u.http.interceptor.response = (res) => {
        return res
    }

}
export default {
    install
}
