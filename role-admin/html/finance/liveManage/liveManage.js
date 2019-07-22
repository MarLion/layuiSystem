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
    function updateLayuiDate(cls) {
        $("#" + cls).each(function () {
            laydate.render({
                elem: this,
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm:ss',
                max: maxDate(),
            })
        })
    }
   laydate.render({
        elem: '#orderTimeStart',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns: ['confirm'],
    });
    laydate.render({
        elem: '#orderTimeEnd',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns: ['confirm'],
    });

    //日期
    laydate.render({
        elem: '#createTimeStart',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns: ['confirm'],
    });
   laydate.render({
        elem: '#createTimeEnd',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        // btns:['clear','confirm'],
        btns: ['confirm'],
    });
    function maxDate() {
        var date = new Date();
        var yesterday = new Date(date);
        return yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate() + " " + yesterday.getHours() + ":" + yesterday.getMinutes() + ":" + yesterday.getSeconds();
    }
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#live', limit: 10, cellMinWidth: 80, method: 'post',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        request: {pageName: "pageNum", limitName: "pageSize"},
        url: base.apiUrl() + "/liveCon/getLiveList",
        headers: {'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')},
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName', title: '直播间账号', align: 'center', width: 150},
            {field: 'roomName', title: '直播间名称', align: 'center', width: 180},
            {field: 'memberName', title: '主播昵称', align: 'center', width: 180},
            {field: 'money', title: '总金额', align: 'center', width: 100},
            {field: 'memberMoney', title: '主播金额', align: 'center', width: 100},
            {field: 'gsMoney', title: '公司金额', align: 'center', width: 100},
            {
                field: 'status', align: 'center', width: 100, title: '是否发放', templet: function (e) {
                    return formatStatus(e.status);
                }
            },
            {field: 'ratio', title: '分成比率', align: 'center', width: 100},
            {field: 'branchName', title: '分公司', align: 'center', width: 100},
            {field: 'areaName', title: '区域', align: 'center', width: 100},
            {field: 'shopName', title: '门店', align: 'center', width: 100},
            {
                field: 'date', title: '创建时间', width: 200, align: 'center', templet: function (e) {
                    return base.toDateString(e.date)
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
    $("#searchBut").on('click', function () {
        if (!checkSearchContend($("#createTimeStart").val(),$("#createTimeEnd").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数
                branchCompanyId: $("#companySelect").val(),
                areaId: $("#areaSelect").val(),
                shopId: $("#shopSelect").val(),
                loginName: $("#queryLoginName").val(),
                status: $("#status").val(),
                roomName: $("#queryRoomName").val(),
                memberName: $("#userName").val(),
                queryTimeStart: $("#createTimeStart").val(),
                queryTimeEnd: $("#createTimeEnd").val()
            }
            , page: {
                curr: 1 //重新从第 1 页开始
            },
            done: function () {
                base.close_load_layer(m);
            }
        });
    });

    function formatStatus(value) {
        if (value == 0) {
            return '未发放';
        } else if (value == 1) {
            return '已发放';
        }
    }

    $("#resetBd").on('click', function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        $("#queryLoginName").val('');
        $("#status").val('');
        $("#createTimeStart").val('');
        $("#createTimeEnd").val('');
        $("#queryRoomName").val('');
        $("#orderTimeStart").val('');
        $("#orderTimeEnd").val('');
        $("#userName").val('');
        base.opereteReset();
        form.render();
    });

    $("#export").on('click', function () {
        var url = base.apiUrl() + "/liveCon/exportLiveShop2Excel?1=1";
        var fileName = "直播管理-批量导出" + base.getFormDate();
        getParamter(url, fileName);

    });

    $("#exportByShop").on('click', function () {
        var url = base.apiUrl() + "/liveCon/exportLiveShop2Excel?1=1";
        var fileName = "直播管理-门店导出-" + base.getFormDate();
        getParamter(url, fileName);
    });

    function getParamter(url, fileName) {
        if (!checkSearchContend($("#createTimeStart").val(),$("#createTimeEnd").val())) {
            return;
        }
        var length = 0;
        var status = $("#status").val();
        if (status != null && status != '') {
            url += "&status=" + status;
            length++;
        }
        var branchCompanyId = $("#companySelect").val();
        if (branchCompanyId != null && branchCompanyId != '') {
            url += "&branchCompanyId=" + branchCompanyId;
            length++;
        }
        var areaId = $("#areaSelect").val();
        if (areaId != null && areaId != '') {
            url += "&areaId=" + areaId;
            length++;
        }
        var shopId = $("#shopSelect").val();
        if (shopId != null && shopId != '') {
            url += "&shopId=" + shopId;
            length++;
        }
        var loginName = $("#queryLoginName").val();
        if (loginName != null && loginName != '') {
            url += "&loginName=" + loginName;
            length++;
        }
        var roomName = $("#queryRoomName").val();
        if (roomName != null && roomName != '') {
            url += "&roomName=" + roomName;
            length++;
        }
        var memberName = $("#userName").val();
        if (memberName != null && memberName != '') {
            url += "&memberName=" + memberName;
            length++;
        }
        var orderCreStart = $("#orderTimeStart").val();
        if (orderCreStart != null && orderCreStart != '') {
            url += "&orderCreStart=" + orderCreStart;
            length++;
        }
        var orderCreEnd = $("#orderTimeEnd").val();
        if (orderCreEnd != null && orderCreEnd != '') {
            url += "&orderCreEnd=" + orderCreEnd;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }
    function checkSearchContend(startTime,endTime) {
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
        return true;
    }
});
