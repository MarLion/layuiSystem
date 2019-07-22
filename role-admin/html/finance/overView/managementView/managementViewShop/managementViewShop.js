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
    var searchTime;
    var deptId;
    //初始化时间
    if (v != undefined) {
        searchTime = v['searchTime'];
        deptId = v['deptId'];
        $("#chooseTime").val(searchTime);
        updateLayuiDate("chooseTime",searchTime);
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
    var m = base.show_load_layer();
    var totalOverTable = table.render({
        elem:'#totalOver',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        //page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getAcountList',
            parameters:"{'searchTime': "+ searchTime +",'deptId':"+deptId+"}"
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
            }}
            , {field: 'deptName',width:150, align:'center',title: '部门名'}
            , {field: 'createTime',width:150, align:'center',title: '时间'}
            , {field: 'healthTotal',width:150, align:'center',title: '保健品销售额'}
            , {field: 'groupBuyTotal',width:150,align:'center', title: '团购销售额'}
            , {field: 'rechargeTotal',width:150,align:'center', title: '充值总额'}
            , {field: 'drawCashTotal',width:150,align:'center', title: '提现总额'}
            , {field: 'gameIncomeTotal',width:150,align:'center',title: '游戏收益额'}
            , {field: 'serviceTotal',width:150,align:'center', title: '服务费收益额'}
            , {field: 'exclusiveProduct',width:150, align:'center',title: '玄乐管理总额'}
            , {field: 'nearShopTotal',width:150,align:'center', title: '附近小店总额'}
            , {field: 'shopTotal',width:150,align:'center', title: '全球代购总额'}
            , {field: 'healthYlTotal',width:150,align:'center', title: '健康医疗总额'}
            , {field: 'timeYyZdTotal',width:150, align:'center',title: '营养指导总额'}
            , {field: 'timeHnTotal',width:150,align:'center', title: '相亲交友总额'}
            , {field: 'timeLiveTotal',width:150,align:'center', title: '直播总额'}
            , {field: 'status',width:250, align:'center',title: '操作',fixed:'right',templet:function (d) {
                var  str ='  <a class="layui-btn layui-btn-xs layui-btn-normal" src="javaScript:void(0)" lay-event="detail">详情</a>'
                return str;

            }}
        ]],

        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/login.html';
                return;
            }
            console.log('表格加载完成');
            base.close_load_layer(m);
        }
    });

    //监听行工具事件
    table.on('tool(totalOver)', function (obj) {
        var searchTime = $("#chooseTime").val();
        var data = obj.data
            , layEvent = obj.event;
        var deptId = data.id;
        var deptName = data.deptName;
        var name=deptName+"总账列表";
        if (layEvent === 'detail') {
            parent.tab.tabAdd({

                href: 'html/finance/overView/managementView/managementViewDetail/managementViewDetail.html?time='+searchTime+'&deptId='+deptId,
                id:deptId,
                title: name
            })
        }
    });



    $("#check").on('click',function () {
        //查询分公司积分数据详情
        var n = base.show_load_layer();
        var searchTime = $("#chooseTime").val();
        var obj = {
            searchTime:searchTime,
            deptId:deptId
        };

        for(var key in obj){
            if (obj[key] == null || obj[key] == '' || obj[key] == '0') {
                delete obj[key];
            }
        }
        totalOverTable.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getAcountList',
                parameters:JSON.stringify(obj)
            },
            page:{
                curr:1
            },
            done:function () {
                base.close_load_layer(n);
            }
        })
    });
});
