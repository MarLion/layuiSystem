/**
 * Create by MarLion on 2019-07-01
 * */
window.CreateCalendar = (function () {
    var calendar = function () {

    };
    calendar.prototype = {
        init:function (obj) {
            this.content = document.getElementById(obj.elem);
            this.data = obj.data || {};
            this.content.innerHTML = '';
            this.addHtml();
        },
        addHtml:function () {
            var _this = this;
            _this.content.innerHTML = _this.createHtml(_this.data);
        },
        createHtml:function (data) {
            var _this = this;
            var _html = '';
            _html += '<table border="1" cellspacing="0" style="width: 100%;border: 1px solid #E4E4E4;">';
            _html +=    '<tr style="font-size: 18px;color: #333333;font-weight: bold;">';
            _html +=        '<th>周日</th>';
            _html +=        '<th>周一</th>';
            _html +=        '<th>周二</th>';
            _html +=        '<th>周三</th>';
            _html +=        '<th>周四</th>';
            _html +=        '<th>周五</th>';
            _html +=        '<th>周六</th>';
            _html +=    '</tr>';
            var startWeek = _this.getWeekDay(data[0].create_time);
            if (startWeek != 7) {
                /*第一行*/
                _html += '<tr>';
                for (var i = 0;i<startWeek;i++){
                    _html += '<td></td>';
                }
                for (var j = 0;j<7-startWeek;j++){
                    _html += '<td><p style="text-align: center;color: #333333;font-size: 18px;">'+data[j].create_time+'</p><p style="text-align: center;color: #005BFF;font-size: 16px;margin-top: 15px;">'+data[j].total+'</p></td>'
                }
                _html += '</tr>';
                /*中间行*/
                var m = Math.floor((data.length - (7-startWeek))/7); //取整
                var n = (data.length - (7-startWeek))%7; //去余
                for (var t = 0; t<m;t++){
                    _html += '<tr>';
                        for (var f = 0; f < 7;f++) {
                            _html += '<td><p style="text-align: center;color: #333333;font-size: 18px;">'+data[7*t+(7-startWeek)+f].create_time+'</p><p style="text-align: center;color: #005BFF;font-size: 16px;margin-top: 15px;">'+data[7*t+(7-startWeek)+f].total+'</p></td>'
                        }
                    _html += '</tr>';
                }
                /*最后一行*/
                _html += '<tr>';
                for(var z = data.length - n;z < data.length;z++){
                    _html += '<td><p style="text-align: center;color: #333333;font-size: 18px;">'+data[z].create_time+'</p><p style="text-align: center;color: #005BFF;font-size: 16px;margin-top: 15px;">'+data[z].total+'</p></td>'
                }
                for(var x = 0;x<(7-n);x++){
                    _html += '<td></td>'
                }
                _html += '</tr>';
            } else {
                var m1 = Math.floor((data.length - (7-startWeek))/7); //取整
                var n1 = (data.length - (7-startWeek))%7; //去余
                for (var t1 = 0; t1<m1;t1++){
                    _html += '<tr>';
                    for (var f1 = 0; f1 < 7;f1++) {
                        _html += '<td><p style="text-align: center;color: #333333;font-size: 18px;">'+data[7*t1+(7-startWeek)+f1].create_time+'</p><p style="text-align: center;color: #005BFF;font-size: 16px;margin-top: 15px;">'+data[7*t1+(7-startWeek)+f1].total+'</p></td>'
                    }
                    _html += '</tr>';
                }
                /*最后一行*/
                _html += '<tr>';
                for(var z1 = data.length - n1;z1 < data.length;z1++){
                    _html += '<td><p style="text-align: center;color: #333333;font-size: 18px;">'+data[z1].create_time+'</p><p style="text-align: center;color: #005BFF;font-size: 16px;margin-top: 15px;">'+data[z1].total+'</p></td>'
                }
                for(var x1 = 0;x1<(7-n1);x1++){
                    _html += '<td></td>'
                }
                _html += '</tr>';
            }
            _html += '</table>';
            return _html;
        },
        //判断第一天是星期几
        getWeekDay:function (s) {
            return new Date(Date.parse(s.replace(/\-/g,"/"))).getDay();
        }
    };
    return calendar;
})();
