/**
 * Created by Jeffrey on 15/8/31.
 */
var articleData = '';
var url = server + "/manager/article/";
var articleId = window.location.search.substr(1);
var datas = function () {
    url += articleId;
    $.get(url, function (data) {
        articleData = data;
        $('#article-title').val(data.title);
        $('#category').attr("placeholder", data.category);
        moments(data.moments.id);
        var html = '';
        var cells = data.cells;
        if (cells) {
            $.each(cells, function (n, cell) {
                if (cell.type == 1) {
                    html += "<div class=\"article-images\">\n" +
                        "                    <img class=\"cells-0 am-center img-size\" src=\"" + cell.picUrl + "\" alt=\"\"/>\n";

                    var tags = cell.tags;
                    if (tags && tags.length != 0) {
                        html += "                    <div class=\"article-tags\">\n" +
                            "                        <h3 class=\"tags-title\">标签：</h3>\n" +
                            "                        <ul class=\"am-list\">\n";
                        $.each(tags, function (n, tag) {
                            html += "                            <li class=\"am-list-item\">\n" +
                                "                                <div class=\"tags-property\">\n" +
                                "                                    <div class=\"am-panel-group am-u-lg-12 am-u-md-12 am-u-sm-12\">\n" +
                                "                                        <label for=\"tags-" + cell.id + "-" + tag.id + "\" class=\"tags tags-name\">" + tag.name + "</label>\n" +
                                "                                        <span class=\"tags point\">X:</span>\n" +
                                "                                        <span class=\"tags point-value\"> <input type='text' id= 'tagsX-" + cell.id + "-" + tag.id + "'  style='width: 60px;;' value='" + tag.tagX + "'></span>\n" +
                                "                                        <span class=\"tags point\">Y:</span>\n" +
                                "                                        <span class=\"tags point-value\"> <input type='text' id= 'tagsY-" + cell.id + "-" + tag.id + "'  style='width: 60px;;' value='" + tag.tagY + "'></span>\n" +
                                "                                        <input class=\"tags-url am-u-lg-6 am-fr\" type=\"text\" placeholder=\"链接地址\" id=\"tags-" + cell.id + "-" + tag.id + "\" value ='"+tag.linkUrl+"' />\n" +
                                "                                    </div>\n" +
                                "                                </div>\n" +
                                "                            </li>\n";
                        });
                        html += "</ul>\n";
                    }
                    html += "</div>";
                } else {
                    html += "<div class=\"am-u-lg-12 am-u-md-12 am-u-sm-12 article-description\">\n" +
                        "<p>段落:</p>" +
                        "<textarea class='am-u-lg-12 am-u-md-12 am-u-sm-12 ' rows=\"10\" id=\"cells-" + cell.id + "-description\">" + cell.description + "</textarea>\n" +
                        "</div>";
                }
            });
        }
        $('.article-content').append(html);
        //$(".admin-main").height($(document.body).outerHeight(true));
    });

};

$(function () {
    datas();
    activity();
    $("#activity").change(function () {
        var activityId = $("#activity option:selected").val();
        if (activityId != -1) {
            products(activityId);
            $("#products-group").removeClass("am-hide");
        }
    });
});


var activity = function () {
    var url = server + "/mall/manager/activiti/query";
    $.get(url, function (data) {
        var html = '';
        $.each(data, function (n, value) {
            html += "<option value='" + value.id + "'>" + value.activitiName + "</option>"
        });
        $("#activity").append(html);
    });
};

var commit = function () {
    var category = $('#category').val();
    var title = $('#article-title').val();
    console.log(title);
    if (articleData && title) {
        articleData.title = title;
    }

    if (articleData && category) {
        articleData.category = category;
    }
    $.each(articleData.cells, function (i, cell) {
        if (cell.type != "1") {
            articleData.cells[i].description = $('#cells-' + cell.id + '-description').val();
        } else {
            $.each(cell.tags, function (j, tag) {
                articleData.cells[i].tags[j].linkUrl = $('#tags-' + cell.id + '-' + tag.id).val();
                articleData.cells[i].tags[j]["articleCell"] = {"id": articleData.cells[i].id};
                articleData.cells[i].tags[j].tagX = parseFloat($('#tagsX-' + cell.id + '-' + tag.id).val())
                articleData.cells[i].tags[j].tagY = parseFloat($('#tagsY-' + cell.id + '-' + tag.id).val());
            });
        }
    });
    var string = JSON.stringify(articleData);
    //商品ID
    var produtctId = $("#products option:selected").val();
    //商品活动ID
    var activityId = $("#activity option:selected").val();
    //文章圈子ID
    var momentId = $("#moments option:selected").val();
    $.ajax({
        url: server + "/manager/article/modify/" + produtctId + "/" + activityId + "/" + momentId,
        type: 'PUT',

        contentType: 'application/json',
        data: string,
        //beforeSend: function(request) {
        //    request.setRequestHeader("Origin", "*");
        //},
        success: function (data) {
            if (data) {
                alert("修改成功！");
            }
        }
    });
};

var products = function (activitiId) {
    var url = server + "/mall/manager/activiti/product?activitiId=" + activitiId;
    $.get(url, function (data) {
        var html = '';
        $.each(data, function (n, value) {
            html += "<option value='" + value.productId + "'>" + value.productName + "</option>"
        });
        $("#products").html(html);
    })
};

//var products = function () {
//    var url = server + "/mall/manager/product/query";
//    $.get(url, function (data) {
//        var html = '';
//        $.each(data, function (n, value) {
//            html += "<option value='" + value.id + "'>" + value.name + "</option>"
//        });
//        $("#products").append(html);
//    })
//};

/**
 * 圈子下拉框初始化
 */
var moments = function (id) {
    var url = server + "/manager/moments";
    $.get(url, function (data) {
        var momentHtml = '';
        $.each(data.content, function (n, value) {
            if (id == value.id) {
                momentHtml += "<option value='" + value.id + "' selected>" + value.name + "</option>"
            } else {
                momentHtml += "<option value='" + value.id + "'>" + value.name + "</option>"
            }

        });
        $('#moments').html(momentHtml);
    })
};