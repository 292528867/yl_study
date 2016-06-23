/**
 * Created by lixuanwu on 15/11/4.
 */


jump();
function jump(){
    var value = location.search.split('?')[1];

    var articleId = value.split('&')[0];
    var name = decodeURI(value.split('&')[1]);

    console.log(articleId)
    console.log(name)

    $('#articleId').val(articleId);
    $('#doc-vld-name-2').val(name);

}

var commentArticle = function () {
    var url = server + "/manager/article/comment";
    var articleId = $('#articleId').val();
    var fromUserId = $('#fromUserId').val();
    var content = $('#content').val();
    var data = {
        "articleId": articleId,
        "fromUserId":fromUserId,
        "content":content
    };
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        success: function (data) {
            if (data) {
                alert("评论成功！");
            }else{
                alert("评论失败！");
            }
        }
    });
};
