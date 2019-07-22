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
        var time;
        var deptId;
        var deptName;
        var time = $('#chooseTime').val();
        if (v != undefined) {
            deptId = v['deptId'];
            deptName = v['deptName'];
        }
        //    var i = show_load_layer();
            table.render({
                elem: '#staffTable',
                url: base.apiOthUrl(),
                method:'post',
                where:{
                    actionName:'com.xguanjia.client.action.statistics.saleManage.EmployeesAction$getCountByShopId',
                    viewId:1,
                    parameters:"{'shopId':" + deptId + "}"
                    },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                    'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                    'te_method': 'doAction'
                }
                //, page: {layout: ['limit', 'count', 'prev', 'page', 'next', 'skip']}
                , cellMinWidth: 60
                ,parseData:function (res) {
                    return {
                        "code":0,
                        "data":res.data,
                        "count":0
                    }
                },
                cols: [[
                    {field: '', align: 'center', width: 60, title: '序号', toolbar: '#indexTpl'}
                    , {field: 'name',align: 'center', title: '部门名', width: 120}
                    , {field: '3', align: 'center',title: '区域经理'}
                    , {field: '4', align: 'center',title: '主管'}
                    , {field: '5', align: 'center',title: '助理'}
                    , {field: '6',align: 'center', title: '全天店长'}
                    , {field: '7', align: 'center',title: '部长'}
                    , {field: '10', align: 'center',title: '上午店长'}
                    , {field: '11', align: 'center',title: '下午店长'}
                    , {field: '12', align: 'center',title: '代理'}
                    , {field: 'right', align: 'center',width:180, toolbar: '#barDemo', title: '操作'}
                ]]
                // skin: 'line' //表格风格
                , even: true
                , limit: 15 //每页默认显示的数量
                , limits: [15, 30, 50]
                //数据回调
                , done: function (res, curr, count) {
                    console.log(res);
                    $(".layui-table").css({
                        "border": "1px solid #e2e2e2",
                        "border-top": "none",
                        "width": "100%"
                    });
                   // close_load_layer(i);
                }
            });

            table.on('tool(staffTableModel)', function (obj) {
                var data = obj.data;
                if (obj.event === 'group_sale_account') {
                    var deptId = data.id;
                    var name =data.name;

                    var tab_title = name + '区域员工情况';
                    parent.tab.tabAdd({
                        href: 'html/finance/overView/staffCondition/staffNgArea.html?deptId='+deptId+'&name='+encodeURI(name),
                        // icon: '',
                        title: tab_title
                    });
                }
            });
        });


