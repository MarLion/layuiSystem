
layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展


}).use(['table', 'layer', 'jquery', 'form', 'base', 'layedit','upload'], function () {
    var table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        base = layui.base,
        layer = layui.layer,
        upload = layui.upload;
    var tableIns = table.render({
        elem: '#sys_parameter', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum"},
        url: base.apiUrl() + "/sysparameter/getSysParametersList",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', width: 60, templet: function (d) {
                return d.LAY_TABLE_INDEX + 1
            }
            },
            {field: 'parameterKey', title: '参数名'},
            {
                field: 'parameterValue', title: '参数值',
            },
            {   field: 'description',title: '描述'},
            {
                field: 'createTime', title: '创建时间', templet: function (e) {
                return base.toDateString(e.createTime)
            }
            },
            {
                field: '', fixed: 'right', title: '操作', templet: function (e) {
                        var str = '  <a class="layui-btn layui-btn-xs" lay-event="seeValue">查看缓存</a>\n'+
                            '  <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>\n'+
                            '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'
                        return str;

            }
            }]]
    });

    //更新缓存
   $("#updateRedis").on('click',function () {
       base._ajax({
           url: base.apiUrl() + "/sysparameter/updateRedis",
           headers:{
               'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
           },
           timeout:20000,
           success:function (res) {
               var obj = eval('('+res+')');
               if (obj.code == 0){
                   return layer.msg("更新缓存成功！");
               }else {
                   return layer.msg("更新缓存失败！");
               }
           },
           error:function (error) {
               return layer.msg("更新缓存失败！");
           }
       })
   });
    //同步特约人信息
    $("#asyncReferrer").on('click',function () {
        base._ajax({
            url: base.apiUrl() + "/xl_member/asyncReferrer",
            data: {},
            dataType:"json",
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function (data) {
                if(data.code==0){
                    layer.msg("同步成功！");
                }else{
                    layer.msg(data.message);
                }
            }
        })
    });


    //监听行工具事件
    table.on('tool(sysParameter)', function (obj) {
        var data = obj.data
            , layEvent = obj.event;
        if (layEvent === 'edit') {
            layer.closeAll();
            layer.open({
                title: '编辑',
                type: 2,
                shadeClose: true,
                shade: false,
                maxmin: true,
                area: ['100%', '100%'],
                content: "sysParameterDetail.html?type=2&id="+data.id
            })
            findSysParameterById(data.id);
        }else if (layEvent === 'seeValue') {
            layer.closeAll();
            layer.open({
                title: '查看缓存',
                type: 1,
                shadeClose: true,
                shade: false,
                maxmin: true,
                area: ['500px', '150px'],
                content: $("#seeSysValue").html(),
            })
            findSysParameterValuelByKey(data.parameterKey);
        }else if(layEvent==='del'){
            layer.confirm('确定删除？删除后将不可恢复。', function (index) {
                obj.del();
                layer.close(index);
                base._ajax({
                    url: base.apiUrl() + '/sysparameter/delSysParameter',
                    data: {
                        id: data.id
                    },
                    headers:{
                        'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                    },
                    success: function () {
                        layer.msg("删除成功!")
                        base.reload(tableIns)
                        layer.close(index)
                    }
                });
            });
        }
    });

    function findSysParameterById(rowid){
        base._ajax({
            url : base.apiUrl()+'/sysparameter/getSysParameterById',
            data:{
                id:rowid,
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            timeout : 30000,
            dataType:"json",
            error : function() {
                layer.msg("初始化失败！");
                return
            },
            success: function (data) {
                $(".layui-layer-content .form1").formSerialize(data.data);
            }
        });
    }

    //查看当前缓存值
    function findSysParameterValuelByKey(sysKey){
        base._ajax({
            url:base.apiUrl() +  '/sysparameter/getSysparameterValue',
            data:{
                key:sysKey,
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            timeout : 30000,
            dataType:"json",
            error : function() {
                layer.msg("初始化失败！");
                return
            },
            success: function (data) {
                $(".form2").find("[name='sys_value']").val(data.data)
            }
        })
    }

    //新增
    $("#add").click(function () {
        layer.closeAll();
        layer.open({
            type: 2,
            title: '新增',
            shadeClose: true,
            shade: false,
            maxmin: true,
            area: ['100%', '100%'],
            content:"sysParameterDetail.html?type=1",
        });

    });

    //查询
    $("#searchBtn").click(function () {
        var parameterKey = $("#parameterKey").val();
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                parameterKey: parameterKey,
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });


    reList=function () {
        parent.location.reload();
    }

})
