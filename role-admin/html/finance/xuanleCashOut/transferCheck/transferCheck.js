layui.config({
    version : true, //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    debug : false, //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    base : '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use([ 'jquery', 'form', 'laydate', 'base', 'table', 'laypage' ], function() {
    var table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        latydate = layui.laydate,
        base = layui.base,
        laypage = layui.laypage;
    var m = base.show_load_layer();
    var tableIns = table.render({
        elem : '#accounts',
        url : base.apiUrl() + "/xldata/getTransferRecord",
        method : 'post',
        headers : {
            'xxl_sso_sessionid' : window.sessionStorage.getItem('sessionid')
        },
        page : {
            layout : [ 'count', 'prev', 'page', 'next', 'skip', 'limit' ]
        },
        request: {pageName: "pageNum" ,limitName:"pageSize"},
        cols : [ [
            {
                field : '',
                title : '序号',
                align : 'center',
                fixed : 'left',
                width : 60,
                templet : function(d) {
                    return d.LAY_TABLE_INDEX + 1
                }
            },
            {
                field : 'loginNameA',
                title : '转出账号',
                align : 'center',
                width : 200
            },
            {
                field : 'loginNameB',
                title : '转入账号',
                align : 'center',
                width : 200
            },
            {
                field : 'count',
                title : '金额（元）',
                align : 'center',
                width : 200
            },
            {
                field : 'status',
                title : '转账状态',
                align : 'center',
                width : 150,
                templet: function (e) {
                    return formatStatus(e.status)
                }
            },
            {
                field : 'time',
                title : '转账时间',
                align : 'center',
                width : 150,
                templet: function (e) {
                    return base.toDateString(e.time)
                }
            },
        ] ],
        done : function(res) {
            if (res.code == 501) {
                console.log("501");
                window.parent.parent.location.href = '/role-admin/login.html';
                return;
            }
            base.close_load_layer(m);
            console.log('表格加载完成');
        }
    });

    updateLayuiDate('timeStart', function(value, date) {
        //console.log($("#timeStart").val());
    });
    updateLayuiDate('timeEnd', function(value, date) {
        //console.log(value);
    });
    base.operateArea();

    function updateLayuiDate(cls, callback) {
        $("#" + cls).each(function() {
            latydate.render({
                elem : this,
                type : 'datetime',
                trigger : "click",
                format : 'yyyy-MM-dd HH:mm:ss',
                done : callback
            })
        })
    }
    base.operateArea();
    //查询项选择
    //getJxbType('imSelect');
    //金额大小下拉框1
    form.on('select(money-select)', function(data) {});
    //点击查询
    $("#checkAccounts").on('click', function() {
        if (!checkSearchContend($("#timeStart").val(),  $("#timeEnd").val())) {
            return;
        }
        var requestUrl = base.apiUrl() + "/xldata/getTransferRecord";
        var s = base.show_load_layer();
        tableIns.reload({
            where : {
            	 loginNameA : $("#loginNameA").val(), //顾客账户
                 loginNameB : $("#loginNameB").val(), //顾客账户
                 compare : $("#compare").val(), //金额标识
                 amount : $("#amount").val(), //金额
                 staTime : $("#timeStart").val(), //开始时间
                 endTime : $("#timeEnd").val() //结束时间
            },
            url : requestUrl,
            method : 'post',
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            page : {
                curr : 1
            },
            done : function(res) {
                base.close_load_layer(s);
            }
        })
    });

    //重置

    //批量导出

    //校验搜索项是否合法
    function checkSearchContend(startTime,endTime) {
        if (startTime) {
            if (!endTime) {
                layer.alert('起止时间不能只选择一个', {
                    icon : 7
                });
                return false;
            }
            var start = new Date(startTime);
            var end = new Date(endTime);
            var varify = end > start;
            if (!varify) {
                layer.alert("结束时间必须大于开始时间！", {
                    icon : 7
                });
                return false;
            }
            if (start.getMonth() != end.getMonth()) {
                layer.alert("暂不支持跨月查询！", {
                    icon : 7
                });
                return false;
            }
        } else if (endTime) {
            layer.alert('起止时间不能只选择一个', {
                icon : 7
            });
            return false;
        }
        return true;
    }
    /*
    //获取出项入项类别
    function getJxbType(elem) {
        base._ajax({
            url : base.apiUrl() + "/xldata/getCategory",
            method : 'post',
            headers : {
                'xxl_sso_sessionid' : window.sessionStorage.getItem('sessionid')
            },
            success : function(data) {
                var _str = data.data;
                _html = '',
                    _el = $("#imSelect");
                $.each(_str, function(index, item) {
                    _html += '<dd><input type="checkbox" name="types" title="' + item.actionName + ' "value="' + item.id + ' "lay-skin="primary"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><span>' + item.actionName + '</span><i class="layui-icon layui-icon-ok"></i></div></dd>'
                });
                _el.html(_html);
                form.render();
                base.multiSelect('downpanel', 'multSelects1', 'orderTypes', 'types');
            },
            error : function(res) {
                console.log(res);
            }
        })
    }
    */
    //重置
    $("#reset").on('click', function() {
            $("#loginNameA").val(''); //转出账号
            $("#loginNameB").val(''); //转入账号
            $("#compare").val('');//金额标识
            $("#amount").val(''); //金额
            $("#timeStart").val(''); //开始时间
            $("#timeEnd").val(''); //结束时间
        form.render();
    });
    function formatStatus(value) {
        if (value == 0) {
            return '转账成功';
        } else if (value == 1) {
            return '转账失败';
        }
    }

});
