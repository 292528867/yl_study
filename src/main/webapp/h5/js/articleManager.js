/**
 * Created by Jeffrey on 15/8/27.
 */

var tagJson = function () {
    return {
        "name": "",
        "tagX": "",
        "tagY": ""
    };
};

var articleJson = function () {
    return {
        "title": "article-title",
        "momentsId": -1,
        "productId": -1,
        "activityId": -1,
        "cells": "",
        "category":"热门"
    };
};

var articleCellJson = function () {
    return {
        "type": "1",
        "description": "article-cell-content",
        "cellSort": "",
        "picWidth": "",
        "picHeight": "",
        "picUrl": "",
        "tags": ""
    };
};

var sort = 0;

var articleMap = new HashMap(),
    articleCellMap = new HashMap(),
    tagMap = new HashMap();

$(function () {
    var article = articleJson();
    articleMap.put("article", article);
    var cellList = new Array();
    $('.cell-btn').click(function () {
        var articleCellIndex = articleCellMap.size();
        var tagList = new Array();
        var cellHtml = "<div class='article-cell'>" +
            "<div class='am-input-group am-u-lg-11'" +
            "<label for='img-height-" + articleCellIndex + "'>文章单元类型</label>" +
            "<select data-am-selected='{searchBox: 1}' id='cell-select-" + articleCellIndex +
            "' onchange='gradeChange(" + articleCellIndex +")'>" +
            "<option value='-1' selected>请选择类型</option>" +
            "<option value='0'>文章</option>" +
            "<option value='1'>图片</option>" +
            "</select>" +
            "</div>" +
            "<div class='am-input-group am-u-lg-12' style='display: none;' id='cell-content-" + articleCellIndex +"'>" +
            "<label for='article-cell-content-" + articleCellIndex + "'>文章内容</label>" +
            "<textarea id='article-cell-content-" + articleCellIndex + "' type='text' row='5' style='height:300px;' class='am-u-lg-12'></textarea>" +
            "</div>" +
            "<div class='am-input-group am-u-lg-12' style='display: none;' id='cell-pic-" + articleCellIndex +"'>" +
            "<button type='button' class='am-btn am-btn-primary am-btn-sm' style='margin: 10px 0px;' onclick='openImgUpload(" + articleCellIndex + ")'>" +
            "<i class=\"am-icon-cloud-upload\"></i> 选择要上传的展示图片\n" +
            "</button>" +
            "<input type='hidden' id='img-url-" + articleCellIndex + "'/>" +
            "</div>" +
            "<div class='picture-size am-u-lg-12' style='display: none;' id='cell-pic-position-" + articleCellIndex + "'>" +
            "<div class='am-input-group' style='float: left;'>" +
            "<label for='img-width-" + articleCellIndex + "'>图片宽度</label>" +
            "<input type='text' id='img-width-" + articleCellIndex + "'/>" +
            "</div>" +
            "<div class='am-input-group' style='float: left; margin-left: 1.6rem;'>" +
            "<label for='img-height-" + articleCellIndex + "'>图片高度</label>" +
            "<input type='text' id='img-height-" + articleCellIndex + "'/>" +
            "</div>" +
            "</div>" +
            "<hr class='am-u-lg-11 am-center'/>" +
            "<div class='tag-main'>" +
            "<div class='tag-block-" + articleCellIndex + "'>" +
            "</div>" +
            "<div id='cells-tag-" + articleCellIndex + "' class='am-btn tag-btn-" + articleCellIndex + "' style='float: right'>添加标签+</div>" +
            "</div>" +
            "</div>";
        $('.cell-block').append(cellHtml);
        var cells = articleCellJson();
        cells.description = "article-cell-content-" + articleCellIndex;
        cells.cellSort = articleCellIndex;
        cells.picHeight = "img-height-" + articleCellIndex;
        cells.picUrl = "img-url-" + articleCellIndex;
        cells.picWidth = "img-width-" + articleCellIndex;
        cells.type = "cell-select-" + articleCellIndex;

        articleCellMap.put("article-cell" + articleCellIndex, cells);

        $('.tag-btn-' + articleCellIndex).click(function () {
            var tagIndex = articleCellIndex + "-" + tagMap.size();
            var tagHtml = "<div class='tag'>" +
                "<div class='am-u-lg-12'>" +
                "<label for='tag-name-" + tagIndex + "'>标签名称</label>" +
                "<input type='text' id='tag-name-" + tagIndex + "'/>" +
                "</div>" +
                "<div class='position am-u-lg-12'>" +
                "<div class='am-input-group' style='float: left;'>" +
                "<label for='img-x-" + tagIndex + "'>标签X坐标</label>" +
                "<input type='text' id='img-x-" + tagIndex + "'/>" +
                "</div>" +
                "<div class='am-input-group' style='float: left; margin-left: 1.6rem;'>" +
                "<label for='img-y-" + tagIndex + "'>标签Y坐标</label>" +
                "<input type='text' id='img-y-" + tagIndex + "'/>" +
                "</div>" +
                "</div>";
            $('.tag-block-' + articleCellIndex).append(tagHtml);
            var tags = tagJson();
            tags.name = "tag-name-" + tagIndex;
            tags.tagX = "img-x-" + tagIndex;
            tags.tagY = "img-y-" + tagIndex;
            tagMap.put("tag" + tagIndex, tags);

            tagList.push("tag" + tagIndex);
            articleCellMap.get("article-cell" + articleCellIndex).tags = tagList;
        });

        cellList.push("article-cell" + articleCellIndex);
        articleMap.get("article").cells = cellList;
    });

    $('.commit').click(function () {
        var article = articleMap.get("article");
        var userId = $("#users option:selected").val();
        article.title = $('#' + article.title).val();
        article.momentsId = $("#moments option:selected").val();
        article.activityId = $("#activity option:selected").val();
        article.productId = $("#products option:selected").val();
        var cells = new Array();
        if (article.cells) {
            article.cells.forEach(function (data) {
                var value = articleCellMap.get(data);
                console.log(value);
                value.description = $('#' + value.description).val();
                value.picWidth = $('#' + value.picWidth).val();
                value.picHeight = $('#' + value.picHeight).val();
                value.picUrl = $('#' + value.picUrl).val();
                value.type = $('#' + value.type + ' option:selected').val();
                console.log(value);
                var tags = new Array();
                if (value.tags) {
                    value.tags.forEach(function (d) {
                        var tag = tagMap.get(d);
                        console.log(tag);
                        tag.name = $('#' + tag.name).val();
                        tag.tagX = $('#' + tag.tagX).val();
                        tag.tagY = $('#' + tag.tagY).val();
                        console.log(tag);
                        tags.push(tag);
                    });
                    value.tags = tags;
                } else {
                    value.tags = null;
                }
                cells.push(value);
            });
            article.cells = cells;
        } else {
            article.cells = null;
        }
        var string = JSON.stringify(article);
        /**
         * 新增文章请求提交
         */
        $.ajax({
            url: server + '/manager/article/manage/' + userId,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: string,
            success: function (data) {
                if (data.ret_code == 0) {
                    alert(data.message);
                }
                window.location.reload();
            }
        });
    });
    moments();
    users();
    activity();
    uploadPic();
    $("#products-group").hide();
    $("#activity").change(function () {
        var activityId = $("#activity option:selected").val();
        if (activityId != -1) {
            products(activityId);
            $("#products-group").show();
        } else {
            $("#products-group").hide();
            $("#products").html("<option value='-1'>请选择</option>");
        }
    });
});

