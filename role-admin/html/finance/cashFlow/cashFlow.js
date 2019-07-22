layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','element','form','laydate','base','table'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        element = layui.element,
        base = layui.base,
        table= layui.table;
    base.CashFlowGperateArea();
    updateLayuiDate('chooseTimeStart');
    updateLayuiDate('chooseTimeEnd');
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd',
                // value:getNowFormatDate(),
                // max:getNowDate()
            })
        })
    }
    var myChart = echarts.init(document.getElementById('mainChart'));
    chartInit(getParams());
    $("#checkCf").on('click',function () {
    	var p = getParams();
    	if(!checkSearchContend(p.staTime,p.endTime)){
    		return;
    	}
        chartInit(getParams());
    });
    //重置
    $("#resetCf").on('click',function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.cashFlowReset();
        $("#chooseTimeStart").val('');
        $("#chooseTimeEnd").val('');
        form.render('');
    });
    //批量导出
    $("#exportCf").on('click',function () {
        var subCompany = $("#companySelect").val() || '0',
            area = $("#areaSelect").val() == '0' ? null: $("#areaSelect").val(),
            shop = $("#shopSelect").val() == '0' ? null : $("#shopSelect").val(),
            staTime = $("#chooseTimeStart").val(),
            endTime = $("#chooseTimeEnd").val();
        if(!checkSearchContend(staTime,endTime)){
    		return;
    	}
       // if (staTime && endTime){
          //  if(staTime<=endTime){
            //    return layer.msg("结束时间必须大于开始时间!");
          //  }
        //}
      //批量导出提示
        layer.open({
            closeBtn: 0,
            shadeClose: true,
            skin: '',
            title: '批量导出小提示'
            ,content:
            '<div style="margin-top: 5px">1、请点击按钮确认是否继续操作!</div>'+
            '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
            , area: ['360px', '270px']
            ,btnAlign: 'c'
            ,btn: ['确定导出', '放弃导出']
            ,yes: function(){
                layer.closeAll();
                var fileName = "现金流数据导出" + staTime+"-"+endTime;
                var url =base.apiCashFlow() +  '/cashflow/getExcelDetalis?staTime='+staTime+'&endTime='+endTime+'&subCompany='+subCompany+'&area='+area+'&shop='+shop;
                layer.msg('导出中，请稍等....', {icon: 4});
                base.downXlsxExcel(url, fileName);
            }
            ,btn2: function(){
                layer.closeAll();
            }
        });
    });
    function getParams() {
        var params = {
            subCompany :$("#companySelect").val() || '0',
            area:$("#areaSelect").val() == '0' ? '': $("#areaSelect").val(),
            shop:$("#shopSelect").val() == '0' ? '' : $("#shopSelect").val(),
            staTime:$("#chooseTimeStart").val(),
            endTime:$("#chooseTimeEnd").val()
        };
        return params;
    }
    function chartInit(params) {
        // console.log(params);
        var m = base.show_load_layer();
        base._ajax({
            url:base.apiCashFlow() + '/cashflow/getGraDetalis',
            data:params,
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success:function (res) {
                // console.log(res);
                base.close_load_layer(m);
                if (res.code == '0') {
                    var dimen = ['product'];
                    var arr = [
                        {product: '相亲交友'},
                        {product: '积分兑换'},
                        {product: '营养指导'},
                        {product: '专享商城'},
                        {product: '垄上扶贫'},
                        {product: '全球代购'},
                        {product: '保健产品'},
                        {product: '附近小店'},
                        {product: '健康医疗'},
                        {product: '玄乐游戏'}
                    ];
                    var series = [];
                    for (var i = 0; i<res.data.length;i++) {
                        var data = res.data[i];
                        dimen.push(data.deptName);
                        series.push({type:'bar'});
                        for (var j = 0; j < arr.length; j++) {
                            var it = arr [j];
                            if (it.product == '相亲交友') {
                                it[data.deptName] = data.user_hongniang_sta/100;
                            }
                            if (it.product == '积分兑换') {
                                it[data.deptName] = data.user_integral_exchange/100;
                            }
                            if (it.product == '营养指导') {
                                it[data.deptName] = data.user_nutrition_guidance/100;
                            }
                            if (it.product == '专享商城') {
                                it[data.deptName] = data.shop_vip/100;
                            }
                            if (it.product == '垄上扶贫') {
                                it[data.deptName] = data.shop_group_buy/100;
                            }
                            if (it.product == '全球代购') {
                                it[data.deptName] = data.user_global_shopping/100;
                            }
                            if (it.product == '保健产品') {
                                it[data.deptName] = data.user_product_buy/100;
                            }
                            if (it.product == '附近小店') {
                                it[data.deptName] = data.user_small_shop/100;
                            }
                            if (it.product == '健康医疗') {
                                it[data.deptName] = data.user_health_sta/100;
                            }
                            if (it.product == '玄乐游戏') {
                                it[data.deptName] = data.shopa_game/100;
                            }
                        }
                    }
                    var option = {
                        legend:{},
                        tooltip:{
                            show:true,
                            trigger:'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        dataset: {
                            // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
                            // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
                            dimensions:dimen,
                            source: arr
                        },
                        xAxis: {type: 'category'},
                        yAxis: {},
                        series:series
                    };
                    myChart.setOption(option,true);
                    drawTable(res.data);
                } else {
                    layer.msg(res.message);
                }
            },
            error:function (error) {
                base.close_load_layer(m);
                console.log(error)
            }
        });
    }
    //获取当前日期的前一天作为初始值
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate()-1;
        month = month > 9 ? month:'0' + month;
        strDate = strDate > 9 ? strDate:'0' + strDate;
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    //获取当前日期
    function getNowDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        month = month > 9 ? month:'0' + month;
        strDate = strDate > 9 ? strDate:'0' + strDate;
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    //生成表格
    function drawTable(data) {
        var _html = '';
        _html += '<table border="1" cellspacing="0">';
        _html +=    '<tr>';
        _html +=        '<th></th>';
        _html +=        '<th>相亲交友</th>';
        _html +=        '<th>积分兑换</th>';
        _html +=        '<th>营养指导</th>';
        _html +=        '<th>专享商城</th>';
        _html +=        '<th>垄上扶贫</th>';
        _html +=        '<th>全球代购</th>';
        _html +=        '<th>保健产品</th>';
        _html +=        '<th>附近小店</th>';
        _html +=        '<th>健康医疗</th>';
        _html +=        '<th>玄乐游戏</th>';
        _html +=   '</tr>';
        for(var i = 0;i < data.length; i++){
            var tr = data[i];
            _html +=   '<tr>';
            _html +=        '<td>'+tr.deptName+'</td>';
            _html +=        '<td>'+tr.user_hongniang_sta/100+'</td>';
            _html +=        '<td>'+tr.user_integral_exchange/100+'</td>';
            _html +=        '<td>'+tr.user_nutrition_guidance/100+'</td>';
            _html +=        '<td>'+tr.shop_vip/100+'</td>';
            _html +=        '<td>'+tr.shop_group_buy/100+'</td>';
            _html +=        '<td>'+tr.user_global_shopping/100+'</td>';
            _html +=        '<td>'+tr.user_product_buy/100+'</td>';
            _html +=        '<td>'+tr.user_small_shop/100+'</td>';
            _html +=        '<td>'+tr.user_health_sta/100+'</td>';
            _html +=        '<td>'+tr.shopa_game/100+'</td>';
            _html +=    '</tr>';
        }
        _html +='</table>';
        $("#mainTable").html(_html);
    }
    function getUrl1(subCompany,shop,area,staTime,endTime) {
        var url =base.apiCashFlow() +  '/cashflow/getExcelDetalis?staTime='+staTime+'&endTime='+endTime+'&subCompany='+subCompany+'&area='+area+'&shop='+shop;
        layer.msg('导出中，请稍等....', {icon: 4});
        return url;
    }
    //校验搜索项是否合法
    function checkSearchContend(startTime, endTime) {
        if (startTime) {
            if (!endTime) {
                layer.alert('起止时间不能只选择一个', {
                    icon : 7
                });
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end >= start;
            if (!varify) {
                layer.alert("结束时间必须大于开始时间！", {
                    icon : 7
                });
                return false;
            }
        } else if (endTime) {
            layer.alert('起止时间不能只选择一个', {
                icon : 7
            });
            return false;
        }
        if(!startTime && ! end){
        	 layer.alert('请选择时间', {
                 icon : 7
             });
             return false;
        }
        return true;
    }
});

