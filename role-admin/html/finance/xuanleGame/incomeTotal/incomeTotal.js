layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table,
        element = layui.element;
    updateLayuiDate('time');
    //updateLayuiDate('timeStart');
    laydate.render({
        elem:"#timeStart",
        type:'date',
        trigger:"click",
        format:'yyyy-MM-dd'
    });
    //updateLayuiDate('timeEnd');
    laydate.render({
        elem:"#timeEnd",
        type:'date',
        trigger:"click",
        format:'yyyy-MM-dd'
    });
    var ca = new CreateCalendar();
    getData('/game/getAbstractDate',{date:$("#time").val()});
    var myChart = echarts.init(document.getElementById('listChart'));
    var option = {
        title:{
            text:'收益余额'
        },
        legend:{},
        tooltip:{
            show:true,
            trigger:'axis',
        },
        grid:{},
        xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine:{
                show:true
            },
            axisLabel:{
                rotate:30
            },
            data: []
        },
        yAxis: {
            type: 'value',
            splitLine:{
                show:true
            }
        },
        series: [{
            data: [],
            type: 'line',
            lineStyle:{
                color:'#005BFF'
            },
            itemStyle:{
                color:'#005BFF'
            },
            areaStyle:{
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(0,91,255,0.5)' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(27,184,250,0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            }
        }]
    };
    // myChart.setOption(option,true);
    $("#check").on('click',function () {
        getData('/game/getAbstractDate',{date:$("#time").val()});
    });
    //
    //查询导出
    $("#excelByCheck").on('click',function () {
    	layer.open({
            closeBtn: 0,
            shadeClose: true,
            skin: '',
            title: '导出小提示'
            ,content:
            '<div style="margin-top: 5px">1、请点击按钮是确认是否继续操作!</div>'+
            '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
            , area: ['360px', '270px']
            ,btnAlign: 'c'
            ,btn: ['确定导出', '放弃导出']
            ,yes: function(){
                layer.closeAll();
                var fileName = "游戏数据统计表" + $("#time").val();
                var url =base.apiCashFlow() + '/game/getExcelGameDataByDate?date='+$("#time").val()+'&type=0';
                layer.msg('导出中，请稍等....', {icon: 4});
                base.downXlsxExcel(url, fileName);
            }
            ,btn2: function(){
                layer.closeAll();
            }
        });
    });
    //按月导出
    $("#excelByMonth").on('click',function () {
    	layer.open({
            closeBtn: 0,
            shadeClose: true,
            skin: '',
            title: '导出小提示'
            ,content:
            '<div style="margin-top: 5px">1、请点击按钮是确认是否继续操作!</div>'+
            '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
            , area: ['360px', '270px']
            ,btnAlign: 'c'
            ,btn: ['确定导出', '放弃导出']
            ,yes: function(){
                layer.closeAll();
                var timm = $("#time").val().split("-");
                var tim =timm[0]+timm[1] ;
                var fileName = "游戏数据统计表" + tim;
                var url =base.apiCashFlow() + '/game/getExcelGameDataByDate?date='+$("#time").val()+'&type=1';
                layer.msg('导出中，请稍等....', {icon: 4});
                base.downXlsxExcel(url, fileName);
            }
            ,btn2: function(){
                layer.closeAll();
            }
        });
        // window.location.href =
    });
    //查询图表
    $("#checkAll").on('click',function () {
       getChartData();
    });
    //获取统计数据
    function getData(url,params) {
        var s = base.show_load_layer();
        base._ajax({
            url: base.apiCashFlow() + url,
            data: params,
            success:function (res) {
                // console.log(res);
                base.close_load_layer(s);
                if (res.code == '0') {
                    $("#m1").html(base.formattedNumber(res.data.totalMoney));
                    $("#m2").html(base.formattedNumber(res.data.avgWeekMoney));
                    $("#m3").html(base.formattedNumber(res.data.avgMonthMoney));
                    $("#m4").html(base.formattedNumber(res.data.dayRise));
                    $("#m5").html(base.formattedNumber(res.data.monthRise));
                    var xData = [];
                    var yData = [];
                    $.each(res.data.moneyList,function (index,item) {
                        xData.push(item.create_time);
                        yData.push(item.total);
                    });
                    option.xAxis.data = xData;
                    option.series[0].data = yData;
                    myChart.setOption(option,true);
                    ca.init({
                        elem:'calendarTable',
                        data:res.data.moneyList
                    })
                } else {
                    layer.msg(res.message);
                }
            },
            error:function (error) {
                console.log(error);
                base.close_load_layer(s);
            }
        });
    }
    //获取图表数据
    function getChartData() {
        var l = base.show_load_layer();
        base._ajax({
            url: base.apiCashFlow() + '/game/getAbstractGrapDate',
            data: {
                staTime:$("#timeStart").val(),
                endTime:$("#timeEnd").val()
            },
            success:function (res) {
                //console.log(res);
                base.close_load_layer(l);
                if (res.code == '0') {
                    var xData = [];
                    var yData = [];
                    $.each(res.data.moneyList,function (index,item) {
                        xData.push(item.create_time);
                        yData.push(item.total);
                    });
                    option.xAxis.data = xData;
                    option.series[0].data = yData;
                    myChart.setOption(option,true);
                    ca.init({
                        elem:'calendarTable',
                        data:res.data.moneyList
                    })
                } else {
                    layer.msg(res.message);
                }
            },
            error:function (error) {
                console.log(error);
                base.close_load_layer(l);
            }
        })
    }
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd',
                value:getNowFormatDate()
            })
        })
    }
//获取当前日期的前一天作为初始值
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //当前月
        var strDate = date.getDate()-1; //前一天
        var isRun=year%400==0&&year%100!=0||year%400==0; //是否闰年
        var bigMonth = [1,3,5,7,8,10,12]; //大月
        var smallMonth = [4,6,9,11];//小月
        var last = month-1; //上个月
        if (strDate == 0) {
             if (bigMonth.indexOf(last) != -1) {
                 strDate = 31;
             }
             if (smallMonth.indexOf(last) != -1) {
                 strDate = 30
             }
             if (last == 2) {
                  if (isRun) {
                      strDate = 29;
                  } else {
                      strDate = 28;
                  }
             }
             month = month == 1 ? 12 : last;
        }
        month = month > 9 ? month:'0' + month;
        strDate = strDate > 9 ? strDate:'0' + strDate;
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
});
