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
    if (v != undefined) {
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    }
    var t = base.show_load_layer();
    //分公司详情表
    var companyTable = table.render({
        elem:'#companyLs',
        url: base.apiUrl()+'/live/getSaleInfos',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        where: {
            deptId:1,
            searchTime:$("#chooseTime").val()
        },
        method: 'post',
        cellMinWidth: 60,
        parseData:function (res) {
            return {
                "code":res.code,
                "data":res.data.data
            }
        },
        cols: [[
            {field: '', align: 'center', width:60,title: '序号', toolbar: '#indexTpl'},
            {field: 'deptName', title: '公司名'},
            {field: 'saleMoney', title: '销售额'},
            {field: 'weekSaleMoney', title: '周平均销售额'},
            {field: 'monthSaleMoney', title: '月平均销售额'},
            {field: 'todayRise', title: '同比昨日增长', templet: '#todayRise',templet:function (d) {
                var obj = changColor(d.todayGrowth);
                var _html = '<span>'+d.todayRise+'</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">'+d.todayGrowth+'</span>';
                return _html;
            }},
            {field: 'monthRise', title: '同比本月平均增长', templet: '#monthRise',templet:function (d) {
                    var obj = changColor(d.monthGrowth);
                    var _html = '<span>'+d.monthRise+'</span><span class="ml10"><img src="'+obj.src+'"/></span><span class="ml10 '+obj.class+'">'+d.monthGrowth+'</span>';
                    return _html;
                }},
            {field: 'right', align: 'center',width:250, toolbar: '#barDemo', title: '操作'}
        ]],
        skin: 'line', //表格风格
        even: true,
        //数据回调
        done: function (res, curr, count) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            console.log('表格加载完成');
            base.close_load_layer(t);
        }
    });
    // // 七日情况
    $(function(){
        base._ajax({
            url: base.apiUrl()+'/live/getWeekData',
            data:{
                deptId:1
            },
            success:function (res) {
                var _obj = res.data;
                var dateList = _obj.date;
                var dataList = _obj.dataList;
                var dateTr = '';
                dateTr += '<th>序号</th><th>公司名</th>';
                for(var i = 0; i < dateList.length; i++){
                    dateTr += '<th>' + dateList[i] + '</th>';
                }
                $("#dateTr").html(dateTr);
                var service = '';
                for(var j = 0; j < dataList.length; j++){
                    service += '<tr>';
                    service += '<td>'+(j+1)+'</td><td>'+dataList[j][0]+'</td><td>'+dataList[j][1]+'</td><td>'+dataList[j][2]+'</td><td>'+dataList[j][3]+'</td><td>'+dataList[j][4]+'</td><td>'+dataList[j][5]+'</td><td>'+dataList[j][6]+'</td><td>'+dataList[j][7]+'</td>';
                    service += '</tr>';
                }
                $("#service").html(service);
            },
            error: function (error) {
                layer.msg("数据获取失败！")
            }
        })
    });
    $("#check").on('click',function () {
        t = base.show_load_layer();
        companyTable.reload({
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            where: {
                deptId:1,
                searchTime:$("#chooseTime").val()
            }
        })
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

    //列表页面--监听工具条
    table.on('tool(companyLs)', function (obj) {
        var data = obj.data;
        if (obj.event === 'goRegionalDetails') {
            var deptId = data.id;
            var deptName =data.deptName;
            var time = $('#chooseTime').val();
            if (time == ""){
                return layer.msg("请选择日期！");
            }
            var tab_title = deptName + '直播区域详情';
            parent.tab.tabAdd({
                href: 'html/finance/overView/liveManage/ngCompanyArea/ngArea.html?time='+ time+'&deptId='+deptId+'&deptName='+encodeURI(deptName),
                // icon: '',
                title: tab_title
            });
        } else if (obj.event === 'goHistoryReport') {
            var deptId = data.id;
            var deptName =data.deptName;
            var tab_title = deptName + '往期销售报表';
            parent.tab.tabAdd({
                href: 'html/finance/overView/liveManage/ngHistoryReport/ngHistoryReport.html?deptId='+ deptId+'&deptName='+encodeURI(deptName),
                // icon: '',
                title: tab_title
            });
        }
    });
    function changColor(n) {
        var n = parseFloat(n);
        var obj = {
            src:'',
            class:''
        };
        if (n > 0) {
            obj.src = '../../icon/up.png';
            obj.class = 'col-r';
        } else if (n < 0) {
            obj.src = '../../icon/down.png';
            obj.class = 'col-g';
        } else {
            obj.src = '../../icon/eq.png';
            obj.class = 'col-b';
        }
        return obj;
    }
})