/**
 * 圈子下拉框初始化
 */
var moments = function () {
    var url = server + "/manager/moments";
    $.get(url, function (data) {
        var html = '';
        $.each(data.content, function (n, value) {
            html += "<option value='" + value.id + "'>" + value.name + "</option>"
        });
        $("#moments").append(html);
    })
};

var users = function () {
    //var url = server + "/manager/user";
    var url = server + "/manager/user/findAllUserByAccountType";
    $.get(url, function (data) {
        var html = '';
        $.each(data, function (n, value) {
            html += "<option value='" + value.id + "'>" + value.nickName + "</option>"
        });
        $("#users").append(html);
    })
};

var activity = function () {
    var url = server + "/mall/manager/activiti/query";
    $.get(url, function (data) {
        var html = '<option value="-1">请选择</option>';
        $.each(data, function (n, value) {
            html += "<option value='" + value.id + "'>" + value.activitiName + "</option>"
        });
        $("#activity").append(html);
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

var gradeChange = function (index) {
    var type = $('#cell-select-' + index + ' option:selected').val();
    if (type == 0) {
        $('#cell-content-' + index).css("display","block");
        console.log($('#cell-content-' + index));
        $('#cell-pic-' + index).css("display","none");
        $('#cell-pic-position-' + index).css("display","none");
        $('#cells-tag-' + index).css("display","none");
    }else if (type == 1) {
        $('#cell-content-' + index).css("display","none");
        $('#cell-pic-' + index).css("display","block");
        $('#cell-pic-position-' + index).css("display","block");
        $('#cells-tag-' + index).css("display","block");
    }
};

function openImgUpload(index) {
    $('#change-modal').modal('toggle');
    $('#index-img').attr('src', "");
    //$('#index-img-sub').attr('disabled', true);
    $('#article-cell-index').val(index);
}

var uploadPic = function () {
    var percent = $('.percent');
    var bar = $('.bar');
    $('#index-img-form').on('submit', function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
                success: function (responseText, statusText, xhr, $form) {
                    console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText);
                    console.log(responseText);
                    if (responseText.ret_code == '0') {
                        $('#index-img').attr('src', responseText.ret_values.url);
                        var index = $('#article-cell-index').val();
                        $('#img-url-' + index).val(responseText.ret_values.url);
                        $('#index-img-sub').attr('disabled', false);
                        percent.html('上传成功');
                    }
                },
                uploadProgress: function (event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';
                    bar.width(percentVal);
                    if (percentComplete == 100) {
                        percentVal = "<i class='am-icon-spinner am-icon-spin'></i> 请等待服务器提交";
                    }
                    percent.html(percentVal);
                }
            },
            function () {
            })
    })
};
