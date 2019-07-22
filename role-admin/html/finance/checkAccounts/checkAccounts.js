layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','laypage'],function () {
    var  table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        latydate = layui.laydate,
        base = layui.base,
        laypage = layui.laypage;
    var s = base.show_load_layer();
     var tableIns = table.render({
            elem:'#accounts',
            url:base.apiOthUrl(),
            method:'post',
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$list',
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
                {field:'actionName',title:'类别',align:'center',width:300},
                {field:'loginName',title:'用户账号',align:'center',width:200},
                {field:'subCompany',title:'分公司',align:'center',width:180},
                {field:'areaName',title:'区域',align:'center',width:150},
                {field:'shopName',title:'门店',align:'center',width:200},
                {field:'recordFigure',title:'金额（元）',align:'center',width:150},
                {field:'recordFigureAfter',title:'操作后金额（元）',align:'center',width:150},
                {field:'time',title:'时间',align:'center',width:200},
                {field:'orderno',title:'订单编号',align:'center',width:200},
                {field:'sumprestores',title:'获得经验',align:'center',width:100},
                {field:'actionType',title:'类别编号',align:'center',width:100}
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
    updateLayuiDate('timeStart',function (value,date) {
        //console.log($("#timeStart").val());
    });
    updateLayuiDate('timeEnd',function (value,date) {
        //console.log(value);
    });
    function updateLayuiDate(cls,callback) {
        $("#"+cls).each(function () {
            latydate.render({
                elem:this,
                type:'datetime',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss',
                done:callback
            })
        })
    }
    base.operateArea();
    //店铺选择
    form.on('select(shop-select)',function (data) {
    });
    //入项
    getJxbType(0,'imSelect','im-type');
    //出项
    getJxbType(1,'exSelect','ex-type');
    //入项选择
    form.on('select(im-select)',function (data) {
    });
    //出项选择
    form.on('select(ex-type)',function (data) {
    });
    //金额大小下拉框1
    form.on('select(money-select)',function (data) {
    });
    //点击查询
    $("#checkAccounts").on('click',function () {
        var obj = {
            subCompany : $("#companySelect").val(),//分公司id
            area : $("#areaSelect").val(),//区域id
            shop : $("#shopSelect").val(),//门店id
            categoryIn : $("#imSelect").val(),//类别入项
            categoryOut : $("#exSelect").val(),//类别出项
            sort : $("#sort").val(),//排序方式
            loginName : $("#loginName").val(),//顾客账户
            compareTo : $("#compareTo").val(),//金额标识
            amount : $("#amount").val(),//金额
            startTime : $("#timeStart").val(),//开始时间
            endTime : $("#timeEnd").val()//结束时间
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if(!checkSearchContend(obj.startTime,obj.amount,obj.loginName,obj.endTime)){
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$list',
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
    //重置
    $("#reset").on('click',function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.opereteReset();
        $("#imSelect").val('');
        $("#exSelect").val('');
        $("#sort").val('');
        $("#loginName").val('');
        $("#compareTo").val('');
        $("#amount").val('');
        $("#timeStart").val('');
        $("#timeEnd").val('');
        form.render();
    });
    //批量导出
    $("#lotsExport").on('click',function () {
        var obj = {
            subCompany : $("#companySelect").val(),//分公司id
            area : $("#areaSelect").val(),//区域id
            shop : $("#shopSelect").val(),//门店id
            categoryIn : $("#imSelect").val(),//类别入项
            categoryOut : $("#exSelect").val(),//类别出项
            sort : $("#sort").val(),//排序方式
            loginName : $("#loginName").val(),//顾客账户
            compareTo : $("#compareTo").val(),//金额标识
            amount : $("#amount").val(),//金额
            startTime : $("#timeStart").val(),//开始时间
            endTime : $("#timeEnd").val()//结束时间
        };
        for(var key in obj){
            if (obj[key] == null || obj[key] == '' || obj[key] == '0') {
                delete obj[key];
            }
        }
        if(!checkSearchContend(obj.startTime,obj.amount,obj.loginName,obj.endTime)){
            return;
        }
        console.log(JSON.stringify(obj));
        if (JSON.stringify(obj) == '{}') {
            base.exportsExcelWithoutConditionTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$export","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        } else {
            base.exportsExcelTip('base.exportExcelBatch('+JSON.stringify(obj)+',"com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$export","com.xguanjia.client.action.statistics.download.DownloadAction$fileExists")')
        }
        //base.exportExcelBatch(obj,'com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$export','com.xguanjia.client.action.statistics.download.DownloadAction$fileExists');
    });

    //校验搜索项是否合法
    function checkSearchContend(startTime,amount,loginName,endTime) {
        // var regu = /^[0-9]+$/;
        // if (amount) {
        //     var isNum = regu.test(amount);
        //     if (!isNum) {
        //         layer.alert("金额输入错误，请输入正整数", {icon:7})
        //         return false;
        //     }
        // } else {
        //     $("#amount").val("");
        // }
        if (loginName) {
            var reg = /^[0-9]+$/;
            if (!(reg.test(loginName))) {
                layer.alert("用户账号错误", {icon:7});
                return false;
            }
            //判断是否选择时间
            if(!startTime || !endTime){
                layer.alert("请选择起止时间,最大范围6个月", {icon:7});
                return false;
            }
            //校验时间范围是否超过6个月
            var distanceMonth = base.judgeMonthInterval(startTime,endTime,6);
            if (distanceMonth){
                layer.alert("暂不支持超过6个月的查询,请重新选择时间!",{icon:7})
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
            if (start.getMonth() != end.getMonth() && loginName == undefined) {
                layer.alert("暂不支持跨月查询！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }

    //获取出项入项类别
    function getJxbType(param,elem,filter,text) {
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleinfo.FinancialStatisticAction$listJxbtype',
                parameters:"{'jxbtype': "+param +"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (data) {
                var _str = data.data.replace(/吉祥/g,'玄乐');
                var _obj = JSON.parse(_str).data,
                    _html = '<option value="" >请选择</option>',
                    _el = $("#"+elem);
                $.each(_obj,function (index,item) {
                    _html += '<option value="'+item.id+'">'+item.actionname+'</option>'
                });
                _el.html(_html);
                form.render('select',filter);
             },
            error:function (res) {
                console.log(res);
            }
            })
        }
});
