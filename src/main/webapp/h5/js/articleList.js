/**
 * Created by Jeffrey on 15/8/30.
 */

var data = function (currentPage) {
    var filters = {};
    filters["status_equal"] = 1;
    filters["removed_equal"] = false;
    var url = server + "/manager/article?filters=" + JSON.stringify(filters) + "&page=" + currentPage + "&sort=createdDate,DESC";
    $.get(url, function (data) {
        var pageStr = '',
            totalPages = data.totalPages;
        initArticleData(data);
        //分页
        pageStr += '<ul class="am-pagination">';
        var prePage = (currentPage == 1) ? 1 : (currentPage - 1),
            nextPage = (currentPage == totalPages) ? totalPages : (currentPage + 1);
        pageStr += '<li><a href="javascript:data(' + prePage + ')">上一页</a></li>';
        for (var i = 1; i <= totalPages; i++) {
            console.log(data.number + 1);
            if (i == (data.number + 1)) {
                pageStr += '<li class="am-active"><a href="javascript:data(' + i + ')">' + i + '</a></li>';
            } else {
                pageStr += '<li> <a href="javascript:data(' + i + ')">' + i + '</a> </li>';
            }
            //pageStr += '<li><a href="javascript:loadData(' + i + ')">' + i + '</a></li>';
        }
        pageStr += '<li><a href="javascript:data(' + nextPage + ')">下一页</a></li> ';

        $('#pageDiv').html(pageStr);

    });
};

var articlesByFilters = function (currentPage) {
    var momentName = $("#moments option:selected").val();
    var nickName = $("#nickName").val();
    var articleTitle = $("#article-title").val();
    var articleCreatedDate = $("#article-created-date").val();
    var status = $("#article-status option:selected").val();
    //--------------构建查询条件---------
    //------------begin----------------
    var filters = {};
    if (-1 != momentName) {
        filters["pk.article.moments.id_equal"] = Number(momentName);
    }
    if (null != nickName && "" != nickName) {
        filters["pk.user.nickName_equal"] = nickName;
    }
    if (null != articleTitle && "" != articleTitle) {
        filters["pk.article.title_equal"] = articleTitle;
    }
    if (null != articleCreatedDate && "" != articleCreatedDate) {
        //构建一天时间的查询即大于0点小于12点
        filters["createdDate_greaterThan"] = Number(new Date(articleCreatedDate).pattern("yyyyMMdd").toString() + "000000");
        filters["createdDate_lessThan"] = Number(new Date(articleCreatedDate).pattern("yyyyMMdd").toString() + "235959");
    }
    if (-1 != status && status == "true") {
        filters["pk.article.removed_equal"] = true;
    } else if (-1 != status) {
        filters["pk.article.status_equal"] = Number(status);
    }
    //------------end--------------------

    console.log(JSON.stringify(filters));
    var url = server + "/manager/userArticle?filters=" + JSON.stringify(filters) + "&page=" + currentPage + "&sort=createdDate,DESC";
    $.get(url, function (data) {
        initArticleDataForSearch(data.content);

        var pageStr = '',
            totalPages = data.totalPages;
        //分页
        pageStr += '<ul class="am-pagination">';
        var prePage = (currentPage == 1) ? 1 : (currentPage - 1),
            nextPage = (currentPage == totalPages) ? totalPages : (currentPage + 1);
        pageStr += '<li><a href="javascript:data(' + prePage + ')">上一页</a></li>';
        for (var i = 1; i <= totalPages; i++) {
            console.log(data.number + 1);
            if (i == (data.number + 1)) {
                pageStr += '<li class="am-active"><a href="javascript:articlesByFilters(' + i + ')">' + i + '</a></li>';
            } else {
                pageStr += '<li> <a href="javascript:articlesByFilters(' + i + ')">' + i + '</a> </li>';
            }
            //pageStr += '<li><a href="javascript:loadData(' + i + ')">' + i + '</a></li>';
        }
        pageStr += '<li><a href="javascript:articlesByFilters(' + nextPage + ')">下一页</a></li> ';

        $('#pageDiv').html(pageStr);
    });

};

var search = function () {
    $("#search").click(function () {
        articlesByFilters(0);
    });
};

var initArticleData = function (data) {
    var html = '';
    //遍历文章信息
    $.each(data.content, function (n, value) {
        /**
         * 用户信息
         */
        initUserData(value);
        var isShielding = value.status == "effective" ? "屏蔽" : "解屏";
        //将文章信息添加到列表
        html += "<tr>" +
            "<td>" + value.id + "</td>" +
            "<td> <a href='articleView.html?" + value.id + "'>" + value.title + "</a></td>" +
            "<td>" + value.moments.name + "</td>" +
            "<td>" + new Date(value.createdDate).pattern('yyyy年MM月dd日 HH:mm:ss') + "</td>" +
            "<td id='article-id-" + value.id + "' class='article-author'>未知</td>" +
            "<td><button class=\"am-btn am-btn-xs options\" onclick=\"isShielding(" + value.id + ",'" + value.status + "')\">" +
            isShielding + "</button> " +
            " <button class=\"am-btn am-btn-xs options\" " + isHightlightCanClick(value) + ">" + (value.hightlight ? "精品" : "加精") + "</button> " +
            " <button class=\"am-btn am-btn-xs options\" " + isTopCanClick(value) + ">" + (value.top ? "已置顶" : "置顶") + "</button> " +
            "<button class=\"am-btn am-btn-xs options\" onclick='removeArticle(" + value.id + ")'>删除</button> " +
            "<button class=\"am-btn am-btn-xs options\"><a href='articleComment.html?"+value.id +"&"+value.title+"'>"+"评论"+"</a></button></td>" +
            "</tr>";
    });
    $('#article-data').html(html);
};

