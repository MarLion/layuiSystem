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

    var roleLevel = getCookie("roleLevel");
    var roleName=["分公司","分公司","区域","门店"][roleLevel]
    //跳转分公司详情
    $("#goCompany").html(roleName+"详情")

    //跳转分公司详情
    $("#goCompany").on('click',function () {
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var hrefUrl;
        if(roleLevel==1||roleLevel==0){
            hrefUrl='html/finance/overView/peopleVipAddNum/signCompany/signCompany.html?time='+ time
        }else if(roleLevel==2){
            hrefUrl='html/finance/overView/peopleVipAddNum/ngCompanyArea/ngArea.html?time='+ time+'&deptId=1'+'&deptName=';
        }else if(roleLevel==3){
            hrefUrl='html/finance/overView/peopleVipAddNum/ngCompanyAreaShop/ngArea.html?time='+ time+'&deptId=1'+'&deptName=';
        }
        parent.tab.tabAdd({
            href: hrefUrl,
            title: '分公司新增会员情况'
        })
    });

    var v = parseUrl();//解析所有参数
    var time;
    if (v != undefined) {
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    }
    //init select 1
    updateIntervalLayuiDate("chooseTimeRange");
    select1(time);
    // 1 select
    function select1(time){
        base.oldProjectAjax({
            actionName:'com.xguanjia.client.action.statistics.memberstatistics.MemberstatisticsAction$getSaleInfosOfCount',
            data:'{"time":'+time+',"deptId":1,"type":5}',
            success:function (res) {
                var data=res.data.data[0];
                $(".form1").formSerialize(data);
                changeColor('todayPercent','day-rise-icon');
                changeColor('monthPercent','month-rise-icon');
            }
        })
    }
    function changeColor(id,cl){
        var percent = parseFloat($("#"+id).html());
        var img = $("."+cl);
        var span = $("#"+id);
        if (percent > 0) {
            img.attr('src','../icon/up.png');
            span.removeClass('col-g').removeClass('col-b').addClass('col-r');
        } else if(percent < 0){
            img.attr('src','../icon/down.png');
            span.removeClass('col-r').removeClass('col-b').addClass('col-g');
        } else {
            img.attr('src','../icon/eq.png');
            span.removeClass('col-r').removeClass('col-g').addClass('col-b');
        }
    }
    //图表+轮播 init
    ridgePovertyEcharts();

    // 1 click
    $("#check").on('click',function () {
        select1($("#chooseTime").val());
    });
    // 2 click
    $("#checkCharts").on('click',function () {
        ridgePovertyEchartsSearch()
    });
    //sign table
    function ridgePovertyEchartsSearch() {
        var time = $("#chooseTimeRange").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var begindate = time.substr(0, 10);
        var enddate = time.substr(13, 10);
        var m = base.show_load_layer(); //loading层
        base.oldProjectAjax({
            actionName:'com.xguanjia.client.action.statistics.memberstatistics.MemberstatisticsAction$searchOrder',
            data:'{"deptId":1,"type":5,"begindate":'+begindate+',"enddate":'+enddate+'}',
            success:function (res) {
                var _obj = res.data;
                var names = [];
                var nums = [];
                for (var i = 0; i < _obj.length; i++) {
                    names.push(_obj[i].time);
                }
                for (var i = 0; i < _obj.length; i++) {
                    nums.push(_obj[i].num);
                }

                var saleChart = echarts.init(document.getElementById('saleChart'));
                var option = {
                    legend:{
                        data:['新增会员']
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
                        name: '新增会员',
                        type: 'line',
                        symbolSize: 4,
                        color: ['#406ece'],
                        smooth: false,
                        label:{
                            normal:{
                                show:true
                            }
                        },
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                    type: 'solid'
                                }
                            }
                        },
                        areaStyle:{color: '#e2e9f7'},
                        data: nums
                    }]
                };
                option.series[0].label.normal.show = !base.juddgeDay(begindate, enddate);
                saleChart.setOption(option,true);

                //轮播
                var _html = '';
                for (var i=_obj.length-1;i>=0;i--) {
                    _html +=  '<div class="swiper-slide slide-container">';
                    _html +=    '<p>'+_obj[i].time+'</p>';
                    _html +=    '<p>新增会员：</p>';
                    _html +=    '<p>'+_obj[i].num+'</p>';
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
    //图表+轮播
    function ridgePovertyEcharts() {
        var m = base.show_load_layer(); //loading层
        base.oldProjectAjax({
            actionName:'com.xguanjia.client.action.statistics.memberstatistics.MemberstatisticsAction$getMonthData',
            data:'{"deptId":1,"type":5}',
            success:function (res) {
                var _obj = res.data;
                var names = [];
                var nums = [];
                for (var i = 0; i < _obj.length; i++) {
                    names.push(_obj[i].time);
                }
                for (var i = 0; i < _obj.length; i++) {
                    nums.push(_obj[i].num);
                }
                var saleChart = echarts.init(document.getElementById('saleChart'));
                var option = {
                    legend:{
                        data:['新增会员']
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
                        name: '新增会员',
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
                        areaStyle:{color: '#e2e9f7'},
                        data: nums
                    }]
                };
                saleChart.setOption(option,true);

                //轮播
                var _html = '';
                for (var i=_obj.length-1;i>=0;i--) {
                    _html +=  '<div class="swiper-slide slide-container">';
                    _html +=    '<p>'+_obj[i].time+'</p>';
                    _html +=    '<p>新增会员：</p>';
                    _html +=    '<p>'+_obj[i].num+'</p>';
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
            }
        })

    }
    //common
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

    //common
    function updateIntervalLayuiDate(cls) {
        var time = base.getFirstDayOfMonth() + " - " + base.getNowDate();
        $("#"+cls).val(time);
        laydate.render({
            elem: '#'+cls,
            range: true //或 range: '~' 来自定义分割字符
        });
    }
    //common
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
});
