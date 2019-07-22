layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table,
        element = layui.element;
    base.operateArea();
    base.multiSelect('downpanel-pay','multSelects1-pay','orderTypes-pay','typesPay');
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'datetime',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss'
            })
        })
    }

    laydate.render({
        elem: '#hnCreateTimeStart',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#hnCreateTimeEnd',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#hnPayTimeStart',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#hnPayTimeEnd',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });


    var tableIns = table.render({
        elem: '#hn', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "page", limitName: "size"},
        url: base.apiUrl() + "/hnSearch/getHnOrder",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        cols: [[ // 表头
            {field: 'id', title: '序号',align: 'center', fixed: 'left', width: 60, templet: function (d) {return d.LAY_TABLE_INDEX + 1}},
            {field: 'orderNo', title: '订单编号', align: 'center', width: 100},
            {field: 'payStatus', title: '支付状态', align: 'center', width: 100},
            {field: 'orderType', title: '订单类型', align: 'center', width: 100},
            {field: 'isDraw', title: '押金是否提取', align: 'center', width: 100},
             {field: 'amount', title: '押金金额', align: 'center', width: 100},
            {field: 'hnLoginName', title: '红娘账号', align: 'center', width: 128},
            {field: 'hnName', title: '红娘姓名', align: 'center', width: 100},
            {field: 'subCompany', title: '分公司', align: 'center', width: 100},
            {field: 'area', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {field: 'createTime', title: '创建时间', width: 180, align: 'center', templet: function (e) {return base.toDateString(e.createTime)}},
            {field: 'payTime', title: '支付时间', align: 'center', templet: function (e) {return base.toDateString(e.payTime)}}
        ]],
        done: function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.parent.location.href = '/role-admin/login.html';
                return;
            }
        }
    });
    $("#checkHn").on('click', function () {
        if (!checkSearchContend($("#hnCreateTimeStart").val(),$("#hnCreateTimeEnd").val(),$("#hnPayTimeStart").val(), $("#hnPayTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                subCompany: $("#companySelect").val(),
                area: $("#areaSelect").val(),
                shop: $("#shopSelect").val(),
                hnLoginName: $("#hnLoginName").val(),
                isDraw: $("#isDraw").val(),
                startCreateTime: $("#hnCreateTimeStart").val(),
                endCreateTime: $("#hnCreateTimeEnd").val(),
                orderNo:$("#orderNo").val(),
                orderStatus:getPayStatus(),
                startPayTime: $("#hnPayTimeStart").val(),
                endPayTime: $("#hnPayTimeEnd").val()
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });
    //重置搜索条件
    $("#resetHn").on('click',function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        $("#hnLoginName").val('');
        $("#isDraw").val('');
        $("#hnCreateTimeStart").val('');
        $("#hnCreateTimeEnd").val('');
        $("#orderNo").val('');
        $("#hnPayTimeStart").val('');
        $("#hnPayTimeEnd").val('');
        $("input:checkbox[name='typesPay']:checked").each(function (e) {
            $(this).attr('checked', false);
        });
        $("#payStatus").val('');
        base.opereteReset();
        form.render();
    })

    function getPayStatus() {
        var value = [];
        $("input:checkbox[name='typesPay']:checked").each(function (e) {
            value.push($(this).val());//向数组中添加元素
        });
        return value.join(",");
    }

    $("#export").on('click',function () {
        var fileName = "相亲交友(红娘订单)-批量导出-"+base.getFormDate();
        getUrl(3,fileName);
    });
    $("#exportByShop").on('click', function () {
        var fileName = "相亲交友(红娘订单)-门店导出-"+base.getFormDate();
        getUrl(4,fileName);
    });

    function getUrl(value,fileName) {
        if (!checkSearchContend($("#hnCreateTimeStart").val(),$("#hnCreateTimeEnd").val(),$("#hnPayTimeStart").val(), $("#hnPayTimeEnd").val())) {
            return;
        }
        var url = base.apiUrl()+ "/hnSearch/exportBy?exportType=" + value;
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
        var hnLoginName = $("#hnLoginName").val();
        if (hnLoginName != null && hnLoginName != '') {
            url += "&hnLoginName=" + hnLoginName;
            length++;
        }
        var isDraw = $("#isDraw").val();
        if (isDraw != null && isDraw != '') {
            url += "&isDraw=" + isDraw;
            length++;
        }
        var hnCreateTimeStart = $("#hnCreateTimeStart").val();
        if (hnCreateTimeStart != null && hnCreateTimeStart != '') {
            url += "&startCreateTime=" + hnCreateTimeStart;
            length++;
        }
        var hnCreateTimeEnd = $("#hnCreateTimeEnd").val();
        if (hnCreateTimeEnd != null && hnCreateTimeEnd != '') {
            url += "&endCreateTime=" + hnCreateTimeEnd;
            length++;
        }
        var orderNo = $("#orderNo").val();
        if (orderNo != null && orderNo != '') {
            url += "&orderNo=" + orderNo;
            length++;
        }
        var payStatus = getPayStatus();
        if (payStatus != null && payStatus != "" && payStatus != undefined) {
            url += "&orderStatus=" + payStatus;
            length++;
        }
        var hnPayTimeStart = $("#hnPayTimeStart").val();
        if (hnPayTimeStart != null && hnPayTimeStart != '') {
            url += "&startPayTime=" + hnPayTimeStart;
            length++;
        }
        var hnPayTimeEnd = $("#hnPayTimeEnd").val();
        if (hnPayTimeEnd != null && hnPayTimeEnd != '') {
            url += "&endPayTime=" + hnPayTimeEnd;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }
    function checkSearchContend(startTime,endTime,startTime2,endTime2) {
        if (startTime) {
            if (!endTime) {
                layer.alert('创建起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("创建结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('创建起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('支付起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("支付结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('支付起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
