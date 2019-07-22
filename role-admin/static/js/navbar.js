layui.define(['element', 'common'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element,
        common = layui.common,
        cacheName = 'tb_navbar';

    var Navbar = function () {
		/**
		 *  默认配置
		 */
        this.config = {
            elem: undefined, //容器
            data: undefined, //数据源
            url: undefined, //数据源地址
            type: 'post', //读取方式
            cached: false, //是否使用缓存
            spreadOne: false, //设置是否只展开一个二级菜单
            params:{} //查询参数
        };
        this.v = '1.0.0';
    };
    //渲染
    Navbar.prototype.render = function () {
        var _that = this;
        var _config = _that.config;
        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
            common.throwError('Navbar error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
        }
        var $container;
        if (typeof (_config.elem) === 'string') {
            $container = $('' + _config.elem + '');
        }
        if (typeof (_config.elem) === 'object') {
            $container = _config.elem;
        }
        if ($container.length === 0) {
            common.throwError('Navbar error:找不到elem参数配置的容器，请检查.');
        }
        if (_config.data === undefined && _config.url === undefined) {
            common.throwError('Navbar error:请为Navbar配置数据源.')
        }
        if (_config.data !== undefined && typeof (_config.data) === 'object') {
            console.log(_config.data);
            var html = getHtml(_config.data);
            $container.html(html);
            element.init();
            _that.config.elem = $container;
        } else {
            if (_config.cached) {
                var cacheNavbar = layui.data(cacheName);
                if (cacheNavbar.navbar === undefined) {
                    $.ajax({
                        type: _config.type,
                        url: _config.url,
                        async: false, //_config.async,
                        dataType: 'json',
                        data:_config.params,
                        headers:{
                            'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                        },
                        success: function (result, status, xhr) {
                            if (result.code == 501) {
                                window.location.href = 'login.html';
                                return;
                            }
                            //添加缓存
                            layui.data(cacheName, {
                                key: 'navbar',
                                value: result
                            });
                            var html = getHtml(result);
                            $container.html(html);
                            element.init();
                        },
                        error: function (xhr, status, error) {
                            common.msgError('Navbar error:' + error);
                        },
                        complete: function (xhr, status) {
                            _that.config.elem = $container;
                        }
                    });
                } else {
                    var html = getHtml(cacheNavbar.navbar);
                    $container.html(html);
                    element.init();
                    _that.config.elem = $container;
                }
            } else {
                //清空缓存
                layui.data(cacheName, null);
                $.ajax({
                    type: _config.type,
                    url: _config.url,
                    async: false, //_config.async,
                    dataType: 'json',
                    data:_config.params,
                    headers:{
                        'xxl_sso_sessionid':window.sessionStorage.getItem('sessionid')
                    },
                    success: function (result, status, xhr) {
                        if (result.code == 501) {
                            window.location.href = 'login.html';
                            return;
                        }
                        var html = getHtml(result);
                        $container.html(html);
                        element.init();
                    },
                    error: function (xhr, status, error) {
                        common.msgError('Navbar error:' + error);
                    },
                    complete: function (xhr, status) {
                        _that.config.elem = $container;
                    }
                });
            }
        }

        //只展开一个二级菜单
        if (_config.spreadOne) {
            var $ul = $container.children('ul');
            $ul.find('li.layui-nav-item').each(function () {
                $(this).on('click', function () {
                    $(this).siblings().removeClass('layui-nav-itemed');
                });
            });
        }
        return _that;
    };
	/**
	 * 配置Navbar
	 * @param {Object} options
	 */
    Navbar.prototype.set = function (options) {
        var that = this;
        that.config.data = undefined;
        $.extend(true, that.config, options);
        return that;
    };
	/**
	 * 绑定事件
	 * @param {String} events
	 * @param {Function} callback
	 */
    Navbar.prototype.on = function (events, callback) {
        var that = this;
        var _con = that.config.elem;
        if (typeof (events) !== 'string') {
            common.throwError('Navbar error:事件名配置出错，请参考API文档.');
        }
        var lIndex = events.indexOf('(');
        var eventName = events.substr(0, lIndex);
        var filter = events.substring(lIndex + 1, events.indexOf(')'));
        if (eventName === 'click') {
            if (_con.attr('lay-filter') !== undefined) {
                _con.children('ul').find('li').each(function () {
                    var $this = $(this);
                    if ($this.find('dl').length > 0) {
                        var $dd = $this.find('dd').each(function () {
                            $(this).on('click', function () {
                                var $a = $(this).children('a');
                                var href = $a.data('url');
                                var icon = $a.children('i:first').data('icon');
                                var title = $a.children('cite').text();
                                //var id = $(this).attr('lay-filter');
                                var data = {
                                    elem: $a,
                                    field: {
                                        href: href,
                                        icon: icon,
                                        title: title,
                                       // id:id
                                    }
                                }
                                callback(data);
                            });
                        });
                    } else {
                        $this.on('click', function () {
                            var $a = $this.children('a');
                            var href = $a.data('url');
                            var icon = $a.children('i:first').data('icon');
                            var title = $a.children('cite').text();
                            //var id = $(this).attr('lay-filter');
                            var data = {
                                elem: $a,
                                field: {
                                    href: href,
                                    icon: icon,
                                    title: title,
                                   // id:id
                                }
                            }
                            callback(data);
                        });
                    }
                });
            }
        }
    };
	/**
	 * 清除缓存
	 */
    Navbar.prototype.cleanCached = function () {
        layui.data(cacheName, null);
    };
	/**
	 * 获取html字符串
	 * @param {Object} data
	 */
    function getHtml(data) {
        //debugger;
        $("#bigTitle").html(data[0].sourceName);
        var ulHtml = '<ul class="layui-nav layui-nav-tree beg-navbar">';
        for (var i = 0; i < data.length; i++) {
            // console.log(data[i].children);
            if (data[i].spread) {
                ulHtml += '<li class="layui-nav-item layui-nav-itemed" lay-filter="'+data[i].id+'" style="position: relative">';
            } else {
                ulHtml += '<li class="layui-nav-item" lay-filter="'+data[i].id+'" style="position: relative">';
            }
            if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
                ulHtml += '<a href="javascript:;">';
                ulHtml += '<span style="position: absolute;top: 0;bottom: 0;margin: auto;"><img src="'+data[i].icon+'"/></span>';
                ulHtml += '<cite style="margin-left: 42px;">' + data[i].title + '</cite>';
                ulHtml += '<span style="position: absolute;top: 0;bottom: 0;right: 30px;margin: auto;"><img src="static/images/levelArr.png"/></span>';
                ulHtml += '</a>';
                ulHtml += '<dl class="layui-nav-child">';
                for (var j = 0; j < data[i].children.length; j++) {
                    ulHtml += '<dd class="layui-no-this" title="' + data[i].children[j].title + '">';
                    ulHtml += '<a href="javascript:;" data-url="' + data[i].children[j].href + '">';
                    ulHtml += '<span><img src="static/images/secondNav.png"/></span>';
                    ulHtml += '<cite style="margin-left: 20px;">' + data[i].children[j].title + '</cite>';
                    ulHtml += '</a>';
                    ulHtml += '</dd>';
                }
                ulHtml += '</dl>';
            } else {
                var dataUrl = (data[i].href !== undefined && data[i].href !== '') ? 'data-url="' + data[i].href + '"' : '';
                ulHtml += '<a href="javascript:;" ' + dataUrl + '>';
                ulHtml += '<span style="position: absolute;top: 0;bottom: 0;margin: auto;"><img src="'+data[i].icon+'"/></span>';
                ulHtml += '<cite style="margin-left: 42px;">' + data[i].title + '</cite>';
                ulHtml += '<span style="position: absolute;top: 0;bottom: 0;right: 30px;margin: auto;"><img src="static/images/levelArr.png"/></span>';
                ulHtml += '</a>';
            }
            ulHtml += '</li>';
        }
        ulHtml += '</ul>';

        return ulHtml;
    }

    var navbar = new Navbar();

    exports('navbar', function (options) {
        return navbar.set(options);
    });
});
