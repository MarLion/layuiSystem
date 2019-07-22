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
    var shopId;
    var type;
    var category;
    //初始化时间
    if (v != undefined) {
        time = v['time'];
        shopId = v['shopId'];
        type = v['type'];
        category = v['category'];
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
        elem:'#areaLs',
        url:base.apiOthUrl(),
        method:'post',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
            'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        //page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        where:{
            actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$integralListByType',
            parameters:"{'time': "+ time +",'type':"+type+",'shopId':"+shopId+",'category':"+category+"}"
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
            , {field: 'name', title: '公司名'}
            , {field: 'yestIntegral', title: '昨日积分数'}
            , {field: 'integral', title: '今日积分数'}
            , {field: 'dayRise', title: '同比昨日对比',templet:function (d) {
                var obj = changColor(d.dayRises);
                var _html = '<span>' + d.dayRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.dayRises + '</span>';
                return _html;
            }}
            , {field: 'monthRise', title: '同比月平均',templet:function (d) {
                var obj = changColor(d.monthRises);
                var _html = '<span>' + d.monthRise + '</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">' + d.monthRises + '</span>';
                return _html;
            }}
            ,{field:'status',title:'操作',align:'center',width:320,templet: function (e) {

                var  str ='  <a class="layui-btn layui-btn-xs" src="javaScript:void(0)" lay-event="shopDetail">门店</a>'
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

    $(function () {
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$sevenDayByType',
                viewId:'1',
                parameters:"{'time': "+ time +",'type':"+type+",'shopId':"+shopId+",'category':"+category+"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var dateStr = _obj.date;
                var dataList = _obj.dataList;
                var str = '';
                if (_obj != '') {
                    str += '<thead>';
                    str += '<tr><th>序号</th><th>日期</th>';
                    for (var j = 0; j < dateStr.length; j++) {
                        str += '<th>' + dateStr[j] + '</th>';
                    }
                    str += '</tr></thead>';
                    str += '<tbody>';
                    for (var i = 0; i < dataList.length; i++) {
                        str += '<tr>';
                        str += '<td>'+(i+1)+'</td><td>' + dataList[i][0] + '</td><td>' + dataList[i][1] + '</td><td>' + dataList[i][2] + '</td><td>' + dataList[i][3] + '</td><td>' + dataList[i][4] + '</td><td>' + dataList[i][5] + '</td><td>' + dataList[i][6] + '</td><td>' + dataList[i][7] + '</td>';
                        str += '</tr>';
                    }
                    str += '</tbody>';
                    $("#sevenLs").html(str);
                }

            },
            error:function (mes) {
                console.log(mes);
            }
        })
    });

    //查看区域
    //监听行工具事件
    table.on('tool(areaLs)', function (obj) {
        // 1：平台增长 2：游戏增长 3:平台消耗 4：游戏消耗
        var time = $("#chooseTime").val();
        var data = obj.data
            , layEvent = obj.event;
        var shopId = data.id;
        var deptName = data.name;
        var name = deptName+"所属门店积分品类详情";
        var id = type+shopId;
        //查看分公司详情
        if (layEvent === 'shopDetail') {
            parent.tab.tabAdd({

                href: 'html/finance/overView/platPointsCatgoryShopDetail/platPointsCategoryShopDetail.html?time='+time+'&shopId='+shopId+'&type='+type+"&category="+category,
                // icon: '',
                id:id,
                title: name
            })
        }
    });


    $("#check").on('click',function () {
        //查询分公司积分数据详情
        t = base.show_load_layer();
        var time = $("#chooseTime").val();
        var obj = {
            time:time,
            type:type,
            shopId:shopId,
            category:category
        };

        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        companyTable.reload({
            where:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$integralListByType',
                parameters:JSON.stringify(obj)
            },
            page:{
                curr:1
            }
        })
        //查询分公司7天数据
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$sevenDayByType',
                viewId:'1',
                parameters:"{'time': "+ time +",'type':"+type+",'shopId':"+shopId+",'category':"+category+"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var dateStr = _obj.date;
                var dataList = _obj.dataList;
                var str = '';
                if (_obj != '') {
                    str += '<thead>';
                    str += '<tr><th>序号</th><th>日期</th>';
                    for (var j = 0; j < dateStr.length; j++) {
                        str += '<th>' + dateStr[j] + '</th>';
                    }
                    str += '</tr></thead>';
                    str += '<tbody>';
                    for (var i = 0; i < dataList.length; i++) {
                        str += '<tr>';
                        str += '<td>'+(i+1)+'</td><td>' + dataList[i][0] + '</td><td>' + dataList[i][1] + '</td><td>' + dataList[i][2] + '</td><td>' + dataList[i][3] + '</td><td>' + dataList[i][4] + '</td><td>' + dataList[i][5] + '</td><td>' + dataList[i][6] + '</td><td>' + dataList[i][7] + '</td>';
                        str += '</tr>';
                    }
                    str += '</tbody>';
                    $("#sevenLs").html(str);
                }

            },
            error:function (mes) {
                console.log(mes);
            }
        })
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
