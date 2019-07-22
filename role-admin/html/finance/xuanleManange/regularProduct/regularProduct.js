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
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'datetime',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss'
            })
        })
    }
    //----------------------------------------------------产品列表--------------------------------------------------------------
    var s = base.show_load_layer();
     table.render({
        elem: '#productList', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/xuanleManager/goodsList",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center',fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'name', align: 'center',title: '产品名称'},
            {field: 'description', align: 'center',title: '产品描述'},
            {field: 'status', align: 'center',title: '产品状态',templet:function (e) {
                    return ["在售","待售"][e.status]
                }},
            {field: 'anticipateFive', align: 'center',title: '最低收益（元）'},
            {field: 'initialMoney', align: 'center',title: '起购金额（元）'},
            {field: 'period', align: 'center',title: '投资周期（月）'},
            {field: 'rate', align: 'center',title: '利率',templet:function (e) {
                    return e.rate+"%";
                }
                },
            {field: 'riskLevel',align: 'center', title: '风险等级'},
            // {
            //     field: '', fixed: 'right', title: '操作', templet: function (e) {
            //         // var str =
            //         //     '  <a class="layui-btn layui-btn-xs" lay-event="edit">转入</a>'
            //         // return str;
            //         return ""
            //     }
            // }
            ]],
         done: function (res) {
             if (res.code == 501) {
                 console.log("501");
                 window.parent.parent.location.href = '/role-admin/login.html';
                 return;
             }
             base.close_load_layer(s);
         }
    });
});
