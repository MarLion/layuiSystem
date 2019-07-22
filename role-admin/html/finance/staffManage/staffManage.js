layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','element'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate,
        base = layui.base,
        table= layui.table,
        element = layui.element;
    base.operateArea();
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
    var m = base.show_load_layer();
    var tableIns = table.render({
        elem:'#staff',
        page:{layout: ['count', 'prev', 'page', 'next', 'skip','limit']},
        method:'post',
        url: base.apiUrl() + "/xgjUser/getUserList",
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
            {field:'xlloginName',title:'玄乐账号',align:'center',width:160},
            {field:'loginName',title:'kpi账号',align:'center',width:150},
            {field:'userName',title:'员工姓名',align:'center',width:273},
            {field:'sex',title:'性别',align:'center',width:100,templet:function (d) {
                return formatSex(d.sex);
            }},
            {field:'positionName',title:'职位',align:'center',width:160},
            {field:'generalize',title:'推广职位',align:'center',width:160,templet:function (d) {
                return formatGeneralize(d.generalize);
            }},
            {field:'subCompany',title:'分公司',align:'center',width:172},
            {field:'area',title:'区域',align:'center',width:172},
            {field:'shop',title:'门店',align:'center',width:172},
            {field:'standardName',title:'考勤规范',align:'center',width:172},
            {field:'workPhone',title:'工作电话',align:'center',width:172},
            {field:'mobile',title:'移动电话',align:'center',width:172},

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
    $("#checkSm").on('click',function () {
        var userName = $("#user_name").val();
        var loginName = $("#login_name").val();
        var shopId = $("#shopSelect").val();//门店id
        var areaId = $("#areaSelect").val();//区域id
        var branchCompanyId = $("#companySelect").val();//分公司id
        var s = base.show_load_layer();
        tableIns.reload({

            where:{
                userName:userName,
                loginName:loginName,
                shopId:shopId,
                areaId:areaId,
                branchCompanyId:branchCompanyId
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
    $("#resetSm").on('click',function () {
        $("#user_name").val('');
        $("#login_name").val('');
        $("#shopSelect").val('');//门店id
        $("#areaSelect").val('');//区域id
        $("#companySelect").val('');//分公司id
        base.opereteReset();
        form.render();
    });


    //格式化性别
    function formatSex(sex) {
        if(sex=='0'){
            return '男'
        }else if(sex=='1'){
            return '女'
        }else{
            return '未知'
        }
    }
    //格式化代理职位
    function formatGeneralize(generalize) { //0：总代 1：代理 2：普通

        if(generalize=='0'){
            return '总代'
        }else if(generalize=='1'){
            return '代理'
        }else if(generalize=='2'){
            return '普通'
        }else{
            return '未知'
        }
    }
});
