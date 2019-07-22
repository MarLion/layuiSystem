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
    base.operateArea();
    base.multiSelect('downpanel-global','multSelects1-global','orderTypes-global','typesGlobal');
    var depts = getCookie("depts");
    var level = getCookie("roleLevel");

   laydate.render({
        elem: '#globalBuyTimeStart',
        type: 'datetime',
        value: new Date(new Date() - 1000 * 60 * 60 * 24 * 30),
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#globalBuyTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
        value: new Date(new Date() - 1000 * 60 * 60 * 24),
    });
    laydate.render({
        elem: '#globalExTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#globalExTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#globalSignTimeStart',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#globalSignTimeEnd',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    //---------------------------------------------------订单列表----------------------------------------------
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem:'#gl',limit: 10, cellMinWidth: 80,
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiShopUrl() + "/weishoporder/getOrderList?deptIds="+depts+"&roleLevel="+level,
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        where:{
            startBuyDate:$("#globalBuyTimeStart").val(),
            endBuyDate:$("#globalBuyTimeEnd").val(),
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
            {field: 'orderStatus', align: 'center',width: 100, title: '订单状态',templet:function (e) {
                    return formatStatus(e.orderStatus);
                }},
            {field: 'shopFilialeName', title: '分公司', align: 'center',width: 160},
            {field: 'shopAreaName', title: '区域', align: 'center',width: 160},
            {field: 'ownShopName', title: '门店', align: 'center',width: 120},
            {field: 'userLoginName', title: '用户账号', align: 'center',width: 160},
            {field: 'totalMoney', title: '玄乐金额', align: 'center',width: 100},
            {field: 'totalIntegral', title: '抵扣积分', align: 'center',width: 100},
            {field: 'shopMoney', title: '商家货款', align: 'center',width: 100},
            {field: 'serviceFee', title: '管理费', align: 'center',width: 100},
            {field: 'platformFee', title: '平台服务费', align: 'center',width: 140},
            {field: 'peopleFee', title: '特约人服务费', align: 'center',width: 140},
            {field: 'referrerName', title: '特约人', align: 'center',width: 160},
            {field: 'referrerLoginName', title: '特约人账号', align: 'center',width: 160},
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
            base.close_load_layer(s);
        }
    });

    //多条件查询
    $("#checkGl").on('click',function() {
        if (!checkSearchContend($("#globalBuyTimeStart").val(),$("#globalBuyTimeEnd").val(),$("#globalExTimeStart").val(), $("#globalExTimeEnd").val(),$("#globalSignTimeStart").val(),$("#globalSignTimeEnd").val())) {
            return;
        }
        var orderStatusIds=[];
        $("input:checkbox[name='typesGlobal']:checked").each(function(e) {
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
                userLoginName:$("#userLoginName").val(),
                shopName:$("#shopName").val(),
                shopNumber:$("#shopNumber").val(),
                referrerName:$("#referrerName").val(),
                startBuyDate:$("#globalBuyTimeStart").val(),//购买开始时间
                endBuyDate:$("#globalBuyTimeEnd").val(),//购买结束时间
                startShipDate:$("#globalExTimeStart").val(),//出货开始时间
                endShipDate:$("#globalExTimeEnd").val(),//出货结束时间
                startSigningDate:$("#globalSignTimeStart").val(),//收货开始时间
                endSigningDate:$("#globalSignTimeEnd").val(),//收货结束时间
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

    //重置
    $("#resetGl").on('click',function () {
        $("#shopSelect").val('');
        $("#areaSelect").val('');
        $("#companySelect").val('');
        base.opereteReset();
        $("#orderNo").val('');
        $("#userLoginName").val('');
        $("#shopName").val('');
        $("#shopNumber").val('');
        $("#referrerName").val('');
        $("#globalBuyTimeStart").val('');
        $("#globalBuyTimeEnd").val('');
        $("#globalExTimeStart").val('');
        $("#globalExTimeEnd").val('');
        $("#globalSignTimeStart").val('');
        $("#globalSignTimeEnd").val('');
        $(".orderTypes-global").val('');
        $("input:checkbox[name='typesGlobal']:checked").each(function(e) {
            $(this).attr('checked',false)
        });

        form.render('');
    });

    //获取订单状态列表
    getOrderStatusList('statusSelect');

    //状态转换
    function formatStatus(value){
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
        var fileName = "附近小店-全球代购批量导出" + base.getFormDate();
        var url =base.apiShopUrl()+"/weishoporder/weiShopOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });

    //门店导出
    $("#referrerOrderExcel").on('click', function () {
        var fileName = "附近小店-全球代购门店导出" + base.getFormDate();
        var url =base.apiShopUrl()+"/weishoporder/referrerShopingOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });

    //公司导出
    $("#ownShopOrderExcel").on('click', function () {
        var fileName = "附近小店-全球代购公司导出" + base.getFormDate();
        var url =base.apiShopUrl()+"/weishoporder/ownShoppingOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });

    function getParamter(url,fileName) {
        if (!checkSearchContend($("#globalBuyTimeStart").val(),$("#globalBuyTimeEnd").val(),$("#globalExTimeStart").val(), $("#globalExTimeEnd").val(),$("#globalSignTimeStart").val(),$("#globalSignTimeEnd").val())) {
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
            length++;
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
        var startBuyDate=$("#globalBuyTimeStart").val();//购买开始时间
        if (startBuyDate != null && startBuyDate != '') {
            url += "&startBuyDate=" + startBuyDate;
            length++;
        }
        var endBuyDate=$("#globalBuyTimeEnd").val();//购买结束时间
        if (endBuyDate != null && endBuyDate != '') {
            url += "&endBuyDate=" + endBuyDate;
            length++;
        }
        var startShipDate=$("#globalExTimeStart").val();//出货开始时间
        if (startShipDate != null && startShipDate != '') {
            url += "&startShipDate=" + startShipDate;
            length++;
        }
        var endShipDate=$("#globalExTimeEnd").val();//出货结束时间
        if (endShipDate != null && endShipDate != '') {
            url += "&endShipDate=" + endShipDate;
            length++;
        }
        var startSigningDate=$("#globalSignTimeStart").val();//收货开始时间
        if (startSigningDate != null && startSigningDate != '') {
            url += "&startSigningDate=" + startSigningDate;
            length++;
        }
        var endSigningDate=$("#globalSignTimeEnd").val();//收货结束时间
        if (endSigningDate != null && endSigningDate != '') {
            url += "&endSigningDate=" + endSigningDate;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }

    //获取订单状态列表
    function getOrderStatusList(elem) {
        base._ajax({
            url : base.apiShopUrl() + "/weishoporder/getOrderStatusList",
            method : 'post',
            headers : {
                'xxl_sso_sessionid' : window.sessionStorage.getItem('sessionid')
            },
            success : function(data) {
                var _str = data.data;
                _html = '',
                    _el = $("#statusSelect");
                $.each(_str, function(index, item) {
                    var statusName = formatStatus(item.orderStatus);
                    _html += '<dd><input type="checkbox" name="typesGlobal" title="' + statusName + ' "value="' + item.orderStatus + ' "lay-skin="primary"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>' + statusName + '</span><i class="layui-icon layui-icon-ok"></i></div></dd>'
                });
                _el.html(_html);
                form.render();
                base.multiSelect('downpanel-global', 'multSelects1-global', 'orderTypes-global', 'typesGlobal');
            },
            error : function(res) {
                console.log(res);
            }
        })
    }
    //检验时间
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
