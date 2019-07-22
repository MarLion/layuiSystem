
layui.config({
    version: true //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
    , debug: false //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
    , base: '../../static/js/' //设定扩展的Layui模块的所在目录，一般用于外部模块扩展


}).use(['table', 'layer', 'jquery', 'form', 'laydate', 'base', 'layedit','upload'], function () {
    var table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        form = layui.form,
        base = layui.base,
        layedit=layui.layedit,
        layer = layui.layer;
    var upload = layui.upload;


    function parseUrl(){
        var url=location.href;
        var i=url.indexOf('?');
        if(i==-1)return;
        var querystr=url.substr(i+1);
        var arr1=querystr.split('&');
        var arr2=new Object();
        for  (i in arr1){
            var ta=arr1[i].split('=');
            arr2[ta[0]]=ta[1];
        }
        return arr2;
    }
    var v = parseUrl();//解析所有参数
    var rowid=v['id'];
    var type=v['type'];

    if(type==1){
        openWindow(1);

    }else if(type==2){
        findSysParameterById(rowid);
    }
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
                $(".form1").formSerialize(data.data);
                if(data.data.parameterFlag==0){
                    var imgUrl=data.data.parameterValue;
                    var sign = "imgsign_0";
                    // var str = '<div class="layui-upload-imgbox"><img onclick="delimg(this)" sign="' + sign + '" class="close-upimg" src="http://112.74.187.103:8001/group1/M00/00/1B/rBKmn1vdBoKAXrdKAAAGHiYXR1Q284.png">' +
                    //     '<img src="' + imgUrl + '"  class="layui-upload-img" width="200px" height="200px" style="margin-right: 5px;margin-bottom: 5px;" sign="' + sign + '" ></div>'
                    var str = '<div sign="'+sign+'" style="width:200px;height:200px;margin-left: 5px; float:left; margin-right: 5px;margin-bottom: 35px;"><div class="showdiv"><img onclick="changeDiv(this,0)" class="left" src="../../static/plugin/layui/img/Arrow_left.svg" /><img onclick="delimgs(this)"  sign="'+sign+'" class="center" src="../../static/plugin/layui/img/delete.svg" /><img onclick="changeDiv(this,1)" class="right" src="../../static/plugin/layui/img/Arrow_right.svg" /></div><img src="' + imgUrl + '"  class="layui-upload-img" width="200px" height="200px"  sign="' + sign + '" ></div>';
                    $("#uploadlist").append(str);
                    $(".form1").find("[name='classLevel']").val("1");
                    form.render('select');
                    openWindow(3);
                }else if(data.data.parameterFlag==1){
                    $(".form1").find("[name='classLevel']").val("2");
                    form.render('select');
                    openWindow(4);
                }
            }
        });
    }


    function openWindow(flag){
        var photos = document.getElementById("photos");
        var value = document.getElementById("value");
        var scl = document.getElementById("select_class_level");
        if(flag==1){
            photos.style.display="none";
            value.style.display="block";
        }else if(flag==2){
            photos.style.display="block";
            value.style.display="none";
        }else if(flag==3){
            scl.style.display="none";
            photos.style.display="block";
            value.style.display="none";
        }else if(flag==4){
            scl.style.display="none";
            photos.style.display="none";
            value.style.display="block";
        }
    }

    //加载区域
    form.on('select(selectClassLevel)',function(){
        openWindow(1);
        var value = $('#class_level  option:selected').val();
        if(value==1){
            openWindow(2);
        }
    });

    function uploadImg(a, b, d) {
        upload.render({
            elem: a
            , url: base.apiUrl() + '/documents/saveFile?ownerType=' + d
            ,headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            }
            , before: function (obj) {
                //预读本地文件
                obj.preview(function (index, file, result) {
                    var sign = "imgsign" + $(b).find("img").length;
                    // var str = '<div class="layui-upload-imgbox"><img onclick="delimg(this)" sign="' + sign + '" class="close-upimg" src="http://112.74.187.103:8001/group1/M00/00/1B/rBKmn1vdBoKAXrdKAAAGHiYXR1Q284.png">' +
                    //     '<img src="' + result + '" alt="' + file.name + '" class="layui-upload-img" width="200px" height="200px" style="margin-right: 5px;margin-bottom: 35px;" sign="' + sign + '" ></div>'
                    var str = '<div sign="'+sign+'" style="width:200px;height:200px;margin-left: 5px; float:left; margin-right: 5px;margin-bottom: 35px;"><div class="showdiv"><img onclick="changeDiv(this,0)" class="left" src="../../static/plugin/layui/img/Arrow_left.svg" /><img onclick="delimgs(this)"  sign="'+sign+'" class="center" src="../../static/plugin/layui/img/delete.svg" /><img onclick="changeDiv(this,1)" class="right" src="../../static/plugin/layui/img/Arrow_right.svg" /></div><img src="' + result + '" alt="' + file.name + '" class="layui-upload-img" width="200px" height="200px"  sign="' + sign + '" ></div>';
                    $(b).html(str);
                });
            }
            , multiple: false
            , done: function (res) {
                var sign = "imgsign" + ($("#uploadlist").find("img").length - 2)
                //如果上传
                if (res.code != 200) {
                    return layer.msg('上传失败');
                }
                //上传成功,将链接保存到参数值中
                $("#parameter_value").val(res.result.filePath);
            }
        });
    }

    uploadImg('#imgbut','#uploadlist',1);


    //监听提交
    form.on('submit(add1)', function(data) {
        var level = $('#class_level option:selected').val();
        var updata=$.extend(data.field,{"level":level});
        var parameterValue=$(".form1").find("[name='parameterValue']").val();
        if(level==1&&parameterValue==""){
            layer.msg("图片不能为空！");
            return;
        }
        if(level==2&&parameterValue==""){
            layer.msg("参数值不能为空！");
            return;
        }
        base._ajax({
            url:base.apiUrl() +  '/sysparameter/saveSysParameter',
            data:updata,
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
            },
            beforeSend: function () {
                $(".form1").find(".submitForm").attr({ disabled: "disabled" });
            },
            success: function (data) {
                if(data.code==0){
                    layer.msg("操作成功！");
                    parent.location.reload();
                }else{
                    layer.msg(data.message);
                }

            },
            complete: function () {//完成响应
                $(".form1").find(".submitForm").removeAttr("disabled");
            }
        })
    });

})
//删除图片
function delimgs(a) {
    var sign=$(a).attr("sign");
    $("[sign='"+sign+"']").remove();
    $(".form1").find("[name='parameterValue']").val("");
}






