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
    //-----------1号------
    updateLayuiDate('inTimeStart');
    updateLayuiDate('inTimeEnd');

    updateLayuiDate('buyTimeStartVip');
    updateLayuiDate('buyTimeEndVip');
    updateLayuiDate('outTimeStart');
    updateLayuiDate('outTimeEnd');
    base.multiSelect('downpanel-one','multSelects1-one','orderTypes-one','typesX1Status');
    base.fourLevelAreaSelect();
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
    //--------------------------------------------------------玄乐1号-----------------------------------------------------
    var s = base.show_load_layer();
    var tableInsnumOne = table.render({
        elem: '#numOne', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/xuanleManager/xuanle1hao",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center',fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'loginName',align: 'center', title: '用户账号'},
            {field: 'nickname',align: 'center', title: '用户姓名'},
            {field: 'branchCompanyName',align: 'center', title: '分公司'},
            {field: 'areaName', align: 'center',title: '区域'},
            {field: 'shopName',align: 'center', title: '门店'},
            {field: 'status',align: 'center', title: '订单状态', templet: function (e) {
                    return ["未到期","到期","取消"][e.status]
                }
            },
            {field: 'type', align: 'center',title: '订单类型', templet: function (e) {
                    return ["","转入","转出","收益"][e.type]
                }
            },
            {field: 'recordFigure', align: 'center',title: '金额'},
            {field: 'orderno', align: 'center',title: '订单编号'},
            {field: 'validAssets',align: 'center', title: '有效金额'},
            {
                field: 'createTime', align: 'center',title: '日期', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            }
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

    //查询
    $("#checkOne").on('click',function(){
        var loginName = $("#loginNameX1").val();
        var saleLoginName = $("#saleLoginNameVip").val();
        var buyTimeStart = $("#buyTimeStartVip").val();
        var buyTimeEnd = $("#buyTimeEndVip").val();
        var outTimeStart = $("#outTimeStart").val();
        var outTimeEnd = $("#outTimeEnd").val();
        var expireTimeStart = $("#expireTimeStartVip").val();
        var expireTimeEnd = $("#expireTimeEndVip").val();
        var redeemType = $("#redeemTypeVip").val();
        var branchCompanyId = $("#companySelect").val();
        var areaId = $("#areaSelect").val();
        var shopId = $("#shopSelect").val();
        var orderByTime = $("#orderByTime").val();
        var X1orderType = $("#X1orderType").val();
        var shopInfoAreaId = $("#shopArea").val();
        var orderStatusIds=[];
        if(X1orderType==1&&(outTimeStart.length>1||outTimeEnd.length>1)){
            layer.msg("订单类型为转入不能选择转出时间");
            return;
        }
        if(X1orderType==2&&(buyTimeStart.length>1||buyTimeEnd.length>1)){
            layer.msg("订单类型为转出不能选择转入时间");
            return;
        }
        $("input:checkbox[name='typesX1Status']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var goodsIds=[];
        $("input:checkbox[name='typesEightVip']:checked").each(function(e) {
            goodsIds.push($(this).val());//向数组中添加元素
        });
        goodsIds=goodsIds.join(',');//将数组元素连接起来以构建一个字符串
        if (!checkSearchContend(buyTimeStart,buyTimeEnd,outTimeStart,outTimeEnd)) {
            return;
        }
        var m = base.show_load_layer();
        tableInsnumOne.reload({
            where:{
                userLoginName:loginName,
                saleLoginName:saleLoginName,
                buyTimeStart:buyTimeStart,
                buyTimeEnd:buyTimeEnd,
                expireTimeStart:expireTimeStart,
                expireTimeEnd:expireTimeEnd,
                redeemType:redeemType,
                orderStatuses:orderStatusIds,
                goodsIds:goodsIds,
                branchCompanyId:branchCompanyId,
                areaId:areaId,
                shopId:shopId,
                orderByTime:orderByTime,
                type:X1orderType,
                shopInfoAreaId:shopInfoAreaId,
                outTimeStart:outTimeStart,
                outTimeEnd:outTimeEnd,
            }
            ,page: {
                curr: 1       //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });
    $("#resetOne").on('click',function() {
        base.fourReset();
        // tableIns.reload({
        //     where:{},
        //     page: {
        //         curr: 1       //重新从第 1 页开始
        //     }
        // });
    });
    $("#pldc").click(function () {
        var loginName = $("#loginNameX1").val();
        var saleLoginName = $("#saleLoginNameVip").val();
        var buyTimeStart = $("#buyTimeStartVip").val();
        var buyTimeEnd = $("#buyTimeEndVip").val();
        var outTimeStart = $("#outTimeStart").val();
        var outTimeEnd = $("#outTimeEnd").val();
        var expireTimeStart = $("#expireTimeStartVip").val();
        var expireTimeEnd = $("#expireTimeEndVip").val();
        var redeemType = $("#redeemTypeVip").val();
        var branchCompanyId = $("#companySelect").val();
        var areaId = $("#areaSelect").val();
        var shopId = $("#shopSelect").val();
        var orderByTime = $("#orderByTime").val();
        var X1orderType = $("#X1orderType").val();
        var shopInfoAreaId = $("#shopArea").val();
        var orderStatusIds=[];
        if (!checkSearchContend(buyTimeStart,buyTimeEnd,outTimeStart,outTimeEnd)) {
            return;
        }
        $("input:checkbox[name='typesX1Status']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var goodsIds=[];
        $("input:checkbox[name='typesEightVip']:checked").each(function(e) {
            goodsIds.push($(this).val());//向数组中添加元素
        });
        goodsIds=goodsIds.join(',');//将数组元素连接起来以构建一个字符串

        var paramter={
            userLoginName:loginName,
            saleLoginName:saleLoginName,
            buyTimeStart:buyTimeStart,
            buyTimeEnd:buyTimeEnd,
            expireTimeStart:expireTimeStart,
            expireTimeEnd:expireTimeEnd,
            redeemType:redeemType,
            orderStatuses:orderStatusIds,
            goodsIds:goodsIds,
            branchCompanyId:branchCompanyId,
            orderByTime:orderByTime,
            type:X1orderType,
            shopInfoAreaId:shopInfoAreaId,
            areaId:areaId,
            shopId:shopId,
            outTimeStart:outTimeStart,
            outTimeEnd:outTimeEnd,
        }
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
            url:base.apiUrl() + "/xuanleManager/xuanle1hao",
            data:paramter,
            success:function (res) {
                //excel名
                var name =  "玄乐1号-批量导出-"+new Date().format("yyyyMMddhhmm");
                //excel头部
                var firstR={loginName: "用户账号", nickname: "用户姓名", branchCompanyName: "分公司",areaName:"区域",shopName:"门店",status: '订单状态'
                    , type: '订单类型',recordFigure: '金额',orderno:'订单编号',validAssets: '有效金额',createTime: '日期'};
                //格式转换map
                var templateMap={
                    status:function (e) {
                        return ["未到期","到期","取消"][e.status]
                    },
                    type:function (e) {
                        return ["","转入","转出","收益"][e.type]
                    },
                    createTime:function (e) {
                        return base.toDateString(e.createTime)
                    }
                }
                base.downloadExl(res.data,name,null,firstR,templateMap);
            }
        })
    }
    //所在大区
    //areaSelect();
    function areaSelect() {
        base._ajax({
            type: "get",
            url: base.apiUrl() + '/shopinfo/areaList',
            success: function (item) {
                item=item.data
                var str = '<option value="">请选择</option>';
                $.each(item, function (a, b) {
                    str += '<option value="' + b.id + '">' + b.shopname + '</option>';
                })
                $("#shopInfoAreaId").html(str);
                form.render("select")
            }
        });
    }
    function checkSearchContend(startTime,endTime,startTime2,endTime2) {
        if (startTime) {
            if (!endTime) {
                layer.alert('转入起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("转入结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('转入起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('转出起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("转出结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('转出起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
