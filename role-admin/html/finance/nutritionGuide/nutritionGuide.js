layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery', 'form', 'laydate', 'base', 'table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table;
    base.operateArea();
    base.multiSelect('downpanel-order', 'multSelects1-order', 'orderTypes-order', 'typesOrder');
    base.multiSelect('downpanel-trans', 'multSelects1-trans', 'orderTypes-trans', 'typesTrans');
    function updateLayuiDate(cls) {
        $("#" + cls).each(function () {
            laydate.render({
                elem: this,
                type: 'datetime',
                trigger: "click",
                format: 'yyyy-MM-dd HH:mm:ss'
            })
        })
    }
    laydate.render({
        elem: '#exTimeStart',
        type: 'datetime',
        btns: ['clear', 'confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#exTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

  laydate.render({
        elem: '#getTimeStart',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#getTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

    laydate.render({
        elem: '#backTimeStart',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#backTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#yys', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "page", limitName: "size"},
        url: base.apiUrl() + "/yysSearch/getOrders",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', align: 'center', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'orderStatus', title: '订单状态', align: 'center', width: 89},
            {field: 'logisticsStatus', title: '物流状态', align: 'center', width: 89},
            {field: 'orderNo', title: '订单编号', align: 'center', width: 200},
            {field: 'prodName', title: '商品名称', align: 'center', width: 150},
            {field: 'loginName', title: '用户账号', align: 'center', width: 128},
            {field: 'userName', title: '用户姓名', align: 'center', width: 125},
            {field: 'amount', title: '玄乐金额', align: 'center', width: 89},
            {field: 'integral', title: '抵扣积分', align: 'center', width: 89},
            {field: 'serverName', title: '特约人', align: 'center', width: 100},
            {field: 'serverNo', title: '特约人账号', align: 'center', width: 128},
            {field: 'company', title: '分公司', align: 'center', width: 100},
            {field: 'area', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {
                field: 'createTime', title: '购买时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            },
            {
                field: 'sendTime', title: '发货时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.sendTime)
                }
            },
            {
                field: 'acceptTime', title: '收货时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.acceptTime)
                }
            },
            {
                field: 'refundTime', title: '退货时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.refundTime)
                }
            }
        ]],
        done: function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(s);
        }
    });
    $("#checkLs").on('click', function () {
        if (!checkSearchContend($("#exTimeStart").val(),$("#exTimeEnd").val(),$("#getTimeStart").val(), $("#getTimeEnd").val(),$("#backTimeStart").val(),$("#backTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                subCompany: $("#companySelect").val(),
                area: $("#areaSelect").val(),
                shop: $("#shopSelect").val(),
                orderNo: $("#orderNo").val(),
                orderStatus: getOrderStatus(),

                startSendTime: $("#exTimeStart").val(),
                endSendTime: $("#exTimeEnd").val(),
                logisticsStatus: getWuStatus(),
                prodName: $("#proName").val(),

                startAcceptTime: $("#getTimeStart").val(),
                endAcceptTime: $("#getTimeEnd").val(),
                loginName: $("#userLoginName").val(),

                startRefundTime: $("#backTimeStart").val(),
                endRefundTime: $("#backTimeEnd").val(),
                serverNo: $("#serverLoginName").val(),
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            },
            done: function () {
                base.close_load_layer(m);
            }
        });
    });

    function getOrderStatus() {
        var orderStatus = [];
        $("input:checkbox[name='typesOrder']:checked").each(function (e) {
            orderStatus.push($(this).val());//向数组中添加元素
        });
        return orderStatus.join(",");
    }

    function getWuStatus() {
        var wuStatus = [];
        $("input:checkbox[name='typesTrans']:checked").each(function (e) {
            wuStatus.push($(this).val());//向数组中添加元素
        });
        return wuStatus.join(",");
    }

    //重置
    $("#resetLs").on('click', function () {
        $("#shopArea").val('');
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.opereteReset();
        $("#orderNo").val('');
        $("#buyTimeStart").val('');
        $("#buyTimeEnd").val('');

        $("#consumeLg").val('');
        $("#exTimeStart").val('');
        $("#exTimeEnd").val('');

        $("#signTimeStart").val('');
        $("#signTimeEnd").val('');

        $("#getTimeStart").val('');
        $("#getTimeEnd").val('');

        $("#userLoginName").val('');

        $("#serverLoginName").val('');

        $("#backTimeStart").val('');
        $("#backTimeEnd").val('');
        $("#proName").val('');

        $("input:checkbox[name='typesOrder']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#orderStatus").val('');

        $("input:checkbox[name='typesTrans']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#wuStatus").val('');

        base.opereteReset();
        form.render();
    });

    $("#export").on('click', function () {
        var fileName = "营养指导-批量导出-" + base.getFormDate();
        getUrl(1, fileName);
    });
    $("#exportByShop").on('click', function () {
        var fileName = "营养指导-门店导出-" + base.getFormDate();
        getUrl(1, fileName);
    });
    $("#exportByProNum").on('click', function () {
        var fileName = "营养指导-商品导出(商品销售量)-" + base.getFormDate();
        getUrl(4, fileName);
    });
    $("#exportByProSale").on('click', function () {
        var fileName = "营养指导-商品导出(商品销售额)-" + base.getFormDate();
        getUrl(5, fileName);
    });

    function getUrl(value, fileName) {
        if (!checkSearchContend($("#exTimeStart").val(),$("#exTimeEnd").val(),$("#getTimeStart").val(), $("#getTimeEnd").val(),$("#backTimeStart").val(),$("#backTimeEnd").val())) {
            return;
        }
        var url = base.apiUrl() + "/yysSearch/exportBy?exportType=" + value;
        var length = 0;
        var shopId = $("#shopSelect").val();
        if (shopId != null && shopId != '') {
            url += "&shop=" + shopId;
            length++;
        }
        var areaId = $("#areaSelect").val();
        if (areaId != null && areaId != '') {
            url += "&area=" + areaId;
            length++;
        }
        var branchCompanyId = $("#companySelect").val();
        if (branchCompanyId != null && branchCompanyId != '') {
            url += "&subCompany=" + branchCompanyId;
            length++;
        }
        var orderNo = $("#orderNo").val();
        if (orderNo != null && orderNo != '') {
            url += "&orderNo=" + orderNo;
            length++;
        }
        var exTimeStart = $("#exTimeStart").val();
        if (exTimeStart != null && exTimeStart != '') {
            url += "&startSendTime=" + exTimeStart;
            length++;
        }
        var memberName = $("#userName").val();
        if (memberName != null && memberName != '') {
            url += "&memberName=" + memberName;
            length++;
        }
        var exTimeEnd = $("#exTimeEnd").val();
        if (exTimeEnd != null && exTimeEnd != '') {
            url += "&endSendTime=" + exTimeEnd;
            length++;
        }
        var getTimeStart = $("#getTimeStart").val();
        if (getTimeStart != null && getTimeStart != '') {
            url += "&startAcceptTime=" + getTimeStart;
            length++;
        }
        var getTimeEnd = $("#getTimeEnd").val();
        if (getTimeEnd != null && getTimeEnd != '') {
            url += "&endAcceptTime=" + getTimeEnd;
            length++;
        }
        var userLoginName = $("#userLoginName").val();
        if (userLoginName != null && userLoginName != '') {
            url += "&loginName=" + userLoginName;
            length++;
        }
        var backTimeStart = $("#backTimeStart").val();
        if (backTimeStart != null && backTimeStart != '') {
            url += "&startRefundTime=" + backTimeStart;
            length++;
        }
        var backTimeEnd = $("#backTimeEnd").val();
        if (backTimeEnd != null && backTimeEnd != '') {
            url += "&endRefundTime=" + backTimeEnd;
            length++;
        }
        var serverLoginName = $("#serverLoginName").val();
        if (serverLoginName != null && serverLoginName != '') {
            url += "&serverNo=" + serverLoginName;
            length++;
        }
        var orderStatus = getOrderStatus();
        if (orderStatus != null && orderStatus != '') {
            url += "&orderStatus=" + orderStatus;
            length++;
        }
        var wuStatus = getWuStatus();
        if (wuStatus != null && wuStatus != '') {
            url += "&logisticsStatus=" + wuStatus;
            length++;
        }
        var prodName = $("#proName").val();
        if (prodName != null && prodName != '') {
            url += "&prodName=" + prodName;
            length++;
        }
        base.judgeDownload(url, fileName, length);
    }
    function checkSearchContend(startTime,endTime,startTime2,endTime2,startTime3,endTime3) {
        if (startTime) {
            if (!endTime) {
                layer.alert('发货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("发货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('发货起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('收货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("收货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('收货起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime3) {
            if (!endTime3) {
                layer.alert('退货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime3);
            var end = new Date(endTime3);
            var varify = end > start;
            if (!varify){
                layer.alert("退货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime3) {
            layer.alert('退货起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
