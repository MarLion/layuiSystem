layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element','tab'],function () {
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
    var deptName;
    if (v != undefined) {
        time = v['time'];
        deptId = v['deptId'];
        deptName = v['name'];
        $("#deptName").val(decodeURI(deptName));
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime", time);
    }

    var t = base.show_load_layer();
    //分公司详情表
    var cateTable = table.render({
        elem: '#lsCate',
        url: base.apiOthUrl(),
        headers: {
            'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        where: {
            actionName: 'com.xguanjia.client.action.statistics.saleManage.GroupAction$getSaleInfosByGoods',
            viewId: '1',
            parameters: "{'deptId': "+deptId+", 'searchTime': " + $("#chooseTime").val() + ",'type': '0'}"
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
            {field: 'goodsname', title: '商品名', templet: '#positionName'},
            {field: 'saleCount', title: '销量'},
            {field: 'saleMoney', title: '团购销售额'},
            {field: 'weekSaleMoney', title: '周平均销售额'},
            {field: 'monthSaleMoney', title: '月平均销售额'},
            {
                field: 'todayRise', title: '同比昨日增长', templet: '#todayRise', templet: function (d) {
                    var obj = changColor(d.todayPercent);
                    var _html = '<span>' + d.todayRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.todayPercent + '</span>';
                    return _html;
                }
            },
            {
                field: 'monthRise', title: '同比本月平均增长', templet: '#monthRise', templet: function (d) {
                    var obj = changColor(d.monthPercent);
                    var _html = '<span>' + d.monthRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.monthPercent + '</span>';
                    return _html;
                }
            },
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

    $("#check").on('click',function () {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        t = base.show_load_layer();
        cateTable.reload({
            where: {
                actionName: 'com.xguanjia.client.action.statistics.saleManage.GroupAction$getSaleInfosByGoods',
                viewId: '1',
                parameters: "{'deptId': "+deptId+", 'searchTime': " + time + ",'type': '0'}"
            }
        })
    })

    //**********************************************************************
    //列表页面--监听工具条
    //**********************************************************************
    table.on('tool(lsCate)', function (obj) {
        var data = obj.data;
        if (obj.event === 'goCompanyDetails') {
            var name = data.goodsname;
            var goodsno = data.goodsno;
            var tab_id = 'branchCategorya1' + goodsno;
            var time = $('#chooseTime').val();
            if (time == "") {
                return layer.msg("请选择日期！");
            }
            var tab_title = name + '分公司销售列表';
            parent.tab.tabAdd({
                id: tab_id,
                href: 'html/finance/overView/lsShoppingSale/isCompanyCategory/isCompanyCategory.html?deptId=1&time=' + time + '&goodsno=' + goodsno + '&goodsname=' + encodeURI(name),
                // icon: '',
                title: tab_title
            });
        } else if (obj.event === 'goHistoryReport') {
            var name = data.goodsname;
            var goodsno = data.goodsno;
            var tab_id = 'branchReport1' + goodsno;
            var tab_title = name + '往期销售报表';
            parent.tab.tabAdd({
                id: tab_id,
                href: 'html/finance/overView/lsShoppingSale/isCategoryHistoryReport/isCategoryHistoryReport.html?deptId=1&goodsno=' + goodsno,
                // icon: '',
                title: tab_title
            });
        }else if (obj.event === 'goRegionalDetails') {
            var time = $('#chooseTime').val();
            if (time == "") {
                return layer.msg("请选择日期！");
            }
            var name = data.goodsname;
            var goodsno = data.goodsno;
            var deptName = $("#deptName").val();
            var tab_title = "";
            if (deptName == 'undefined') {
                tab_title = name + '区域销售列表';
            }else {
                tab_title = name + deptName + '销售列表';
            }
            parent.tab.tabAdd({
                href: 'html/finance/overView/lsShoppingSale/isRegionCategory/isRegionCategory.html?deptId=' + deptId + '&time=' + time + '&goodsno=' + goodsno + '&goodsname=' + encodeURI(name),
                // icon: '',
                title: tab_title
            });
        }else if (obj.event === 'goStoreDetails') {
            var time = $('#chooseTime').val();
            if (time == "") {
                return layer.msg("请选择日期！");
            }
            var name = data.goodsname;
            var goodsno = data.goodsno;
            var tab_title = name + '门店销售列表';
            parent.tab.tabAdd({
                href: 'html/finance/overView/lsShoppingSale/isStoreCategory/isStoreCategory.html?deptId=' + deptId + '&time=' + time + '&goodsno=' + goodsno + '&goodsname=' + encodeURI(name),
                // icon: '',
                title: tab_title
            });
        }else if (obj.event === 'goPersonalDetails') {
            var time = $('#chooseTime').val();
            if (time == "") {
                return layer.msg("请选择日期！");
            }
            var name = data.goodsname;
            var goodsno = data.goodsno;
            var tab_title = name + '销售列表';
            parent.tab.tabAdd({
                href: 'html/finance/overView/lsShoppingSale/isPersonalCategory/isPersonalCategory.html?deptId=' + deptId + '&time=' + time + '&goodsno=' + goodsno + '&goodsname=' + encodeURI(name),
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
            src:'',
            class:''
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