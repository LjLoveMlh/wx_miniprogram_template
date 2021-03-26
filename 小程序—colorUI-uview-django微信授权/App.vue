<script>
    import token from 'common/http/http.token.js'
    import Vue from 'vue'
    export default {
        onLaunch: function() {
            this.initData();
        },
        onShow: function() {},
        onHide: function() {},
        methods: {
            initData() {
                this.checkLocalToken();
                this.getSystemInfoCus();
            },
            // 获取系统的一些信息
            getSystemInfoCus() {
                uni.getSystemInfo({
                    success: function(e) {
                        // console.log(e)
                        Vue.prototype.StatusBar = e.statusBarHeight;
                        let custom = wx.getMenuButtonBoundingClientRect();
                        Vue.prototype.Custom = custom;
                        Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;

                    }
                })
            },
            // 检查本地信息
            checkLocalToken() {
                if (!token.has_token()) {
                    token.get_token().then(res => {
                        let interVal = setInterval(() => {
                            if (this.vuex_token != '') {
                                clearInterval(interVal)
                                this.userInfoInit()
                            }
                        }, 300);
                    })
                } else {
                    //检查token是否有效
                    token.check_token().then(res => {
                        if (res) {
                            // token 有效
                            this.userInfoInit()
                        } else {
                            // token 失效
                            token.refresh_token().then(res => {
                                this.userInfoInit()
                            })
                        }
                    })
                }
            },
            //用户信息初始化
            userInfoInit() {
                let that = this;
                uni.showLoading({
                    title: "正在准备数据"
                })

                that.$u.api.getUserInfo().then(res => {

                    console.log(res)



                }).catch(err => {});

                setTimeout(() => {
                    uni.showToast({
                        title: "身份信息为空,前往认证",
                        icon: 'loading'
                    })
                    uni.hideLoading()
                }, 800)

            },
        }
    }
</script>

<style>
    @import "common/colorui/main.css";
    @import "common/colorui/icon.css";
</style>
