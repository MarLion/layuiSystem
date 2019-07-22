layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table;
    updateLayuiDate('byTimeStart');
    updateLayuiDate('buTimeEnd');
    updateLayuiDate('exTimeStart');
    updateLayuiDate('exTimeEnd');
    updateLayuiDate('finishTimeStart');
    updateLayuiDate('finishTimeEnd');
    base.fourLevelAreaSelect();
    base.multiSelect('downpanel','multSelects1','orderTypes','types');
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem:'#points',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$search',
            parameters:"{}"
        },
        parseData:function (res) {
            return {
                "code":res.data.code,
                "data":res.data.data,
                "count":res.data.count
            }
        },
        cols:[[
            {field:'',title	:'序号',align:'center',fixed: 'left', width: 60,templet:function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }},
            {field:'loginName',title:'用户账号',align:'center',width:160},
            {field:'productName',title:'商品名称',align:'center',width:150},
            {field:'num',title:'数量',align:'center',width:100},
            {field:'cash',title:'单价',align:'center',width:100},
            {field:'figure',title:'消耗积分',align:'center',width:150},
            {field:'orderNum',title:'订单编号',align:'center',width:200},
            {field:'type',title:'订单状态',align:'center',width:120},
            {field:'status',title:'订单类型',align:'center',width:150},
            {field:'receiveTime',title:'购买时间',align:'center',width:200},
            {field:'entrepotTime',title:'出货时间',align:'center',width:200},
            {field:'time',title:'收货时间',align:'center',width:200},
            {field:'waiterMoney',title:'订单服务费（元）',align:'center',width:100},
            {field:'seller',title:'销售姓名',align:'center',width:150},
            {field:'sellerId',title:'销售KPI',align:'center',width:200},
            {field:'tgloginname',title:'销售账号',align:'center',width:200},
            {field:'post',title:'职位',align:'center',width:120},
            {field:'dept',title:'门店',align:'center',width:200},
            {field:'area',title:'区域',align:'center',width:200},
            {field:'subCompany',title:'分公司',align:'center',width:200},
            {field:'inStock',title:'是否有货',align:'center',width:100}
        ]],
        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(s);
        }
    });
    $("#checkPoints").on('click',function () {
        var obj = obtionSearchData();
        if (!obj){
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$search',
                parameters:JSON.stringify(obj)
            },
            page:{
                curr:1
            },
            done:function () {
                base.close_load_layer(m);
            }
        })
    });

    //获取搜索条件中的数据
    function obtionSearchData(){
        var orderStatusIds=[];
        $("input:checkbox[name='types']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var obj = {
            type:orderStatusIds,//订单状态
            inStock:$("#inStock").val(),//是否有货
            status:$("#status").val(),//订单类别
            loginName:$("#loginName").val(),//购买人账号
            shopId:$("#shopSelect").val(),//门店id
            areaId:$("#areaSelect").val(),//区域id
            subCompany:$("#companySelect").val(),//分公司id
            shopAreaId:$("#shopArea").val(),//大区 id
            seller:$("#seller").val(),//销售人账号
            startTime1:$("#byTimeStart").val(),//购买开始时间
            endTime1:$("#buTimeEnd").val(),//购买结束时间
            startTime2:$("#exTimeStart").val(),//出货开始时间
            endTime2:$("#exTimeEnd").val(),//出货结束时间
            startTime4:$("#finishTimeStart").val(),//完场开始时间
            endTime4:$("#finishTimeEnd").val()//完成结束时间
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if (!checkSearchContend(obj.loginName,obj.seller,obj.startTime1,obj.endTime1,obj.startTime2,obj.endTime2,obj.startTime4,obj.endTime4)){
            return;
        }
        return obj;
    }
    $("#resetPoints").on('click',function () {
        $("#inStock").val('');
        $("#status").val('');
        $("#loginName").val('');
        $("#shopSelect").val('');
        $("#areaSelect").val('');
        $("#companySelect").val('');
        $("#shopArea").val('');
        base.fourReset();
        $("#seller").val('');
        $("#byTimeStart").val('');
        $("#buTimeEnd").val('');
        $("#exTimeStart").val('');
        $("#exTimeEnd").val('');
        $("#imTimeStart").val('');
        $("#imTimeEnd").val('');
        $("#finishTimeStart").val('');
        $("#finishTimeEnd").val('');
        $(".orderTypes").val('');
        $("input:checkbox[name='types']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        form.render('');
    });
    //批量导出
    $("#pointExports").on('click',function () {
        var obj = obtionSearchData();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelUser","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelUser","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelUser','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });

    //门店导出
    $("#ponitExportsByShop").on('click',function () {
        var obj = obtionSearchData();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByShop','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });

    //商品导出--销量
    $("#ponitExportsByGoodsSaleNum").on('click',function () {
        var obj = obtionSearchData();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsNum","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsNum","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsNum','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });


    //商品导出--销售额
    $("#ponitExportsByGoodsMoney").on('click',function () {
        var obj = obtionSearchData();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsMoney","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsMoney","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.IntegralStatisticAction$exportExcelByGoodsMoney','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });
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

    //校验搜索项是否合法
    function checkSearchContend(loginName,seller,startTime,endTime,startTime2,endTime2,startTime4,endTime4) {
        if (loginName) {
            var reg = /^[0-9]+$/;
            if (!(reg.test(loginName))) {
                layer.alert("用户账号错误", {icon:7});
                return false;
            }
        }
        if (seller) {
            var reg = /^[0-9]+$/;
            if (!(reg.test(seller))) {
                layer.alert("销售账号错误", {icon:7});
                return false;
            }
        }
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
                layer.alert('出货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("出货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('出货起止时间不能只选择一个',{icon:7});
            return false;
        }

        if (startTime4) {
            if (!endTime4) {
                layer.alert('完成起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime4);
            var end = new Date(endTime4);
            var varify = end > start;
            if (!varify){
                layer.alert("完成结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime4) {
            layer.alert('完成起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
