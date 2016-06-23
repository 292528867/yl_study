var orderInfoUrl = server + '/mall/manager/order?sort=lastModifiedDate,desc';
var dataes;
$.get(orderInfoUrl, function (data) {
    dataes = data;
    var datas = '';
    var type = '';
    $.each(data.content, function (n, value) {
        datas += "<tr style='display: none' ><td><input type='checkbox'/></td><td>" + value.id +
            "</td>" +
            "<td><a href='#'>" + value.mallProductNames + "</a></td>" +
            "<td><a href='#'>" + value.score + "</a></td>" +
            "<td><a href='userInfoList.html#"+value.userName+"'>" + value.userName + "</a></td>" +
            "<td><a href='#'>" + value.receiver + "</a></td>" +
            "<td><a href='#'>" + value.receiverPhone + "</a></td>" +
            "<td><a href='#'>" + value.receiverAddress + "</a></td>" +
            "<td><a href='#'>" + new Date(value.createdDate).pattern("yyyy年MM月dd日") + "</a></td>" +
            "<td><a href='#'>" + value.orderStatusDesc + "</a></td>" +
            "</tr>";

    });

    $("#order-data").append(datas);
    $("#order-data tr").fadeIn(300);
    $("#total").append(data.content.length);
});

function searchOrder(goodsName, consigneeName) {
    var lists = '';
    var type = '';
    var sexs = '';
    $.each(dataes.content, function (n, value) {
        var productNames = value.mallProductNames;
        var receiver = value.receiver;
        if ((goodsName.length != 0 && productNames.search(goodsName) != -1) || (consigneeName.length != 0 && receiver.search(consigneeName) != -1 ) || (goodsName.length === 0 && consigneeName.length === 0)) {
            lists += "<tr style='display: none' ><td><input type='checkbox'/></td><td>" + value.id +
                "</td>" +
                "<td><a href='#'>" + value.mallProductNames + "</a></td>" +
                "<td><a href='#'>" + value.score + "</a></td>" +
                "<td><a href='#'>" + value.receiver + "</a></td>" +
                "<td><a href='#'>" + value.receiverPhone + "</a></td>" +
                "<td><a href='#'>" + value.receiverAddress + "</a></td>" +
                "<td><a href='#'>" + new Date(value.createdDate).pattern("yyyy年MM月dd日") + "</a></td>" +
                "<td><a href='#'>" + value.orderStatusDesc + "</a></td>" +
                "</tr>";

        }
        ;
    });
    $("#order-data").html('');
    $("#order-data").append(lists);
    $("#order-data tr").show();
    $('.none').fadeIn(300);
};