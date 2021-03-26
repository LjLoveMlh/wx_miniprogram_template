import Vue from 'vue'
const has_token = data => {
    // 检查本地是否存有token
    try {
        const lifeData = uni.getStorageSync('lifeData');
        if (lifeData.vuex_token) {
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}

const login = login => {
    return new Promise(function(resolve, reject) {
        uni.login({
            provider: 'weixin',
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

const get_token = async data => {
    // 网络获取token
    var token = null;
    var code_res = null;
    await login().then(res => {
        code_res = res.code
    })
    Vue.prototype.$u.api.getUserToken({
        "code": code_res
    }).then(res => {
        Vue.prototype.$u.vuex('vuex_token',
            res.data.access);
        Vue.prototype.$u.vuex('vuex_refresh',
            res.data.refresh);
    }).catch(err => {
    });

    // return token == null ? wx.getStorageSync('vuex_token') || '' : token;
}

const check_token = async data => {
    // 检查token是否有效
    const lifeData = uni.getStorageSync('lifeData');
    let access_token = lifeData.vuex_token || '';
    let state;

    await Vue.prototype.$u.api.verifyToken({
        'token': access_token
    }).then((res) => {
        if (res.data.code) {
            state = false;
        } else {
            state = true;
        }
    })
    return state
}

const refresh_token = async data => {
    // 刷新token
    const lifeData = uni.getStorageSync('lifeData');
    let refresh_token = lifeData.vuex_refresh || '';
    let re_token = null;
    let token = null;
    if (refresh_token == '') {
        await get_token().then(res => {
            Vue.prototype.$u.vuex('vuex_token',
                res.data.access);
            Vue.prototype.$u.vuex('vuex_refresh',
                res.data.refresh);
            token = res;
        })
    } else {
        await Vue.prototype.$u.api.refreshToken({
            'refresh': refresh_token
        }).then((res) => {
            if (res.statusCode === 200) {
                try {
                   Vue.prototype.$u.vuex('vuex_token',
                       res.data.access);
                } catch (e) {
                    console.log(e)
                }
            } else if (res.statusCode === 401) {
                // refresh token 过期 重新获取
                // get_token();
                re_token = true;
            } else {
                re_token = false;
                console.log(res.data)
            }
        })
       
        if (re_token == true) {
            await get_token().then(res => {
                Vue.prototype.$u.vuex('vuex_token',
                    res.data.access);
                token = res;
            })
        } else if (re_token == false) {
            console.log('出错')
        }
    }
}

module.exports = {
    has_token: has_token,
    get_token: get_token,
    check_token: check_token,
    refresh_token: refresh_token,
}

/*
 * token存取可能存在时差 导致token为空
 */
