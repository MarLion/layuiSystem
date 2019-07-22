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
    updateLayuiDate('timeStart',1);
    updateLayuiDate('timeEnd',2);
    base.operateArea();
    function updateLayuiDate(cls,type) {
        var value='';
        //获取当天时间，时间格式为yyyy-MM-dd HH:mm:ss
        var max = base.dateFormatter(new Date())
        if(type==1){
            value =base.getCurrentMonthFirst();
        }else if(type==2){
            value= base.getCurrentMonthLast();
        }
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'datetime',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss',
                max: max,
                value:value
            })
        })
    }
    var m = base.show_load_layer();
    var tableIns = table.render({
        elem:'#um',
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiUrl()+"/member/getMemberList",
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
        cols:[[
            {field:'',title	:'序号',align:'center',fixed: 'left', width: 60,templet:function (d) {
                return d.LAY_TABLE_INDEX + 1
            }},
            {field:'loginName',title:'用户账号',align:'center',width:150},
            {field:'memberNickname',title:'用户昵称',align:'center',width:160},
            {field:'recommen',title:'推荐人',align:'center',width:150},
            {field:'recommenNickName',title:'推荐人姓名',align:'center',width:100},
            {field:'createTime',title:'账号创建时间',align:'center',width:220,templet:function (e) {
                return base.toDateString(e.createTime);
            }},
            {field:'registerDeviceTime',title:'设备创建时间',align:'center',width:220},
            {field:'subCompany',title:'分公司',align:'center',width:160},
            {field:'area',title:'区域',align:'center',width:160},
            {field:'shopName',title:'门店',align:'center',width:172}
        ]],
        done:function (res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(m);
        }
    });

    //查询
    $("#checkUm").on('click',function () {
        //获取条件
        var shopId = $("#shopSelect").val();//门店id
        var areaId = $("#areaSelect").val();//区域id
        var branchCompanyId = $("#companySelect").val();//分公司id
        var addType = $("#addType").val(); //新增类型（全部，1-新用户新设备）
        //起止时间
        var timeStart = $("#timeStart").val();
        var timeEnd=$("#timeEnd").val();
        if (timeEnd && timeStart){
            if(timeEnd<=timeStart){
                return layer.msg("结束时间必须大于开始时间!");
            }
        }
        var s = base.show_load_layer();
        tableIns.reload({

            where:{
                shopId:shopId,
                areaId:areaId,
                branchCompanyId:branchCompanyId,
                timeStart:timeStart,
                timeEnd:timeEnd,
                addType:addType
            },
            page:{
                curr:1
            },
            done:function (res) {
                base.close_load_layer(s);
            }
        })
    });
    //重置
    $("#resetUm").on('click',function () {
        updateLayuiDate('timeStart',1);
        updateLayuiDate('timeEnd',2);
        $("#shopSelect").val('');
        $("#areaSelect").val('');
        $("#companySelect").val('');
        base.opereteReset();
        $("#addType").val('0');
        form.render();
    });
    //批量导出
    $("#umExports").on('click',function () {
        var shopId = $("#shopSelect").val();//门店id
        var area = $("#areaSelect").val();//区域id
        var cityNo = $("#companySelect").val();//分公司id
        var addType = $("#addType").val(); //新增类型（全部，1-新用户新设备）
        //起止时间
        var timeStart = $("#timeStart").val();
        var timeEnd=$("#timeEnd").val();
        if (timeEnd && timeStart){
            if(timeEnd<=timeStart){
                return layer.msg("结束时间必须大于开始时间!");
            }
        }
        //批量导出提示
        layer.open({
            closeBtn: 0,
            shadeClose: true,
            skin: '',
            title: '批量导出小提示'
            ,content:
            '<div style="margin-top: 5px">1、批量导出时候尽量精准选择查询条件，这样导出速度会提升。</div>'+
            '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'+
            '<div style="margin-top: 5px">3、[新增类型]下拉选项可选择，不选，默认为导出全部。</div>'+
            '<div style="margin-top: 5px">4、[新增类型]-全部：某个时间段注册的所有用户，包括新用户新设备。</div>'+
            '<div style="margin-top: 5px">5、[新增类型]-新用户新设备：在某个时间段注册并且用设备登录过的用户。</div>'
            , area: ['471px', '329px']
            ,btnAlign: 'c'
            ,btn: ['确定导出', '放弃导出']
            ,yes: function(){
                layer.closeAll();
                var fileName = "用户管理-批量导出" + base.getFormDate();
                base.downXlsxExcel(getUrl1(1,shopId,area,cityNo,timeStart,timeEnd,addType), fileName);

            }
            ,btn2: function(){
                layer.closeAll();
            }
        });

    });
    //门店导出
    $("#storeExports").on('click',function () {
        var shopId = $("#shopSelect").val();//门店id
        var area = $("#areaSelect").val();//区域id
        var cityNo = $("#companySelect").val();//分公司id
        //起止时间
        var timeStart = $("#timeStart").val();
        var timeEnd=$("#timeEnd").val();
        if (timeEnd && timeStart){
            if(timeEnd<=timeStart){
                return layer.msg("结束时间必须大于开始时间!");
            }
        }
        layer.open({
            closeBtn: 0,
            shadeClose: true,
            skin: '',
             title: '门店导出小提示'
            ,content:
            '<div style="margin-top: 5px">1、门店导出主要是获得某个时间段新用户新设备数，给门店算提成。</div>'+
            '<div style="margin-top: 5px">2、例如：要获取2019年5月数据，为了保证数据的准确性，请在2019年6月1号或以后时间导出。</div>'+
            '<div style="margin-top: 5px">3、如果分公司，区域或者门店不选择，则导出所有分公司新增设备信息。</div>'+
            '<div style="margin-top: 5px">4、搜索栏中[新增类型]请选择新用户新设备数选项。</div>'+
            '<div style="margin-top: 5px">5、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
            , area: ['471px', '329px']
            ,btnAlign: 'c'
            ,btn: ['确定导出', '放弃导出']
            ,yes: function(){
                layer.closeAll();
                var fileName = "用户管理-门店导出" + base.getFormDate();
                base.downXlsxExcel(getUrl(1,shopId,area,cityNo,timeStart,timeEnd), fileName);

            }
            ,btn2: function(){
                layer.closeAll();
            }
        });

    });
    function getUrl(value,shopId,area,cityNo,timeStart,timeEnd) {
        var url = base.apiUrl() + "/member/getMemberByShop?exportType=" + value;
        if (shopId != null && shopId != "" && shopId != undefined) {
            url += "&shopId=" + shopId;
        }
        if (area != null && area != "" && area != undefined) {
            url += "&areaId=" + area;
        }
        if (cityNo != null && cityNo != "" && cityNo != undefined) {
            url += "&branchCompanyId=" + cityNo;
        }
        if (timeStart != null && timeStart != "" && timeStart != undefined) {
            url += "&timeStart=" + timeStart;
        }
        if (timeEnd != null && timeEnd != "" && timeEnd != undefined) {
            url += "&timeEnd=" + timeEnd;
        }
        return url;
    }
    function getUrl1(value,shopId,area,cityNo,timeStart,timeEnd,addType) {
        var url = base.apiUrl() + "/member/getMemberExport?exportType=" + value;
        if (shopId != null && shopId != "" && shopId != undefined) {
            url += "&shopId=" + shopId;
        }
        if (area != null && area != "" && area != undefined) {
            url += "&areaId=" + area;
        }
        if (cityNo != null && cityNo != "" && cityNo != undefined) {
            url += "&branchCompanyId=" + cityNo;
        }
        if (timeStart != null && timeStart != "" && timeStart != undefined) {
            url += "&timeStart=" + timeStart;
        }
        if (timeEnd != null && timeEnd != "" && timeEnd != undefined) {
            url += "&timeEnd=" + timeEnd;
        }
        if(addType!=null&&addType!='undefined'&&addType!=''){
            url+="&addType="+addType;
        }
        return url;
    }


    //格式化时间
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

});
