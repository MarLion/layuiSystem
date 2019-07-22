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
    updateLayuiDate('rechangeTimeStart');
    updateLayuiDate('rechangeTimeEnd');
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem:'#xl',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$list',
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
            {field:'count',title:'金额（元）',align:'center',width:160},
            {field:'shopName',title:'门店',align:'center',width:200},
            {field:'areaName',title:'区域',align:'center',width:200},
            {field:'subCompany',title:'分公司',align:'center',width:200},
            {field:'time',title:'充值时间',align:'center',width:200},
            {field:'type',title:'充值类型',align:'center',width:160,templet:function (d) {
                    if (d.type == '0') {
                        return '游戏充值';
                    } else {
                        return 'app充值';
                    }
                }},
            {field:'rechargeMode',title:'充值方式',align:'center',width:160,templet:function (d) {
                    if (d.rechargeMode == '0') {
                        return '支付宝';
                    } else if (d.rechargeMode == '1') {
                        return '微信';
                    } else {
                        return '银行卡';
                    }
                }},
            {field:'status',title:'充值状态',align:'center',width:160,templet:function (d) {
                    if (d.status == '0') {
                        return '充值未完成';
                    } else {
                        return '充值已完成';
                    }
                }},
            {field:'tradeNum',title:'订单编号',align:'center',width:240},
            {field:'id',title:'ID',align:'center',width:100}
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
    base.operateArea('a','b','c','d','e','f','g','h'); //自定义参数
    $("#checkXl").on('click',function () {
        var obj = {
            startTime:$("#rechangeTimeStart").val(),//充值开始时间
            endTime:$("#rechangeTimeEnd").val(),//充值结束时间
            loginName:$("#loginName").val(),//客户账号
            sort:$("#sort").val(),//排序方式
            subCompany:$("#a").val(),//分公司
            area:$("#d").val(),//区域
            shop:$("#g").val(),//门店
            status:$("#status").val()
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if (!checkSearchContend(obj.startTime,obj.loginName,obj.endTime)){
            return;
        }
        var m = base.show_load_layer();1
        tableIns.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$list',
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
    $("#resetXl").on('click',function () {
        $("#rechangeTimeStart").val('');
        $("#rechangeTimeEnd").val('');
        $("#loginName").val('');
        $("#sort").val('');
        $("#a").val('');
        $("#d").val('');
        $("#g").val('');
        $("#status").val('');
        base.opereteReset('a','b','c','d','e','f','g','h');
        form.render();
    });
    $("#rechangeExport").on('click',function () {
        var obj = {
            startTime:$("#rechangeTimeStart").val(),//充值开始时间
            endTime:$("#rechangeTimeEnd").val(),//充值结束时间
            loginName:$("#loginName").val(),//客户账号
            sort:$("#sort").val(),//排序方式
            subCompany:$("#a").val(),//分公司
            area:$("#d").val(),//区域
            shop:$("#g").val(),//门店
            status:$("#status").val()
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '' || obj[key] == '0') {
                delete obj[key];
            }
        }
        if (!checkSearchContend(obj.startTime,obj.loginName,obj.endTime)){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$export","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$export","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$export','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists','spinner-container');
    });

    //门店导出
    $("#rechangeExportByShop").on('click',function () {
        var obj = {
            startTime:$("#rechangeTimeStart").val(),//充值开始时间
            endTime:$("#rechangeTimeEnd").val(),//充值结束时间
            loginName:$("#loginName").val(),//客户账号
            sort:$("#sort").val(),//排序方式
            subCompany:$("#a").val(),//分公司
            area:$("#d").val(),//区域
            shop:$("#g").val(),//门店
            status:$("#status").val()
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if (!checkSearchContend(obj.startTime,obj.loginName,obj.endTime)){
            return;
        }
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$exportExcelByShop","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.RechargeRecordStatisticAction$exportExcelByShop','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists');
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
    function checkSearchContend(startTime,loginName,endTime) {
        if (loginName) {
            var reg = /^[0-9]+$/;
            if (!(reg.test(loginName))) {
                layer.alert("用户账号错误", {icon:7});
                return false;
            }
        }
        if (startTime) {
            if (!endTime) {
                layer.alert('起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
