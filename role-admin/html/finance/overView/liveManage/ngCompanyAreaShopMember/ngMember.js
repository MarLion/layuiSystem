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
    if (v != undefined) {
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
        deptId = v['deptId'];
    }

    var t = base.show_load_layer();

    //个人销售情况
    var userTable = table.render({
        elem:'#lsCate',
        url: base.apiUrl()+'/live/getProductMemberOrder',
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        where: {
            deptId:deptId,
            searchTime:$("#chooseTime").val()
        },
        method: 'post',
        cellMinWidth: 60,
        parseData:function (res) {
            var shopManager=res.data.shopManager;
            var phone=res.data.phone;
            $("#shopManager").html(shopManager);
            $("#phone").html(phone);
            return {
                "code":res.code,
                "data":res.data.dataList
            }
        },
        cols: [[
            {field: '', align: 'center', width:60,title: '序号', toolbar: '#indexTpl'},
            {field: 'originalPrice', title: '原价'},
            {field: 'payPrice', title: '实付价格'},
            {field: 'loginName', title: '主播账号'},
            {field: 'nickname', title: '姓名'},
            {field: 'mobile', title: '联系方式'}
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
    $("#check").on('click',function () {
        t = base.show_load_layer();
        userTable.reload({
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            where: {
                deptId:deptId,
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
});
