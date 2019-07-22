layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element','tab'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;
    laydate.render({
        elem:"#chooseTime",
        type:'date',
        trigger:"click",
        format:'yyyy-MM-dd'
    });
    function parseUrl(){
        var url=location.href;
        var i=url.indexOf('?');
        if(i==-1)return;
        var querystr=url.substr(i+1);
        var arr1=querystr.split('&');
        var arr2=new Object();
        for  (i in arr1){
            var ta=arr1[i].split('=');
            arr2[ta[0]]=ta[1];
        }
        return arr2;
    }
    var v = parseUrl();//解析所有参数
    var time;
    var deptId;
    //初始化时间
    if (v != undefined) {
        time = v['time'];
        deptId = v['deptId'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    };
    function updateLayuiDate(cls,time) {
        if (time == ""){
            time = base.getLastDay();
        }
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd',
                value:time,
                done: function (value, date) {

                }
            })
        })
    }

    //分公司详情表
    var t = base.show_load_layer();
    var companyTable = table.render({
        elem:'#lsCate',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleManage.GaneAction$gameCategory',
            parameters:"{'time': "+ time +",'deptId':"+deptId+"}"
        },
        parseData:function (res) {
            return {
                "code":0,
                "data":res.data,
                "count":0
            }
        },
        cols:[[
            {field:'',title	:'序号',align:'center',fixed: 'left', width: 60,templet:function (d) {
                return d.LAY_TABLE_INDEX + 1
            }},
            {field:'gameName',title:'游戏名',align:'center',width:250},
            {field:'totalMoney',title:'收益金额',align:'center',width:250},
            {field:'avgMonthMoney',title:'本周日平均金额',align:'center',width:200},
            {field:'avgMonthMoney',title:'本月日平均金额',align:'center',width:200},
            {field:'dayRise',title:'同比昨日增长',align:'center',width:200,templet:function (d) {
                var obj = changColor(d.dayRises);
                var _html = '<span>' + d.dayRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span></span><span class="ml10 '+obj.class+'">' + d.dayRises + '</span>';
                return _html;
            }},
            {field:'monthRise',title:'同比月平均增长',align:'center',width:200,templet:function (d) {
                var obj = changColor(d.monthRises);
                var _html = '<span>' + d.monthRise + '</span><span class="ml10"></span><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.monthRises+ '</span>';
                return _html;
            }},
        ]],

        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            console.log('表格加载完成');
            base.close_load_layer(t);
        }
    });

    $("#check").on('click',function () {
        //查询分公司积分数据详情
        var time = $("#chooseTime").val();
        var parameters = "{'time': "+ time +",'deptId':"+deptId+"}";
        companyTable.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.GaneAction$gameCategory',
                parameters:parameters
            },
            page:{
                curr:1
            }
        });
    });
    function changColor(n) {
        var n = parseFloat(n);
        var obj = {
            src:'',
            class:''
        };
        if (n > 0) {
            obj.src = '../../icon/up.png';
            obj.class = 'col-r';
        } else if (n < 0) {
            obj.src = '../../icon/down.png';
            obj.class = 'col-g';
        } else {
            obj.src = '../../icon/eq.png';
            obj.class = 'col-b';
        }
        return obj;
    }
});
