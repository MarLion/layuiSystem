layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','laypage'],function () {
    var  table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        laydate = layui.laydate,
        base = layui.base,
        laypage = layui.laypage;
    base.fourLevelAreaSelect();
    base.multiSelect('downpanel','multSelects1');
    var buyTimeStart = laydate.render({
        elem: '#buyTimeStart',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns:['confirm'],
        value: new Date(new Date() - 1000 * 60 * 60 * 24*30),
    });
    var buyTimeEnd = laydate.render({
        elem: '#buyTimeEnd',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns:['confirm'],
        value: new Date(new Date()),
    });
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#hp', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "pageNum", limitName: "pageSize"},
        url: base.apiUrl() + "/yysStatistics/getOrdersBy",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        where:{
            startCreateTime: $("#buyTimeStart").val(),
            endCreateTime: $("#buyTimeEnd").val()
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号',  align: 'center',fixed: 'left', width: 100, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName', title: '用户账号', align: 'center', width: 120},
            {field: 'userName', title: '用户姓名', align: 'center', width: 100},
            {field: 'shopArea', title: '大区', align: 'center', width: 100},
            {field: 'subCompany', title: '分公司', align: 'center', width: 100},
            {field: 'area', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {field: 'name', title: '商品名称', align: 'center', width: 200},
            {field: 'proCode', title: '商品编号', align: 'center', width: 150},
            {field: 'num', title: '商品数量', align: 'center', width: 100},
            {field: 'totalPrice', title: '总金额', align: 'center', width: 80},
            {field: 'cash', title: '支付现金', align: 'center', width: 100},
            {field: 'integral', title: '支付积分', align: 'center', width: 100},
            {field: 'reducedPay', title: '抵扣玄乐', align: 'center', width: 100},
            {field: 'type', title: '类型', align: 'center', width: 120},
            {field: 'serviceName', title: '销售人', align: 'center', width: 80},
            {field: 'kpiLoginName', title: 'KPI账号', align: 'center', width: 80},
            {field: 'serviceNo', title: '销售人玄乐账号', align: 'center', width: 150},
            {field: 'post', title: '职位', align: 'center', width: 100},
            {
                field: 'createTime', title: '购买时间', width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            },
            {field: '', title: '使用优惠券备注', align: 'center', width: 80},
            {field: '', title: '优惠金额', align: 'center', width: 80},
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
    $("#checkAccounts").on('click', function () {
        if (!checkSearchContend($("#buyTimeStart").val(),$("#buyTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                shopAreaId: $("#shopArea").val(),
                companyId: $("#companySelect").val(),
                areaId: $("#areaSelect").val(),
                shopId: $("#shopSelect").val(),
                proCode: $("#productCode").val(),
                proName: $("#productName").val(),
                loginName: $("#consumeLg").val(),

                serviceNo: $("#sellerNo").val(),
                startCreateTime: $("#buyTimeStart").val(),
                endCreateTime: $("#buyTimeEnd").val(),
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

    $("#reset").on('click', function () {
        $("#shopArea").val('');
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        $("#productCode").val('');
        $("#productName").val('');
        $("#consumeLg").val('');
        $("#sellerNo").val('');
        $("#buyTimeStart").val('');
        $("#buyTimeEnd").val('');
        base.fourReset();
        form.render();
    });


    $("#export").on('click', function () {
        var fileName = "保健产品-批量导出" + base.getFormDate();
        getUrl(1,fileName);
    });
    $("#exportByShop").on('click', function () {
        var fileName = "保健产品-门店导出"+base.getFormDate();
        getUrl(2,fileName);
    });
    $("#exportByProNum").on('click', function () {
        var fileName = "保健产品-商品导出(数量)"+base.getFormDate();
        getUrl(3,fileName);
    });
    $("#exportByProSale").on('click', function () {
        var fileName = "保健产品-商品导出(销售额)"+base.getFormDate();
        getUrl(4,fileName);
    });
    function getUrl(value,fileName) {
        if (!checkSearchContend($("#buyTimeStart").val(),$("#buyTimeEnd").val(),$("#exTimeStart").val(), $("#exTimeEnd").val(),$("#signTimeStart").val(),$("#signTimeEnd").val())) {
            return;
        }
        var url = base.apiUrl()+ "/yysStatistics/exportBy?exportType=" + value;
        var length = 0;
        var shopId = $("#shopSelect").val();
        if (shopId != null && shopId != '') {
            url += "&shopId=" + shopId;
            length++;
        }
        var areaId = $("#areaSelect").val();
        if (areaId != null && areaId != '') {
            url += "&areaId=" + areaId;
            length++;
        }
        var branchCompanyId = $("#companySelect").val();
        if (branchCompanyId != null && branchCompanyId != '') {
            url += "&companyId=" + branchCompanyId;
        }
        var shopAreaId = $('#shopArea').val();
        if(shopAreaId != null && shopAreaId != ''){
            url += "&shopAreaId=" + shopAreaId;
        }
        var productCode = $("#productCode").val();
        if (productCode != null && productCode != '') {
            url += "&proCode=" + productCode;
            length++;
        }
        var productName = $("#productName").val();
        if (productName != null && productName != '') {
            url += "&proName=" + productName;
            length++;
        }
        var consumeLg = $("#consumeLg").val();
        if (consumeLg != null && consumeLg != '') {
            url += "&loginName=" + consumeLg;
        }
        var sellerNo = $("#sellerNo").val();
        if (sellerNo != null && sellerNo != '') {
            url += "&serviceNo=" + sellerNo;
            length++;
        }
        var buyTimeStart = $("#buyTimeStart").val();
        if (buyTimeStart != null && buyTimeStart != '') {
            url += "&startCreateTime=" + buyTimeStart;
            length++;
        }
        var buyTimeEnd = $("#buyTimeEnd").val();
        if (buyTimeEnd != null && buyTimeEnd != '') {
            url += "&endCreateTime=" + buyTimeEnd;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }
    function checkSearchContend(startTime,endTime) {
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
        return true;
    }
});
