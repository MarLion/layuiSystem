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
    //layui时间区间格式化
    function updateIntervalLayuiDate(cls) {
        var time = base.getFirstDayOfMonth() + " - " + base.getNowDate();
        $("#"+cls).val(time);
        laydate.render({
            elem: '#'+cls,
            range: true //或 range: '~' 来自定义分割字符
        });
    };
    //时间区间格式化
    updateIntervalLayuiDate("chooseTimeRange");
    //历史报表折线图
    gameChat(deptId);
    //历史报表三十天游戏金额情况
    gameChatList(deptId);

    //中间那个查询
    $("#checkCharts").on('click',function () {
        gameChat(deptId);
    });




    laydate.render({
        elem: '#chooseTimeRange',
        range: true //或 range: '~' 来自定义分割字符
    });

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
    //#######Echarts图标#######
    function gameChat(deptId){
        var time = $("#chooseTimeRange").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        getGameChat(deptId,time);
    }
    //#######30天游戏收益情况#######
    function gameChatList(deptId) {
        getgameChatList(deptId);
    }

    //#######30天游戏情况#######
    function getgameChatList(deptId) {
        var m = base.show_load_layer(); //loading层
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.GaneAction$gameMoneyList',
                viewId:'1',
                parameters:"{'deptId': "+ deptId +"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var _html = '';
                for (var i = _obj.length-1; i >=0; i--) {
                    _html +=  '<div class="swiper-slide slide-container">';
                    _html +=    '<p>'+_obj[i].date+'</p>';
                    _html +=    '<p>游戏金额：</p>';
                    _html +=    '<p>'+_obj[i].money+'</p>';
                    _html +=  '</div>';
                }
                $(".swiper-wrapper").html(_html);
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 'auto',
                    spaceBetween: 5,
                    freeMode: true,
                    observer: true,
                    observeParents: true
                });
                base.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })
    }

    function getGameChat(deptId,time){
        var begindate = time.substr(0, 10);
        var enddate = time.substr(13, 10);
        var m = base.show_load_layer(); //loading层
        base._ajax({
            url:base.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.GaneAction$searchOrder',
                viewId:'1',
                parameters:"{'deptId': "+ deptId +", 'begindate': "+ begindate +", 'enddate': "+ enddate +"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var names = [];
                var nums = [];
                for (var i = 0; i < _obj.length; i++) {
                    names.push(_obj[i].date);
                }

                for (var i = 0; i < _obj.length; i++) {
                    nums.push(_obj[i].money);
                }
                var saleChart = echarts.init(document.getElementById('saleChart'));
                var option = {
                    legend:{
                        data:['游戏数据']
                    },
                    tooltip:{
                        trigger: 'axis'
                    },
                    grid:{
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        show:true,
                        x:'100',
                        feature: {
                            dataView : {show: false, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        axisLabel: {
                            rotate: 30
                        },
                        data: names
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    series: [{
                        name: '游戏收益金额',
                        type: 'line',
                        symbolSize: 4,
                        color: ['#406ece'],
                        smooth: false,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                    type: 'solid'
                                }
                            }
                        },
                        barWidth:20,
                        label: {
                            normal: {
                                show: false,
                                position: 'top'
                            }
                        },
                        areaStyle:{color: '#e2e9f7'},
                        data: nums
                    }]
                };
                option.series[0].label.normal.show = !base.juddgeDay(begindate, enddate);
                saleChart.setOption(option,true);
                base.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })

    }
});
