// 获取地址栏参数
function getUrlStr(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
}
  
// 随机生成字符串
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
// rem换算
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 749) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//轮播
var mySwiper = new Swiper ('.swiper-container', {
    autoplay: true,
    observer: true,
    observeParents:true,
    loopedSlides:  1,
    autoplayDisableOnInteraction:false,
    loop: true,
    // 如果需要分页器
    pagination: {
        el: '.swiper-pagination',
    }
})
var obj = {}
// 请求数据
$.get('https://wksc.99114.com//product/detail?id=' + getUrlStr('id') , function(res){
    obj = res.obj
    // 标题
    $('#headerText').text(res.obj.name)
    // 轮播图
    var imgStr = ''
    for(var i=0; i < res.obj.pic.length; i++){
        imgStr += `<div class="swiper-slide"><img src=${res.obj.pic[i]} alt=""></div>`
    }
    $('.swiper-wrapper').html(imgStr)
    // 标题
    // $('#title').text(res.obj.name)
    $('title').text(res.obj.name)
    // 规格
    if (res.obj.attrDetail != null && res.obj.attrDetail != "") {
        res.obj.attrDetail = JSON.parse(res.obj.attrDetail);
        var attrDetailArr = []
        var newAttrDetail = []
        res.obj.attrDetail.map(item => {
            attrDetailArr.push(...item.attribute)
        })
        attrDetailArr.map(item => {
            if (item.is_full){
                if ((item.typeid == 0 && item.use != "") || (item.typeid == 1) || (item.typeid == 2)) {
                    newAttrDetail.push(item)
                }
            }
        })
        var contentStr = ''
        for(var i=0; i < 3; i++){
            contentStr += `<li><span>${newAttrDetail[i].name}</span><span>${newAttrDetail[i].userdata}${newAttrDetail[i].unit}</span></li>`
        }
        $('#content').html(contentStr)
    }
    // 商品详情
    $('#detail').html(res.obj.detail)
})
$('#detail').on('click',function(e){
    if(e.target.tagName  === 'IMG'){
        console.log(1)
    }
})

// 微信分享
$.ajax({
        url: 'https://wksc.99114.com/school/getat',
        type: "GET",
        async:false,
        success: function(data) {
            var timestamp = Date.parse(new Date()),
                nonceStr = randomString(20),
                url = location.href;
            var string1 = `noncestr=${nonceStr}&jsapi_ticket=${data}&timestamp=${timestamp}&url=${url}`
            wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxe3c0e6248494fcc9', // 必填，公众号的唯一标识
                timestamp, // 必填，生成签名的时间戳
                nonceStr, // 必填，生成签名的随机串
                signature: binb2hex(string1),// 必填，签名
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
            });
        },
        error: function(error) {
            console.log(error)
        }
    })


wx.ready(function(){
    $.get('https://wksc.99114.com//product/detail?id=' + getUrlStr('id') , function(res){
        wx.onMenuShareTimeline({
            title: res.obj.name, // 分享标题
            // link: , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: res.obj.pic[0], // 分享图标
            desc: res.obj.name, // 分享描述
            success: function () {
                // 用户点击了分享后执行的回调函数
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            }
        })
        wx.onMenuShareAppMessage({
            title: res.obj.name, // 分享标题
            desc: res.obj.name, // 分享描述
            imgUrl: res.obj.pic[0], // 分享图标
            success: function () {
            // 用户点击了分享后执行的回调函数
            }
        });
    })
})

