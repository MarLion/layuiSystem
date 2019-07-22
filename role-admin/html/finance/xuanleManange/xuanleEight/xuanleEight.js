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
    //-----------8号----------

    // base.operateArea('branchCompanyId','b2','c2','areaId','e2','f2','shopId','h2');
    base.fourLevelAreaSelect();
    updateLayuiDate('buyTimeStart');
    updateLayuiDate('buyTimeEnd');
    updateLayuiDate('expireTimeStart');
    updateLayuiDate('expireTimeEnd');
    base.multiSelect('downpanel-eight','multSelects1-eight','orderTypes-eight','typesEight');
    base.multiSelect('downpanel-eight-status','multSelects1-eight-status','orderTypes-eight-status','typesEightStatus');
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
    //----------------------------------------------------玄乐8号--------------------------------------------------------------
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#numEig', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/xuanleManager/xuanleFixList?goodsType=0",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', align: 'center',fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'goodsName', align: 'center',title: '产品名称'},
            {field: 'userLoginName',align: 'center', title: '用户账号'},
            {field: 'nickname', align: 'center',title: '用户姓名'},
            {field: 'branchCompanyName',align: 'center', title: '分公司'},
            {field: 'areaName', align: 'center',title: '区域'},
            {field: 'shopName',align: 'center', title: '门店'},
            {field: 'amountMoney', align: 'center',title: '购买金额'},
            {field: 'status', align: 'center',title: '订单状态', templet: function (e) {
                    return ["未到期","到期","已提取","已续期"][e.status]
                }
            },
            {
                field: 'createTime',align: 'center', title: '购买时间', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            }, {
                field: 'updateTime', align: 'center',title: '到期时间', templet: function (e) {
                    return base.toDateString(e.expireTime)
                }
            },
            {field: 'amountMoney',align: 'center', title: '赎回类型',templet:function (e) {
                    if(e.redeemType){
                        return ["","到期赎回","未到期赎回"][e.redeemType];
                    }else {
                        return "";
                    }
                }},
            {field: 'rate',align: 'center', title: '利率',templet:function (e) {
                    return e.rate+"%";
                }},
            {field: 'expireMoney', align: 'center',title: '到期收益（元）'},
            {field: 'amountMoney',align: 'center', title: '实际收益（元）',templet:function (e) {
                    if(e.status==0){
                        return "0"
                    }else if(e.status==1){
                        return e.expireMoney;
                    }else if(e.status==2){
                        if(e.redeemType==1){
                            return e.expireMoney;
                        }else {
                            return "0"
                        }
                    }
                    return "0"
                }},
            {field: 'referrerNo', align: 'center',title: '推荐人账号'},
            // {
            //     field: '', fixed: 'right', title: '操作', templet: function (e) {
            //         var str =
            //             '  <a class="layui-btn layui-btn-xs" lay-event="edit">提取</a>\n' +
            //             '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'
            //         return "";
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

    //查询
    $("#checkEight").on('click',function(){
        var loginName = $("#loginName").val();
        var saleLoginName = $("#saleLoginName").val();
        var buyTimeStart = $("#buyTimeStart").val();
        var buyTimeEnd = $("#buyTimeEnd").val();
        var expireTimeStart = $("#expireTimeStart").val();
        var expireTimeEnd = $("#expireTimeEnd").val();
        var redeemType = $("#redeemType").val();
        var branchCompanyId = $("#companySelect").val();
        var shopId = $("#shopSelect").val();
        var areaId = $("#areaSelect").val();
        var shopInfoAreaId = $("#shopArea").val();
        var orderStatusIds=[];
        if (!checkSearchContend(buyTimeStart,buyTimeEnd,expireTimeStart,expireTimeEnd)) {
            return;
        }
        $("input:checkbox[name='typesEightStatus']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var goodsIds=[];
        $("input:checkbox[name='typesEight']:checked").each(function(e) {
            goodsIds.push($(this).val());//向数组中添加元素
        });
        goodsIds=goodsIds.join(',');//将数组元素连接起来以构建一个字符串
        var m = base.show_load_layer();
        tableIns.reload({
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
                shopId:shopId,
                areaId:areaId,
                shopInfoAreaId:shopInfoAreaId,
            }
            ,page: {
                curr: 1       //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

    $("#resetEight").on('click',function() {
        base.fourReset();
        // tableIns.reload({
        //     where:{},
        //     page: {
        //         curr: 1       //重新从第 1 页开始
        //     }
        // });
    })
    $("#pldcE").click(function () {
        var loginName = $("#loginName").val();
        var saleLoginName = $("#saleLoginName").val();
        var buyTimeStart = $("#buyTimeStart").val();
        var buyTimeEnd = $("#buyTimeEnd").val();
        var expireTimeStart = $("#expireTimeStart").val();
        var expireTimeEnd = $("#expireTimeEnd").val();
        var redeemType = $("#redeemType").val();
        var branchCompanyId = $("#companySelect").val();
        var shopId = $("#shopSelect").val();
        var areaId = $("#areaSelect").val();
        var shopInfoAreaId = $("#shopArea").val();
        var orderStatusIds=[];
        if (!checkSearchContend(buyTimeStart,buyTimeEnd,expireTimeStart,expireTimeEnd)) {
            return;
        }
        $("input:checkbox[name='typesEightStatus']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var goodsIds=[];
        $("input:checkbox[name='typesEight']:checked").each(function(e) {
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
            shopId:shopId,
            areaId:areaId,
            shopInfoAreaId:shopInfoAreaId,
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
            url:base.apiUrl() + "/xuanleManager/xuanleFixList?goodsType=0",
            data:paramter,
            success:function (res) {
                //excel名
                var name =  "玄乐8号-批量导出-"+new Date().format("yyyyMMddhhmm");
                //excel头部
                var firstR=  { goodsName: '产品名称',userLoginName:'用户账号',nickname:'用户姓名',branchCompanyName:'分公司',
                    areaName:'区域',shopName:'门店',amountMoney:'购买金额',status:'订单状态',createTime:'购买时间',expireTime:'到期时间'
                    ,redeemType:'赎回类型',rate:'利率',expireMoney:'到期收益（元）',accMoney:'实际收益（元）',referrerNo:'推荐人账号'}
                //格式转换map
                var templateMap= {
                    status: function (e) {
                        return ["未到期","到期","已提取","已续期"][e.status]
                    },

                    createTime: function (e) {
                        return base.toDateString(e.createTime)
                    },
                    expireTime: function (e) {
                        return base.toDateString(e.expireTime)
                    },
                    redeemType:function (e) {
                        if(e.redeemType){
                            return ["","到期赎回","未到期赎回"][e.redeemType];
                        }else {
                            return "";
                        }
                    },
                    accMoney:function (e) {
                        if(e.status==0){
                            return "0"
                        }else if(e.status==1){
                            return e.expireMoney;
                        }else if(e.status==2){
                            if(e.redeemType==1){
                                return e.expireMoney;
                            }else {
                                return "0"
                            }
                        }
                        return "0"
                    },
                    rate:function (e) {
                        return e.rate+"%";
                    }
                }
                base.downloadExl(res.data,name,null,firstR,templateMap);
            }
        })
    }
    //所在大区
    //areaSelect()
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
                layer.alert('购买起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("购买结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('购买起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('到期起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("到期结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('到期起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
