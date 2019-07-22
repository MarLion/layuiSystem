layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;

    base.multiSelect('downpanel-income','multSelects1-income','orderTypes-income','typesIncome');
    var depts = getCookie("depts");
    var level = getCookie("roleLevel");

    //时间选择器
   laydate.render({
        elem: '#timeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#timeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#arrideTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
  laydate.render({
        elem: '#arrideTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

    //查询
    var tableIns = table.render({
        elem:'#income',limit: 10, cellMinWidth: 80,
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiShopUrl() + "/profitSharecw/list?deptIds="+depts+"&roleLevel="+level,
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        where:{
            beginSearchTime: $("#timeStart").val(),
            endSearchTime: $("#timeEnd").val(),
        },
        parseData:function (res) {
            return {
                "code":res.code,
                "data":res.data,
                "count":res.count
            }
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center',fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName', title: '玄乐账号', align: 'center',},
            {field: 'amount', title: '分成金额', align: 'center',},
            {field: 'shareType', title: '分成类型', align: 'center',templet:function (f) {
                    return formatShareType(f.shareType);
                }},
            {field: 'status', title: '是否到账', align: 'center',templet:function (g) {
                    return formatShareStatus(g.status);
                }},
            {field: 'createTime', title: '创建时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            },
            {field: 'updateTime', title: '到账时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.updateTime)
                }
            }
        ]],
        done:function (res) {
            if (res.code == 501) {
                window.location.href = 'login.html';
                return;
            }
        }
    });

    //格式化分成类型
    function formatShareStatus(status){
        if (status == -1){
            return "已取消"
        } else if (status == 0){
            return "<span style='color: red;'>未到账</span>"
        } else if (status == 1){
            return "已到账"
        }
    }

    //格式化分成类型
    function formatShareType(type){
        if (type == 0){
            return "平台管理费"
        } else if (type == 1){
            return "推荐人服务费"
        } else if (type == 2){
            return "特约人服务费"
        }else if (type == 3){
            return "推广员服务费"
        }
    }

    //多条件查询
    $("#checkIncome").click(function () {
        if (!checkSearchContend($("#timeStart").val(),$("#timeEnd").val(),$("#arrideTimeStart").val(),$("#arrideTimeEnd").val())) {
            return;
        }
        var shareTypeIds=[];
        $("input:checkbox[name='typesIncome']:checked").each(function(e) {
            shareTypeIds.push($(this).val());//向数组中添加元素
        });
        shareTypeIds=shareTypeIds.join(',');//将数组元素连接起来以构建一个字符串
        var timeStart = $("#timeStart").val();
        var timeEnd=$("#timeEnd").val();
        var arrideTimeStart = $("#arrideTimeStart").val();
        var arrideTimeEnd = $("#arrideTimeEnd").val();
        var status = $("#status").val();
        var orderNo = $("#orderNo").val();
        var shop_name = $("#shop_name").val();
        var loginName = $("#loginName").val();
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                beginSearchTime: timeStart,
                endSearchTime: timeEnd,
                loginName: loginName,
                arrideTimeStart:arrideTimeStart,
                arrideTimeEnd:arrideTimeEnd,
                status:status,
                shopName:shop_name,
                shareTypeIds:shareTypeIds,
                orderNo:orderNo
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

//  收益导出提示信息
    $("#settleExcel").hover(function() {
        var value ="导出条件仅可选择订单完成时间，店铺名称!"
        openMsg(value);
    }, function() {
        layer.close(subtips);
    });
    function openMsg(value) {
        subtips = layer.tips(value,'#settleExcel',{tips:[1,'#ff6700'],time: 3000});
    }

    //批量导出
    $("#incomeExcel").on('click', function () {
        var fileName = "收益结算-批量导出" + base.getFormDate();
        var url = base.apiShopUrl()+ "/profitSharecw/batchExport?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });
    function getParamter(url,fileName) {
        if (!checkSearchContend($("#timeStart").val(),$("#timeEnd").val(),$("#arrideTimeStart").val(),$("#arrideTimeEnd").val())) {
            return;
        }
        var length = 0;
        var shareTypeIds=[];
        $("input:checkbox[name='typesIncome']:checked").each(function(e) {
            shareTypeIds.push($(this).val());//向数组中添加元素
        });
        shareTypeIds=shareTypeIds.join(',');//将数组元素连接起来以构建一个字符串
        if(shareTypeIds != null && shareTypeIds != ''){
            url += "&shareTypeIds=" + shareTypeIds;
            length++;
        }
        var status=$("#status").val();
        if(status != null ){
            url += "&status=" + status;
            length++;
        }
        var orderNo=$("#orderNo").val();
        if (orderNo != null && orderNo != '') {
            url += "&orderNo=" + orderNo;
            length++;
        }
        var loginName=$("#loginName").val();
        if (loginName != null && loginName != '') {
            url += "&loginName=" + loginName;
            length++;
        }
        var shop_name=$("#shop_name").val();
        if (shop_name != null && shop_name != '') {
            url += "&shopName=" + shop_name;
            length++;
        }
        var timeStart=$("#timeStart").val();//购买开始时间
        if (timeStart != null && timeStart != '') {
            url += "&timeStart=" + timeStart;
            length++;
        }
        var timeEnd=$("#timeEnd").val();//购买结束时间
        if (timeEnd != null && timeEnd != '') {
            url += "&timeEnd=" + timeEnd;
            length++;
        }
        var arrideTimeStart=$("#arrideTimeStart").val();//购买开始时间
        if (arrideTimeStart != null && arrideTimeStart != '') {
            url += "&arrideTimeStart=" + arrideTimeStart;
            length++;
        }
        var arrideTimeEnd=$("#arrideTimeEnd").val();//购买结束时间
        if (arrideTimeEnd != null && arrideTimeEnd != '') {
            url += "&arrideTimeEnd=" + arrideTimeEnd;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }

    //收益数据导出
    $("#settleExcel").click(function () {
        var beginSearchTime = $("#startSignTime").val();
        var endSearchTime = $("#endSignTime").val();
        var shopName=$("#shop_name").val();
        var profitcwExportCheck = getCookie("profitcwExportCheck");
        if (profitcwExportCheck == '') {
            location.href = base.apiShopUrl() + "/profitSharecw/profitExportToExcel?deptIds="+depts+"&shopName=" + shopName +
                "&beginSearchTime=" + beginSearchTime + "&endSearchTime=" + endSearchTime+"&roleLevel="+level;
            setCookie("profitcwExportCheck","profitcwExportCheck",30)
        }else {
            layer.open({
                title: '温馨提示'
                ,content: '请勿频繁点击导出按钮'
                ,area: ['270px', '160px']
                ,btnAlign: 'c'
                ,btn: ['我知道了']
                ,yes: function(index, layero){
                    layer.close(index);
                }
            });
        }
    });

    //重置查询条件
    $("#resetIncome").click(function () {
        $("#timeStart").val('');
        $("#timeEnd").val('');
        $("#loginName").val('');
        $("#orderNo").val('');
        $("#status").val('');
        $("#shop_name").val('');
        $("#arrideTimeStart").val('');
        $("#arrideTimeEnd").val('');
        $("#startSignTime").val('');
        $("#endSignTime").val('');
        $(".orderTypes-income").val('');
        $("input:checkbox[name='typesIncome']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        form.render('');
    });
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
                layer.alert('到账起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("到账结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('到账起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }

})
