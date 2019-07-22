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
    var m;
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
    //初始化图表时间范围
    function initTimeRange() {
        //时间范围控制
        var startDate = laydate.render({
            elem: '#startDate',
            type: 'date',
            // btns: ['clear', 'confirm'],
            btns: ['confirm'],
            format: 'yyyy-MM-dd',
            value: base.getFirstSevenDay(),
            // max: base.maxDate(),//默认最大值为当前日期
            // done: function (value, date) {
            //     endDate.config.min = {
            //         year: date.year,
            //         month: date.month-1 ,//月份需要减一(否则两个日期相差一个月)
            //         date: date.date+1 //+1(不能是同一天)
            //     };
            //     endDate.config.max = {
            //         year: date.year,
            //         month: date.month-1 ,//月份需要减一(否则两个日期相差一个月)
            //         date: date.date+6 //+1(不能是同一天)
            //     };
            //
            // }
        });
        var endDate = laydate.render({
            elem: '#endDate',
            type: 'date',
            // btns: ['clear', 'confirm'],
            btns: ['confirm'],
            format: 'yyyy-MM-dd',
            value:base.getNowDate(),
            // max: base.maxDate(),
            // done: function (value, date) {
            //     startDate.config.max = {
            //         year: date.year,
            //         month: date.month-1 ,//月份需要减一(否则两个日期相差一个月)
            //         date: date.date-1//-1(不能是同一天)
            //     }
            //     startDate.config.min ={
            //         year: date.year,
            //         month: date.month-1 ,//月份需要减一(否则两个日期相差一个月)
            //         date: date.date-6//-1(不能是同一天)
            //     }
            //
            // }
        });
    }
    //如果是分公司权限进来的话可以查看柱状图，否则无法查看
    var roleLevel = getCookie("roleLevel");
    if(roleLevel==1){
        //初始化柱状图
        var myChart = echarts.init(document.getElementById('mainChart'));
        //初始化图表时间范围
        initTimeRange();
        chartInit();
        function chartInit() {
            var n = base.show_load_layer();
            //时间切割
            var startTime =$("#startDate").val();
            var endTime =$("#endDate").val();
            base._ajax({
                url:base.apiOthUrl(),
                data:{
                    actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getChartsAcountList',
                    viewId:'1',
                    parameters:"{'deptId': "+ 1 +",'startTime':"+startTime+",'endTime':"+endTime+"}"
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                    'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                    'te_method': 'doAction'
                },
                success:function (res) {
                    var dateSource = res.data;
                    //时间
                    var createTime=[];
                    var healthTotal=[];
                    var groupBuyTotal=[];
                    var rechargeTotal=[];
                    var drawCashTotal=[];
                    var gameIncomeTotal=[];
                    var serviceTotal=[];
                    var xlMoney=[];
                    var nearShopTotal=[];
                    var shopTotal=[];
                    var healthYlTotal=[];
                    var timeYyZdTotal=[];
                    var timeHnTotal=[];
                    var timeLiveTotal=[];

                    dateSource.forEach(function (element, index, array) {
                        createTime.push(element.createTime);
                        healthTotal.push(element.healthTotal);
                        groupBuyTotal.push(element.groupBuyTotal);
                        rechargeTotal.push(element.rechargeTotal);
                        drawCashTotal.push(element.drawCashTotal);
                        gameIncomeTotal.push(element.gameIncomeTotal);
                        serviceTotal.push(element.serviceTotal);
                        xlMoney.push(element.xlMoney);
                        nearShopTotal.push(element.nearShopTotal);
                        shopTotal.push(element.shopTotal);
                        healthYlTotal.push(element.healthYlTotal);
                        timeYyZdTotal.push(element.timeYyZdTotal);
                        timeHnTotal.push(element.timeHnTotal);
                        timeLiveTotal.push(element.timeLiveTotal);
                    });
                    myChart.setOption({
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },

                        legend: {
                            data:['保健品销售额','团购销售额','充值总额','提现总额','游戏收益额','服务费收益额','玄乐管理总额','附近小店总额','全球代购总额','健康医疗总额','营养指导总额','相亲交友总额','直播总额']
                        },
                        toolbox: {
                            show : true,
                            orient: 'vertical',
                            x: 'right',
                            y: 'center',
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : createTime
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'保健品销售额',
                                type:'bar',
                                data:healthTotal
                            },
                            {
                                name:'团购销售额',
                                type:'bar',
                                data:groupBuyTotal
                            },
                            {
                                name:'充值总额',
                                type:'bar',
                                data:rechargeTotal
                            },
                            {
                                name:'提现总额',
                                type:'bar',
                                data:drawCashTotal
                            },
                            {
                                name:'游戏收益额',
                                type:'bar',
                                data:gameIncomeTotal
                            },
                            {
                                name:'服务费收益额',
                                type:'bar',
                                data:serviceTotal
                            },
                            {
                                name:'玄乐管理总额',
                                type:'bar',
                                data:xlMoney
                            },
                            {
                                name:'附近小店总额',
                                type:'bar',
                                data:nearShopTotal
                            },
                            {
                                name:'全球代购总额',
                                type:'bar',
                                data:shopTotal
                            },
                            {
                                name:'健康医疗总额',
                                type:'bar',
                                data:healthYlTotal
                            },
                            {
                                name:'营养指导总额',
                                type:'bar',
                                data:timeYyZdTotal
                            },
                            {
                                name:'相亲交友总额',
                                type:'bar',
                                data:timeHnTotal
                            },
                            {
                                name:'直播总额',
                                type:'bar',
                                data:timeLiveTotal
                            },
                        ]
                    });
                    //关闭弹窗
                    base.close_load_layer(n);
                },
                error:function (error) {
                    base.close_load_layer(n);
                    console.log(error)
                }
            });
        }
    }else{
        $("#chartId").hide();
    }


    //图标时间范围查询
    $("#checkCharts").on("click",function () {
        //判断时间，如果大于7天则弹出提示
        var startTime = $("#startDate").val();
        var endTime = $("#endDate").val();
        if(endTime<=startTime){
            layer.msg("查询结束时间必须大于开始时间!");
            return;
        }
        var dates = GetDateDiff(startTime,endTime);
        if(dates>6){
            layer.msg("只能查询7天范围的数据!");
            return;
        }
        chartInit();
    })
    function GetDateDiff(startDate,endDate)
    {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return  dates;
    }
    //图表条件重置
    $("#clearCheckCharts").on("click",function () {
        initTimeRange();
    })
    //dept =2 查分公司
    if(roleLevel!=1){
         m = base.show_load_layer();
    }

    var totalOverTable = table.render({
        elem:'#subCompanyTotalOver',
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
            , {field: 'deptName',width:150,align:'center',title: '部门名'}
            , {field: 'createTime',width:150,align:'center', title: '时间'}
            , {field: 'healthTotal',width:150,align:'center', title: '保健品销售额'}
            , {field: 'groupBuyTotal',width:150, align:'center',title: '团购销售额'}
            , {field: 'rechargeTotal',width:150, align:'center',title: '充值总额'}
            , {field: 'drawCashTotal', width:150,align:'center',title: '提现总额'}
            , {field: 'gameIncomeTotal',width:150,align:'center', title: '游戏收益额'}
            , {field: 'serviceTotal',width:150, align:'center',title: '服务费收益额'}
            , {field: 'exclusiveProduct',width:150,align:'center', title: '玄乐管理总额'}
            , {field: 'nearShopTotal',width:150,align:'center', title: '附近小店总额'}
            , {field: 'shopTotal',width:150,align:'center', title: '全球代购总额'}
            , {field: 'healthYlTotal',width:150, align:'center',title: '健康医疗总额'}
            , {field: 'timeYyZdTotal',width:150,align:'center', title: '营养指导总额'}
            , {field: 'timeHnTotal',width:150,align:'center', title: '相亲交友总额'}
            , {field: 'timeLiveTotal',width:150, align:'center',title: '直播总额'}
            , {field: 'status', width:250,title: '操作',fixed:'right',templet:function (d) {
                var  str ='  <a class="layui-btn layui-btn-xs layui-btn-normal" src="javaScript:void(0)" lay-event="detail">详情</a>'+
                    '<a class="layui-btn layui-btn-xs layui-btn-normal" src="javaScript:void(0)" lay-event="areaTotalTable">区域总账列表</a>'
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
    table.on('tool(subCompanyTotalOver)', function (obj) {
        var searchTime = $("#chooseTime").val();
        var data = obj.data
            , layEvent = obj.event;
        var deptId = data.id;
        var deptName = data.deptName;
        var name = deptName+"积分详情";
        var name1 = deptName+"总账列表"
        //查看分公司详情
        if (layEvent === 'areaTotalTable') {
            parent.tab.tabAdd({

                href: 'html/finance/overView/managementView/managementViewArea/managementViewArea.html?searchTime='+searchTime+'&deptId='+deptId,
                // icon: '',
                id:deptId,
                title: name
            })
        }else if(layEvent==='detail'){
            parent.tab.tabAdd({

                href: 'html/finance/overView/managementView/managementViewDetail/managementViewDetail.html?time='+searchTime+'&deptId='+deptId,
                id:deptId,
                title: name1
            })
        }
    });



    $("#check").on('click',function () {
        //查询分公司积分数据详情
        m=base.show_load_layer();
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
            }
        })
    });
});
