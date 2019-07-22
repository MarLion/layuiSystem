layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table,
        apiUrl = base.apiUrl(),
        element = layui.element;

    var requestUrl= base.apiUrl() + "/queryIntegral/getPlatformIntegral";
    updateLayuiDate('timeStart',1);
    updateLayuiDate('timeEnd',2);
    // base.operateArea();
    function updateLayuiDate(cls,type) {
        var value='';
        var max = base.dateFormatter(new Date())
        if(type==1){
            value =base.getCurrentMonthFirst();
        }else if(type==2){
            value= base.getCurrentMonthLast();
        }
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'datetime',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss',
                min:'2018-05-01 00:00:00',
                max:max,
                value:value
            })
        })
    }
    var m = base.show_load_layer();
    var tableIns = table.render({
        elem:'#pc',
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: requestUrl,
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        parseData:function (res) {
            return {
                "code":res.code,
                "data":res.data,
                "count":res.count
            }
        },
        cols:[[
            {field:'',title	:'序号',align:'center',fixed: 'left', width: 60,templet:function (d) {
                return d.LAY_TABLE_INDEX + 1
            }},
            {field:'integralType',title:'积分类型',align:'center',width:160},
            {field:'loginName',title:'用户账号',align:'center',width:150},
            {field:'discr',title:'事件',align:'center',width:273},
            {field:'integral',title:'积分',align:'center',width:100},
            {field:'operatorIntegral',title:'操作后积分',align:'center',width:100},
            {field:'cktime',title:'日期',align:'center',width:220,templet:function (e) {
                return base.toDateString(e.cktime);
            }},
            {field:'subCompany',title:'分公司',align:'center',width:160},
            {field:'area',title:'区域',align:'center',width:160},
            {field:'shopName',title:'门店',align:'center',width:194}
        ]],
        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(m);
        }
    });

    //查询
    $("#checkPc").on('click',function () {
        var requestUrl = base.apiUrl() + "/queryIntegral/getPlatformIntegral";
        //积分类型
        var integralType = $("#integral_type").val();
        //用户账号
        var loginName=$("#login_name").val();
        //起止时间
        var timeStart = $("#timeStart").val();
        var timeEnd=$("#timeEnd").val();
        if (timeEnd && timeStart){
            var date =new Date();
            var currentYear = date.getFullYear();
            var currentMonth =date.getMonth() + 1;
            if(timeEnd<=timeStart){
                return layer.msg("结束时间必须大于开始时间!");
            }
            var start = timeStart.substring(0,7);
            var end = timeEnd.substring(0,7);
            if(start!=end){
                return layer.msg("查询时间范围不可跨月!");
            }
            //只允许查询当月及以前的，不能查询以后的
            var date1 = new Date(end);
            var searchYear = date1.getFullYear();
            var searchMonth = date1.getMonth()+1;
            if((searchYear>currentYear&&searchMonth>currentMonth)||(searchYear==currentYear&&searchMonth>currentMonth)){
                return layer.msg("当前查询时间范围未产生积分，请重新输入!");
            }
            if(parseInt(searchYear)<=parseInt(2018)&&parseInt(searchMonth)<parseInt(5)){
                return layer.msg("2018年5月份以后的积分暂不能查询!");
            }

        }
        if(integralType=='2'){
            requestUrl= base.apiUrl() + "/queryIntegral/getGameIntegral";
        }
        var s = base.show_load_layer();
        tableIns.reload({

            where:{
                loginName:loginName,
                timeStart:timeStart,
                timeEnd:timeEnd
            },
            url: requestUrl,
            page:{
                curr:1
            },
            done:function (res) {

                base.close_load_layer(s);
            }
        })
    });
    //重置
    $("#resetPc").on('click',function () {
        $("#login_name").val('');
        updateLayuiDate('timeStart',1);
        updateLayuiDate('timeEnd',2);
        form.render();
    });

});
