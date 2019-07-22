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
    var id = "gameIntegralAdd";
    var time;
    //从cookie中取角色级别
    var roleLevel = getCookie("roleLevel");
    //0-管理员，1-分公司 2-区域 3-门店
    var href = '';
    var name = '';
    var categoryName='';
    //初始化时间
    if (v != undefined) {
        time = v['time'];
        $("#chooseTime").val(time);
        updateLayuiDate("chooseTime",time);
    };
    //初始化角色级别
    initRoleLevel();
    //初始化品类名称
    initCategoryName();
    laydate.render({
        elem: '#chooseTimeRange',
        range: true //或 range: '~' 来自定义分割字符
    });
    //layui时间区间格式化
    function updateIntervalLayuiDate(cls) {
        var time = base.getFirstDayOfMonth() + " - " + base.getNowDate();
        $("#"+cls).val(time);
        laydate.render({
            elem: '#'+cls,
            range: true //或 range: '~' 来自定义分割字符
        });
    };
    //初始化角色权限
    function initRoleLevel() {
        if(roleLevel==0||roleLevel==1){
            href = 'html/finance/overView/platPointsCompany/platPointsCompany.html?integtalType=2&shopId=1';
            name = '分公司';
        }else if(roleLevel==2){
            href = 'html/finance/overView/platPointsCompanyAreaDetail/platPointsCompanyAreaDetail.html?shopId=1&integtalType=2';
            name = '区域';
        }else if(roleLevel==3){
            href='html/finance/overView/platPointsCompanyShopDetail/platPointsCompanyShopDetail.html?shopId=1&integtalType=2';
            name = '门店'
        }
        $("#goCompany").text(name+"积分详情");
    }
    //初始化品类名称
    function initCategoryName() {
        if(roleLevel==0){
            categoryName = '集团公司'
        }else if(roleLevel==1){
            categoryName='分公司'
        }else if(roleLevel==2){
            categoryName = '区域';
        }else if(roleLevel==3){
            categoryName = '门店'
        }
    }
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd',
                done: function (value, date) {

                }
            })
        })
    }
    //时间区间格式化
    updateIntervalLayuiDate("chooseTimeRange");
    //游戏积分增加类别图表
    integralChartData(2);
    //游戏积分增加折线图
    integralChat(2);
    //游戏积分增加三十天内积分情况
    integralChatList(2);

    //上面那个查询
    $("#check").on('click',function () {
        integralChartData(2);
    });
    //中间那个查询
    $("#checkCharts").on('click',function () {
        integralChat(2);
    });
    //#######类别图表#######
    function integralChartData(integralType){
        var time = $("#chooseTime").val();
        if (time == ""){
            layer.msg("请选择日期！");
            return;
        }
        base.getIntegralChartData(integralType,time);
    }
    //#######Echarts图标#######
    function integralChat(integralType){
        var time = $("#chooseTimeRange").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        base.getIntegralChat(integralType,time);
    }
    //#######30天内积分情况#######
    function integralChatList(integralType) {
        base.getIntegralChatList(integralType);
    }

    //跳转游戏积分类别详情
    $("#goCategory").on('click',function () {
        var time = $("#chooseTime").val();
        parent.tab.tabAdd({
            href: 'html/finance/overView/platPointsCategory/platPointsCategory.html?time='+time+"&integtalType=2",
            // icon: '',
            id:id,
            title: '(游戏增长)'+categoryName+'积分品类详情'
        })
    });
    //跳转分公司详情
    $("#goCompany").on('click',function () {
        var time = $("#chooseTime").val();
        parent.tab.tabAdd({
            href: href+'&time='+time,
            // icon: '',
            id:id,
            title: '(游戏增长)'+name+'积分详情'
        })
    });
});
