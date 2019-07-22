
layui.define(['jquery', 'table', 'util','form','upload','upload'], function (exports) {
    var $ = layui.jquery;
    var util = layui.util;
    var form = layui.form;
    var upload=layui.upload;
    var base = {
        apiUrl: function (tableIns, p) {
            
        },
        apiShopUrl: function (tableIns, p) {
            
        },
        apiHospitalUrl: function (tableIns, p) {
           
        },
        apiOthUrl:function () {
           
        },

        apiCashFlow:function(){
            
        },
        _ajax:function(data){
            return $.ajax({
                type:data.type || 'post',
                async:true,
                dataType:'json',
                url:data.url,
                data:data.data || {},
                headers:data.headers || {
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                },
                success:function (res) {
                    if (res.code == 501) {
                        if (window.parent.parent != window.parent) {
                            window.parent.parent.location.href = '/role-admin/login.html';
                        } else if (window.parent != this.window) {
                            window.parent.location.href = '/role-admin/login.html';
                        }  else {
                            window.location.href = '/role-admin/login.html';
                        }

                    } else {
                        data.success(res);
                    }
                },
                error:function (error) {
                    data.error(error);
                    // if (window.parent != this.window) {
                    //     window.parent.location.href = '/role-admin/login.html';
                    // }  else {
                    //     window.location.href = '/role-admin/login.html';
                    // }
                }
            })
        },
        //导表带等待框ajax
        exportAjax:function(data){
            var sindex=base.show_load_layer();
            $.ajax({
                type:data.type || 'post',
                async:true,
                dataType:'json',
                url:data.url,
                data:data.data || {},
                headers:data.headers || {
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                },
                success:function (res) {
                    if (res.code == 501) {
                        window.location.href = '/role-admin/login.html';
                    } else {
                        data.success(res);
                    }
                    base.close_load_layer(sindex);
                },
                error:function (error) {
                    data.error(error);
                    base.close_load_layer(sindex);
                }
            })
        },
        //老财务系统调用ajax封装
        oldProjectAjax:function(data){
            $.ajax({
                type: 'post',
                async:true,
                dataType:'json',
                url:this.apiOthUrl(),
                data:{
                    actionName:data.actionName,
                    viewId:'1',
                    parameters:data.data
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                    'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                    'te_method': 'doAction'
                },
                success:function (res) {
                    if (res.code == 501) {
                        window.location.href = '/role-admin/login.html';
                    } else {
                        data.success(res);
                    }
                },
                error:function (error) {
                    console.log(error)
                }
            })
        },
        //获取位置信息
        getAreaMes:function (parentId,elem,filter,text,step) {
          this._ajax({
              url:this.apiOthUrl(),
              data:{
                  actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAccountsAction$listShopno',
                  viewId:'1',
                  parameters:"{'shopParentId': "+parentId +",'step':"+step+"}"
              },
              headers:{
                  'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                  'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                  'te_method': 'doAction'
              },
              success:function (res) {
                  var _el = $("#"+elem),
                      _html = '<option value="">'+text+'</option>',
                      _obj = res.data;
                  $.each(_obj,function (index,item) {
                      _html += '<option value='+item.id+'>'+item.name+'</option>';
                  });
                  _el.html(_html);
                  form.render('select',filter);
              },
              error:function (mes) {
                  console.log(mes);
              }
          })
        },
        //区域选择操作
        operateArea:function (a,b,c,d,e,f,g,h) {
            var _a =  a || 'companySelect',
                _b = b || 'company-div',
                _c = c || 'company-select',
                _d = d || 'areaSelect',
                _e = e || 'area-div',
                _f = f || 'area-select',
                _g = g || 'shopSelect',
                _h = h || 'shop-div';
            var _that = this;
            $("#"+_d).html('');
            $("#"+_g).html('');
            //传递1 表示第一次加载，传递2表示不是第一次加载
            _that.getAreaMes(1,_a,_b,'请选择分公司',1);
            //分公司选择
            form.on('select('+_c+')',function (data) {
                if (data.value != '' && data.value != '0') {
                    _that.getAreaMes(data.value,_d,_e,'请选择区域',2);
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                } else {
                    $("#"+_d).html('<option value="">请选择区域</option>');
                    form.render('select',_e);
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                }
                // console.log($("#companySelect").val());
            });
            //区域选择
            form.on('select('+_f+')',function (data) {
                if (data.value != '' && data.value != '0') {
                    _that.getAreaMes(data.value,_g,_h,'请选择门店',3);
                } else {
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                }
            });
            //设置重置
            layui.onevent('three','reset',function (param) {
                return param.fun
            });
        },
        //三级联动重置
        opereteReset:function (a,b,c,d,e,f,g,h) {
          var _that = this;
          layui.event('three','reset',{
              fun:_that.operateArea(a,b,c,d,e,f,g,h)
          })
        },
        /*包含大区选择的四级联动*/
        fourLevelAreaSelect:function(a,b,c,d,e,f,g,h,i,j,k){
          var _that = this;
          var _a = a || 'shopArea',
              _b = b || 'district-div',
              _c = c || 'shop-area',
              _d =  d || 'companySelect',
              _e = e || 'company-div',
              _f = f || 'company-select',
              _g = g || 'areaSelect',
              _h = h || 'area-div',
              _i = i || 'area-select',
              _j = j || 'shopSelect',
              _k = k || 'shop-div';
            $("#"+_d).html('');
            $("#"+_g).html('');
            $("#"+_j).html('');
          _that.getDistrictMes(_a,_b,'请选择大区',{});
          //点击大区拉出分公司
            form.on('select('+_c+')',function (data) {
                if (data.value != '') {
                    _that.getDistrictMes(_d,_e,'请选择分公司',{'cityId':data.value});
                    $("#"+_g).html('<option value="">请选择区域</option>');
                    form.render('select',_h);
                    $("#"+_j).html('<option value="">请选择门店</option>');
                    form.render('select',_k);
                } else {
                    $("#"+_d).html('<option value="">请选择区域</option>');
                    form.render('select',_e);
                    $("#"+_g).html('<option value="">请选择区域</option>');
                    form.render('select',_h);
                    $("#"+_j).html('<option value="">请选择门店</option>');
                    form.render('select',_k);
                }
            });
            //拉出区域
            form.on('select('+_f+')',function (data) {
                if (data.value != ''){
                    _that.getDistrictMes(_g,_h,'请选择区域',{'cityId':$("#"+_a).val(),'companyId':data.value});
                    $("#"+_j).html('<option value="">请选择门店</option>');
                    form.render('select',_k);
                } else {
                    $("#"+_g).html('<option value="">请选择区域</option>');
                    form.render('select',_h);
                    $("#"+_j).html('<option value="">请选择门店</option>');
                    form.render('select',_k);
                }
            });
            //拉出门店
            form.on('select('+_i+')',function (data) {
                if (data.value != ''){
                    _that.getDistrictMes(_j,_k,'请选择门店',{'cityId':$("#"+_a).val(),'companyId':$("#"+_d).val(),'areaId':data.value})
                } else {
                    $("#"+_j).html('<option value="">请选择门店</option>');
                    form.render('select',_k);
                }
            });
            //定义重置
            layui.onevent('four','reset',function (param) {
                return param.fun
            });
        },
        //调用重置
        fourReset:function (a,b,c,d,e,f,g,h,i,j,k) {
            var _that = this;
            layui.event('four','reset', {
                fun:_that.fourLevelAreaSelect(a,b,c,d,e,f,g,h,i,j,k)
            })
        },
        getDistrictMes:function (elem,filter,text,data) {
            var _that = this;
            _that._ajax({
                url:_that.apiUrl() + '/vipShopping/getDepts',
                type:'get',
                data:data,
                success:function (res) {
                    var _el = $("#"+elem),
                        _html = '<option value="">'+text+'</option>',
                        _obj = res.data;
                    $.each(_obj,function (index,item) {
                        _html += '<option value='+item.id+'>'+item.name+'</option>';
                    });
                    _el.html(_html);
                    form.render('select',filter);
                },
                error:function (error) {
                    console.log(error);
                }
            })
        },
        //多选下拉框实现 除去layui的类名之外 a b c类名作为选择器 d作为checkbox的name名
        multiSelect:function (a,b,c,d) {
            //订单类型复选框选中效果
            $("."+a).on("click",".layui-select-title",function(e){
                var $select=$(this).parents(".layui-form-select");
                $(".layui-form-select").not($select).removeClass("layui-form-selected");
                $select.addClass("layui-form-selected");
                e.stopPropagation();
            }).on("click",".layui-form-checkbox",function(e){
                e.stopPropagation();
            });
            //订单类型复选框选中后回显输入框
            $("."+b).click(function() {
                var titles=[];
                $("input:checkbox[name='"+d+"']:checked").each(function(e) {
                    titles.push($(this).attr('title'));//向数组中添加元素
                });
                $("."+c).val(titles);
            });
        },
        /*现金流这边区域操作需要全部选项 单独生成*/
        cashFlowGetAreaMes:function (parentId,elem,filter,text,step) {
            this._ajax({
                url:this.apiOthUrl(),
                data:{
                    actionName:'com.xguanjia.client.action.statistics.financialAnalysis.FinancialAccountsAction$listShopno',
                    viewId:'1',
                    parameters:"{'shopParentId': "+parentId +",'step':"+step+"}"
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                    'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                    'te_method': 'doAction'
                },
                success:function (res) {
                    var _el = $("#"+elem),
                        _html = '<option value="">'+text+'</option>' +
                            '<option value="0">全部</option>',
                        _obj = res.data;
                    $.each(_obj,function (index,item) {
                        _html += '<option value='+item.id+'>'+item.name+'</option>';
                    });
                    _el.html(_html);
                    form.render('select',filter);
                },
                error:function (mes) {
                    console.log(mes);
                }
            })
        },
        //区域选择操作
        CashFlowGperateArea:function (a,b,c,d,e,f,g,h) {
            var _a =  a || 'companySelect',
                _b = b || 'company-div',
                _c = c || 'company-select',
                _d = d || 'areaSelect',
                _e = e || 'area-div',
                _f = f || 'area-select',
                _g = g || 'shopSelect',
                _h = h || 'shop-div';
            var _that = this;
            $("#"+_d).html('');
            $("#"+_g).html('');
            _that.cashFlowGetAreaMes(1,_a,_b,'请选择分公司',1);
            //分公司选择
            form.on('select('+_c+')',function (data) {
                if (data.value != '' && data.value != '0') {
                    _that.cashFlowGetAreaMes(data.value,_d,_e,'请选择区域',2);
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                } else {
                    $("#"+_d).html('<option value="">请选择区域</option>');
                    form.render('select',_e);
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                }
                // console.log($("#companySelect").val());
            });
            //区域选择
            form.on('select('+_f+')',function (data) {
                if (data.value != '' && data.value != '0') {
                    _that.cashFlowGetAreaMes(data.value,_g,_h,'请选择门店',3);
                } else {
                    $("#"+_g).html('<option value="">请选择门店</option>');
                    form.render('select',_h);
                }
            });
            layui.onevent('cash','reset',function (param) {
                return param.fun
            })
        },
        //现金流重置
        cashFlowReset:function (a,b,c,d,e,f,g,h) {
            var _that = this;
            layui.event('cash','reset', {
                fun:_that.CashFlowGperateArea(a,b,c,d,e,f,g,h)
            })
        },
        //批量导出 by 王金峰
        exportExcelBatch:function (obj,a,b,c) {
            //增加遮罩
            // $("."+c).show();
            var _that = this;
            var t = _that.show_load_layer();
            base._ajax({
                url:_that.apiOthUrl(),
                data:{
                    actionName:a,
                    parameters:JSON.stringify(obj)
                },
                headers:{
                    'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                    'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                    'te_method': 'doAction'
                },
                success:function (res) {
                    //console.log(res);
                    if (res.data.success) {
                        var file = res.data.address;
                        base._ajax({
                            url:_that.apiOthUrl(),
                            data:{
                                actionName:b,
                                parameters:"{'address':'"+res.data.address+"'}"
                            },
                            headers:{
                                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                                'te_method': 'doAction'
                            },
                            success:function (result) {
                                if (result.data == 0) {
                                    window.location.href = _that.apiOthUrl()+"?downloadPath=" + encodeURI(encodeURI(file));
                                    _that.close_load_layer(t);
                                } else {
                                    _that.close_load_layer(t);
                                    layer.msg('暂无数据！');
                                }
                            }
                        })
                    } else {
                        _that.close_load_layer(t);
                        layer.msg('暂无数据！');
                    }
                },
                error:function (error) {
                    console.log(error);
                    _that.close_load_layer(t);
                    layer.msg('导出出错！');
                }
            })
        },

        maxDate:function() {
            var date = new Date();
            var yesterday = new Date(date);
            return yesterday.getFullYear() + "-" + (yesterday.getMonth() + 1) + "-" + yesterday.getDate()+" "+yesterday.getHours()+":"+yesterday.getMinutes()+":"+yesterday.getSeconds();
        },

        pad2:function (n) {
            return n < 10 ? '0' + n : n
        },
        getFormDate:function() {
            var date = new Date();
            return date.getFullYear().toString() +"-"+ base.pad2(date.getMonth() + 1) +"-"+ base.pad2(date.getDate());
        },
        downExcel:function(url, fileName) {
            var _that = this;
            var s = _that.show_load_layer();
            var xhh = new XMLHttpRequest();
            xhh.open("post", url);
            xhh.setRequestHeader("xxl_sso_sessionid", window.sessionStorage.getItem('sessionid'));
            xhh.responseType = 'blob';
            xhh.onreadystatechange = function () {
                if (xhh.readyState === 4 && xhh.status === 200) {
                    var blob = new Blob([xhh.response], {type: 'text/xls'});
                    var csvUrl = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = csvUrl;
                    link.download = fileName+".xlsx";
                    link.click();
                    _that.close_load_layer(s);
                }
            };
            xhh.send();
         },
        judgeDownload:function(url,fileName,length){;
            if (length<1){
                base.exportsExcelWithoutConditionTip('base.downExcel("'+url+'","'+fileName+'")');
            } else {
                base.exportsExcelTip('base.downExcel("'+url+'","'+fileName+'")');
            }
        },
        downXlsxExcel:function(url, fileName) {
            var _that = this;
            var s = _that.show_load_layer();
            var xhh = new XMLHttpRequest();
            xhh.open("post", url);
            xhh.setRequestHeader("xxl_sso_sessionid", window.sessionStorage.getItem('sessionid'));
            xhh.responseType = 'blob';
            xhh.onreadystatechange = function () {
                if (xhh.readyState === 4 && xhh.status === 200) {
                    var blob = new Blob([xhh.response], {type: 'text/xlsx'});
                    var csvUrl = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = csvUrl;
                    link.download = fileName+".xlsx";
                    link.click();
                    _that.close_load_layer(s);
                }
            };
            xhh.send();
        },
        /*时间选择提示弹框*/
        checkSearchContend:function(startTime, endTime){
            if (startTime) {
                if (!endTime) {
                    layer.alert('起止时间不能只选择一个', {
                        icon : 7
                    });
                    return false;
                }
                var start = new Date(startTime);
                var end = new Date(endTime);
                var varify = end >= start;
                if (!varify) {
                    layer.alert("结束时间必须大于开始时间！", {
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
            if(!startTime && ! end){
                layer.alert('请选择时间', {
                    icon : 7
                });
                return false;
            }
            return true;
        },
        /*导出提示框  这里要传入下载方法的字符串 eval执行 否则一调用此方法就会下载*/
        exportsExcelTip:function (params) {
            layer.open({
                closeBtn: 0,
                shadeClose: true,
                skin: '',
                title: '提示'
                ,content:
                    '<div style="margin-top: 5px">1、请点击按钮确认是否继续操作!</div>'+
                    '<div style="margin-top: 5px">2、当数据比较多的时候，导出时间会很长，请耐心等待。</div>'
                , area: ['360px', '270px']
                ,btnAlign: 'c'
                ,btn: ['确定导出', '放弃导出']
                ,yes: function () {
                    layer.closeAll();
                    eval(params);
                }
                ,btn2: function(){
                    layer.closeAll();
                }
            });
        },
        /*未选择条件导出提示框*/
        exportsExcelWithoutConditionTip:function (params) {
            layer.open({
                closeBtn: 0,
                shadeClose: true,
                skin: '',
                title: '提示'
                ,content:
                    '<div style="margin-top: 5px">您未选择任一查询条件，导出的数据会比较大，会存在一定的性能风险，如果您任然要执行该操作，请点击确认导出，但您的操作会被记录，谢谢！</div>'
                , area: ['360px', '270px']
                ,btnAlign: 'c'
                ,btn: ['确定导出', '放弃导出']
                ,yes: function () {
                    layer.closeAll();
                    eval(params);
                }
                ,btn2: function(){
                    layer.closeAll();
                }
            });
        },
        /**
         * --将json数据导出为excel 引入xlxs.full.min.js和saveFile.js
         * 参数说明：
         * data为数据源 [{name:'张三',age:18}] 必传
         *  name为excel名 不传默认为 下载.xlxs
         *  cols设置表格列宽 不传为默认宽度 [{wpx:30},{wpx:50}] 从左往右
         */
        downloadExl:function (data,name,cols,firstR,templateMap){
            if(!cols){
                cols=[{wpx:100},{wpx:80},{wpx:80},{wpx:80},{wpx:80},{wpx:80},{wpx:80},{wpx:80},{wpx:80}];
            }
            var _name = name || '下载';
            var keys;
            if(firstR){
                 keys = Object.keys(firstR);
            }else {
                keys = Object.keys(data[0]);
            }
            var firstRow = {};
            if(firstR){
                firstRow=firstR
            }else {
                keys.forEach(function (item) {
                    firstRow[item] = item;
                });
            }

            data.unshift(firstRow);
            var content = {};

            // 把json格式的数据转为excel的行列形式
            var sheetsData = data.map(function (item, rowIndex) {
                return keys.map(function (key, columnIndex) {
                    var val=item[key];
                    if(templateMap){
                        var fun=templateMap[key]
                        if(rowIndex!=0&&fun){
                            val=fun(item)
                        }
                    }
                    return Object.assign({}, {
                        value: val,
                        position: (columnIndex > 25 ? this.getCharCol(columnIndex) : String.fromCharCode(65 + columnIndex)) + (rowIndex + 1),
                    });
                });
            }).reduce(function (prev, next) {
                return prev.concat(next);
            });

            sheetsData.forEach(function (item, index) {
                content[item.position] = { v: item.value };
            });

            //设置区域,比如表格从A1到D10,SheetNames:标题，
            var coordinate = Object.keys(content);
            content["B1"].s = {
                font: { sz: 20, bold: true, color: '#2A8916' },
                fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "#F1E2E2" }}
            };//<====设置xlsx单元格样式
            // content["!merges"] = [{
            //     s: { c: 1, r: 0 },
            //     e: { c: 4, r: 0 }
            // }];//<====合并单元格
            var workBook = {
                SheetNames: ["sheet1"],
                Sheets: {
                    "sheet1": Object.assign({}, content, { "!ref": coordinate[0] + ":" + coordinate[coordinate.length - 1] , "!cols":cols})//"!rows":[{hpx:30},{hpx:30},{hpx:30},{hpx:30}]
                },

            };
            //这里的数据是用来定义导出的格式类型
            var excelData = XLSX.write(workBook, { bookType: "xlsx", bookSST: false, type: "binary" });
            var blob = new Blob([this.string2ArrayBuffer(excelData)], { type: "" });
            saveAs(blob, _name+".xlsx");
        },
        //字符串转字符流
        string2ArrayBuffer:function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        },
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
        getCharCol:function(n) {
            var temCol = "",
                s = "",
                m = 0
            while (n > 0) {
                m = n % 26 + 1
                s = String.fromCharCode(m + 64) + s
                n = (n - m) / 26
            }
            return s
        },

        //数字格式化 整数和小数的整数部分每3个加一个逗号
        formattedNumber:function (num) {
            var isMinus = (num || 0).toString().indexOf('-') != -1;
            var isFloat = (num || 0).toString().indexOf('.') != -1;
            var d = isFloat ? (num || 0).toString().split('.') : (num || 0).toString();
            var da = isFloat ? d[0] : d;
            var reg = new RegExp('-','g');
            da = isMinus ? da.replace(reg,'') : da;
            var result = '';
            while (da.length > 3) {
                result = ',' + da.slice(-3) + result;
                da = da.slice(0, da.length - 3);
            }
            if (da) { result = isFloat ? da + result + '.' + d[1] : da + result; }
            result = isMinus ? '-' + result : result;
            return result;
        },
        isNull: function (a) {
            if (a == undefined || a == '' || a == null) {
                return true;
            }
            return false;
        },
        //获取form表单json数据
        serializeObject: function (e) {
            var o = {};
            var a = e.serializeArray();
            $.each(a, function (index, element) {
                o[element.name] = element.value || ''
            });
            return o;
        },
        //时间戳转换
        toDateString: function (date) {
            if (date == null || date == "undefined" || date == '') return '';
            return util.toDateString(date)
        },
        //从第一页重载表格
        reload: function (tableIns, p) {
            tableIns.reload({})
        },
        // layui加载动画
        show_load_layer:function() {
            return layer.msg('努力加载中...', {
                icon: 16
                ,shade: [0.3, '#000']
                ,time:false       //取消遮罩层的自动关闭
            });
        },
        //判断是否显示图表label
        juddgeDay:function(beg,end) {
            var _bt = new Date(beg).getTime();
            var _et = new Date(end).getTime();
            return _et - _bt > 60 * 60 * 24 * 7 * 1000;
        },
// 关闭加载层
        close_load_layer:function(index) {
            layer.close(index);
        },
        //获取当前日期的前一天
        getLastDay:function () {
                 var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1; //当前月
                var strDate = date.getDate()-1; //前一天
                var isRun=year%400==0&&year%100!=0||year%400==0; //是否闰年
                var bigMonth = [1,3,5,7,8,10,12]; //大月
                var smallMonth = [4,6,9,11];//小月
                var last = month-1; //上个月
                if (strDate == 0) {
                    if (bigMonth.indexOf(last) != -1) {
                        strDate = 31;
                    }
                    if (smallMonth.indexOf(last) != -1) {
                        strDate = 30
                    }
                    if (last == 2) {
                        if (isRun) {
                            strDate = 29;
                        } else {
                            strDate = 28;
                        }
                    }
                    month = month == 1 ? 12 : last;
                }
                month = month > 9 ? month:'0' + month;
                strDate = strDate > 9 ? strDate:'0' + strDate;
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
        },
        //获取昨天时间年月日
        getNowDate: function () {
            var curr_time = new Date();
            curr_time.setTime(curr_time.getTime() - 24*60*60*1000);
            var year = curr_time.getFullYear();
            var month = curr_time.getMonth() + 1;
            var date = curr_time.getDate();
            var strDate = year + "-" + Appendzero(month) + "-" + Appendzero(date);
            return strDate;
        },
        //获取昨天的前30天时间
        getFirstDayOfMonth: function () {
            var curr_time = new Date();
            curr_time.setTime(curr_time.getTime() - 24*60*60*1000*30);
            var year = curr_time.getFullYear();
            var month = curr_time.getMonth() + 1;
            var date = curr_time.getDate();
            var strDate = year + "-" + Appendzero(month) + "-" + Appendzero(date);
            return strDate;
        },
        //获取昨天的前7天时间
        getFirstSevenDay: function () {
            var curr_time = new Date();
            curr_time.setTime(curr_time.getTime() - 24*60*60*1000*7);
            var year = curr_time.getFullYear();
            var month = curr_time.getMonth() + 1;
            var date = curr_time.getDate();
            var strDate = year + "-" + Appendzero(month) + "-" + Appendzero(date);
            return strDate;
     //    }
     // };
        },
        //本月第一天时间
        getCurrentMonthFirst:function () {
            var date = new Date();
            date.setDate(1);
            var month = parseInt(date.getMonth()+1);
            var day = date.getDate();
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            return date.getFullYear() + '-' + month + '-' + day+' 00:00:00';
        },
       //本月最后一天
        getCurrentMonthLast:function () {
            var date=new Date();
            var currentMonth=date.getMonth();
            var nextMonth=++currentMonth;
            var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
            var oneDay=1000*60*60*24;
            var lastTime = new Date(nextMonthFirstDay-oneDay);
            var month = parseInt(lastTime.getMonth()+1);
            var day = lastTime.getDate();
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            return date.getFullYear() + '-' + month + '-' + day+' 23:59:59';
        },
        //获取某一天时间，时间格式为yyyy-MM-dd HH:mm:ss
        dateFormatter:function( dateInput ) {
        var year = dateInput.getFullYear();
        var month = dateInput.getMonth() + 1;
        var theDate = dateInput.getDate();

        var hour = dateInput.getHours();
        var minute = dateInput.getMinutes();
        var second = dateInput.getSeconds();

        if ( month < 10 ) {
            month = '0' + month;
        }

        if ( theDate < 10 ) {
            theDate = '0' + theDate;
        }

        if ( hour < 10 ) {
            hour = '0' + hour;
        }

        if ( minute < 10 ) {
            minute = '0' + minute;
        }

        if ( second < 10 ) {
            second = '0' + second;
        }

        return year +"-"+ month +"-" + theDate + " "+ hour +":"+ minute +":"+ second;
    },
        //#######类别图表(今日平台积分增加，昨日平台积分增加....)#######
        getIntegralChartData:function (integralType,time){
           var thisSelf = this;
           var m = thisSelf.show_load_layer(); //loading层
           this._ajax({
            url:this.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$integralAdd',
                viewId:'1',
                parameters:"{'time': "+ time +",'integtalType':"+integralType+"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                $("#integralName").html(_obj.integralName);
                $("#addIntegral").html(_obj.addIntegral);
                $("#yestaddIntegral").html(_obj.yestaddIntegral);
                $("#monthIntegral").html(_obj.monthIntegral);
                document.getElementById("dayRise").innerHTML= _obj.allyestIntegral;
                thisSelf.changeColor(_obj.integralnum,'day-rises-icon','dayRises');
                document.getElementById("dayRises").innerHTML= _obj.integralnum+"%";
                document.getElementById("monthRise").innerHTML= _obj.monthRise;
                thisSelf.changeColor(_obj.monthRises,'month-rises-icon','monthRises');
                document.getElementById("monthRises").innerHTML= _obj.monthRises+"%";
                thisSelf.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })
    },
        changeColor:function (n,cl,id) {
            var i = $('.'+cl);
            var s = $("#"+id);
            n = parseFloat(n);
            if (n > 0) {
                i.attr('src','../icon/up.png');
                s.removeClass('col-g').removeClass('col-b').addClass('col-r');
            } else if (n < 0) {
                i.attr('src','../icon/down.png');
                s.removeClass('col-r').removeClass('col-b').addClass('col-g');
            } else {
                i.attr('src','../icon/eq.png');
                s.removeClass('col-r').removeClass('col-g').addClass('col-b');
            }
        },
    //#######Echarts图标#######
    getIntegralChat:function(integralType,time){
        var thisSelf = this;
        var begindate = time.substr(0, 10);
        var enddate = time.substr(13, 10);
        var m = thisSelf.show_load_layer(); //loading层
        this._ajax({
            url:this.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$integralChat',
                viewId:'1',
                parameters:"{'integtalType': "+ integralType +", 'begindate': "+ begindate +", 'enddate': "+ enddate +"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var names = [];
                var nums = [];
                for (var i = 0; i < _obj.length; i++) {
                    names.push(_obj[i].time);
                }

                for (var i = 0; i < _obj.length; i++) {
                    nums.push(_obj[i].integral);
                }

                var saleChart = echarts.init(document.getElementById('saleChart'));
                var option = {
                    legend:{
                        data:['积分数据']
                    },
                    tooltip:{
                        trigger: 'axis'
                    },
                    grid:{
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        show:true,
                        x:'100',
                        feature: {
                            dataView : {show: false, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        axisLabel: {
                            rotate: 30
                        },
                        data: names
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    series: [{
                        name: '积分数据',
                        type: 'line',
                        symbolSize: 4,
                        color: ['#406ece'],
                        smooth: false,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                    type: 'solid'
                                }
                            }
                        },
                        barWidth:20,
                        label: {
                            normal: {
                                show: false,
                                position: 'top'
                            }
                        },
                        areaStyle:{color: '#e2e9f7'},
                        data: nums
                    }]
                };
                option.series[0].label.normal.show = !thisSelf.juddgeDay(begindate, enddate);
                saleChart.setOption(option,true);
                thisSelf.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })

    },
    //#######30天内积分情况#######
        getIntegralChatList:function (integralType) {
        var thisSelf = this;
        var m = thisSelf.show_load_layer(); //loading层
            this._ajax({
            url:this.apiOthUrl(),
            data:{
                actionName:'com.xguanjia.client.action.statistics.saleManage.IntegralAction$integralChatList',
                viewId:'1',
                parameters:"{'integtalType': "+ integralType +"}"
            },
            headers:{
                'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid'),
                'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
                'te_method': 'doAction'
            },
            success:function (res) {
                var _obj = res.data;
                var _html = '';
                for (var i = _obj.length-1; i >=0; i--) {
                    _html +=  '<div class="swiper-slide slide-container">';
                    _html +=    '<p>'+_obj[i].time+'</p>';
                    _html +=    '<p>积分数据：</p>';
                    _html +=    '<p>'+_obj[i].integral+'</p>';
                    _html +=  '</div>';
                }
                $(".swiper-wrapper").html(_html);
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 'auto',
                    spaceBetween: 5,
                    freeMode: true,
                    observer: true,
                    observeParents: true
                });
                thisSelf.close_load_layer(m); //关闭loading
            },
            error:function (mes) {
                console.log(mes);
            }
        })
     },
        arrowColor:function (changeValue,colorValue){
        var changeValue =parseFloat(changeValue);
        var colorValue =parseFloat(colorValue);
        var str2 ='';
        str2 +='<span>'+changeValue+'</span>';
        if(colorValue < -100){
            str2 +='<span class="arrow_decline6"></span>';
            str2 +='<span class="tab_decline6" >'+colorValue+'%</span>';
        }else if(colorValue >= -100 && colorValue< -80){
            str2 +='<span class="arrow_decline4"></span>';
            str2 +='<span class="tab_decline4" >'+colorValue+'%</span>';
        }else if(colorValue >= -80 && colorValue< -60){
            str2 +='<span class="arrow_decline4"></span>';
            str2 +='<span class="tab_decline4" >'+colorValue+'%</span>';
        }else if(colorValue >= -60 && colorValue< -40){
            str2 +='<span class="arrow_decline3"></span>';
            str2 +='<span class="tab_decline3">'+colorValue+'%</span>';
        }else if(colorValue >= -40 && colorValue< -20){
            str2 +='<span class="arrow_decline2"></span>';
            str2 +='<span class="tab_decline2">'+colorValue+'%</span>';
        }else if(colorValue >= -20 && colorValue < 0){
            str2 +='<span class="arrow_decline1"></span>';
            str2 +='<span class="tab_decline1">'+colorValue+'%</span>';
        }else if(colorValue == 0){
            str2 +='<span class="icon_equal"></span>';
            str2 +='<span class="tab_equal" >'+colorValue+'%</span>';
        }else if(colorValue > 0 && colorValue < 20){
            str2 +='<span class="arrow_rise1"></span>';
            str2 +='<span class="tab_rise1">'+colorValue+'%</span>';
        }else if(colorValue >= 20 && colorValue < 40){
            str2 +='<span class="arrow_rise2"></span>';
            str2 +='<span class="tab_rise2">'+colorValue+'%</span>';
        }else if(colorValue >= 40 && colorValue < 60){
            str2 +='<span class="arrow_rise3"></span>';
            str2 +='<span class="tab_rise3">'+colorValue+'%</span>';
        }else if(colorValue >= 60 && colorValue < 80){
            str2 +='<span class="arrow_rise4"></span>';
            str2 +='<span class="tab_rise4">'+colorValue+'%</span>';
        }else if(colorValue >= 80 && colorValue < 100){
            str2 +='<span class="arrow_rise5"></span>';
            str2 +='<span class="tab_rise5">'+colorValue+'%</span>';
        }else if(colorValue >=100){
            str2 +='<span class="arrow_rise6"></span>';
            str2 +='<span class="tab_rise6">'+colorValue+'%</span>';
        }
        return str2;
    },

    //判断时间跨度是否超过指定月
    judgeMonthInterval:function (startTime,endTime,specificMonth) {
        startTime = new Date(startTime);
        endTime = new Date(endTime);
        if (endTime <= startTime){
            return false;
        }
        var startYear = startTime.getFullYear();
        var endYear = endTime.getFullYear();
        var startMonth = startTime.getMonth() + 1;
        var endMonth = endTime.getMonth() + 1;
        var distanceYear = endYear - startYear;
        var distanceMonth = 0;
        if (endMonth >= startMonth){
            distanceMonth = (endMonth - startMonth + 1) + distanceYear * 12;
        }else{
            distanceMonth = (12 - (startMonth - endMonth) + 1) + (distanceYear - 1) * 12;
        }
        return distanceMonth > specificMonth;
    }

};

    //-----------------------------------------------------------------------------------------------------------------------

    //补0
    function Appendzero(obj)
    {
        if(obj<10) {
            return "0" +""+ obj;
        } else {
            return obj;
        }
    }
    //自动填充表单数据
    $.fn.formSerialize = function (formdate) {
        var element = $(this);
        if (formdate) {
            for (var key in formdate) {
                var str="[name='"+key+"']"
                var $id = element.find(str);
                var value = $.trim(formdate[key]).replace(/ /g, '');
                var type = $id.attr('type');
                switch (type) {
                    case "checkbox":
                        if (value == "true") {
                            $id.attr("checked", 'checked');
                        } else {
                            $id.removeAttr("checked");
                        }
                        break;
                    case "select":
                        $id.val(value).trigger("change");
                        form.render("select")
                        break;
                    case "span":
                        $id.html(value);
                        break;
                    default:
                        if(type!='radio'){
                            $id.val(value);
                        }
                        break;
                }
            };
        }
    };
    //获取表单数据
    $.fn.serializeObject = function () {
        var o = {};
        var a = $(this).serializeArray();
        $.each(a, function (index, element) {
            o[element.name] = element.value || ''
        });
        return o;
    };
    exports('base', base);
});

