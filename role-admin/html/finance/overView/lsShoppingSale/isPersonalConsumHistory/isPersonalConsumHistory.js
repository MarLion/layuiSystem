layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery', 'form', 'laydate', 'base', 'table', 'element', 'tab'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;

    function parseUrl() {
        var url = location.href;
        var i = url.indexOf('?');
        if (i == -1) return;
        var querystr = url.substr(i + 1);
        var arr1 = querystr.split('&');
        var arr2 = new Object();
        for (i in arr1) {
            var ta = arr1[i].split('=');
            arr2[ta[0]] = ta[1];
        }
        return arr2;
    }

    var v = parseUrl();//解析所有参数
    var time;
    var shopName;
    var userId;             //消费者id
    var loginName ;     //玄乐账号
    var name ;          //姓名

    if (v != undefined) {
        shopName = v['shopName'];
        userId = v['userId'];
        time = v['time'];
        loginName = v['loginName'];
        name = v['name'];
        $("#chooseTime").val(time);
        loadUser(loginName,decodeURI(name),decodeURI(shopName));
        updateLayuiDate("chooseTime", time);
    }
    var t = base.show_load_layer();
    //加载列表
    $("#check").on('click', function () {
        loadData();
    });
    loadData();
    function loadData(){
        time = $("#chooseTime").val();
        if (time == "") {
            time = base.getLastDay();
        }
        var t = base.show_load_layer();
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.saleManage.ProductStaAction$memberInfo',
                viewId: '1',
                parameters: "{'userId': "+ userId +",'loginName':'"+loginName+"','searchTime':'"+time+"'}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                var service = '';
                var groupList = _obj.groupList;
                var saleType="团购";
                for (var j = 0; j < groupList.length; j++) {
                    service += '<tr>';
                    service += '<td>' + saleType + '</td><td>' + groupList[j].name + '</td><td>' + groupList[j].num + '</td><td>' + groupList[j].total + '</td>';
                    service += '</tr>';
                }
                $("#service").html(service)

                var gameList = _obj.gameList;
                saleType="游戏,充值,提现";
                var service2 = '';
                for (var j = 0; j < gameList.length; j++) {
                    service2 += '<tr>';
                    service2 += '<td>' + saleType + '</td><td>' + gameList[j].name + '</td><td>' + gameList[j].type + '</td><td>' + gameList[j].total + '</td>';
                    service2 += '</tr>';
                }
                $("#service2").html(service2)

                var healthList = _obj.healthList;
                saleType="保健品";
                var service3 = '';
                for (var j = 0; j < healthList.length; j++) {
                    service3 += '<tr>';
                    service3 += '<td>' + saleType + '</td><td>' + healthList[j].name + '</td><td>' + healthList[j].num + '</td><td>' + healthList[j].total + '</td>';
                    service3 += '</tr>';
                }
                $("#service3").html(service3)

                var healthYlList = _obj.healthYlList;
                saleType="健康医疗";
                var service4 = '';
                for (var j = 0; j < healthYlList.length; j++) {
                    service4 += '<tr>';
                    service4 += '<td>' + saleType + '</td><td>' + healthYlList[j].name + '</td><td>' + healthYlList[j].num + '</td><td>' + healthYlList[j].total + '</td>';
                    service4 += '</tr>';
                }
                $("#service4").html(service4)

                var shopList = _obj.shopList;
                saleType="附近小店";
                var service5 = '';
                for (var j = 0; j < shopList.length; j++) {
                    service5 += '<tr>';
                    service5 += '<td>' + saleType+ '</td><td>' + shopList[j].name + '</td><td>' + shopList[j].num + '</td><td>' + shopList[j].total + '</td>';
                    service5 += '</tr>';
                }
                $("#service5").html(service5)

                var hnList = _obj.hnList;
                saleType="相亲交友";
                var service6 = '';
                for (var j = 0; j < hnList.length; j++) {
                    service6 += '<tr>';
                    service6 += '<td>' + saleType + '</td><td>' + hnList[j].name + '</td><td>' + hnList[j].num + '</td><td>' + hnList[j].total + '</td>';
                    service6 += '</tr>';
                }
                $("#service6").html(service6)

                var yyzdList = _obj.yyzdList;
                saleType="营养指导";
                var service7 = '';
                for (var j = 0; j < yyzdList.length; j++) {
                    service7 += '<tr>';
                    service7 += '<td>' + saleType + '</td><td>' + yyzdList[j].name + '</td><td>' + yyzdList[j].num + '</td><td>' + yyzdList[j].total + '</td>';
                    service7 += '</tr>';
                }
                $("#service7").html(service7)
                base.close_load_layer(t);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
                base.close_load_layer(t);
            }
        })
    }



    function updateLayuiDate(cls, time) {
        if (time == "") {
            time = base.getLastDay();
        }
        $("#" + cls).each(function () {
            laydate.render({
                elem: this,
                type: 'date',
                trigger: "click",
                format: 'yyyy-MM-dd',
                value: time,
                done: function (value, date) {

                }
            })
        })
    }

    //加载负责人信息
    function loadUser(loginName,name,shopName) {
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getMemberInfo',
                viewId: '1',
                parameters: "{'loginName': "+ loginName +"}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                $("#loginName").html(loginName);
                $("#nikename").html(name);
                $("#areaName").html(shopName);
                $("#money").html(_obj.prestores);
                $("#createTime").html(_obj.createTime);
                $("#lastLoginTime").html(_obj.lastTime);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
            }
        })
    }
    //加载负责人信息
    /*$(function () {
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getMemberInfo',
                viewId: '1',
                parameters: "{'loginName': "+ loginName +"}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                $("#money").html(_obj.prestores);
                $("#createTime").html(_obj.createTime);
                $("#lastLoginTime").html(_obj.lastTime);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
            }
        })
    });*/
});
