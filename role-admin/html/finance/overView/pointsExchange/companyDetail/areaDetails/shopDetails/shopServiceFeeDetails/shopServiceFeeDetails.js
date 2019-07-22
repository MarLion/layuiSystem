layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
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
    var deptId;             //门店id
    if (v != undefined) {
        time = v['time'];
        deptId = v['id'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime", time);
    }
    var t = base.show_load_layer();
    //分公司详情表
    var companyTable = table.render({
        elem: '#companyPc',
        url: base.apiOthUrl(),
        headers: {
            'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        where: {
            actionName: 'com.xguanjia.client.action.statistics.saleManage.ServiceChargeAction$serviceMemberList',
            viewId: '1',
            parameters: "{'deptId': "+ deptId +", 'time': " + $("#chooseTime").val() + "}"
        },
        method: 'post',
        //page: {layout: ['limit', 'count', 'prev', 'page', 'next', 'skip']},
        cellMinWidth: 60,
        parseData: function (res) {
            return {
                "code": res.data.code,
                "data": res.data.data,
                "count": res.data.count
            }
        },
        cols: [[
            {field: '', align: 'center', width: 60, title: '序号', toolbar: '#indexTpl'},
            {field: 'nickname', title: '姓名'},
            {field: 'post', title: '职位'},
            {field: 'mobile', title: '联系方式'},
            {field: 'loginName', title: '用户账号'},
            {field: 'waiterMoney', title: '所收服务费'},
            {field: 'right', align: 'center', width: 250, toolbar: '#barDemo', title: '操作'}
        ]],
        skin: 'line', //表格风格
        even: true,
        limit: 15, //每页默认显示的数量
        limits: [15, 30, 50],
        //数据回调
        done: function (res, curr, count) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            console.log('表格加载完成');
            base.close_load_layer(t);
        }
    });

    $("#check").on('click', function () {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        t = base.show_load_layer();
        companyTable.reload({
            where: {
                actionName: 'com.xguanjia.client.action.statistics.saleManage.ServiceChargeAction$serviceMemberList',
                viewId: '1',
                parameters: "{'deptId': "+ deptId +", 'time': " + time + "}"
            }
        })

    });

    //加载门店店长信息
    $(function () {
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$shopInfo',
                viewId: '1',
                parameters: "{'deptId': "+ deptId +"}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                $("#shopName").html(_obj.shopName);
                $("#phone").html(_obj.phone);
                $("#shopManager").html(_obj.name);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
            }
        })
    });

    //**********************************************************************
    //列表页面--监听工具条
    //**********************************************************************
    table.on('tool(companyPc)', function (obj) {
        var data = obj.data;
        if (obj.event === 'goShopDetails') {
            var id = data.id;
            var name = data.nickname;
            var time = $('#chooseTime').val();
            if (time == ""){
                return layer.msg("请选择日期！");
            }
            var tab_title = name + '服务费详情';
            parent.tab.tabAdd({
                href: 'html/finance/overView/pointsExchange/companyDetail/areaDetails/shopDetails/shopServiceFeeDetails/serviceFeeDetails/serviceFeeDetails.html?id='+id+"&time="+time+"&deptId="+deptId,
                // icon: '',
                title: tab_title
            });
        }
    });

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

});
