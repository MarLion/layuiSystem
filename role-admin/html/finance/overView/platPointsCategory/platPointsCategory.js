layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element','tab'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;
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
    var integtalType;
    //从cookie中取角色级别
    var roleLevel = getCookie("roleLevel");
    //0-管理员，1-分公司 2-区域 3-门店
    var href = '';
    var name = '';
    //初始化时间
    if (v != undefined) {
        integtalType = v['integtalType'];
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    };
    //初始化角色级别
    initRoleLevel();
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
    //初始化角色权限
    function initRoleLevel() {
        if(roleLevel==0||roleLevel==1){
            href = 'html/finance/overView/platPointsCategorySubCompanyDetail/platPointCategorySubCompanyDetail.html';
            name = '分公司';
        }else if(roleLevel==2){
            href = 'html/finance/overView/platPointsCategoryAreaDetail/platPointsCategoryAreaDetail.html';
            name = '区域';
        }else if(roleLevel==3){
            href = 'html/finance/overView/platPointsCatgoryShopDetail/platPointsCategoryShopDetail.html';
            name = '门店'
        }
    }
    var t = base.show_load_layer();
    var tableIns = table.render({
        elem:'#lsCate',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        //page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$typeIntegralList',
            parameters:"{'time': "+ time +",'integtalType':"+integtalType+"}"
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
            {field:'typeName',title:'名称',align:'center',width:250},
            {field:'integralName',title:'类别',align:'center',width:250},
            {field:'integral',title:'今日',align:'center',width:200},
            {field:'yestintegral',title:'昨日',align:'center',width:200},
            {field:'monthintegral',title:'本月',align:'center',width:200},
            {field:'yestaddintegral',title:'同比昨日增长',align:'center',width:200,templet:function (d) {
                var obj = changColor(d.yestaddintegrals);
                var _html = '<span>' + d.yestaddintegral + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.yestaddintegrals + '</span>';
                return _html;
            }},
            {field:'type',title:'同比月平均',align:'center',width:200,templet:function (d) {
                var obj = changColor(d.monthRises);
                var _html = '<span>' + d.monthRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.monthRises+ '</span>';
                return _html;
            }},
            {field:'status',title:'操作',align:'center',width:320,templet: function (d) {
                var str = '';
                if(roleLevel==0||roleLevel==1){
                    str = ' <a class="layui-btn layui-btn-xs" src="javaScript:void(0)" lay-event="branchCompanyDetail">查看分公司详情</a>';
                }else if(roleLevel==2){
                    str = ' <a class="layui-btn layui-btn-xs" src="javaScript:void(0)" lay-event="branchCompanyDetail">查看区域详情</a>';
                }else if(roleLevel==3){
                    str = ' <a class="layui-btn layui-btn-xs" src="javaScript:void(0)" lay-event="branchCompanyDetail">查看门店详情</a>';
                }

                str+= '  <a class="layui-btn layui-btn-xs" src="javaScript:void(0)" lay-event="oldTable">查看往期报表</a>\n';
                return str;
            }}
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


    //查询
    $("#check").on('click',function () {
        t = base.show_load_layer();
        var time = $("#chooseTime").val();
        var obj = {
            time:time,
            integtalType:integtalType
        };

        for(var key in obj){
            if (obj[key] == null || obj[key] == '' || obj[key] == '0') {
                delete obj[key];
            }
        }
        tableIns.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$typeIntegralList',
                parameters:JSON.stringify(obj)
            },
            page:{
                curr:1
            }
        })
    });
    //监听行工具事件
    table.on('tool(lsCate)', function (obj) {
        // shopId=1&type=1&category=1&beginTime=2019-06-04&endTime=2019-07-03
        // 1：平台增长 2：游戏增长 3:平台消耗 4：游戏消耗
        var time = $("#chooseTime").val();
        var data = obj.data
            , layEvent = obj.event;
        var type = data.actiontype;
        var category = data.type;
        var prefix;
        if(integtalType==1){
            prefix="(平台增长)"
        }else if(integtalType==2){
            prefix="(游戏增长)"
        }else if(integtalType==3){
            prefix="(平台消耗)"
        }else if(integtalType==4){
            prefix="(游戏消耗)"
        }
        var id =integtalType+category;
        var typeName= data.typeName;
        var name1 = prefix+"("+typeName+")"+name+"积分品类详情";
        var name2 = prefix+"("+typeName+")"+name+"往期报表"
        //查看分公司详情
        if (layEvent === 'branchCompanyDetail') {
            parent.tab.tabAdd({
                href: href+'?time='+time+'&shopId='+1+'&type='+type+"&category="+category,
                // icon: '',
                id:integtalType,
                title: name1
            })
        }else if(layEvent==='oldTable'){  //查看往期报表
            parent.tab.tabAdd({
                href: 'html/finance/overView/platPointsCategoryReport/platPointsCategoryReport.html?time='+time+'&shopId='+1+'&type='+type+'&category='+category,
                // icon: '',
                id:id,
                title: name2
            })
        }
    });
    function changColor(n) {
        var n = parseFloat(n);
        var obj = {
            src:'',
            class:''
        };
        if (n > 0) {
            obj.src = '../icon/up.png';
            obj.class = 'col-r';
        } else if (n < 0) {
            obj.src = '../icon/down.png';
            obj.class = 'col-g';
        } else {
            obj.src = '../icon/eq.png';
            obj.class = 'col-b';
        }
        return obj;
    }
});
