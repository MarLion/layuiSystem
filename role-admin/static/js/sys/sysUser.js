layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['table', 'layer', 'jquery', 'form', 'laydate', 'base', 'layedit'], function () {
    var table = layui.table,
        layui$ = layui.jquery,
        form = layui.form,
        base = layui.base,
        layer = layui.layer;
    var tableIns = table.render({
        elem: '#info', limit: 10, cellMinWidth: 80, method: 'get',
        page: {layout: ['count', 'prev', 'page', 'next', 'skip']},
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        url: base.apiUrl() + "/sys/list",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'username', title: '用户名'},
            {field: 'realName', title: '真实姓名'},
            {field: 'phone', title: '手机号'},
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
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'+
                        '  <a class="layui-btn  layui-btn-xs" lay-event="fpjs">分配角色</a>'+
                        '  <a class="layui-btn  layui-btn-xs" lay-event="resetPsw">重置密码</a>'
                    return str;
                }
            }]]
    });

    //查询
    $("#searchBtn").bind('click',function () {
        var username = $("#username").val();
        var realname = $("#realname").val();
        tableIns.reload({
            where:{
                username:username,
                realName:realname
            },
            page:{
                curr:1
            }
        })
    })

    //加载一级菜单
    function parentIdSelect(parentId) {
        $.ajax({
            type: "get",
            url: base.apiUrl() + '/menu/rootMenu',
            success: function (item) {
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

    //编辑新增菜单
    function saveOrUpdate() {
        base._ajax({
            url:base.apiUrl() +  '/sys/user/add',
            data: layui$(".form1").serializeObject(),
            id:window.sessionStorage.getItem('sessionid'),
            success: function () {
                layer.msg("操作成功!")
                base.reload(tableIns)
                layer.close(index)
            }
        })
    }
    //分配角色提交
    function fpqxSbmit(userId) {
        var zTree = $.fn.zTree.getZTreeObj("ztree")
        var o = zTree.getCheckedNodes(true)
        base._ajax({
            url:base.apiUrl() + '/sys/user/saveUserRole',
            data:{userId:userId,trees:JSON.stringify(o)},
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
                    url:base.apiUrl() + '/sys/user/del',
                    data:{id: data.id},
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
            $("#password")[0].style.display = "none";
            layer.open({
                title: '编辑',
                shadeClose: true,
                shade: false,
                maxmin: true,
                area: ['800px', '600px'],
                content: $("#content").html(),
                yes: function () {
                    saveOrUpdate();
                }
            });
            layui$(".form1").formSerialize(data)
            parentIdSelect(data.parentId);
        }else if (layEvent === 'fpjs') {
            layer.open({
                title: '分配角色',
                shadeClose: true,
                shade: false,
                maxmin: true,
                area: ['800px', '600px'],
                content: '<ul id="ztree" class="ztree"></ul>',
                yes: function () {
                    fpqxSbmit(data.id);
                }
            });
            base._ajax({
                url:base.apiUrl() + '/sys/user/getUserRole',
                data:{
                    userId: data.id
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                },
                success: function (zNodes) {
                    var setting = {
                        view: {
                            selectedMulti: false
                        },
                        check: {
                            enable: true
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        }
                        ,
                        callback: {
                            onCheck: onCheck
                        }
                    };
                    var clearFlag = false;
                    function onCheck(e, treeId, treeNode) {

                        if (clearFlag) {
                            clearCheckedOldNodes();
                        }
                    }
                    function clearCheckedOldNodes() {
                        var zTree = $.fn.zTree.getZTreeObj("ztree"),
                            nodes = zTree.getChangeCheckedNodes();
                        for (var i = 0, l = nodes.length; i < l; i++) {
                            nodes[i].checkedOld = nodes[i].checked;
                        }
                    }
                    function createTree() {
                        $.fn.zTree.init($("#ztree"), setting, zNodes);

                        clearFlag = $("#last").attr("checked");
                    }
                    createTree();
                    $("#init").bind("change", createTree);
                    $("#last").bind("change", createTree);
                }
            })
        }else if (layEvent === 'resetPsw') {
            layer.confirm('确定重置密码吗?重置密码将变成888888', {btn: ['确定', '取消'],title:"提示"},function (index) {
                base._ajax({
                    url:base.apiUrl() + '/sys/resetPassword?userId='+data.id,
                    type:"get",
                    timeout:20000,
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
        }
    });
    //新增
    $("#add").click(function () {
        $("#password")[0].style.display = "block";
        layer.open({
            type: 1,
            title: '新增',
            shadeClose: true,
            shade: false,
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
