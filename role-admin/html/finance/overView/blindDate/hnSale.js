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
    $(function() {
        if(roleLevel==2){
            $("#goCompany").html('区域详情');
        }else if(roleLevel==3){
            $("#goCompany").html('门店详情');
        }else{
            $("#goCompany").html('分公司详情');
        }
    });
    //跳转分公司详情
    $("#goCompany").on('click',function () {
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var href='';
        var title='';
        if(roleLevel==2){
            title='相亲交友区域销售详情';
            href='html/finance/overView/blindDate/ngCompanyArea/ngArea.html?time='+ time+'&deptId=-1';
        }else if(roleLevel==3){
            title='相亲交友门店销售详情';
            href='html/finance/overView/blindDate/ngCompanyAreaShop/ngShop.html?time='+ time+'&deptId=-1';
        }else{
            title='相亲交友分公司销售详情';
            href='html/finance/overView/blindDate/ngCompany/ngCompany.html?time='+ time;
        }
        parent.tab.tabAdd({
            href: href,
            // icon: '',
            title: title
        })
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
    if (v != undefined) {
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    }

    //初始化时间
    updateIntervalLayuiDate("chooseTimeRange");
    //初始化汇总、图表数据
    ridgePovertyData();
    ridgePovertyEcharts();

    $("#check").on('click',function () {
        ridgePovertyData();
    });
      $("#checkCharts").on('click',function () {
        ridgePovertyEchartsSearch();
    });

    //相亲交友销售汇总
    function ridgePovertyData(){
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var m = base.show_load_layer(); //loading层
        base._ajax({
            url:base.apiUrl()+'/hn/getSaleTotalInfos',
            data:{
                searchTime:time,
            },
            success:function (res) {
                var _obj = res.data;
                $("#saleCount").html(_obj.saleCount);
                $("#saleMoney").html(_obj.saleMoney);
                $("#weekSaleMoney").html(_obj.weekSaleMoney);
                $("#monthSaleMoney").html(_obj.monthSaleMoney);
                document.getElementById("todayRise").innerHTML= _obj.todayRise;
                changeColor(_obj.todayPercent,'today-per-icon','todayPercent');
                document.getElementById("todayPercent").innerHTML= _obj.todayPercent;
                document.getElementById("monthRise").innerHTML= _obj.monthRise;
                changeColor(_obj.monthPercent,'month-per-icon','monthPercent');
                document.getElementById("monthPercent").innerHTML= _obj.monthPercent;
                base.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })
    }

    //相亲交友销售图表+轮播
    function ridgePovertyEcharts() {
        var m = base.show_load_layer(); //loading层
        base._ajax({
            url:base.apiUrl()+'/hn/getChartData',
            data:{
                deptId:'1'
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
                        data:['相亲交友销售金额']
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
                        name: '相亲交友销售金额',
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
                saleChart.setOption(option,true);

                //轮播
                var _html = '';
                for (var i=_obj.length-1;i>=0;i--) {
                    _html +=  '<div class="swiper-slide slide-container">';
                    _html +=    '<p>'+_obj[i].date+'</p>';
                    _html +=    '<p>相亲交友玄乐币：</p>';
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

    //相亲交友销售图表
    function ridgePovertyEchartsSearch() {
        var time = $("#chooseTimeRange").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var begindate = time.substr(0, 10);
        var enddate = time.substr(13, 10);
        var m = base.show_load_layer(); //loading层
        base._ajax({
            url:base.apiUrl()+'/hn/getChartDataByData',
            data:{
                deptId:'1',
                startTime:begindate,
                endTime:enddate,
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
                        data:['相亲交友销售金额']
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
                        name: '相亲交友销售金额',
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
                base.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })
    }

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
    function updateIntervalLayuiDate(cls) {
        var time = base.getFirstDayOfMonth() + " - " + base.getNowDate();
        $("#"+cls).val(time);
        laydate.render({
            elem: '#'+cls,
            range: true //或 range: '~' 来自定义分割字符
        });
    }
    function changeColor(n,cl,id) {
        var i = $('.'+cl);
        var s = $("#"+id);
        n = parseFloat(n);
        if (n > 0) {
            i.attr('src','../icon/up.png');
            s.removeClass('col-g').removeClass('col-b').addClass('col-r');
        } else if (n < 0) {
            i.attr('src','../icon/down.png');
            s.removeClass('col-r').removeClass('col-b').addClass('col-g');
        } else {
            i.attr('src','../icon/eq.png');
            s.removeClass('col-r').removeClass('col-g').addClass('col-b');
        }
    }
});
