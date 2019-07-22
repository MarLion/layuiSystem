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

    $(function () {
        //**********************************************************************
        loadViewDetailData(time,deptId);

    });
// 加载数据
    function loadViewDetailData(time,deptId) {
        var n = base.show_load_layer();
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getSaleManageByType',
                viewId:'1',
                parameters:"{'searchTime': "+ time +",'deptId':"+deptId+"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var str = '';
                var dataList = res.data.dataList;
                var index = 1;
                for (var i = 0; i < dataList.length; i++) {
                    str += '<tr>';
                    str += '<td>' + index + '</td>';
                    str += '<td>' + dataList[i].name + '</td>';
                    str += '<td>' + dataList[i].money + '</td>';
                    str += '<td>' + dataList[i].weekMoney + '</td>';
                    str += '<td>' + dataList[i].monthMoney + '</td>';
                    str += '<td>' + arrowColor(dataList[i].dayRise, dataList[i].todayPercent) + '</td>';
                    str += '<td style="text-align: left;color:#666;font-weight: normal;">' + arrowColor(dataList[i].monthRise, dataList[i].monthPercent) + '</td>';
                    str += '</tr>';
                    index++;
                }
                $("#sale_manage").html(str);
                $("#allIntegral1s").html(base.formattedNumber(res.data.allIntegral1s));
                $("#platformJxbTotal").html(base.formattedNumber(res.data.platformJxbTotal));
                base.close_load_layer(n);

            },
            error:function (mes) {
                console.log(mes);
            }
        });

        //会员详情
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.memberstatistics.MemberstatisticsAction$getSaleInfosOfCount',
                viewId:'1',
                parameters:"{'time': "+ time +",'deptId':"+deptId+"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var str = '';
                var result = res.data.data;
                var index = 1;
                for (var i = result.length-1; i >= 0; i--) {
                    str += '<tr>';
                    str += '<td>' + index + '</td>';
                    str += '<td>' + result[i].name + '</td>';
                    str += '<td>' + result[i].daynum + '</td>';
                    str += '<td>' + result[i].weekMean + '</td>';
                    str += '<td>' + result[i].monthMean + '</td>';
                    str += '<td>' + arrowColor(result[i].day_Rise, parseInt(result[i].dayRise)+"%") + '</td>';
                    str += '<td style="text-align: left;color:#666;font-weight: normal;">' + arrowColor(result[i].month_Rise, parseInt(result[i].monthRise)+"%") + '</td>';
                    str += '</tr>';
                    index++;
                }
                $("#member_manage").html(str);

            },
            error:function (mes) {
                console.log(mes);
            }
        });
    }
    //查询
    $("#check").on('click',function () {
        var time = $("#chooseTime").val();
        loadViewDetailData(time,deptId);
    });

    function arrowColor(rise,rises) {
        var obj = changColor(rises);
        var _html = '<span>' + rise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + rises + '</span>';
        return _html;
    }




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
