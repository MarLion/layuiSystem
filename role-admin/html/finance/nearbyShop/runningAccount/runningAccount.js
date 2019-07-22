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
    var depts = getCookie("depts");
    var level = getCookie("roleLevel");
    laydate.render({
        elem: '#startBuyDate',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    laydate.render({
        elem: '#endBuyDate',
        type: 'datetime',
        btns: ['confirm'],
        format: 'yyyy-MM-dd HH:mm:ss',
    });
    //---------------------------------------------------订单列表----------------------------------------------
    var tableIns = table.render({
        elem:'#treat',limit: 10, cellMinWidth: 80,
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiShopUrl() + "/financialStatistic/list?deptIds="+depts+"&roleLevel="+level,
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
            {field: 'payType', title: '交易类型', align: 'center',width: 220},
            {field: 'recordFigureBefore', title: '交易前金额', align: 'center',width: 160},
            {field: 'recordFigure', title: '交易金额', align: 'center',width: 160},
            {field: 'recordFigureAfter', title: '交易后金额', align: 'center',width: 160},
            {field: 'loginName', title: '交易账号', align: 'center',width: 150},
            {field: 'shopName', title: '门店', align: 'center',width: 100},
            {field: 'area', title: '区域', align: 'center',width: 100},
            {field: 'subCompany', title: '分公司', align: 'center',width: 100},
            {field: 'time', title: '交易时间',width: 180, align: 'center', templet: function (e) {
                    return base.toDateString(e.time)
                }
            },
            {field: 'actionName', title: '备注', align: 'center',width: 420}
        ]],
        done:function (res) {
            if (res.code == 501) {
                window.location.href = 'login.html';
                return;
            }
            console.log('表格加载完成');
        }
    });

    //多条件查询
    $("#checkTreat").on('click',function() {
        if (!checkSearchContend($("#startBuyDate").val(),$("#endBuyDate").val())) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                actionType:$("#actionType").val(),
                userLoginName:$("#userLoginName").val(),
                startBuyDate:$("#startBuyDate").val(),//购买开始时间
                endBuyDate:$("#endBuyDate").val(),//购买结束时间
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            },
            done:function () {
                base.close_load_layer(m);
            }
        });
    });

    //批量导出
    $("#traetExcel").on('click', function () {
        var fileName = "交易流水-批量导出" + base.getFormDate();
        var url = base.apiShopUrl()+ "/financialStatistic/export?deptIds=" + depts+"&roleLevel="+level;
        getParamter(url,fileName)
    });
    function getParamter(url,fileName) {
        if (!checkSearchContend($("#startBuyDate").val(),$("#endBuyDate").val())) {
            return;
        }
        var length = 0;
        var actionType=$("#actionType").val();
        if(actionType != null && actionType != '' ){
            url += "&actionType=" + actionType;
            length++;
        }
        var userLoginName=$("#userLoginName").val();
        if (userLoginName != null && userLoginName != '') {
            url += "&userLoginName=" + userLoginName;
            length++;
        }
        var startBuyDate=$("#startBuyDate").val();//购买开始时间
        if (startBuyDate != null && startBuyDate != '') {
            url += "&startBuyDate=" + startBuyDate;
            length++;
        }
        var endBuyDate=$("#endBuyDate").val();//购买结束时间
        if (endBuyDate != null && endBuyDate != '') {
            url += "&endBuyDate=" + endBuyDate;
            length++;
        }
        base.judgeDownload(url,fileName,length);
    }

    //重置
    $("#resetTreat").on('click',function () {
        $("#startBuyDate").val('');
        $("#endBuyDate").val('');
        $("#actionType").val('');
        $("#userLoginName").val('');
        form.render();
    })

    //获取交易类型列表
    getActionList();
    function getActionList(){
        base._ajax({
            url: base.apiShopUrl() + "/financialStatistic/getActionInfoList",
            dataType: "json",
            async:false,
            crossDomain:true,
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function (data) {
                var option = " <option value=\"\">-------请选择-------</option>";
                $.each(data, function (a, b) {
                    option += "<option value=" + b.actionType;
                    option += ">" + b.typeName + "</option>"
                })
                $("[name='actionType']").html(option);
                form.render('select');
            }
        })
    }
    function checkSearchContend(startTime,endTime) {
        if (startTime) {
            if (!endTime) {
                layer.alert('交易起止时间不能只选择一个',{icon:7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify){
                layer.alert("交易结束时间必须大于开始时间！",{icon:7});
                return false;
            }
        } else if (endTime) {
            layer.alert('交易起止时间不能只选择一个',{icon:7});
            return false;
        }
        return true;
    }
})
