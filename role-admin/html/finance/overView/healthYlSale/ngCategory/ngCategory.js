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
    var roleLevel = getCookie("roleLevel");
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

    var t = base.show_load_layer();

    //品类销售详情
    var companyTable = table.render({
        elem: '#lsCate',
        url: base.apiUrl() + '/health/getSaleInfosByGoods',
        headers: {
            'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')
        },
        where: {
            deptId: deptId,
            searchTime: $("#chooseTime").val()
        },
        method: 'post',
        cellMinWidth: 60,
        parseData: function (res) {
            return {
                "code": res.code,
                "data": res.data.data
            }
        },
        cols: [[
            {field: '', align: 'center', width: 60, title: '序号', toolbar: '#indexTpl'},
            {field: 'goodsname', title: '商品名'},
            {field: 'saleCount', title: '销量'},
            {field: 'saleMoney', title: '销售金额'},
            {field: 'weekSaleMoney', title: '本周日平均金额'},
            {field: 'monthSaleMoney', title: '本周月平均金额'},
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
            {
                field: '', fixed: 'right', align: 'center', width: 250, title: '操作', templet: function (e) {
                var str = '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="goHistoryReport">查看往期报表</button>';
                    if(roleLevel==2){
                        str += '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="goRegionalDetails">查看区域详情</button>';
                    }else if(roleLevel==3){
                        str += '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="goRegionalDetails">查看门店详情</button>';
                    }else{
                        str += '<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="goRegionalDetails">查看分公司详情</button>';
                    }
                    return str;
                }
            }
        ]],
        skin: 'line', //表格风格
        even: true,
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
        t = base.show_load_layer();
        companyTable.reload({
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')
            },
            where: {
                deptId: deptId,
                searchTime: $("#chooseTime").val()
            }
        })
    });

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

    //列表页面--监听工具条
    table.on('tool(lsCate)', function (obj) {
        var data = obj.data;
        var tab_id = "dept:" + data.id;
        if (obj.event === 'goRegionalDetails') {
            var goodsno = data.goodsno;
            var goodsName = data.goodsname;
            var time = $('#chooseTime').val();
            if (time == "") {
                return layer.msg("请选择日期！");
            }
            var tab_title = goodsName + '分公司销售详情';
            var href='html/finance/overView/healthYlSale/ngCategory/ngCompany.html?time=' + time + '&goodsno=' + goodsno+ '&goodsName=' + decodeURI(goodsName)
            if(2==roleLevel){
                tab_title = goodsName + '区域销售详情';
                href='html/finance/overView/healthYlSale/ngCategory/ngArea.html?time=' + time + '&deptId=' + deptId+ '&goodsno=' + goodsno+ '&goodsName=' + decodeURI(goodsName)
            }else if(3==roleLevel){
                tab_title = goodsName + '门店销售详情';
                href='html/finance/overView/healthYlSale/ngCategory/ngShop.html?time=' + time + '&deptId=' + deptId + '&goodsno=' + decodeURI(goodsno) + '&goodsName=' + decodeURI(goodsName)
            }
            parent.tab.tabAdd({
                id: tab_id,
                href: href,
                // icon: '',
                title: tab_title
            });
        } else if (obj.event === 'goHistoryReport') {
            var goodsno = data.goodsno;
            var goodsName = data.goodsname;
            var tab_title = goodsName + '历史销售报表';
            parent.tab.tabAdd({
                id: tab_id,
                href: 'html/finance/overView/healthYlSale/ngHistoryReport/ngHistoryReport.html?deptId=1&deptName=&goodsno=' + decodeURI(goodsno),
                // icon: '',
                title: tab_title
            });
        }
    });


});