function isHightlightCanClick(article) {
    if (article.hightlight) {
        return "style='background: red; color: #000;' disabled='disabled'";
    } else {
        return "onclick='makeHightlight(" + article.id + ")'";
    }
}

function isTopCanClick(article) {
    if (article.top) {
        return "style='background: red; color: #000;' disabled='disabled'";
    } else {
        return "onclick='makeArticleTop(" + article.id + ")'";
    }
}

var initArticleDataForSearch = function (datas) {
    var html = '';
    $.each(datas, function (n, data) {
        var article = data.pk.article;
        var isShielding = article.status == "effective" ? "屏蔽" : "解屏";
        //将文章信息添加到列表
        html += "<tr>" +
            "<td>" + article.id + "</td>" +
            "<td> <a href='articleView.html?" + article.id + "'>" + article.title + "</a></td>" +
            "<td>" + article.moments.name + "</td>" +
            "<td>" + new Date(article.createdDate).pattern('yyyy年MM月dd日 HH:mm:ss') + "</td>" +
            "<td id='article-id-" + article.id + "' class='article-author'>未知</td>" +
            "<td><button class=\"am-btn am-btn-xs options\" onclick=\"isShielding(" + article.id + ",'" + article.status + "')\">" +
            isShielding + "</button> " +
            " <button class=\"am-btn am-btn-xs options\" " + isHightlightCanClick(article) + ">" + (article.hightlight ? "精品" : "加精") + "</button> " +
            " <button class=\"am-btn am-btn-xs options\" " + isTopCanClick(article) + ">" + (article.top ? "已置顶" : "置顶") + "</button> " +
            "<button class=\"am-btn am-btn-xs options\" onclick='removeArticle(" + article.id + ")'>删除</button>" +
            "<button class=\"am-btn am-btn-xs options\"><a href='articleComment.html?"+article.id +"&"+article.title+"'>"+"评论"+"</a></button></td>" +
            "</tr>";
    });
    $('#article-data').html(html);
    $.each(datas, function (n, data) {
        var article = data.pk.article;
        var user = data.pk.user;
        fillUserInfo(article.id, user);
    });
};


var initUserData = function (value) {
    $.get(server + "/manager/article/" + value.id + "/author", function (user) {
        fillUserInfo(value.id, user);
    });
};

var fillUserInfo = function (articleId, user) {
    if (user) {
        var userLink = "<button type=\"button\" class=\"am-btn am-btn-xs\" id=\"user-info-" + user.id + "\" " +
            "data-am-modal=\"{target: '#doc-modal-1', closeViaDimmer: 0, width: 500, height: 500}\">" + user.nickName
        "</button>"
        $("#article-id-" + articleId).html(userLink);
        $("#user-info-" + user.id).click(function () {
            //填充用户信息模态窗口数据
            $(".portrait-img").attr('src', user.iconUrl);
            $("#userName-label").html(user.nickName);
            $("#tel-label").html(user.tel);
            $("#integrals-label").html(user.integrals);
            $("#created-date-label").html("" == user.createdDate ? "未知" : new Date(user.createdDate).pattern("yyyy年MM月dd日"));
            $("#birthday-label").html("" == user.birthday ? "未知" : new Date(user.birthday).pattern("yyyy年MM月dd日"));
            $("#sex").html("female" == user.sex ? "女" : "男");
            if ("mother" == user.motherType) {
                $("#type-label").html("辣妈");
                $("#type-property-label").html("孩子生日:");
                $("#child-birthday-label").html(new Date(user.childBirthday).pattern("yyyy年MM月dd日"));
            } else {
                $("#type-label").html("孕妇");
                $("#type-property-label").html("孕期:");
                console.log(user.pregnancyWeek + "周" + user.pregnancyDay + "天");
                $("#child-birthday-label").html(
                    "" == user.pregnancyWeek || "" == user.pregnancyDay ?
                        "未知" : (user.pregnancyWeek + "周" + user.pregnancyDay + "天")
                );
            }
        });
    }
};

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

var isShielding = function (articleId, status) {
    var url = server + "/manager/article/" + articleId + "/status";
    var value = status == "effective" ? "ineffective" : status;
    var data = {"status": value};
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (data) {
            if (data) {
                alert("操作成功！");
                window.location.reload();
            }
        }
    });
};

var makeHightlight = function (articleId) {
    var url = server + "/manager/article/" + articleId + "/hightlight";
    var data = {"hightlight": 1};
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (data) {
            if (data) {
                alert("操作成功！");
                window.location.reload();
            }
        }
    });
};

var makeArticleTop = function (articleId) {
    var url = server + "/manager/article/" + articleId + "/top";
    var data = {"top": 1};
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (data) {
            if (data) {
                alert("操作成功！");
                window.location.reload();
            }
        }
    });
};

var removeArticle = function (articleId) {
    var url = server + "/manager/article/" + articleId + "/remove";
    $.ajax({
        url: url,
        type: 'post',
        success: function (data) {
            if (data) {
                alert("删除成功！");
                window.location.reload();
            }
        }
    });
};



$(function () {
    data(0);
    moments();
    search();
});