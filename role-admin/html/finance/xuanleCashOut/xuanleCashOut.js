layui.config({
	version : true, //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
	debug : false, //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
	base : '../../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use([ 'jquery', 'form', 'laydate', 'base', 'table', 'laypage' ,'element'], function() {
	var table = layui.table,
		$ = layui.jquery,
		form = layui.form,
		latydate = layui.laydate,
		base = layui.base,
		laypage = layui.laypage,
		element = layui.element;
    $('.check-data-tab iframe').css({height:window.innerHeight-220 + 'px'});
});
