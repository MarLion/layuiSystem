layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table;

    base.fourLevelAreaSelect();
    base.multiSelect('downpanel-hospital','multSelects1-hospital','orderTypes-hospital','typesHospital');
    base.multiSelect('downpanel-name','multSelects1-name','orderTypes-name','typesName');
    base.multiSelect('downpanel-order-type','multSelects1-order-type','orderTypes-order-type','typesOrderType');
    base.multiSelect('downpanel-order-status','multSelects1-order-status','orderTypes-order-status','typesOrderStatus');
    var depts = getCookie("depts");
    var level = getCookie("roleLevel");

    //规范时间选择器
    laydate.render({
        elem: '#startPayTime',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
   laydate.render({
        elem: '#endPayTime',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

   laydate.render({
        elem: '#startSendTime',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#endSendTime',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });

    var s = base.show_load_layer();
    var tableIns = table.render({
        elem:'#hm',
        method:'post',
        url: base.apiHospitalUrl() + "/healthorder/getHealthOrderList?deptIds="+depts+"&roleLevel="+level,
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        parseData:function (res) {
            return {
                "code":res.code,
                "data":res.data,
                "count":res.count
            }
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', align: 'center',width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'orderType', title: '订单类型', align: 'center',width: 160,templet:function (e) {
                    return formatStatus1(e.orderType);
                }},
            {field: 'status', align: 'center',width: 100, title: '订单状态',templet:function (e) {
                    return formatStatus2(e.status);
                }},
            {field: 'orderNo', title: '订单编号', align: 'center',width: 160},
            {field: 'packageName', title: '套餐名称', align: 'center',width: 300},
            {field: 'hospitalName', title: '所属医院', align: 'center',width: 160},
            {field: 'price', title: '玄乐金额', align: 'center',width: 100},
            {field: 'integral', title: '抵扣积分', align: 'center',width: 100},
            {field: 'userName', title: '用户姓名', align: 'center',width: 100},
            {field: 'loginName', title: '用户账号', align: 'center',width: 150},
            {field: 'shopParentName', title: '地区', align: 'center',width: 100},
            {field: 'companyName', title: '分公司', align: 'center',width: 150},
            {field: 'areaName', title: '区域', align: 'center',width: 150},
            {field: 'shopName', title: '门店', align: 'center',width: 160},
            {field: 'payTime', title: '下单时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.payTime)
                }
            },
            {field: 'consumeTime', title: '送检时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.consumeTime)
                }
            },
            {field: 'refundTime', title: '退款时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.refundTime)
                }
            }
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
    $("#checkhm").on('click',function() {
        if (!checkSearchContend($("#startPayTime").val(),$("#endPayTime").val(),$("#startSendTime").val(), $("#endSendTime").val())) {
            return;
        }
        //订单状态
        var orderStatusIds=[];
        $("input:checkbox[name='typesOrderStatus']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
       //所属医院
        var hospitalIds=[];
        $("input:checkbox[name='typesHospital']:checked").each(function(e) {
            hospitalIds.push($(this).val());//向数组中添加元素
        });
        hospitalIds=hospitalIds.join(',');//将数组元素连接起来以构建一个字符串
       //订单类型
        var orderTypeIds=[];
        $("input:checkbox[name='typesOrderType']:checked").each(function(e) {
            orderTypeIds.push($(this).val());//向数组中添加元素
        });
        orderTypeIds=orderTypeIds.join(',');//将数组元素连接起来以构建一个字符串
        //套餐
        var packageIds=[];
        $("input:checkbox[name='typesName']:checked").each(function(e) {
            packageIds.push($(this).val());//向数组中添加元素
        });
        var startPayTime=$("#startPayTime").val();//购买开始时间
        var endPayTime=$("#endPayTime").val();//购买结束时间
        var startSendTime=$("#startSendTime").val();//送检开始时间
        var endSendTime=$("#endSendTime").val();//送检结束时间

        packageIds=packageIds.join(',');//将数组元素连接起来以构建一个字符串
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                ownShop:$("#shopSelect").val(),//门店id
                area:$("#areaSelect").val(),//区域id
                cityNo:$("#companySelect").val(),//分公司id
                orderStatusIds:orderStatusIds,//订单状态
                hospitalIds:hospitalIds,
                orderTypeIds:orderTypeIds,
                packageIds:packageIds,
                shopParentId:$("#shopArea").val(),
                orderNo:$("#orderNo").val(),
                loginName:$("#loginName").val(),
                userName:$("#userName").val(),
                startPayTime:startPayTime,//购买开始时间
                endPayTime:endPayTime,//购买结束时间
                startSendTime:startSendTime,//送检开始时间
                endSendTime:endSendTime,//送检结束时间
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });

    });
    //获取套餐列表
    getPackageList('packageSelect');
    //动态获取医院列表
    getHospitalList('hospitalSelect');
    //重置
    $("#resethm").on('click',function () {
        $("#shopSelect").val('');
        $("#areaSelect").val('');
        $("#companySelect").val('');
        $("#orderNo").val('');
        $("#loginName").val('');
        $("#userName").val('');
        $("#shopArea").val('');
        $("#startPayTime").val('');
        $("#endPayTime").val('');
        $("#startSendTime").val('');
        $("#endSendTime").val('');
        $(".orderTypes-hospital").val('');
        base.fourReset();
        $("input:checkbox[name='typesHospital']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        $(".orderTypes-name").val('');
        $("input:checkbox[name='typesName']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        $(".orderTypes-order-type").val('');
        $("input:checkbox[name='typesOrderType']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        $(".orderTypes-order-status").val('');
        $("input:checkbox[name='typesOrderStatus']:checked").each(function(e) {
            $(this).attr('checked',false)
        });
        form.render('');
    });

    //状态转换
    function formatStatus1(value){
        if (value == 0){
            return '玄乐币';
        } else if (value == 1){
            return '医保卡';
        }else if (value == 2){
            return '购买赠送';
        }
    }
    function formatStatus2(value){
        if (value == 0){
            return '已支付';
        } else if (value == 1){
            return '已消费';
        }else if (value == 2){
            return '已退款';
        }
    }

    //批量导出
    $("#healthOrderToEcel").on('click', function () {
        var fileName = "健康医疗-批量导出" + base.getFormDate();
        var url =  base.apiHospitalUrl()+"/healthorder/healthOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });
    //门店导出
    $("#healthOwnShopToEcel").on('click', function () {
        var fileName = "健康医疗-门店导出" + base.getFormDate();
        var url =  base.apiHospitalUrl()+"/healthorder/ownShoppingOrderToExcel?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });
    function getParamter(url,fileName) {
        if (!checkSearchContend($("#startPayTime").val(),$("#endPayTime").val(),$("#startSendTime").val(), $("#endSendTime").val())) {
            return;
        }
        var length = 0;
        //订单状态
        var orderStatusIds=[];
        $("input:checkbox[name='typesOrderStatus']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        if(orderStatusIds!=null){
            url += "&orderStatusIds=" + orderStatusIds;
            length++;
        }
        //所属医院
        var hospitalIds=[];
        $("input:checkbox[name='typesHospital']:checked").each(function(e) {
            hospitalIds.push($(this).val());//向数组中添加元素
        });
        hospitalIds=hospitalIds.join(',');//将数组元素连接起来以构建一个字符串
        if(hospitalIds!=null){
            url += "&hospitalIds=" + hospitalIds;
            length++;
        }
        //订单类型
        var orderTypeIds=[];
        $("input:checkbox[name='typesOrderType']:checked").each(function(e) {
            orderTypeIds.push($(this).val());//向数组中添加元素
        });
        orderTypeIds=orderTypeIds.join(',');//将数组元素连接起来以构建一个字符串
        if(orderTypeIds!=null){
            url += "&orderTypeIds=" + orderTypeIds;
            length++;
        }
        //套餐
        var packageIds=[];
        $("input:checkbox[name='typesName']:checked").each(function(e) {
            packageIds.push($(this).val());//向数组中添加元素
        });
        if(packageIds!=null){
            url += "&packageIds=" + packageIds;
            length++;
        }
        var shopParentId=$("#shopArea").val();
        if(shopParentId != null){
            url += "&shopParentId=" + shopParentId;
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
        var loginName=$("#loginName").val();
        if (loginName != null && loginName != '') {
            url += "&loginName=" + loginName;
            length++;
        }
        var userName=$("#userName").val();
        if (userName != null && userName != '') {
            url += "&userName=" + userName;
            length++;
        }
        var startPayTime=$("#startPayTime").val();//购买开始时间
        if (startPayTime != null && startPayTime != '') {
            url += "&startPayTime=" + startPayTime;
            length++;
        }
        var endPayTime=$("#endPayTime").val();//购买开始时间
        if (endPayTime != null && endPayTime != '') {
            url += "&endPayTime=" + endPayTime;
            length++;
        }
        var startSendTime=$("#startSendTime").val();//购买结束时间
        if (startSendTime != null && startSendTime != '') {
            url += "&startSendTime=" + startSendTime;
            length++;
        }
        var endSendTime=$("#endSendTime").val();//购买结束时间
        if (endSendTime != null && endSendTime != '') {
            url += "&endSendTime=" + endSendTime;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }

    /*//门店汇总导出
    $("#healthOwnShopToEcel").on('click',function () {
        //订单状态
        var orderStatusIds=[];
        $("input:checkbox[name='typesOrderStatus']:checked").each(function(e) {
            orderStatusIds.push($(this).val());//向数组中添加元素
        });
        orderStatusIds=orderStatusIds.join(',');//将数组元素连接起来以构建一个字符串
        //所属医院
        var hospitalIds=[];
        $("input:checkbox[name='typesHospital']:checked").each(function(e) {
            hospitalIds.push($(this).val());//向数组中添加元素
        });
        hospitalIds=hospitalIds.join(',');//将数组元素连接起来以构建一个字符串
        //订单类型
        var orderTypeIds=[];
        $("input:checkbox[name='typesOrderType']:checked").each(function(e) {
            orderTypeIds.push($(this).val());//向数组中添加元素
        });
        orderTypeIds=orderTypeIds.join(',');//将数组元素连接起来以构建一个字符串
        //套餐
        var packageIds=[];
        $("input:checkbox[name='typesName']:checked").each(function(e) {
            packageIds.push($(this).val());//向数组中添加元素
        });
        var ownShop=$("#shopSelect").val();//门店id
        var area=$("#areaSelect").val();//区域id
        var cityNo=$("#companySelect").val();//分公司id
        var shopParentId=$("#shopArea").val();
        var orderNo=$("#orderNo").val();
        var loginName=$("#loginName").val();
        var userName=$("#userName").val();
        var startPayTime=$("#startPayTime").val();//购买开始时间
        var endPayTime=$("#endPayTime").val();//购买结束时间
        var startSendTime=$("#startSendTime").val();//送检开始时间
        var endSendTime=$("#endSendTime").val();//送检结束时间
        if (startPayTime != '' && endPayTime != '') {
            //时间戳比较
            var startTime = Date.parse(startPayTime);
            var endTime = Date.parse(endPayTime);
            if (endTime < startTime) {
                layer.msg("下单结束时间必须大于开始时间！");
                return;
            }
        }

        if (startSendTime != '' && endSendTime != '') {
            //时间戳比较
            var startTime1 = Date.parse(startSendTime);
            var endTime1 = Date.parse(endSendTime);
            if (endTime1 < startTime1) {
                layer.msg("送检结束时间必须大于开始时间！");
                return;
            }
        }
        var healthOwnShopOrderExportCheck = getCookie("healthOwnShopOrderExportCheck");
        if (healthOwnShopOrderExportCheck == '') {
            location.href = base.apiHospitalUrl()+"/healthorder/ownShoppingOrderToExcel?deptIds="+depts+"&ownShopNo="+ownShop+
                "&areaNo="+area+"&cityNo="+cityNo+"&orderStatusIds="+orderStatusIds+"&hospitalIds="+hospitalIds+"&roleLevel="+level+
                "&orderTypeIds="+orderTypeIds+"&packageIds="+packageIds+"&orderNo="+orderNo+"&loginName="+loginName+
                "&shopParentId="+shopParentId+"&userName="+userName+"&startPayTime="+startPayTime+"&endPayTime="+endPayTime+
                "&startSendTime="+startSendTime+"&endSendTime="+endSendTime;
            setCookie("healthOwnShopOrderExportCheck","healthOwnShopOrderExportCheck",30)
        }else {
            layer.open({
                title: '温馨提示'
                ,content: '请勿频繁点击导出按钮'
                ,area: ['270px', '160px']
                ,btnAlign: 'c'
                ,btn: ['我知道了']
                ,yes: function(index, layero){
                    layer.close(index);
                }
            });
        }
    });*/

   //获取套餐列表
    function getPackageList(elem) {
        base._ajax({
            url : base.apiHospitalUrl()+ "/healthorder/getPackageList",
            method : 'post',
            headers : {
                'xxl_sso_sessionid' : window.sessionStorage.getItem('sessionid')
            },
            success : function(data) {
                var _str = data.data;
                _html = '',
                    _el = $("#packageSelect");
                $.each(_str, function(index, item) {
                    _html += '<dd><input type="checkbox" name="typesName" title="' + item.packageName + ' "value="' + item.id + ' "lay-skin="primary"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>' + item.packageName + '</span><i class="layui-icon layui-icon-ok"></i></div></dd>'
                });
                _el.html(_html);
                form.render();
                base.multiSelect('downpanel-name', 'multSelects1-name', 'orderTypes-name', 'typesName');
            },
            error : function(res) {
                console.log(res);
            }
        })
    }

    //获取医院列表
    function getHospitalList(elem) {
        base._ajax({
            url : base.apiHospitalUrl() + "/healthorder/getHospitalList",
            method : 'post',
            headers : {
                'xxl_sso_sessionid' : window.sessionStorage.getItem('sessionid')
            },
            success : function(data) {
                var _str = data.data;
                _html = '',
                    _el = $("#hospitalSelect");
                $.each(_str, function(index, item) {
                    _html += '<dd><input type="checkbox" name="typesHospital" title="' + item.hospitalName + ' "value="' + item.id + ' "lay-skin="primary"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>' + item.hospitalName + '</span><i class="layui-icon layui-icon-ok"></i></div></dd>'
                });
                _el.html(_html);
                form.render();
                base.multiSelect('downpanel-hospital', 'multSelects1-hospital', 'orderTypes-hospital', 'typesHospital');
            },
            error : function(res) {
                console.log(res);
            }
        })
    }
    function checkSearchContend(startTime,endTime,startTime2,endTime2) {
        if (startTime) {
            if (!endTime) {
                layer.alert('下单起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("下单结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('下单起止时间不能只选择一个',{icon:7});
            return false;
        }
        if (startTime2) {
            if (!endTime2) {
                layer.alert('送检起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime2);
            var end = new Date(endTime2);
            var varify = end > start;
            if (!varify){
                layer.alert("送检结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime2) {
            layer.alert('送检起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
});
