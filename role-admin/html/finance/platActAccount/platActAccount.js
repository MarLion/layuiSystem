layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element','layer'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table,
        element = layui.element,
        layer = layui.layer;
    updateLayuiDate('chooseDate');
    getDate();
    $("#checkBd").on('click',function () {
       getDate();
    });
    function getDate () {
        var m = base.show_load_layer();
        base._ajax({
            url: base.apiCashFlow() + '/cashcheck/getCashCheckData',
            data: {date:$("#chooseDate").val()},
            // data:{date:'2019-06-26'},
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid')
            },
            success:function (res) {
                //console.log(res);
                if (res.code == '0') {
                    getTable(res.data);
                    base.close_load_layer(m);
                } else {
                    base.close_load_layer(m);
                    layer.msg(res.message);
                }
            },
            error:function (error) {
                base.close_load_layer(m);
                console.log(error);
            }
        });
    }
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd',
                value:getNowFormatDate(),
                max:getNowFormatDate()
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
    //生成表格
    function getTable (data) {
        //console.log(data);
        var platIn = data.pIn,//平台入账
            platOut = data.pOut,//平台出账
            gameIn = data.gIn,//游戏入账
            gameOut = data.gOut,//游戏出账
            gameYe = data.gYe,//游戏余额
            gameCheck = data.gCheck,//游戏核对
            gamePft = data.gPft,
            gXls = data.gXls,
            checks = data.checks,
            lefts = data.lefts;
        var t1 = '',
            t2 = '',
            t3 = '';
        //平台入
        t1 += '<table border="1" cellspacing="0">';
        t1 +=   '<tr>';
        t1 +=       '<td colspan="3" class="fw">入</td>';
        t1 +=   '</tr>';
        t1 +=   '<tr class="cell-bg">';
        t1 +=       '<td colspan="2" class="fw">明细</td>';
        t1 +=       '<td class="fw">金额</td>';
        t1 +=   '</tr>';
        for (var i = 0; i <  platIn.data.length;i++){
            t1 += '<tr>';
            t1 +=   '<td class="cell-bg-t" rowspan="'+ platIn.data[i].value.length+'">'+ platIn.data[i].name+'</td>';
            t1 +=   '<td>'+ platIn.data[i].value[0].name+'</td>';
            t1 +=   '<td>'+ platIn.data[i].value[0].value+'</td>';
            t1 += '</tr>';
            for (var j = 1;j< platIn.data[i].value.length;j++){
                t1 += '</tr>';
                t1 +=   '<td>'+ platIn.data[i].value[j].name+'</td>';
                t1 +=   '<td>'+ platIn.data[i].value[j].value+'</td>';
                t1 += '</tr>';
            }
        }
        t1 +=   '<tr>';
        t1 +=       '<td class="fw">总计</td>';
        t1 +=       '<td colspan="2" class="fw">'+platIn.count+'</td>';
        t1 +=   '</tr>';
        t1 += '</table>';
        //平台出
        t2 += '<table border="1" cellspacing="0">';
        t2 +=   '<tr>';
        t2 +=       '<td colspan="3" class="fw">出</td>';
        t2 +=   '</tr>';
        t2 +=   '<tr class="cell-bg">';
        t2 +=       '<td colspan="2" class="fw">明细</td>';
        t2 +=       '<td class="fw">金额</td>';
        t2 +=   '</tr>';
        for (var i = 0; i <  platOut.data.length;i++){
            t2 += '<tr>';
            t2 +=   '<td class="cell-bg-t" rowspan="'+ platOut.data[i].value.length+'">'+ platOut.data[i].name+'</td>';
            t2 +=   '<td>'+ platOut.data[i].value[0].name+'</td>';
            t2 +=   '<td>'+ platOut.data[i].value[0].value+'</td>';
            t2 += '</tr>';
            for (var j = 1;j< platOut.data[i].value.length;j++){
                t2 += '</tr>';
                t2 +=   '<td>'+ platOut.data[i].value[j].name+'</td>';
                t2 +=   '<td>'+ platOut.data[i].value[j].value+'</td>';
                t2 += '</tr>';
            }
        }
        t2 +=   '<tr>';
        t2 +=       '<td class="fw">总计</td>';
        t2 +=       '<td colspan="2" class="fw">'+platOut.count+'</td>';
        t2 +=   '</tr>';
        t2 += '</table>';
        //游戏
        t3 += '<table border="1" cellspacing="0">';
        t3 +=   '<tr class="fw">';
        t3 +=       '<td rowspan="2">明细</td>';
        t3 +=       '<td colspan="'+gameIn.length+'">入</td>';
        t3 +=       '<td colspan="'+gameOut.length+'">出</td>';
        t3 +=       '<td colspan="'+gamePft.length+'">收益</td>';
        t3 +=       '<td colspan="'+gameYe.length+'">余额</td>';
        t3 +=       '<td colspan="'+gameCheck.length+'">核对</td>';
        t3 +=   '</tr>';
        t3 +=   '<tr>';
        for(var i = 0;i<gameIn.length;i++){
            t3 +=       '<td>'+gameIn[i].name+'</td>'
        }
        for(var i = 0;i<gameOut.length;i++){
            t3 +=       '<td>'+gameOut[i].name+'</td>'
        }
        for(var i = 0;i<gamePft.length;i++){
            t3 +=       '<td>'+gamePft[i].name+'</td>'
        }
        for(var i = 0;i<gameYe.length;i++){
            t3 +=       '<td>'+gameYe[i].name+'</td>'
        }
        for(var i = 0;i<gameCheck.length;i++){
            t3 +=       '<td>'+gameCheck[i].name+'</td>'
        }
        t3 +=   '</tr>';
        for(var i = 0;i<gameIn[0].value.length;i++){
            t3 += '<tr>';
            t3 +=   '<td>'+gameIn[0].value[i].name.replace(/入账/g,"")+'</td>';
            for(var j = 0;j<gameIn.length;j++){
                t3 += '<td>'+gameIn[j].value[i].value+'</td>';
            }
            for(var j = 0;j<gameOut.length;j++){
                t3 += '<td>'+gameOut[j].value[i].value+'</td>';
            }
            for(var j = 0;j<gamePft.length;j++){
                t3 += '<td>'+gamePft[j].value[i].value+'</td>';
            }
            for(var j = 0;j<gameYe.length;j++){
                t3 += '<td>'+gameYe[j].value[i].value+'</td>';
            }
            for(var j = 0;j<gameCheck.length;j++){
                t3 += '<td>'+gameCheck[j].value[i].value+'</td>';
            }
            t3 += '</tr>';
        }

        t3 +=   '<tr class="fw">';
        t3 +=       '<td>总计</td>';
        for(var i = 0;i<gameIn.length;i++){
            t3 +=       '<td>'+gameIn[i].count+'</td>'
        }
        for(var i = 0;i<gameOut.length;i++){
            t3 +=       '<td>'+gameOut[i].count+'</td>'
        }
        for(var i = 0;i<gamePft.length;i++){
            t3 +=       '<td>'+gamePft[i].count+'</td>'
        }
        for(var i = 0;i<gameYe.length;i++){
            t3 +=       '<td>'+gameYe[i].count+'</td>'
        }
        for(var i = 0;i<gameCheck.length;i++){
            t3 +=       '<td>'+gameCheck[i].count+'</td>'
        }
        t3 +=   '</tr>';
        t3 +=   '<tr class="fw">';
        t3 +=       '<td rowspan="'+gXls.value.length+'">'+gXls.name+'</td>';
        t3 +=       '<td colspan="3">'+gXls.value[0].name+'</td>';
        t3 +=       '<td colspan="3">'+gXls.value[0].value+'</td>';
        t3 +=       '<td></td>';
        t3 +=   '</tr>';
        for (var i = 1;i<gXls.value.length;i++){
            t3 +=   '<tr class="fw">';
            t3 +=       '<td colspan="3">'+gXls.value[i].name+'</td>';
            t3 +=       '<td colspan="3">'+gXls.value[i].value+'</td>';
            t3 +=       '<td></td>';
            t3 +=   '</tr>';
        }
        t3 +=   '<tr class="fw">';
        t3 +=       '<td>游戏核对</td>';
        t3 +=       '<td colspan="3">剩=原+（入-出）- 收益</td>';
        t3 +=       '<td colspan="3">'+lefts.game+'</td>';
        t3 +=       '<td></td>';
        t3 +=   '</tr>';
        t3 +=   '<tr class="fw">';
        t3 +=       '<td>平台核对</td>';
        t3 +=       '<td colspan="3">剩=原+（入-出）</td>';
        t3 +=       '<td colspan="3">'+lefts.platm+'</td>';
        t3 +=       '<td></td>';
        t3 +=   '</tr>';
        t3 +=   '<tr class="fw" style="color: #1E87F0;">';
        t3 +=       '<td colspan="8">'+checks+'</td>';
        t3 +=   '</tr>';
        t3 += '</table>';
        $("#plat-in-table").html(t1);
        $("#plat-out-table").html(t2);
        $("#game-table").html(t3);
    }
  //查询导出
    $("#exportBd").on('click',function () {
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
                var fileName = "玄乐对账" + $("#chooseDate").val();
                var url =base.apiCashFlow() + '/cashcheck/getExcelDataByDate?date='+$("#chooseDate").val();
                layer.msg('导出中，请稍等....', {icon: 4});
                base.downXlsxExcel(url, fileName);
            }
            ,btn2: function(){
                layer.closeAll();
            }
        });
    });
    
    
});
