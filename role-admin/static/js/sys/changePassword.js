layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展
}).use(['form','element', 'layer','jquery','base'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        base = layui.base,
        element = layui.element;

    var userId;   //获取登录用户id
    $(function(){
        var cookie = document.cookie;
        //var obj = JSON.parse(document.cookie);
        //var userId = obj.userId;
        userId = cookie.replace(/[^0-9]/ig,"");
})
    //监听提交，发送请求
    form.on('submit(pswSubmit)', function(data){
        var oldPassword = $('#oldPsw').val();
        var newPassword = $('#newPsw').val();
        var confirmPassword = $('#newPsw2').val();

        if (oldPassword == newPassword) {
            return layer.alert('新密码与当前密码一致', {icon: 5});
        }
        if (newPassword != confirmPassword) {
            return layer.alert('两次输入的密码不一致', {icon: 5});
        }
        var params = {
            oldPassword:oldPassword,
            newPassword:newPassword,
            confirmPassword:confirmPassword,
            userId:userId
        };
        base._ajax({
            url:base.apiUrl() + '/sys/changePassword',
            data:params,
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            success:function(res){
                layer.msg("修改成功！", {offset: '30%',icon: 6});
                setTimeout("window.location.reload()",2000);
            },
            error:function(error){
                return layer.alert("修改失败！", {offset: '30%',icon: 5});
                setTimeout("window.location.reload()",2000);
            },
        })
        return false;
    });
    //重置
    pswCancel = function(){
        $('#oldPsw').val('');
        $('#newPsw').val('');
        $('#newPsw2').val('');
    };
});