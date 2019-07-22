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
    $('.xuanle-tab iframe').css({height:window.innerHeight-220 + 'px'});
    //---------专享奖金--------
    updateLayuiDate('timeStart');
    updateLayuiDate('timeEnd');
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
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#vipBonus', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/xuanleManager/xuanleProfit",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号',align: 'center', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName',align: 'center', title: '用户账号'},
            {field: 'nickname',align: 'center', title: '用户姓名'},
            {field: 'type', align: 'center',title: '奖金类型',templet:function (e) {
                 return  ["用户到期奖金","用户续期奖金","特约人到期奖金","特约人续期奖金"][e.type]
            }},
            {field: 'branchCompanyName',align: 'center', title: '分公司'},
            {field: 'areaName',align: 'center', title: '区域'},
            {field: 'shopName',align: 'center', title: '门店'},
            {field: 'amount',align: 'center', title: '奖金金额'},
            {field: 'actionName',align: 'center', title: '描述'},
            {field: 'createTime',align: 'center', title: '时间',templet: function (e) {
                    return base.toDateString(e.createTime)
                }},
            {field: 'status', align: 'center',title: '状态',templet:function (e) {
                    return ["成功","失败"][e.status]
                }},
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
    totalXuanleProfit();
    //查询
    $("#checkVipBonus").on('click',function(){
        var loginName = $("#loginName").val();
        var buyTimeStart = $("#timeStart").val();
        var buyTimeEnd = $("#timeEnd").val();
        if (!checkSearchContend(buyTimeStart,buyTimeEnd)) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where:{
                loginName:loginName,
                timeStart:buyTimeStart,
                timeEnd:buyTimeEnd,
            }
            ,page: {
                curr: 1       //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
        totalXuanleProfit( loginName, buyTimeStart, buyTimeEnd);
    });
    $("#resetVipBonus").on('click',function() {
        tableIns.reload({
            where:{},
            page: {
                curr: 1       //重新从第 1 页开始
            }
        });
    })
    function totalXuanleProfit( loginName, buyTimeStart, buyTimeEnd) {
        base._ajax({
            url: base.apiUrl() + "/xuanleManager/totalXuanleProfit",
            data: {
                loginName: loginName,
                timeStart: buyTimeStart,
                timeEnd: buyTimeEnd,
            },
            success: function (res) {
                if (res.code == 0) {
                    $("#vipBonusTotal").html(res.data.totalXuanleProfit)
                }
            }
        })
    }

    $("#pldc").click(function () {
        var loginName = $("#loginName").val();
        var buyTimeStart = $("#timeStart").val();
        var buyTimeEnd = $("#timeEnd").val();
        if (!checkSearchContend(buyTimeStart,buyTimeEnd)) {
            return;
        }
        var paramter={
            loginName:loginName,
            timeStart:buyTimeStart,
            timeEnd:buyTimeEnd,
        };
        var obj = paramter;
        for(var key in obj){
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if (JSON.stringify(obj) == '{}') {
            layer.open({
                closeBtn: 0,
                shadeClose: true,
                skin: '',
                title: '提示'
                ,content:
                    '<div style="margin-top: 5px">您未选择任一查询条件，导出的数据会比较大，会存在一定的性能风险，如果您任然要执行该操作，请点击确认导出，但您的操作会被记录，谢谢！</div>'
                , area: ['360px', '270px']
                ,btnAlign: 'c'
                ,btn: ['确定导出', '放弃导出']
                ,yes: function () {
                    layer.closeAll();
                    exportTable(paramter)
                }
                ,btn2: function(){
                    layer.closeAll();
                }
            });
        } else {
            layer.open({
                closeBtn: 0,
                shadeClose: true,
                skin: '',
                title: '提示'
                ,content:
                    '<div style="margin-top: 5px">1、请点击按钮确认是否继续操作!</div>'+
                    '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
                , area: ['360px', '270px']
                ,btnAlign: 'c'
                ,btn: ['确定导出', '放弃导出']
                ,yes: function () {
                    layer.closeAll();
                    exportTable(paramter)
                }
                ,btn2: function(){
                    layer.closeAll();
                }
            });
        }
    });
    function exportTable(paramter) {
        base.exportAjax({
            url:base.apiUrl() + "/xuanleManager/xuanleProfit",
            data:paramter,
            success:function (res) {
                //excel名
                var name =  "玄乐专享奖金-批量导出-"+new Date().format("yyyyMMddhhmm");
                //excel头部
                var firstR=  { loginName:'用户账号',nickname:'用户姓名',branchCompanyName:'分公司',
                    areaName:'区域',shopName:'门店',amount:'奖金金额',actionName:'描述',createTime:'时间',status:'状态'
                }
                //格式转换map
                var templateMap= {
                    status: function (e) {
                        return ["成功","失败"][e.status]
                    },
                    createTime: function (e) {
                        return base.toDateString(e.createTime)
                    },
                }
                base.downloadExl(res.data,name,null,firstR,templateMap);
            }
        })
    }
    function checkSearchContend(startTime,endTime) {
        if (startTime) {
            if (!endTime) {
                layer.alert('创建起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("创建结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('创建起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
