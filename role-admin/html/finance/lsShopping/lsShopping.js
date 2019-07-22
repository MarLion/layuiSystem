layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table;
    updateLayuiDate('buyTimeStart');
    updateLayuiDate('buyTimeEnd');
    updateLayuiDate('updateTimeStart');
    updateLayuiDate('updateTimeEnd');
    base.operateArea();
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem:'#ls',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$groupBuylist',
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
            {field:'name',title:'商品名称',align:'center',width:200},
            {field:'goodsno',title:'商品编号',align:'center',width:200},
            {field:'num',title:'商品数量',align:'center',width:100},
            {field:'createTime',title:'购买时间',align:'center',width:200},
            {field:'total',title:'总价（元）',align:'center',width:100},
            {field:'status',title:'订单状态',align:'center',width:120},
            {field:'logisticsState',title:'物流状态',align:'center',width:160},
            {field:'periods',title:'团购期数',align:'center',width:100},
            {field:'orderno',title:'订单编号',align:'center',width:200},
            {field:'shopName',title:'门店',align:'center',width:160},
            {field:'areaName',title:'区域',align:'center',width:160},
            {field:'subCompany',title:'分公司',align:'center',width:160},
            {field:'updateTime',title:'更新时间',align:'center',width:200}
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
    base.multiSelect('downpanel','multSelects1','orderTypes','types');
    $("#checkLs").on('click',function () {
        var obj = getObj();
        if (!obj){
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$groupBuylist',
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
    $("#resetLs").on('click',function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.opereteReset();
        $("#loginName").val('');
        $("#name").val('');
        $("#logisticsState").val('');
        $("#sort").val('');
        $("#goodsno").val('');
        $("#buyTimeStart").val('');
        $("#buyTimeEnd").val('');
        $("#updateTimeStart").val('');
        $("#updateTimeEnd").val('');
        $(".orderTypes").val('');
        $("input:checkbox[name='types']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        form.render();
    });
    //批量导出
    $("#lsExport").on('click',function () {
        var obj = getObj();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelUser","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelUser","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelUser','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });
    //门店导出
    $("#lsExportByShop").on('click',function () {
        var obj = getObj();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByShop','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });
    //商品导出 -- 销量
    $("#lsExportByGoodsNum").on('click',function () {
        var obj = getObj();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsNum","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsNum","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsNum','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });

    //商品导出 -- 销售额
    $("#lsExportByGoodsMoney").on('click',function () {
        var obj = getObj();
        if (!obj){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsMoney","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsMoney","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")');
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.GroupBuyStatisticAction$exportExcelByGoodsMoney','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });
    //获取obj
    function getObj() {
        var orderStatusIds=[];
        $("input:checkbox[name='types']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var obj = {
            subCompany:$("#companySelect").val(),//分公司
            area:$("#areaSelect").val(),//区域
            shop:$("#shopSelect").val(),//门店
            status:orderStatusIds,//订单状态
            loginName:$("#loginName").val(),//顾客账号
            name:$("#name").val(),//商品名称
            logisticsState:$("#logisticsState").val(),//物流状态
            sort:$("#sort").val(),//排序方式
            goodsno:$("#goodsno").val(),//商品编号
            startTime1:$("#buyTimeStart").val(),//购买开始时间
            endTime1:$("#buyTimeEnd").val(),//购买结束时间
            startTime2:$("#updateTimeStart").val(),//更新开始时间
            endTime2:$("#updateTimeEnd").val()//更新结束时间
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }else if (obj[key]){
                obj[key] = obj[key].trim();
            }
        }
        if (!checkSearchContend(obj.loginName,obj.startTime1,obj.endTime1,obj.startTime2,obj.endTime2)) {
            return;
        }
        return obj;
    }
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
    function checkSearchContend(loginName,startTime,endTime,startTime2,endTime2) {
        if (loginName) {
            var reg = /^[0-9]+$/;
            if (!(reg.test(loginName))) {
                layer.alert("用户账号错误", {icon:7});
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
                layer.alert('更新起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("更新结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('更新起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }

});
