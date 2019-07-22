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
    var deptId;
    if (v != undefined) {
        time = v['time'];
        deptId = v['deptId'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime", time);
    }

    var t = base.show_load_layer();
    //个人销售列表
    var userTable = table.render({
        elem: '#companyLs',
        url: base.apiOthUrl(),
        headers: {
            'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        where: {
            actionName: 'com.xguanjia.client.action.statistics.saleManage.GroupAction$getProductMemberOrder',
            viewId: '1',
            parameters: "{'deptId': " + deptId + ", 'searchTime': " + $("#chooseTime").val() + ",'type': '1'}"
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
            {field: 'productName', title: '商品名'},
            {field: 'originalPrice', title: '原价'},
            {field: 'num', title: '数量'},
            {field: 'payPrice', title: '实付价格'},
            {field: 'loginName', title: '用户账号'},
            {field: 'nickname', title: '姓名'},
            {field: 'mobile', title: '联系方式'},
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
    // 门店信息
    $(function () {
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$shopInfo',
                viewId: '1',
                parameters: "{'deptId': " + deptId + "}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                document.getElementById("shopManager").innerHTML = _obj.name;
                document.getElementById("phone").innerHTML = _obj.phone;
                $("#shopName").val(_obj.shopName);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
            }
        })
    });
    $("#check").on('click', function () {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        t = base.show_load_layer();
        userTable.reload({
            where: {
                actionName: 'com.xguanjia.client.action.statistics.saleManage.GroupAction$getProductMemberOrder',
                viewId: '1',
                parameters: "{'deptId': " + deptId + ", 'searchTime': " + $("#chooseTime").val() + ",'type': '1'}"
            },
        })
    });

    //**********************************************************************
    //列表页面--监听工具条
    //**********************************************************************
    table.on('tool(companyLs)', function (obj) {
        var data = obj.data;
        if (obj.event === 'goPersonalConHistory') {
            var shopName = $('#shopName').val();
            var userId = data.userId;
            var loginName = data.loginName;
            var name = data.nickname;
            var time = $('#chooseTime').val();
            if (time == ""){
                return layer.msg("请选择日期！");
            }
            var tab_title = '专享商城个人消费详情';
            parent.tab.tabAdd({
                href: 'html/finance/overView/healthYlSale/ngPersonalConsumHistory/ngPersonalConsumHistory.html?loginName='+loginName+"&name="+encodeURI(name)+"&shopName="+encodeURI(shopName)+"&time="+time+"&userId="+userId,
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

    function changColor(n) {
        var n = parseFloat(n);
        var obj = {
            src: '',
            class: ''
        };
        if (n > 0) {
            obj.src = '../../icon/up.png';
            obj.class = 'col-r';
        } else if (n < 0) {
            obj.src = '../../icon/down.png';
            obj.class = 'col-g';
        } else {
            obj.src = '../../icon/eq.png';
            obj.class = 'col-b';
        }
        return obj;
    }
});
