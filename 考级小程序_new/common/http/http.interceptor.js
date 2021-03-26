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
       
        if (vm.isFreshIng) {
            return false
        } else {
            let errorCodeList = ['token_not_valid', 'bad_authorization_header'];
            if (res.data.code == 'user_not_found') {
                token.get_token().then(res => {
                    let interVal = setInterval(() => {
                        if (vm.vuex_token != '') {
                            clearInterval(interVal)
                            vm.$u.api.getUserInfo().then(res => {
                                vm.$u.vuex('vuex_user',
                                    res.data);
                                const lifeData = uni.getStorageSync('lifeData');
                                if (lifeData.vuex_lastUserRole != null) {
                                    vm.$u.vuex('vuex_userRole', lifeData
                                        .vuex_lastUserRole);
                                } else {
                                    if (res.data.deliveryerinfo.is_pass == false) {
                                        vm.$u.vuex('vuex_userRole', 0);
                                    } else {
                                        vm.$u.vuex('vuex_userRole', 1);
                                    }
                                }
                                if (vm.vuex_user.baseinfo != null) {
                                    vm.$u.vuex("vuex_hasLogin", true)
                                }
                            }).catch(err => {});
                        }
                    }, 300);
                })
            } else if (errorCodeList.indexOf(res.data.code) != -1) {
                uni.showToast({
                    title: "登陆信息失效，请重试",
                    icon: 'none'
                })
                vm.$u.vuex("isFreshIng", true)

                token.refresh_token().then(res2 => {
                    if (res2)
                        console.log(res2)
                }).catch(res2 => {
                    if (res.data.code == "token_not_valid") {
                        token.get_token().then(res3 => {
                            vm.$u.vuex("isFreshIng", false)
                        });
                    }
                });
                return false
            } else {
                return res
            }
            return res
        }
    }

}
export default {
    install
}
