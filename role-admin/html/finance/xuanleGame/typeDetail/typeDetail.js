layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['jquery','form','laydate','base','table','laypage','element'],function () {
	var table= layui.table,
        $ = layui.jquery,
        form = layui.form,
        laydate = layui.laydate,
        base = layui.base,
        laypage = layui.laypage,
        element = layui.element;
    var tableIns = table.render({
		elem : '#accounts',
		url : base.apiUrl() + "/gameprf/getGamePrtByList",
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
				field : 'loginName',
				title : '用户账号',
				align : 'center',
				width : 200
			},
			{
				field : 'sumCompany',
				title : '分公司',
				align : 'center',
				width : 300
			},
			{
				field : 'areaName',
				title : '区域',
				align : 'center',
				width : 200
			},
			{
				field : 'shopName',
				title : '门店名称',
				align : 'center',
				width : 200
			},
			{
				field : 'jxb',
				title : '金额',
				align : 'center',
				width : 200
			},
			{
				field : 'year',
				title : '年',
				align : 'center',
				width : 100
			},
			{
				field : 'month',
				title : '月',
				align : 'center',
				width : 100
			},
			{
				field : 'status',
				title : '发放情况',
				align : 'center',
				width : 100,
				templet: function (e) {
                    return formatStatus(e.status);
                }
			},
			{
				field : 'createTime',
				title : '发放时间',
				align : 'center',
				width : 200,
				templet: function (e) {
	                    return base.toDateString(e.createTime)
	           }
			},
		] ],
		done : function(res) {
			if (res.code == 501) {
				console.log("501");
				window.parent.location.href = '/role-admin/login.html';
				return;
			}
			console.log('表格加载完成');
		}
	});
    updateLayuiDate('timeStart');
    updateLayuiDate('timeEnd');
    base.operateArea();
    //重置
    $("#reset").on('click',function () {
        $("#loginName").val('');
        $("#timeStart").val('');
        $("#timeEnd").val('');
        $("#status").val('');
        form.render();
    });
    function updateLayuiDate(cls) {
        $("#"+cls).each(function () {
            laydate.render({
                elem:this,
                type:'date',
                trigger:"click",
                format:'yyyy-MM-dd HH:mm:ss'
            })
        })
    }
    function formatStatus(value) {
        if (value == 0) {
            return '未发放';
        } else if (value == 1) {
            return '已发放';
        }
    }
  //点击查询
  	$("#check").on('click', function() {
  		var requestUrl = base.apiUrl() + "/gameprf/getGamePrtByList";
  		var s = base.show_load_layer();
  		tableIns.reload({
  			where : {
  				loginName : $("#loginName").val(),
  				staTime : $("#timeStart").val(),
  				endTime : $("#timeEnd").val(),
  				status : $("#status").val(),
  				
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
});
