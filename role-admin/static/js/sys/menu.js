layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['table', 'layer', 'jquery', 'form', 'laydate', 'base', 'layedit'], function () {
    var table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        base = layui.base,
        // layedit = layui.layedit,
        layer = layui.layer;
    var tableIns = table.render({
        elem: '#info', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum"},
        url: base.apiUrl() + "/menu/getMenuList",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'menuName', title: ' 菜单名称'},
            {field: 'href', title: '菜单地址'},
            {field: 'icon', title: '图标'},
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
                    var str = /*'  <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="detail">查看</a>\n' +*/
                        '  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>\n' +
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'
                    return str;
                }
            }]]
    });

    //查询
    $("#searchBtn").on('click',function(){
        var menuName = $("#searchMenuName").val();
        tableIns.reload({
            where:{
                menuName:menuName,
            }
            ,page: {
                curr: 1       //重新从第 1 页开始
            }
        });
    });

    //加载上级菜单
    function parentIdSelect(parentId) {
        $.ajax({
            type: "post",
            url: base.apiUrl() + '/menu/getParentMenu',
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function (item) {
                console.log("item:"+item)
                var str = '<option value="">请选择</option>';
                $.each(item, function (a, b) {
                    if(b.id==parentId){
                        str += '<option value="' + b.id + '" selected>' + b.menuName + '</option>';
                    }else{
                        str += '<option value="' + b.id + '">' + b.menuName + '</option>';
                    }
                })
                $(".form1").find("[name='parentId']").html(str);
                form.render("select")
            }
        });
    }

    //加载资源来源
    function sourceIdSelect(sourceId) {
        $.ajax({
            type: "post",
            url: base.apiUrl() + '/menu/selectSourceList',
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function (item) {
                var str = '<option value="">请选择</option>';
                $.each(item, function (a, b) {
                    if(b.id==sourceId){
                        str += '<option value="' + b.id + '" selected>' + b.sourceName + '</option>';
                    }else{
                        str += '<option value="' + b.id + '">' + b.sourceName + '</option>';
                    }
                })
                $(".form1").find("[name='sourceId']").html(str);
                form.render("select")
            }
        });
    }

    //自定义表单验证
    form.verify({
        menuName:function (value) {
            if (value == null || value == ""){
                return "菜单名称不能为空！";
            }
        }
    })
    //编辑新增菜单
    function saveOrUpdate() {
       var menuName = $(".form1").serializeObject().menuName;
       var href = $(".form1").serializeObject().href;
       var parentId = $(".form1").serializeObject().parentId;
       var sourceId = $(".form1").serializeObject().sourceId;
       var icon = $(".form1").serializeObject().icon;
        if (menuName == null || menuName == ''){
            return layer.alert("请填写菜单名称",{icon:7});
            return;
        }
        if (href == '' && parentId != ''){
            return layer.alert("请填写子菜单的菜单地址",{icon:7});
        }
        if (href != '' && parentId == ''){
            return layer.alert("请选择子菜单的上级菜单",{icon:7});
        }
        if (href != '' && sourceId == ''){
            return layer.alert("请选择子菜单的资源来源",{icon:7});
        }
        if (icon == null || icon == ''){
            return layer.alert("请填写自定义图标",{icon:7});
            return;
        }
        base._ajax({
            url:base.apiUrl() + '/menu/add',
            data: $(".form1").serializeObject(),
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function () {
                layer.msg("操作成功!")
                base.reload(tableIns)
                layer.close(index)
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
                    url:base.apiUrl() + '/menu/del',
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
            $(".form1").formSerialize(data)
            parentIdSelect(data.parentId);
            sourceIdSelect(data.sourceId);
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
        parentIdSelect();
        sourceIdSelect();
    });
})
