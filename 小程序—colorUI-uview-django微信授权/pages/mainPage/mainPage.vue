<template>
    <view>


        <scroll-view scroll-y class="DrawerPage" :class="modalName=='viewModal'?'show':''">
            <cu-custom bgColor="bg-white" :showLeftTitle="true">
                <block slot="leftTitle">
                    <view class="flex justify-center">
                        <view @tap="showModal" data-target="viewModal">
                            <view class="cu-avatar  round" :style="'background-image:url('+testData.userHeadImg+');'">
                            </view>
                        </view>
                        <!-- <view class="margin-left-sm"> {{["学生","机构","考官"][1]}} </view> -->
                        <view class="margin-left-sm">凌星天骄报名工具</view>
                    </view>
                </block>
            </cu-custom>
            <view class="lj-half-round bg-white round"></view>

            <!-- tab考级 -->
            <!--  <block v-if="userActive">
                <commonTabNav ref="refreshThisData" />
            </block> -->
            <!-- <block v-else>
                <view v-if="vuex_userRole!==0"
                    class="padding-xl text-center  margin  radius  text-purple  lj-in-shadow margin-top-xl">当前身份未激活
                    <view class="text-gray text-sm margin-top-sm" @tap="refreshMyAccout">
                        点击尝试刷新
                    </view>
                </view>
            </block> -->


            <view class="padding flex flex-direction justify-center align-center">
                <button type="primary" style="width: 80%;" open-type="getUserInfo"
                    class="cu-btn bg-green lg u-reset-button" @getuserinfo="wxGetUserInfo">微信授权</button>
            </view>
        </scroll-view>


        <!-- 左侧抽屉视图 -->
        <view class="DrawerClose" :class="modalName=='viewModal'?'show':''" @tap="hideModal">
            <text class="cuIcon-pullright"></text>
        </view>
        <scroll-view scroll-y class="DrawerWindow" :class="modalName=='viewModal'?'show':''">

            <view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
                <view class="cu-item">
                    <view class="content flex flex-direction justify-center text-center padding">
                        <view class="lj-self-center">
                            <view class="cu-avatar xl round "
                                :style="'background-image:url('+vuex_user.wechat.info.avatarUrl+');'"></view>
                        </view>
                        <view class="text-black text-bold text-lg margin-tb-sm">{{vuex_user.wechat.info.nickName}}
                        </view>
                        <view class="lj-self-center" v-if="vuex_userRole==1">
                            <view class="cu-capsule radius">
                                <view class='cu-tag bg-purple '>
                                    机构
                                </view>
                                <view class="cu-tag line-purple">
                                    {{vuex_user.org.is_active?'已激活':'未激活'}}
                                </view>
                            </view>
                        </view>
                        <view class="lj-self-center" v-if="vuex_userRole==2">
                            <view class="cu-capsule radius">
                                <view class='cu-tag bg-purple '>
                                    考官
                                </view>
                                <view class="cu-tag line-purple">
                                    {{vuex_user.examiner.is_active?'已激活':'未激活'}}
                                </view>
                            </view>
                        </view>

                    </view>
                </view>
            </view>


            <view class="closeBtnHelp">
                <button class="cu-btn radius line-purple shadow" @tap="hideModal">关闭</button>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                modalName: null,
                testData: {
                    userHeadImg: "https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg"
                }
            }
        },
        onLoad() {

        },
        methods: {
            showModal(e) {
                this.modalName = e.currentTarget.dataset.target;
            },
            hideModal(e) {
                this.modalName = null;
            },
            //1.获取token 用户信息包括加密信息 code
            wxGetUserInfo(res) {
                let that = this;

                if (false) {
                    that.postUserInfo();
                } else {
                    if (!res.detail.iv) {
                        uni.showModal({
                            title: "提示",
                            content: "您已拒绝授权",
                            showCancel: false
                        })
                        return false;
                    } else {
                        //服务器拿微信用户信息
                        var tempDataServiceNeed = {
                            encryptedData: res.detail.encryptedData,
                            iv: res.detail.iv
                        }
                        //目的 获取服务提供商
                        uni.getProvider({
                            service: 'oauth',
                            success: function(res3) {
                                console.log(res3)
                                if (res3.provider[0] === 'weixin') {
                                    //目的 提供服务器需要的加密字符串
                                    that.exchangeForWXinfo(tempDataServiceNeed);
                                }
                            },

                        });
                    }
                }
            },
            //用微信给的密钥给服务器 由服务器向微信换取微信信息
            exchangeForWXinfo(tempDataServiceNeed) {
                var that = this;
                that.$u.api.getUserWxInfo(
                    tempDataServiceNeed
                ).then(res => {
                    // 微信授权成功
                    // if(res.data.user!=null)
                    if (res.statusCode === 200) {
                        uni.showToast({
                            title: "授权成功!"
                        })
                    } else {
                        uni.showToast({
                            title: "授权异常!"
                        })
                    }
                }).catch(err => {});
            },
        }
    }
</script>

<style lang="less" scoped>
    .closeBtnHelp {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 80px;
        display: flex;
        justify-content: center;
    }

    .lj-half-round {
        margin-top: -50px;
        width: 110%;
        margin-left: -5%;
        height: 100px;
        border-radius: 50%;
    }

    .DrawerPage {
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0vw;
        background-color: #f1f1f1;
        transition: all 0.4s;
    }

    .DrawerPage.show {
        transform: scale(0.9, 0.9);
        left: 85vw;
        box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
        transform-origin: 0;
    }

    .DrawerWindow {
        position: absolute;
        width: 85vw;
        height: 100vh;
        left: 0;
        top: 0;
        transform: scale(0.9, 0.9) translateX(-100%);
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s;
        padding: 100upx 0;
    }

    .DrawerWindow.show {
        transform: scale(1, 1) translateX(0%);
        opacity: 1;
        pointer-events: all;
    }

    .DrawerClose {
        position: absolute;
        width: 40vw;
        height: 100vh;
        right: 0;
        top: 0;
        color: transparent;
        padding-bottom: 30upx;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
        letter-spacing: 5px;
        font-size: 50upx;
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s;
    }

    .DrawerClose.show {
        opacity: 1;
        pointer-events: all;
        width: 15vw;
        color: #fff;
    }

    .DrawerPage .cu-bar.tabbar .action button.cuIcon {
        width: 64upx;
        height: 64upx;
        line-height: 64upx;
        margin: 0;
        display: inline-block;
    }

    .DrawerPage .cu-bar.tabbar .action .cu-avatar {
        margin: 0;
    }

    .DrawerPage .nav {
        flex: 1;
    }

    .DrawerPage .nav .cu-item.cur {
        border-bottom: 0;
        position: relative;
    }

    .DrawerPage .nav .cu-item.cur::after {
        content: "";
        width: 10upx;
        height: 10upx;
        background-color: currentColor;
        position: absolute;
        bottom: 10upx;
        border-radius: 10upx;
        left: 0;
        right: 0;
        margin: auto;
    }

    .DrawerPage .cu-bar.tabbar .action {
        flex: initial;
    }
</style>
