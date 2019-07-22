layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery', 'form', 'laydate', 'base', 'table', 'laypage'], function () {
    var table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        latydate = layui.laydate,
        base = layui.base,
        laypage = layui.laypage;
    var s = base.show_load_layer();
    var tableIns = table.render({
        elem: '#business_overview',
        url: base.apiOthUrl(),
        method: 'post',
        height: 650,
        headers: {
            'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
            'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
            'te_method': 'doAction'
        },
        // page: {layout: ['count', 'prev', 'page', 'next', 'skip', 'limit']},
        where: {
            actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getBusinessOverviewList',
            parameters: "{}"
        },
        parseData: function (res) {
            return {
                "code": 0,
                "data": res.data,
                "count": 0
            }
        },
        cols: [[
            {
                field: '',
                title: '序号',
                align: 'center',
                fixed: 'left',
                width: 60,
                templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'time', title: '日期', align: 'center', width: 130, fixed: 'left'},
            {field: 'week', title: '星期', align: 'center', width: 100, fixed: 'left'},
            {
                field: 'groupJxbTotal', title: '玄乐总额', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.groupJxbTotal);
                }
            },
            {
                field: 'allIntegral', title: '积分总额', align: 'center', width: 150, templet: function (e) {
                    return base.formattedNumber(e.allIntegral);
                }
            },
            {
                field: 'loginNum', title: '登录人数', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.loginNum);
                }
            },
            {
                field: 'signNum', title: '店内签到', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.signNum);
                }
            },
            {
                field: 'addEquiNum', title: '新增设备', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.addEquiNum);
                }
            },
            {
                field: 'addMemberNum', title: '新增会员', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.addMemberNum);
                }
            },
            {
                field: 'marketingTotal', title: '营销总额', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.marketingTotal);
                }
            },
            {
                field: 'gameIncomeTotal', title: '游戏收益', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.gameIncomeTotal);
                }
            },
            {
                field: 'serviceTotal', title: '积分兑换', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.serviceTotal);
                }
            },
            {
                field: 'groupBuyTotal0', title: '垄上扶贫', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.groupBuyTotal0);
                }
            },
            {
                field: 'groupBuyTotal1', title: '专享商城', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.groupBuyTotal1);
                }
            },
            {
                field: 'healthTotal', title: '保健产品', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.healthTotal);
                }
            },
            {
                field: 'shopTotal', title: '附近小店', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.shopTotal);
                }
            },
            {
                field: 'nearShopTotal', title: '全球代购', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.nearShopTotal);
                }
            },
            {
                field: 'yyZdTotal', title: '营养指导', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.yyZdTotal);
                }
            },
            {
                field: 'healthYlTotal', title: '健康医疗', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.healthYlTotal);
                }
            },
            {
                field: 'hnTotal', title: '相亲交友', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.hnTotal);
                }
            },
            {
                field: 'liveTotal', title: '直播管理', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.liveTotal);
                }
            },
            {
                field: 'rechargeTotal', title: '充值', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.rechargeTotal);
                }
            },
            {
                field: 'drawCashTotal', title: '提现', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.drawCashTotal);
                }
            },
            {
                field: 'JjgInTotal', title: '玄乐1号转入', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.JjgInTotal);
                }
            },
            {
                field: 'JjgOutTotal', title: '玄乐1号转出', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.JjgOutTotal);
                }
            },
            {
                field: 'exclusiveProductInTotal', title: '玄乐专享转入', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.exclusiveProductInTotal);
                }
            },
            {
                field: 'exclusiveProductOutTotal', title: '玄乐专享转出', align: 'center', width: 120, templet: function (e) {
                    return base.formattedNumber(e.exclusiveProductOutTotal);
                }
            }
        ]],
        done: function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            parsePoint(['allIntegral', 'loginNum', 'signNum', 'addEquiNum', 'addMemberNum']);
            base.close_load_layer(s);
        }

    });
    updateLayuiDate('timeStart', function (value, date) {
        //console.log($("#timeStart").val());
    });
    updateLayuiDate('timeEnd', function (value, date) {
        //console.log(value);
    });

    function updateLayuiDate(cls, callback) {
        $("#" + cls).each(function () {
            latydate.render({
                elem: this,
                done: callback
            })
        })
    }

    base.operateArea();
    //店铺选择
    form.on('select(shop-select)', function (data) {
    });

    // 封装检索标题
    function setSearchTitle(obj) {
        var searchTitle = "";
        if (obj.subCompany != "" && obj.subCompany != null) {
            searchTitle += $("#companySelect").find("option:selected").text();
        }
        if (obj.area != "" && obj.area != null) {
            searchTitle += "/" + $("#areaSelect").find("option:selected").text();
        }
        if (obj.shop != "" && obj.shop != null) {
            searchTitle += "/" + $("#shopSelect").find("option:selected").text();
        }
        if (obj.startTime != "" && obj.endTime != "" && obj.startTime != null && obj.endTime != null) {
            searchTitle += " " + obj.startTime + " ~ " + obj.endTime + " 经营总览"
        }

        return searchTitle;
    }

    //点击查询
    $("#checkAccounts").on('click', function () {
        var obj = {
            subCompany: $("#companySelect").val(),//分公司id
            area: $("#areaSelect").val(),//区域id
            shop: $("#shopSelect").val(),//门店id
            startTime: $("#timeStart").val(),//开始时间
            endTime: $("#timeEnd").val()//结束时间
        };

        // 设置检索标题
        var searchTitle = setSearchTitle(obj);
        document.getElementById("searchTitle").innerText = searchTitle;

        for (var key in obj) {
            if (obj[key] == null || obj[key] == '') {
                delete obj[key];
            }
        }
        if (!checkSearchContend(obj.startTime, obj.endTime)) {
            return;
        }
        var m = base.show_load_layer();
        tableIns.reload({
            where: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getBusinessOverviewList',
                parameters: JSON.stringify(obj)
            },
            /*page: {
                curr: 1
            },*/
            done: function () {
                base.close_load_layer(m);
                parsePoint(['allIntegral', 'loginNum', 'signNum', 'addEquiNum', 'addMemberNum']);
            }
        })
    });
    //重置
    $("#reset").on('click', function () {
        $("#companySelect").val('');
        $("#areaSelect").val('');
        $("#shopSelect").val('');
        base.opereteReset();
        $("#timeStart").val('');
        $("#timeEnd").val('');
        form.render();
    });
    //批量导出
    $("#lotsExport").on('click', function () {
        if (!checkSearchContend($("#timeStart").val(), $("#timeEnd").val())) {
            return;
        }
        // table数据
        var data = table.cache.business_overview;
        //excel名
        var searchTitle = $("#searchTitle").text();
        var name;
        if (searchTitle != "" && searchTitle != null) {
            name = searchTitle;
        } else {
            name = new Date().format("yyyy-MM-dd") + " 经营总览";
        }
        //excel头部
        var firstR = {
            time: "日期",
            week: "星期",
            groupJxbTotal: "玄乐总额",
            allIntegral: "积分总额",
            loginNum: "登录人数",
            signNum: '店内签到'
            ,
            addEquiNum: '新增设备',
            addMemberNum: '新增会员',
            marketingTotal: '营销总额',
            gameIncomeTotal: '游戏收益',
            serviceTotal: '积分兑换'
            ,
            groupBuyTotal0: '垄上扶贫',
            groupBuyTotal1: '专享商城',
            healthTotal: '保健产品',
            shopTotal: '附近小店',
            yyZdTotal: '营养指导'
            ,
            healthYlTotal: '健康医疗',
            hnTotal: '相亲交友',
            liveTotal: '直播管理',
            rechargeTotal: '充值',
            drawCashTotal: '提现'
            ,
            JjgInTotal: '玄乐1号转入',
            JjgOutTotal: '玄乐1号转出',
            exclusiveProductInTotal: '玄乐专享转入',
            exclusiveProductOutTotal: '玄乐专享转出'
        };

        base.downloadExl(data, name, null, firstR, null);
        // layer.tips('Hi，我是tips,功能维护中...', '#lotsExport');
    });

    //校验搜索项是否合法
    function checkSearchContend(startTime, endTime) {
        if (startTime) {
            if (!endTime) {
                layer.alert('起止时间不能只选择一个', {icon: 7});
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end >= start;
            if (!varify) {
                layer.alert("结束时间必须大于或等于开始时间！", {icon: 7});
                return false;
            }
            if (start.getMonth() != end.getMonth()) {
                layer.alert("暂不支持跨月查询！", {icon: 7});
                return false;
            }
        } else if (endTime) {
            layer.alert('起止时间不能只选择一个', {icon: 7});
            return false;
        }
        return true;
    }

    //  合计去小数点
    function parsePoint(data) {
        var tds = $(".layui-table-total tr td");
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < tds.length; j++) {
                if (tds[j].dataset.field == data[i]) {
                    var $html = tds[j].getElementsByTagName('div')[0].innerHTML;
                    $html = $html != '' ? parseInt($html) : '';
                    tds[j].getElementsByTagName('div')[0].innerHTML = $html;
                }
            }
        }
    }
});
