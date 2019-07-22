layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery', 'form', 'laydate', 'base', 'table', 'element', 'tab'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table = layui.table,
        element = layui.element;

    var roleLevel = getCookie("roleLevel");
    $(function() {
        if(roleLevel==1){
            $("#xuanlebiTotal").html('分公司玄乐币总额');
            $("#pointanNum").html('分公司积分总额');
            $("#bussinessNum").html('分公司经营情况概要');
            $("#xuanlebiNum").html('分公司平台玄乐币情况');
            $("#gameXuanlebi").html('分公司游戏玄乐币情况');
            $("#xuanleNum").html('分公司玄乐管理情况');
            $("#personName").html('分公司人员情况');
            $("#memberName").html('分公司总会员人数');
        }else if(roleLevel==2){
            $("#xuanlebiTotal").html('区域玄乐币总额');
            $("#pointanNum").html('区域积分总额');
            $("#bussinessNum").html('区域经营情况概要');
            $("#xuanlebiNum").html('区域平台玄乐币情况');
            $("#gameXuanlebi").html('区域游戏玄乐币情况');
            $("#xuanleNum").html('区域玄乐管理情况');
            $("#personName").html('区域人员情况');
            $("#memberName").html('区域总会员人数');
        }else if(roleLevel==3){
            $("#xuanlebiTotal").html('门店玄乐币总额');
            $("#pointanNum").html('门店积分总额');
            $("#bussinessNum").html('门店经营情况概要');
            $("#xuanlebiNum").html('门店平台玄乐币情况');
            $("#gameXuanlebi").html('门店游戏玄乐币情况');
            $("#xuanleNum").html('门店玄乐管理情况');
            $("#personName").html('门店人员情况');
            $("#memberName").html('门店总会员人数');
        }else{
            $("#xuanlebiTotal").html('集团玄乐币总额');
            $("#pointanNum").html('集团积分总额');
            $("#bussinessNum").html('集团经营情况概要');
            $("#xuanlebiNum").html('集团平台玄乐币情况');
            $("#gameXuanlebi").html('集团游戏玄乐币情况');
            $("#xuanleNum").html('集团玄乐管理情况');
            $("#personName").html('集团人员情况');
            $("#memberName").html('集团总会员人数');
        }
    });
    //初始化时间
    updateLayuiDate("chooseTime");
    //初始化集团玄乐币区域
    jtXuanleEcharts();
    //初始化集团积分区域
    jtIntegralData();
    //初始化平台玄乐币情况区域 + 游戏玄乐币情况 + 玄乐币管理情况 + 集团经营情况概要
    platformXuanleData();
    //初始化平台总会员人数
    platformMemberData();
    //初始化公司人员情况
    companyPersonnelData();
    $("#platXuanle").on('click', '.plat-xuanle', function (e) {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src + "?time=" + time;
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    //积分页面跳转
    $("#platPoints").on('click', '.plat-points', function (e) {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src + "?time=" + time;
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    //游戏收益
    $("#gameXuanle").on('click', '.game-xuanle', function (e) {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src + "?time=" + time;
        //获得cookie中的值
        var depts = getCookie("depts");
        var roleLevel = getCookie("roleLevel");
        if(depts!='null'){
            //0-管理员 1-分公司，2-区域 3-门店
            if(roleLevel==1){
                src = 'html/finance/overView/xuanleGame/xgCompany/xgCompany.html?time='+time+'&deptId=1';
            }else if(roleLevel==2){
                src = 'html/finance/overView/xuanleGame/xgArea/xgArea.html?time='+time+'&deptId=1';
            }else if(roleLevel==3){
                src = 'html/finance/overView/xuanleGame/xgShop/xgShop.html?time='+time+'&deptId=1';
            }

        }
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    //玄乐币管理跳转
    $("#xuanleManage").on('click','.xuanle-manage',function (e) {
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src+"?time="+ time;
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    //营销总额跳转
    $("#manageOver").on('click','.manage-over',function (e) {
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src+"?time="+ time;
        //获得cookie中的值
        var depts = getCookie("depts");
        var roleLevel = getCookie("roleLevel");
        if(depts!='null'){
            //0-管理员 1-分公司，2-区域 3-门店
            if(roleLevel==1){
                src = 'html/finance/overView/managementView/managementViewSubCompany/managementViewSubCompany.html?searchTime='+time+'&deptId='+1
            }else if(roleLevel==2){
                src = 'html/finance/overView/managementView/managementViewArea/managementViewArea.html?searchTime='+time+'&deptId=1';
            }else if(roleLevel==3){
                src = 'html/finance/overView/managementView/managementViewShop/managementViewShop.html?searchTime='+time+'&deptId=1';
            }
            //根据级别跳转页面

        }
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    $("#personNum").on('click',function (e) {
        //console.log(11);
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src+"?time="+ time;
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });
    //会员跳转
    $(".people-num").on('click',function (e) {
        var time = $("#chooseTime").val();
        if (time == ""){
            return layer.msg("请选择日期！");
        }
        var title = e.currentTarget.dataset.title;
        var src = e.currentTarget.dataset.src+"?time="+ time;
        parent.tab.tabAdd({ //iframe
            href: src,
            // icon: '',
            title: title
        })
    });

    //集团玄乐币区域
    function jtXuanleEcharts() {
        var time = $("#chooseTime").val();
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getJtXuanleData',
                viewId: '1',
                parameters: "{'time': " + time + "}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                var names = [];
                //集团玄乐币总额
                document.getElementById("groupJxbTotal").innerHTML = base.formattedNumber(_obj.groupJxbTotal);
                var totalList = _obj.totalList;
                for (var i = 0; i < totalList.length; i++) {
                    names[i] = totalList[i].name+"："+base.formattedNumber(totalList[i].value);
                    totalList[i].name = totalList[i].name+"："+base.formattedNumber(totalList[i].value);
                }
                var nums = totalList;
                var oneChart = echarts.init(document.getElementById('contentOne'));
                //---玄乐币总额图表---
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: '55%',
                        top: 'middle',
                        textStyle:{
                            fontSize:16,
                            lineHeight:20
                        },
                        data: names
                    },
                    series: [
                        {
                            name: '玄乐币数量：',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ['30%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    formatter:"{b}\n({d}%)"
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: nums
                        }
                    ],
                    color: ['#F2637B', '#FBD437', '#3AA1FF']
                };
                oneChart.setOption(option, true);
            },
            error: function (mes) {
                console.log(mes);
            }
        })
    }

    //集团积分区域
    function jtIntegralData() {
        var m = base.show_load_layer();
        var time = $("#chooseTime").val();
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getJtIntegralData',
                viewId: '1',
                parameters: "{'time': " + time + "}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                //集团积分总额
                var groupIntegralTotal = base.formattedNumber(_obj.allIntegral);
                document.getElementById("groupIntegralTotal").innerHTML = groupIntegralTotal;

                //当日增长
                var integralAdd = base.formattedNumber(_obj.addIntegral + _obj.addGameIntegral);
                document.getElementById("integralAdd").innerHTML = integralAdd;

                //当日消耗
                var integralExpend = base.formattedNumber(_obj.subAllIntegral + _obj.subGameIntegral);
                document.getElementById("integralExpend").innerHTML = integralExpend;

                //平台增长
                var platformIntegralAdd = base.formattedNumber(_obj.addIntegral);
                var platformIntegralRise = _obj.addIntegralRise;
                document.getElementById("platformIntegralAdd").innerHTML = platformIntegralAdd;
                changeColor(platformIntegralRise,'plat-int-icon','platformIntegralRise');
                document.getElementById("platformIntegralRise").innerHTML = platformIntegralRise;

                //游戏增长
                var gameIntegralAdd = base.formattedNumber(_obj.addGameIntegral);
                var gameIntegralRise = _obj.addGameIntegralRise;
                document.getElementById("gameIntegralAdd").innerHTML = gameIntegralAdd;
                changeColor(gameIntegralRise,'game-int-icon','gameIntegralRise');
                document.getElementById("gameIntegralRise").innerHTML = gameIntegralRise;

                //平台消耗
                var platformIntegralExpend = base.formattedNumber(_obj.subAllIntegral);
                var platformIntegralExpendRise = _obj.subAllIntegralRise;
                document.getElementById("platformIntegralExpend").innerHTML = platformIntegralExpend;
                changeColor(platformIntegralExpendRise,'plat-int-exp','platformIntegralExpendRise');
                document.getElementById("platformIntegralExpendRise").innerHTML = platformIntegralExpendRise;

                //游戏增长
                var gameIntegralExpend = base.formattedNumber(_obj.subGameIntegral);
                var gameIntegralExpendRise = _obj.subGameIntegralRise;
                document.getElementById("gameIntegralExpend").innerHTML = gameIntegralExpend;
                changeColor(gameIntegralExpendRise,'game-int-exp','gameIntegralExpendRise');
                document.getElementById("gameIntegralExpendRise").innerHTML = gameIntegralExpendRise;
                base.close_load_layer(m);
            },
        error: function (mes) {
            base.close_load_layer(m);
            console.log(mes);
            }
        })
    }


    //平台玄乐币情况区域 + 游戏玄乐币情况 + 玄乐币管理情况 + 集团经营情况概要
    function platformXuanleData() {
        var time = $("#chooseTime").val();
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getPlatformXuanleData',
                viewId: '1',
                parameters: "{'time': " + time + "}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                //*****************************平台玄乐币情况**************************//
                //积分兑换
                var serviceTotal = _obj.serviceTotal;
                var serviceRise = _obj.serviceRise;
                document.getElementById("serviceTotal").innerHTML = serviceTotal;
                changeColor(serviceRise,'points-exchange-icon','serviceRise');
                document.getElementById("serviceRise").innerHTML = serviceRise;

                //垄上扶贫
                var groupBuyTotal0 = _obj.groupBuyTotal0;
                var groupBuyRise0 = _obj.groupBuyRise0;
                document.getElementById("groupBuyTotal0").innerHTML = groupBuyTotal0;
                changeColor(groupBuyRise0,'ls-shopping-icon','groupBuyRise0');
                document.getElementById("groupBuyRise0").innerHTML = groupBuyRise0;

                //专享商城
                var groupBuyTotal1 = _obj.groupBuyTotal1;
                var groupBuyRise1 = _obj.groupBuyRise1;
                document.getElementById("groupBuyTotal1").innerHTML = groupBuyTotal1;
                changeColor(groupBuyRise1,'vip-market-icon','groupBuyRise1');
                document.getElementById("groupBuyRise1").innerHTML = groupBuyRise1;

                //保健产品
                var healthTotal = _obj.healthTotal;
                var healthRise = _obj.healthRise;
                document.getElementById("healthTotal").innerHTML = healthTotal;
                changeColor(healthRise,'health-product-icon','healthRise');
                document.getElementById("healthRise").innerHTML = healthRise;

                //附近小店
                var nearShopTotal = _obj.nearShopTotal;
                var nearShopRise = _obj.nearShopRise;
                document.getElementById("nearShopTotal").innerHTML = nearShopTotal;
                changeColor(nearShopRise,'nearby-shop-icon','nearShopRise');
                document.getElementById("nearShopRise").innerHTML = nearShopRise;


                //全球代购
                var shopTotal = _obj.shopTotal;
                var shopRise = _obj.shopRise;
                document.getElementById("shopTotal").innerHTML = shopTotal;
                changeColor(shopRise,'nearby-shop-icon','shopRise');
                document.getElementById("shopRise").innerHTML = shopRise;

                //提现
                var drawCashTotal = _obj.drawCashTotal;
                var drawCashRise = _obj.drawCashRise;
                document.getElementById("drawCashTotal").innerHTML = drawCashTotal;
                changeColor(drawCashRise,'cash-out-icon','drawCashRise');
                document.getElementById("drawCashRise").innerHTML = drawCashRise;

                //营养指导
                var yyZdTotal = _obj.yyZdTotal;
                var yyZdRise = _obj.yyZdRise;
                document.getElementById("yyZdTotal").innerHTML = yyZdTotal;
                changeColor(yyZdRise,'nut-guide-icon','yyZdRise');
                document.getElementById("yyZdRise").innerHTML = yyZdRise;

                //健康医疗
                var healthYlTotal = _obj.healthYlTotal;
                var healthYlRise = _obj.healthYlRise;
                document.getElementById("healthYlTotal").innerHTML = healthYlTotal;
                changeColor(healthYlRise,'health-medice-icon','healthYlRise');
                document.getElementById("healthYlRise").innerHTML = healthYlRise;

                //相亲交友
                var hnTotal = _obj.hnTotal;
                var hnRise = _obj.hnRise;
                document.getElementById("hnTotal").innerHTML = hnTotal;
                changeColor(hnRise,'blind-date-icon','hnRise');
                document.getElementById("hnRise").innerHTML = hnRise;

                //直播管理
                var liveTotal = _obj.liveTotal;
                var liveRise = _obj.liveRise;
                document.getElementById("liveTotal").innerHTML = liveTotal;
                changeColor(liveRise,'live-manage-icon','liveRise');
                document.getElementById("liveRise").innerHTML = liveRise;

                //充值
                var rechargeTotal = _obj.rechargeTotal;
                var rechargeRise = _obj.rechargeRise;
                document.getElementById("rechargeTotal").innerHTML = rechargeTotal;
                changeColor(rechargeRise,'recharge-icon','rechargeRise');
                document.getElementById("rechargeRise").innerHTML = rechargeRise;

                //*****************************游戏玄乐币情况**************************//
                //玄乐游戏
                var gameIncomeTotal = _obj.gameIncomeTotal;
                var gameIncomeRise = _obj.gameIncomeRise;
                document.getElementById("gameIncomeTotal").innerHTML = gameIncomeTotal;
                changeColor(gameIncomeRise,'xuanle-game-icon','gameIncomeRise');
                document.getElementById("gameIncomeRise").innerHTML = gameIncomeRise;

                //*****************************玄乐币管理情况**************************//
                //玄乐1号转入
                var JjgJxbInTotal = _obj.JjgInTotal;
                var JjgJxbInRise = _obj.JjgInRise;
                document.getElementById("JjgJxbInTotal").innerHTML = JjgJxbInTotal;
                changeColor(JjgJxbInRise,'xuanle-one-in-icon','JjgJxbInRise');
                document.getElementById("JjgJxbInRise").innerHTML = JjgJxbInRise;

                //玄乐1号转出
                var JjgJxbOutTotal = _obj.JjgOutTotal;
                var JjgJxbOutRise = _obj.JjgOutRise;
                document.getElementById("JjgJxbOutTotal").innerHTML = JjgJxbOutTotal;
                changeColor(JjgJxbOutRise,'xuanle-one-out-icon','JjgJxbOutRise');
                document.getElementById("JjgJxbOutRise").innerHTML = JjgJxbOutRise;

                //玄乐专享转入
                var exclusiveProductInTotal = _obj.exclusiveProductInTotal;
                var exclusiveProductInRise = _obj.exclusiveProductInRise;
                document.getElementById("exclusiveProductInTotal").innerHTML = exclusiveProductInTotal;
                changeColor(exclusiveProductInRise,'xuanle-vip-in-icon','exclusiveProductInRise');
                document.getElementById("exclusiveProductInRise").innerHTML = exclusiveProductInRise;

                //玄乐专享转出
                var exclusiveProductOutTotal = _obj.exclusiveProductOutTotal;
                var exclusiveProductOutRise = _obj.exclusiveProductOutRise;
                document.getElementById("exclusiveProductOutTotal").innerHTML = exclusiveProductOutTotal;
                changeColor(exclusiveProductOutRise,'xuanle-vip-out-icon','exclusiveProductOutRise');
                document.getElementById("exclusiveProductOutRise").innerHTML = exclusiveProductOutRise;

                //*****************************集团经营情况概要**************************//
                //营业收入总额
                var marketingTotal = _obj.marketingTotal;
                var marketingRise = _obj.marketingRise;
                document.getElementById("marketingTotal").innerHTML = base.formattedNumber(marketingTotal);
                changeColor(marketingRise,'market-ing-icon','marketingRise');
                document.getElementById("marketingRise").innerHTML = marketingRise;
                var total_s =  parseFloat(marketingRise) >=0 ? 'icon/icon_5.png' : 'icon/icon_6.png';
                $("#totalImg").attr('src',total_s);
            },
            error: function (mes) {
                console.log(mes);
            }
        })
    }

    //平台总会员人数
    function platformMemberData() {
        var time = $("#chooseTime").val();
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getPlatformMemberData',
                viewId: '1',
                parameters: "{'time': " + time + "}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                //平台总会员人数
                var memberNum = _obj.memberNum;
                document.getElementById("memberNum").innerHTML = base.formattedNumber(memberNum);

                //当日店内签到人数
                var signNum = _obj.signNum;
                var signNumRise = _obj.signNumRise;
                document.getElementById("signNum").innerHTML = signNum;
                changeColor(signNumRise,'sign-num-icon','signNumRise');
                document.getElementById("signNumRise").innerHTML = signNumRise;

                //当日登录人数
                var loginNum = _obj.loginNum;
                var loginNumRise = _obj.loginNumRise;
                document.getElementById("loginNum").innerHTML = loginNum;
                changeColor(loginNumRise,'login-num-icon','loginNumRise');
                document.getElementById("loginNumRise").innerHTML = loginNumRise;

                //当日新增会员人数
                var addMemberNum = _obj.addMemberNum;
                var addMemberNumRise = _obj.addMemberNumRise;
                document.getElementById("addMemberNum").innerHTML = addMemberNum;
                changeColor(addMemberNumRise,'add-vip-icon','addMemberNumRise');
                document.getElementById("addMemberNumRise").innerHTML = addMemberNumRise;

                //当日新增设备数
                var addEquiNum = _obj.addEquiNum;
                var addEquiNumRise = _obj.addEquiNumRise;
                document.getElementById("addEquiNum").innerHTML = addEquiNum;
                changeColor(addEquiNumRise,'add-equi-icon','addEquiNumRise');
                document.getElementById("addEquiNumRise").innerHTML = addEquiNumRise;


            },
            error: function (mes) {
                console.log(mes);
            }
        })
    }

    //公司人员情况
    function companyPersonnelData() {
        base._ajax({
            url: base.apiOthUrl(),
            data: {
                actionName: 'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAnalysisAction$getCompanyPersonnelData',
                viewId: '1',
                parameters: "{}"
            },
            headers: {
                'xxl_sso_sessionid': window.sessionStorage.getItem('sessionid'),
                'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success: function (res) {
                var _obj = res.data;
                //集团总人员数
                document.getElementById("personNum").innerHTML = base.formattedNumber(_obj.personNum);
                var names = [];
                for (var i = 0; i<_obj.numList.length;i++){
                    names[i] = _obj.numList[i].name+'：'+_obj.numList[i].value;
                    _obj.numList[i].name =  _obj.numList[i].name+'：'+_obj.numList[i].value;
                }
                var nums = _obj.numList;
                var perChart = echarts.init(document.getElementById('perContain'));
                //----公司人员图表--
                var perOptions = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 20,
                        top: 20,
                        bottom: 20,
                        data:names,
                    },
                    series: [
                        {
                            name: '人员情况',
                            type: 'pie',
                            // radius : '50%',
                            center: ['30%', '50%'],
                            data: nums,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                show:false,
                                color:'#54657E'
                            }
                        }
                    ],
                    // color: ['#0BE3F5', '#FFFD03', '#3F98FD', '#FD9D73']
                };
                perChart.setOption(perOptions, true);

            },
            error: function (mes) {
                console.log(mes);
            }
        })
    }

    function updateLayuiDate(cls) {
        $("#" + cls).each(function () {
            laydate.render({
                elem: this,
                type: 'date',
                max: getNowFormatDate(),
                trigger: "click",
                format: 'yyyy-MM-dd',
                value: getNowFormatDate(),
                done: function (value, date) {
                    jtXuanleEcharts();
                    jtIntegralData();
                    platformXuanleData();
                    platformMemberData();
                    companyPersonnelData();
                }
            })
        })
    }

    //**********************************************************************
    //页面--前一天
    //**********************************************************************
    $("#prev_day").on("click", function () {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        var dt = new Date(time);
        $("#chooseTime").val(new Date(dt.setDate(dt.getDate() - 1)).Format("yyyy-MM-dd"));
        jtXuanleEcharts();
        jtIntegralData();
        platformXuanleData();
        platformMemberData();
        companyPersonnelData();
    });
    //**********************************************************************
    //页面--后一天
    //**********************************************************************
    $("#next_day").on("click", function () {
        var time = $("#chooseTime").val();
        if (time == "") {
            return layer.msg("请选择日期！");
        }
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        var dt = new Date(time);
        var date_next = new Date(dt.setDate(dt.getDate() + 1)).Format("yyyy-MM-dd");
        var date_today = getNowFormatDate();
        var arys1 = new Array();
        var arys2 = new Array();
        arys1 = date_today.split('-');
        var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
        arys2 = date_next.split('-');
        var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
        if (sdate < edate) {
            layer.alert(
                "抱歉,您选择的日期暂无数据！"
                , {
                    icon: 2,
                    time: 2000
                });
            return false;
        } else {
            $("#chooseTime").val(date_next);
            jtXuanleEcharts();
            jtIntegralData();
            platformXuanleData();
            platformMemberData();
            companyPersonnelData();
            return true;
        }
    })

    //获取当前日期的前一天作为初始值
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //当前月
        var strDate = date.getDate() - 1; //前一天
        var isRun = year % 400 == 0 && year % 100 != 0 || year % 400 == 0; //是否闰年
        var bigMonth = [1, 3, 5, 7, 8, 10, 12]; //大月
        var smallMonth = [4, 6, 9, 11];//小月
        var last = month - 1; //上个月
        if (strDate == 0) {
            if (bigMonth.indexOf(last) != -1) {
                strDate = 31;
            }
            if (smallMonth.indexOf(last) != -1) {
                strDate = 30
            }
            if (last == 2) {
                if (isRun) {
                    strDate = 29;
                } else {
                    strDate = 28;
                }
            }
            month = month == 1 ? 12 : last;
        }
        month = month > 9 ? month : '0' + month;
        strDate = strDate > 9 ? strDate : '0' + strDate;
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    //改变颜色图标
    function changeColor(n,cl,id) {
        var i = $('.'+cl);
        var s = $("#"+id);
        n = parseFloat(n);
        if (n > 0) {
            i.attr('src','icon/up.png');
            s.removeClass('col-g').removeClass('col-b').addClass('col-r');
        } else if (n < 0) {
            i.attr('src','icon/down.png');
            s.removeClass('col-r').removeClass('col-b').addClass('col-g');
        } else {
            i.attr('src','icon/eq.png');
            s.removeClass('col-r').removeClass('col-g').addClass('col-b');
        }
    }
});
