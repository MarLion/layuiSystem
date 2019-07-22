layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['table', 'layer', 'form', 'laydate', 'base', 'layedit'], function () {
    var table = layui.table,
        form = layui.form,
        base = layui.base,
        layer = layui.layer;
    var layui$ = layui.jquery;
    var tableIns = table.render({
        elem: '#info', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/menu/sourceList",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'sourceName', title: '资源来源'},
            {
                field: 'createTime', title: '创建时间', templet: function (e) {
                    return base.toDateString(e.createTime)
                }
            }, {
                field: 'updateTime', title: '更新时间', templet: function (e) {
                    return base.toDateString(e.updateTime)
                }
            },
            {
                field: '', fixed: 'right', title: '操作', templet: function (e) {
                    var str =
                        '  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>\n' +
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'
                    return str;
                }
            }]]
    });

    //编辑
    function saveOrUpdate() {
        var roleName = layui$(".form1").serializeObject().sourceName;
        if (roleName == null || roleName == ''){
            return layer.alert("请输入资源来源名",{icon:7});
        }
        base._ajax({
            url:base.apiUrl() +  '/menu/editMenuSource',
            data: layui$(".form1").serializeObject(),
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function () {
                layer.msg("操作成功!")
                base.reload(tableIns)
            }
        })
    }

    //监听行工具事件
    table.on('tool(news)', function (obj) {
        var data = obj.data
            , layEvent = obj.event;
        if (layEvent === 'detail') {

        } else if (layEvent === 'del') {
            layer.confirm('真的删除行么?', function (index) {
                obj.del();
                layer.close(index);
                base._ajax({
                    url:base.apiUrl() +  '/menu/delMenuSource',
                    data: {
                        id: data.id
                    },
                    headers:{
                        'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                    },
                    success: function () {
                        layer.msg("操作成功!")
                        base.reload(tableIns)
                        layer.close(index)
                    }
                })
            });
        } else if (layEvent === 'edit') {
            layer.open({
                title: '编辑',
                shadeClose: false,
                shade: 0.2,
                maxmin: true,
                area: ['800px', '600px'],
                content: $("#content").html(),
                yes: function () {
                    saveOrUpdate();
                }
            });
            layui$(".form1").formSerialize(data)
        }
    });

    //新增
    $("#add").click(function () {
        layer.open({
            type: 1,
            title: '新增',
            shadeClose: false,
            shade: 0.2,
            maxmin: true,
            area: ['800px', '600px'],
            content: $("#content").html(),
            btn: ['确定', '取消']
            , yes: function (index, layero) {
                saveOrUpdate();
                layer.close(index)
            }, btn2: function (index, layero) {
                layer.close(index)
            }
        });
        $(".form1").find("[name='id']").val(null)
    });
})