//移动图片
function changeDiv(a,b){
    //自身节点
    var firstDiv = $(a).parent().parent();
    //图片左移一位
    var secondDiv;
    if(b==0){
        secondDiv = firstDiv.prev();
        if(secondDiv.attr("sign")==null){
            layer.msg("禁止左移");
            return;
        }
    }
    if(b==1){
        secondDiv=firstDiv.next();
        if(secondDiv.attr("sign")==null){
            layer.msg("禁止右移");
            return;
        }
    }


    var temp;
    temp = firstDiv.html();
    firstDiv.html(secondDiv.html());
    secondDiv.html(temp);
    var firstDivValue = firstDiv.attr("sign");
    var secondDivValue = secondDiv.attr("sign");
    firstDiv.attr("sign",secondDivValue);
    secondDiv.attr("sign",firstDivValue);
    var firstSign=firstDiv.attr("sign");
    var secondSign=secondDiv.attr("sign");

//    移动隐藏域中的div

    var hiddenFirst = $("input[sign='"+firstSign+"']");
    var hiddenSecond =  $("input[sign='"+secondSign+"']");
    var hf_sign=hiddenFirst.attr("sign");
    var hf_value=hiddenFirst.val();
    var hs_sign=hiddenSecond.attr("sign");
    var hs_value=hiddenSecond.val();
//    交换隐藏域中的值
    hiddenFirst.attr("sign",hs_sign);
    hiddenFirst.val(hs_value);
    hiddenSecond.attr("sign",hf_sign);
    hiddenSecond.val(hf_value);

}
//删除图片
function delimg(a) {
    var sign=$(a).attr("sign");
    $("[sign='"+sign+"']").remove()
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
