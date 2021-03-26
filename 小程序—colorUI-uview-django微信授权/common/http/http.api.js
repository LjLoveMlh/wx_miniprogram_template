const basePath = '/api/';
// 微信逻辑登陆相关
let getUserTokenUrl = 'token/miniprogram/';
let verifyTokenUrl = 'token/verify/';
let refreshTokenUrl = 'refresh/';
//微信授权及用户注册相关
let getUserWxInfoUrl = 'account/update_wechat_info_from_miniprogram/'
let getUserInfoUrl = 'account/'




const install = (Vue, vm) => {
    let getUserToken = (params = {}) => vm.$u.post(basePath + getUserTokenUrl, params);
    let verifyToken = (params = {}) => vm.$u.post(basePath + verifyTokenUrl, params);
    let refreshToken = (params = {}) => vm.$u.post(basePath + refreshTokenUrl, params);

    let getUserWxInfo = (params = {}) => vm.$u.put(basePath + getUserWxInfoUrl, params);
    let getUserInfo = (params = {}) => vm.$u.get(basePath + getUserInfoUrl, params);
    vm.$u.api = {
        getUserToken,
        verifyToken,
        refreshToken,
        getUserWxInfo,
        getUserInfo
    };
}
export default {
    install
}
