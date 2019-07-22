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
    var id;             //消费者id
    var areaName ; //负责人姓名
    var loginName ;     //玄乐账号
    var name ;          //姓名

    if (v != undefined) {
        id = v['id'];
        time = v['time'];
        areaName = decodeURI(v['areaName']);
        loginName = v['loginName'];
        name = decodeURI(v['name']);
        $("#loginName").html(loginName);
        $("#nikename").html(name);
        $("#areaName").html(areaName);
        $("#chooseTime").val(time);
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
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.saleManage.ProductStaAction$memberInfo',
                viewId: '1',
                parameters: "{'userId': "+ id +",'loginName':'"+loginName+"','searchTime':'"+time+"'}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                var dateTr = '';
                dateTr += '<th>类别</th><th>商品名称</th><th>数量</th><th>金额</th>';
                $("#dateTr").html(dateTr);
                $("#groupDetailsTab").attr("class","layui-this");
                var service = '';

                var groupList = _obj.groupList;
                for (var j = 0; j < groupList.length; j++) {
                    service += '<tr>';
                    service += '<td>' + (j + 1) + '</td><td>' + groupList[j].name + '</td><td>' + groupList[j].num + '</td><td>' + groupList[j].total + '</td>';
                    service += '</tr>';
                }
                $("#service").html(service)

                var gameList = _obj.gameList;
                var service2 = '';
                for (var j = 0; j < gameList.length; j++) {
                    service2 += '<tr>';
                    service2 += '<td>' + (j + 1) + '</td><td>' + gameList[j].name + '</td><td>' + gameList[j].type + '</td><td>' + gameList[j].total + '</td>';
                    service2 += '</tr>';
                }
                $("#service2").html(service2)

                var healthList = _obj.healthList;
                var service3 = '';
                for (var j = 0; j < healthList.length; j++) {
                    service3 += '<tr>';
                    service3 += '<td>' + (j + 1) + '</td><td>' + healthList[j].name + '</td><td>' + healthList[j].num + '</td><td>' + healthList[j].total + '</td>';
                    service3 += '</tr>';
                }
                $("#service3").html(service3)

                var healthYlList = _obj.healthYlList;
                var service4 = '';
                for (var j = 0; j < healthYlList.length; j++) {
                    service4 += '<tr>';
                    service4 += '<td>' + (j + 1) + '</td><td>' + healthYlList[j].name + '</td><td>' + healthYlList[j].num + '</td><td>' + healthYlList[j].total + '</td>';
                    service4 += '</tr>';
                }
                $("#service4").html(service4)


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
    $(function () {
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
    });
});
