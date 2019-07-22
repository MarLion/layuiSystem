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
        url: base.apiUrl() + "/sys/role/list",
        headers:{
            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
        },
        cols: [[ // 表头
            {
                field: 'id', title: '序号', fixed: 'left', width: 60, templet: function (d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {field: 'roleName', title: '角色名'},
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
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>'+
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="fpqx">分配菜单权限</a>'+
                        '  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="fpfgsqx">分配组织权限</a>';
                    return str;
                }
            }]]
    });

    //编辑新增菜单
    function saveOrUpdate() {
        var roleName = layui$(".form1").serializeObject().roleName;
        if (roleName == null || roleName == ''){
            return layer.alert("请输入角色名",{icon:7});
        }
        base._ajax({
            url:base.apiUrl() +  '/sys/role/add',
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


    //菜单 权限提交
    function fpqxSbmit(roleId) {
        var zTree = $.fn.zTree.getZTreeObj("ztree")
        var o = zTree.getCheckedNodes(true)
        base._ajax({
            url:base.apiUrl() + '/sys/role/saveRoleMenu',
            data:{roleId:roleId,listJSON:JSON.stringify(o)},
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success: function (res) {
                if(res.code!=0){
                    layer.msg(res.message);
                    return;
                }else {
                    layer.msg("操作成功!")
                    base.reload(tableIns)
                }
            }
        })
    }


    //分公司 权限提交
    function fpqxSbmitF(roleId) {
        var zTree = $.fn.zTree.getZTreeObj("ztreeF");
        if(zTree==null){
            layer.msg("请先选择权限级别!");
            return;
        }
        var o = zTree.getCheckedNodes(true);
        base._ajax({
            url:base.apiUrl() + '/sys/role/saveRoleDpet',
            data:{
                roleId:roleId,
                roleLevel:$("#roleLevel").val(),
                listJSON:JSON.stringify(o)
            },
            success: function (res) {
                if(res.code!=0){
                    layer.msg(res.message);
                    return;
                }else {
                    layer.msg("操作成功!")
                    base.reload(tableIns)
                }
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
                    url: base.apiUrl() + '/sys/role/del',
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
                });
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
        }else if (layEvent === 'fpqx') {
            layer.open({
                title: '分配菜单权限',
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
                url:base.apiUrl() + '/sys/role/getRoleMenu',
                data:{
                    id: data.id
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                },
                success: function (zNodes) {
                    var setting = {
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
            });

        }else if (layEvent === 'fpfgsqx') {
            layer.open({
                title: '分配组织权限',
                shadeClose: true,
                shade: false,
                maxmin: true,
                area: ['800px', '600px'],
                content: '<div class="layui-form-item">\n' +
                    '                <label class="layui-form-label" >权限级别：</label>\n' +
                    '                <div class="layui-input-inline" style="width: 250px;">\n' +
                    '                    <select class="layui-select" id="roleLevel" name="roleLevel">\n' +
                    '                        <option value="">请选择</option>\n' +
                    '<option value="0">管理员</option>\n' +
                    '                        <option value="1">分公司</option>\n' +
                    '                        <option value="2">区域</option>\n' +
                    '                        <option value="3">门店</option>\n' +
                    '                    </select>\n' +
                    '                </div>\n' +
                    '            </div>' +
                    '<ul id="ztreeF" class="ztree"></ul>',
                yes: function () {
                    fpqxSbmitF(data.id);
                }
            });
            //roleLevel select change
            $("#roleLevel").change(function (e) {
                reloadTree(data.id,$("#roleLevel").val());
            });
            reloadTree(data.id,data.roleLevel,0);
        }
    });
    // reload role tree
    function reloadTree(id,roleLevel,type){
        if(roleLevel==""||roleLevel==null){
            return;
        }
        if(roleLevel==0){
            $("#ztreeF").html("");
            return;
        }
        base._ajax({
            url:base.apiUrl() + '/dept/list',
            data:{
                roleId:id,
                roleLevel:roleLevel
            },
            success: function (zNodes) {
                //set roleLevel val
                if(type==0){
                    $("#roleLevel").val(zNodes.roleLevel)
                }
                var setting = {
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
                        onCheck:function(e,treeId, treeNode){
                            var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                            optParOrSon(treeId, treeNode,zTreeObj);
                        },
                        beforeCheck:zTreeBeforeCheck
                    }
                };
                var clearFlag = false;
                /**
                 * 选父不选子，选子不选父
                 * */
                var optParOrSon = function(treeId,treeNode,zTreeObj){
                    if(treeNode.checked){
                        //取消全部后代节点的选中
                        var childNodes = getChildsByTreeNode(treeNode);
                        for(var i in childNodes){
                            zTreeObj.checkNode(childNodes[i], false, false);
                        }
                        //同时全部祖先节点也不能被选中
                        if(treeNode.getParentNode()){
                            var parNodes = getParsByTreeNode(treeNode);
                            for(var i in parNodes){
                                zTreeObj.checkNode(parNodes[i], false, false);
                            }
                        }
                    }
                };
                //获取所有子节点
                var getChildsByTreeNode = function(treeNode,childsArr){
                    var childsArr = childsArr || [];
                    if (treeNode.isParent) {//是父节点则获取所有子节点
                        var childs = treeNode.children;
                        for(var i in childs){
                            childsArr.push(childs[i]);
                            getChildsByTreeNode(childs[i],childsArr);
                        }
                    }
                    return childsArr;
                };

                //获取所有父节点
                var getParsByTreeNode = function(treeNode,parsArr){
                    var parsArr = parsArr || [];
                    var parNode = treeNode.getParentNode();
                    if(parNode){
                        parsArr.push(parNode);
                        getParsByTreeNode(parNode,parsArr);
                    }
                    return parsArr;
                }
                function onCheck(e, treeId, treeNode) {

                    if (clearFlag) {
                        clearCheckedOldNodes();
                    }
                }
                function zTreeBeforeCheck(treeId, treeNode) {
                    return !treeNode.isParent;//当是父节点 返回false 不让选取
                }
                function clearCheckedOldNodes() {
                    var zTree = $.fn.zTree.getZTreeObj("ztreeF"),
                        nodes = zTree.getChangeCheckedNodes();
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        nodes[i].checkedOld = nodes[i].checked;
                    }
                }
                function createTree() {
                    $.fn.zTree.init($("#ztreeF"), setting, zNodes.trees);

                    clearFlag = $("#last").attr("checked");
                }
                createTree();
                $("#init").bind("change", createTree);
                $("#last").bind("change", createTree);
            }
        });
    }

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
