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
    // updateLayuiDate('buyTimeStart');
    // updateLayuiDate('buyTimeEnd');
    // updateLayuiDate('exTimeStart');
    // updateLayuiDate('exTimeEnd');
    // updateLayuiDate('signTimeStart');
    // updateLayuiDate('signTimeEnd');
    // base.operateArea();
    base.fourLevelAreaSelect();
    base.multiSelect('downpanel', 'multSelects1', 'orderTypes', 'types');
    base.multiSelect('downpane2', 'multSelects2', 'wuTypes', 'wuType');

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
        elem: '#buyTimeStart',
        type: 'datetime',
        value: new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        // max: base.maxDate(),//默认最大值为当前日期
    });
   laydate.render({
        elem: '#buyTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        value: new Date(new Date()),
        // max: base.maxDate(),
    });

   laydate.render({
        elem: '#exTimeStart',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        // max: base.maxDate(),//默认最大值为当前日期
    });
    laydate.render({
        elem: '#exTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

    laydate.render({
        elem: '#signTimeStart',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        // max: base.maxDate(),//默认最大值为当前日期
    });
    laydate.render({
        elem: '#signTimeEnd',
        type: 'datetime',
        // btns: ['clear', 'confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        // max: base.maxDate(),
    });
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#vip', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "pageNum", limitName: "pageSize"},
        url: base.apiUrl() + "/vipShopping/getOrdersBy",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        where:{
            buyTimeBegin: $("#buyTimeStart").val(),
            buyTimeEnd: $("#buyTimeEnd").val()
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center', fixed: 'left', width: 100, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName', title: '用户账号', align: 'center', width: 100},
            {field: 'userName', title: '用户姓名', align: 'center', width: 100},
            {field: 'shopArea', title: '所在大区', align: 'center', width: 100},
            {field: 'company', title: '分公司', align: 'center', width: 100},
            {field: 'area', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {field: 'proName', title: '商品名称', align: 'center', width: 150},
            {field: 'proCode', title: '商品编号', align: 'center', width: 150},
            {field: 'proNum', title: '商品数量', align: 'center', width: 89},
            {field: 'wuStatus', title: '物流状态', align: 'center', width: 80},
            {field: 'totalPrice', title: '消耗玄乐', align: 'center', width: 80},
            {field: 'integral', title: '抵扣积分', align: 'center', width: 80},
            {field: 'orderStatus', title: '订单状态', align: 'center', width: 80},
            {field: 'orderNo', title: '订单编号', align: 'center', width: 80},
            {
                field: 'buyTime', title: '购买时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.buyTime)
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
        if (!checkSearchContend($("#buyTimeStart").val(),$("#buyTimeEnd").val(),$("#exTimeStart").val(), $("#exTimeEnd").val(),$("#signTimeStart").val(),$("#signTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                shopAreaId: $("#shopArea").val(),
                branchCompanyId: $("#companySelect").val(),
                areaId: $("#areaSelect").val(),
                shopId: $("#shopSelect").val(),

                orderNo: $("#orderNo").val(),
                buyTimeBegin: $("#buyTimeStart").val(),
                buyTimeEnd: $("#buyTimeEnd").val(),
                proCode: $("#proCode").val(),

                loginName: $("#consumeLg").val(),
                sendTimeBegin: $("#exTimeStart").val(),
                sendTimeEnd: $("#exTimeEnd").val(),
                proName: $("#proName").val(),

                queryOrderStatus: getOrderStatus(),
                signTimeBegin: $("#signTimeStart").val(),
                signTimeEnd: $("#signTimeEnd").val(),
                queryWuStatus: getWuStatus()
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
        $("input:checkbox[name='types']:checked").each(function (e) {
            orderStatus.push($(this).val());//向数组中添加元素
        });
        return orderStatus.join(",");
    }

    function getWuStatus() {
        var orderStatus = [];
        $("input:checkbox[name='wuType']:checked").each(function (e) {
            orderStatus.push($(this).val());//向数组中添加元素
        });
        return orderStatus.join(",");
    }

    //重置
    $("#resetLs").on('click', function () {
        $("#shopArea").val('');
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.fourReset();
        $("#orderNo").val('');
        $("#buyTimeStart").val('');
        $("#buyTimeEnd").val('');
        $("#proCode").val();

        $("#consumeLg").val('');
        $("#exTimeStart").val('');
        $("#exTimeEnd").val('');
        $("#proName").val('');

        $("#signTimeStart").val('');
        $("#signTimeEnd").val('');

        $("input:checkbox[name='types']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#orderStatus").val('');

        $("input:checkbox[name='wuType']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#wuStatus").val('');

        base.fourReset();
        form.render();
    });

    $("#export").on('click', function () {
        var fileName = "专享商城-批量导出" + base.getFormDate();
        getUrl(1,fileName);
    });
    $("#exportByShop").on('click', function () {
        var fileName = "专享商城-门店导出" + base.getFormDate();
        getUrl(2,fileName);
    });
    $("#exportByProNum").on('click', function () {
        var fileName = "专享商城-商品销量导出" + base.getFormDate();
        getUrl(3,fileName);
    });
    $("#exportByProSale").on('click', function () {
        var fileName = "专享商城-商品销售额导出" + base.getFormDate();
        getUrl(4,fileName);
    });

    function getUrl(value,fileName) {
        if (!checkSearchContend($("#buyTimeStart").val(),$("#buyTimeEnd").val(),$("#exTimeStart").val(), $("#exTimeEnd").val(),$("#signTimeStart").val(),$("#signTimeEnd").val())) {
            return;
        }
        var url = base.apiUrl() + "/vipShopping/export2Excel?exportType=" + value;
        var length = 0;
        var shopArea = $("#shopArea").val();
        if (shopArea != null && shopArea != "" && shopArea != undefined) {
            url += "&shopAreaId=" + shopArea;
            length++;
        }
        var branchCompanyId = $("#companySelect").val();
        if (branchCompanyId != null && branchCompanyId != "" && branchCompanyId != undefined) {
            url += "&branchCompanyId=" + branchCompanyId;
            length++;
        }
        var areaId = $("#areaSelect").val();
        if (areaId != null && areaId != "" && areaId != undefined) {
            url += "&areaId=" + areaId;
            length++;
        }
        var shopId = $("#shopSelect").val();
        if (shopId != null && shopId != "" && shopId != undefined) {
            url += "&shopId=" + shopId;
            length++;
        }
        var orderNo = $("#orderNo").val();
        if (orderNo != null && orderNo != "" && orderNo != undefined) {
            url += "&orderNo=" + orderNo;
            length++;
        }
        var buyTimeBegin = $("#buyTimeStart").val();
        if (buyTimeBegin != null && buyTimeBegin != "" && buyTimeBegin != undefined) {
            url += "&buyTimeBegin=" + buyTimeBegin;
            length++;
        }
        var buyTimeEnd = $("#buyTimeEnd").val();
        if (buyTimeEnd != null && buyTimeEnd != "" && buyTimeEnd != undefined) {
            url += "&buyTimeEnd=" + buyTimeEnd;
            length++;
        }

        var loginName = $("#loginName").val();
        if (loginName != null && loginName != "" && loginName != undefined) {
            url += "&loginName=" + loginName;
            length++;
        }
        var sendTimeBegin = $("#exTimeStart").val();
        if (sendTimeBegin != null && sendTimeBegin != "" && sendTimeBegin != undefined) {
            url += "&sendTimeBegin=" + sendTimeBegin;
            length++;
        }
        var sendTimeEnd = $("#exTimeEnd").val();
        if (sendTimeEnd != null && sendTimeEnd != "" && sendTimeEnd != undefined) {
            url += "&sendTimeEnd=" + sendTimeEnd;
            length++;
        }

        var queryWuStatus = getWuStatus();
        if (queryWuStatus != null && queryWuStatus != "" && queryWuStatus != undefined) {
            url += "&queryWuStatus=" + queryWuStatus;
            length++;
        }
        var signTimeBegin = $("#signTimeStart").val();
        if (signTimeBegin != null && signTimeBegin != "" && signTimeBegin != undefined) {
            url += "&signTimeBegin=" + signTimeBegin;
            length++;
        }
        var signTimeEnd = $("#signTimeEnd").val();
        if (signTimeEnd != null && signTimeEnd != "" && signTimeEnd != undefined) {
            url += "&signTimeEnd=" + signTimeEnd;
            length++;
        }
        var orderStatus = getOrderStatus();
        if (orderStatus != null && orderStatus != "" && orderStatus != undefined) {
            url += "&queryOrderStatus=" + orderStatus;
            length++;
        }

        var proCode = $("#proCode").val();
        if (proCode != null && proCode != "" && proCode != undefined) {
            url += "&proCode=" + proCode;
            length++;
        }

        var proName = $("#proName").val();
        if (proName != null && proName != "" && proName != undefined) {
            url += "&proName=" + proName;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }
    //检验时间
    function checkSearchContend(startTime,endTime,startTime2,endTime2,startTime3,endTime3) {
        if (startTime) {
            if (!endTime) {
                layer.alert('购买起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("购买结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('购买起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('发货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("发货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('发货起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime3) {
            if (!endTime3) {
                layer.alert('签收起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime3);
            var end = new Date(endTime3);
            var varify = end > start;
            if (!varify){
                layer.alert("签收结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime3) {
            layer.alert('签收起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
