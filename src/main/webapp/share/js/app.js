/**
 * Created by qqy on 15/11/4.
 */

//var commonUrl = "http://172.16.74.14:8080/xlab-youle/";
var commonUrl = "http://101.231.124.8:45698/xlab-youle/";

get();
window.setInterval(get, 60000);

function get() {
    $.get(commonUrl + 'manager/user/countDownloadTimes/', function (data) {
        //console.log(data);
        $('#totalData').html(data.totalData);
        $('#day').html(data.day);
        $('#hour').html(data.hour);
        $('#minute').html(data.minute);
    });
}

$(function () {
    var ua = navigator.userAgent;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
    if (isMobile) {
        $('#web-download').hide();
        $('#mobile-download').show();
    } else {
        $('#web-download').show();
        $('#mobile-download').hide();
    }
    //或者单独判断iphone或android
    if (isIphone) {
        //code
    }
    else if (isAndroid) {
        //code
    } else {
        //code
    }
});




