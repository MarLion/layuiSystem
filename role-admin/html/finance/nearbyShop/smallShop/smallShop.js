layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;
    base.operateArea();
    base.multiSelect('downpanel-shop','multSelects1-shop','orderTypes-shop','typesShop');
    var depts = getCookie("depts");
    var level = getCookie("roleLevel");

   laydate.render({
        elem: '#shopBuyTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#shopBuyTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#shopExTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#shopExTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#shopSignTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#shopSignTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    //---------------------------------------------------订单列表----------------------------------------------
    var tableIns = table.render({
        elem:'#sp',limit: 10, cellMinWidth: 80,
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiShopUrl() + "/nearshoporder/getNearOrderList?deptIds="+depts+"&roleLevel="+level,
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
        cols: [[ // 表头
            {
                field: 'id', title: '序号',align: 'center', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'orderNo', title: '订单编号', align: 'center',width: 160},
            {field: 'orderType', align: 'center',width: 100, title: '订单类型',templet:function (e) {
                    return formatStatus1(e.orderType);
                }},
            {field: 'orderStatus', align: 'center',width: 100, title: '订单状态',templet:function (e) {
                    return formatStatus2(e.orderStatus);
                }},
            {field: 'userLoginName', title: '用户账号', align: 'center',width: 160},
            {field: 'shopFilialeName', title: '分公司', align: 'center',width: 160},
            {field: 'shopAreaName', title: '区域', align: 'center',width: 160},
            {field: 'ownShopName', title: '门店', align: 'center',width: 150},
            {field: 'totalMoney', title: '玄乐金额', align: 'center',width: 100},
            {field: 'totalIntegral', title: '抵扣积分', align: 'center',width: 100},
            {field: 'shopMoney', title: '商家货款', align: 'center',width: 100},
            {field: 'serviceFee', title: '管理费', align: 'center',width: 100},
            {field: 'platformFee', title: '平台服务费', align: 'center',width: 100},
            {field: 'peopleFee', title: '推荐人服务费', align: 'center',width: 120},
            {field: 'agencyFee', title: '推广员服务费', align: 'center',width: 120},
            {field: 'referrerName', title: '推荐人', align: 'center',width: 100},
            {field: 'referrerLoginName', title: '推荐人账号', align: 'center',width: 160},
            {field: 'referrerFilialeName', title: '分公司', align: 'center',width: 160},
            {field: 'referrerAreaName', title: '区域', align: 'center',width: 160},
            {field: 'referrerOwnShopName', title: '门店', align: 'center',width: 150},
            {field: 'agencyName', title: '推广员', align: 'center',width: 100},
            {field: 'agencyLoginName', title: '推广员账号', align: 'center',width: 160},
            {field: 'agencyFilialeName', title: '分公司', align: 'center',width: 160},
            {field: 'agencyAreaName', title: '区域', align: 'center',width: 160},
            {field: 'agencyOwnShopName', title: '门店', align: 'center',width: 150},
            {field: 'buyDate', title: '购买时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.buyDate)
                }
            },
            {field: 'shipDate', title: '发货时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.shipDate)
                }
            },
            {field: 'signingDate', title: '签收时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.signingDate)
                }
            },
            {field: 'settleDate', title: '结算时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.settleDate)
                }
            },
            {field: 'shopName', title: '商户名称', align: 'center',width: 200}
        ]],
        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
        }
    });

    //多条件查询
    $("#checkShop").on('click',function() {
        if (!checkSearchContend($("#shopBuyTimeStart").val(),$("#shopBuyTimeEnd").val(),$("#shopExTimeStart").val(), $("#shopExTimeEnd").val(),$("#shopSignTimeStart").val(),$("#shopSignTimeEnd").val())) {
            return;
        }
        var orderStatusIds=[];
        $("input:checkbox[name='typesShop']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                ownShop:$("#shopSelect").val(),//门店id
                area:$("#areaSelect").val(),//区域id
                cityNo:$("#companySelect").val(),//分公司id
                orderStatusIds:orderStatusIds,//订单状态
                orderNo:$("#orderNo").val(),
                orderType:$("#orderType").val(),
                userLoginName:$("#userLoginName").val(),
                shopName:$("#shopName").val(),
                shopNumber:$("#shopNumber").val(),
                agencyName:$("#agencyName").val(),
                referrerName:$("#referrerName").val(),
                startBuyDate:$("#shopBuyTimeStart").val(),//购买开始时间
                endBuyDate:$("#shopBuyTimeEnd").val(),//购买结束时间
                startShipDate:$("#shopExTimeStart").val(),//出货开始时间
                endShipDate:$("#shopExTimeEnd").val(),//出货结束时间
                startSigningDate:$("#shopSignTimeStart").val(),//收货开始时间
                endSigningDate:$("#shopSignTimeEnd").val(),//收货结束时间
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

    //状态转换
    function formatStatus1(value){
        if (value == 1){
            return '商品订单';
        } else if (value == 2){
            return '活动订单';
        }
    }

    //状态转换
    function formatStatus2(value){
        if (value == 1){
            return '待发货';
        } else if (value == 2){
            return '待签收';
        }else if (value == 3){
            return '已完成';
        }else if (value == 4){
            return '申请退货';
        }else if(value == 5){
            return '已取消'
        }else if(value== 6){
            return '待退款'
        }else if(value== 8){
            return '已退款'
        }
    }

    //批量导出
    $("#orderExcel").on('click', function () {
        var fileName = "附近小店-批量导出" + base.getFormDate();
        var url = base.apiShopUrl()+ "/nearshoporder/nearShopOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });
    function getParamter(url,fileName) {
        if (!checkSearchContend($("#shopBuyTimeStart").val(),$("#shopBuyTimeEnd").val(),$("#shopExTimeStart").val(), $("#shopExTimeEnd").val(),$("#shopSignTimeStart").val(),$("#shopSignTimeEnd").val())) {
            return;
        }
        var length = 0;
        var orderStatusIds=[];
        $("input:checkbox[name='typesShop']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        if(orderStatusIds.length>0){
            url += "&orderStatusIds=" + orderStatusIds;
            length++;
        }
        var orderType=$("#orderType").val();
        if(orderType != null ){
            url += "&orderType=" + orderType;
            length++;
        }
        var cityNo=$("#companySelect").val();//分公司id
        if (cityNo != null && cityNo != '') {
            url += "&cityNo=" + cityNo;
            length++;
        }
        var area=$("#areaSelect").val();//区域id
        if (area != null && area != '') {
            url += "&area=" + area;
            length++;
        }
        var ownShop= $("#shopSelect").val();//门店id
        if (ownShop != null && ownShop != '') {
            url += "&ownShop=" + ownShop;
        }
        var orderNo=$("#orderNo").val();
        if (orderNo != null && orderNo != '') {
            url += "&orderNo=" + orderNo;
            length++;
        }
        var userLoginName=$("#userLoginName").val();
        if (userLoginName != null && userLoginName != '') {
            url += "&userLoginName=" + userLoginName;
            length++;
        }
        var shopName=$("#shopName").val();
        if (shopName != null && shopName != '') {
            url += "&shopName=" + shopName;
            length++;
        }
        var shopNumber=$("#shopNumber").val();
        if (shopNumber != null && shopNumber != '') {
            url += "&shopNumber=" + shopNumber;
            length++;
        }
        var referrerName=$("#referrerName").val();
        if (referrerName != null && referrerName != '') {
            url += "&referrerName=" + referrerName;
            length++;
        }
        var agencyName=$("#agencyName").val();
        if (agencyName != null && agencyName != '') {
            url += "&agencyName=" + agencyName;
            length++;
        }
        var startBuyDate=$("#shopBuyTimeStart").val();//购买开始时间
        if (startBuyDate != null && startBuyDate != '') {
            url += "&startBuyDate=" + startBuyDate;
            length++;
        }
        var endBuyDate=$("#shopBuyTimeEnd").val();//购买结束时间
        if (endBuyDate != null && endBuyDate != '') {
            url += "&endBuyDate=" + endBuyDate;
        }
        var startShipDate=$("#shopExTimeStart").val();//出货开始时间
        if (startShipDate != null && startShipDate != '') {
            url += "&startShipDate=" + startShipDate;
            length++;
        }
        var endShipDate=$("#shopExTimeEnd").val();//出货结束时间
        if (endShipDate != null && endShipDate != '') {
            url += "&endShipDate=" + endShipDate;
            length++;
        }
        var startSigningDate=$("#shopSignTimeStart").val();//收货开始时间
        if (startSigningDate != null && startSigningDate != '') {
            url += "&startSigningDate=" + startSigningDate;
            length++;
        }
        var endSigningDate=$("#shopSignTimeEnd").val();//收货结束时间
        if (endSigningDate != null && endSigningDate != '') {
            url += "&endSigningDate=" + endSigningDate;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }

    //重置
    $("#resetShop").on('click',function () {
        $("#shopSelect").val('');//门店id
        $("#areaSelect").val('');//区域id
        $("#companySelect").val('');//分公司id
        base.opereteReset();
        $("#orderNo").val('');
        $("#orderType").val('');
        $("#userLoginName").val('');
        $("#shopName").val('');
        $("#shopNumber").val('');
        $("#agencyName").val('');
        $("#referrerName").val('');
        $("#shopBuyTimeStart").val('');//购买开始时间
        $("#shopBuyTimeEnd").val('');//购买结束时间
        $("#shopExTimeStart").val('');//出货开始时间
        $("#shopExTimeEnd").val('');//出货结束时间
        $("#shopSignTimeStart").val('');//收货开始时间
        $("#shopSignTimeEnd").val('');//收货结束时间
        $(".orderTypes-shop").val('');
        $("input:checkbox[name='typesShop']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        form.render('');
    });
    function checkSearchContend(startTime,endTime,startTime2,endTime2,startTime3,endTime3) {
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
                layer.alert('发货起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("发货结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('发货起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime3) {
            if (!endTime3) {
                layer.alert('签收起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime3);
            var end = new Date(endTime3);
            var varify = end > start;
            if (!varify){
                layer.alert("签收结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime3) {
            layer.alert('签收起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
