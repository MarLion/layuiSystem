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
    base.multiSelect('downpanel','multSelects2','orderTypes','types');
    base.multiSelect('downpanel1','multSelects11','orderTypes1','otype');
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
        elem: '#createTimeStart',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#createTimeEnd',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

   laydate.render({
        elem: '#payTimeStart',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#payTimeEnd',
        type: 'datetime',
        // btns:['clear','confirm'],
        btns:['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#bd', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "page", limitName: "size"},
        url: base.apiUrl() + "/hnSearch/getOrders",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        cols: [[ // 表头
            {field: 'id', title: '序号', align: 'center',fixed: 'left', width: 60, templet: function (d) {return d.LAY_TABLE_INDEX + 1}},
            {field: 'orderStatus', title: '订单状态', align: 'center', width: 89},
            {field: 'orderType', title: '订单类型', align: 'center', width: 150},
            {field: 'orderNo', title: '订单编号', align: 'center', width: 150},
            {field: 'loginName', title: '用户账号', align: 'center', width: 128},
            {field: 'userName', title: '用户姓名', align: 'center', width: 100},
            {field: 'serviveName', title: '服务名称', align: 'center', width: 150},
            {field: 'amount', title: '订单金额', align: 'center', width: 89},
            {field: 'hnName', title: '红娘', align: 'center', width: 100},
            {field: 'hnLoginName', title: '红娘账号', align: 'center', width: 128},
            {field: 'subCompany', title: '分公司', align: 'center', width: 100},
            {field: 'area', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {field: 'createTime', title: '创建时间', width: 180, align: 'center', templet: function (e) {return base.toDateString(e.createTime)}},
            {field: 'payDate', title: '支付时间',width: 180, align: 'center', templet: function (e) {return base.toDateString(e.payDate)}}
        ]],
        done: function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(s);
        }
    });
    $("#checkBd").on('click', function () {
        if (!checkSearchContend($("#createTimeStart").val(),$("#createTimeEnd").val(),$("#payTimeStart").val(), $("#payTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                subCompany: $("#companySelect").val(),
                area: $("#areaSelect").val(),
                shop: $("#shopSelect").val(),
                loginName:$("#loginName").val(),
                hnLoginName:$("#hnLoginName").val(),

                startCreateTime: $("#createTimeStart").val(),
                endCreateTime: $("#createTimeEnd").val(),
                orderTypes:getOrderType(),
                orderNo: $("#orderNo").val(),

                startPayTime: $("#payTimeStart").val(),
                endPayTime: $("#payTimeEnd").val(),
                orderStatus: getOrderStatus()

            }
            , page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
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

    function getOrderType(){
        var orderType = [];
        $("input:checkbox[name='otype']:checked").each(function(e){
            orderType.push($(this).val());
        });
        return orderType.join(",");
    }

    $("#resetBd").on('click',function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        $("input:checkbox[name='otype']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#loginName").val('');
        $("#hnLoginName").val('');
        $("#createTimeStart").val('');
        $("#createTimeEnd").val('');
        $("#payTimeStart").val('');
        $("#payTimeEnd").val('');
        $('#orderNo').val('');
        $("input:checkbox[name='types']:checked").each(function (e) {
            $(this).attr('checked', false)
        });
        $("#orderStatus").val('');
        $("#orderType").val('');

        base.opereteReset();

        form.render();
    })

    $("#export").on('click', function () {
        var fileName = "相亲交友(用户订单)-批量导出-"+base.getFormDate();
        getUrl(1,fileName);
    });
    $("#exportByShop").on('click', function () {
        var fileName = "相亲交友(用户订单)-门店导出-"+base.getFormDate();
        getUrl(2,fileName);
    });

    function getUrl(value,fileName) {
        if (!checkSearchContend($("#createTimeStart").val(),$("#createTimeEnd").val(),$("#payTimeStart").val(), $("#payTimeEnd").val())) {
            return;
        }
        var url = base.apiUrl()+ "/hnSearch/exportBy?exportType=" + value;
        var length = 0;
        var branchCompanyId = $("#companySelect").val();
        if (branchCompanyId != null && branchCompanyId != '') {
            url += "&subCompany=" + branchCompanyId;
            length++;
        }
        var areaId = $("#areaSelect").val();
        if (areaId != null && areaId != '') {
            url += "&area=" + areaId;
            length++;
        }
        var shopId = $("#shopSelect").val();
        if (shopId != null && shopId != '') {
            url += "&shop=" + shopId;
            length++;
        }
        var loginName = $("#loginName").val();
        if (loginName != null && loginName != '') {
            url += "&loginName=" + loginName;
            length++;
        }
        var hnLoginName = $("#hnLoginName").val();
        if (hnLoginName != null && hnLoginName != '') {
            url += "&hnLoginName=" + hnLoginName;
            length++;
        }

        var createTimeStart = $("#createTimeStart").val();
        if (createTimeStart != null && createTimeStart != '') {
            url += "&startCreateTime=" + createTimeStart;
            length++;
        }
        var createTimeEnd = $("#createTimeEnd").val();
        if (createTimeEnd != null && createTimeEnd != '') {
            url += "&endCreateTime=" + createTimeEnd;
            length++;
        }
        var orderTypes = getOrderType();
        if(orderTypes !=null && orderTypes != ''){
            url += "&orderTypes=" + orderTypes;
            length++;
        }
        var orderNo = $("#orderNo").val();
        if (orderNo != null && orderNo != '') {
            url += "&orderNo=" + orderNo;
            length++;
        }

        var payTimeStart = $("#payTimeStart").val();
        if (payTimeStart != null && payTimeStart != '') {
            url += "&startPayTime=" + payTimeStart;
            length++;
        }
        var payTimeEnd = $("#payTimeEnd").val();
        if (payTimeEnd != null && payTimeEnd != '') {
            url += "&endPayTime=" + payTimeEnd;
            length++;
        }
        var orderStatus = getOrderStatus();
        if (orderStatus != null && orderStatus != "" && orderStatus != undefined) {
            url += "&orderStatus=" + orderStatus;
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
