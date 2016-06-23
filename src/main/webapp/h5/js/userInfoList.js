var userInfoUrl = server + '/manager/user/findAllUser';
var userNickNameUrl = server + '/manager/user/findUserByNickName/'
var dataes;

function searchUser(tel, nickName) {
    var lists = '';
    var type = '';
    var sexs = '';
    $.each(dataes, function (n, value) {
        var userTel = value.tel;
        var userNickName = value.nickName;
        if ((tel.length != 0 && userTel.search(tel) != -1) || (nickName.length != 0 && userNickName.search(nickName) != -1 ) || (nickName.length === 0 && tel.length === 0)) {
            console.log(tel + userNickName);
            lists += "<tr style='display: none' ><td><input type='checkbox'/></td><td>" + value.id +
                "</td>" +
                "<td><a href='#'>" + value.nickName + "</a></td>" +
                "<td><a href='#'>" + value.tel + "</a></td>" +
                "<td><a href='#'>" + new Date(value.createdDate).pattern("yyyy年MM月dd日") + "</a></td>" +
                "<td><a href='#'>" + 'xx@qq.com' + "</a></td>" +
                "<td class='am-hide-sm-only'>";
            if ("pregnancy" === value.motherType) {
                type = '妊娠:第' + value.pregnancyWeek + '周,第' + value.pregnancyDay + '天;&nbsp&nbsp宝妈生日:' + value.birthday;
            } else if ("mother" === value.motherType) {
                type = '宝妈生日:' + value.birthday + ';&nbsp&nbsp宝宝生日:' + value.childBirthday;
            }
            lists += type + "</td>" +
                "<td class='am-hide-sm-only'>";
            if ("male" === value.sex) {
                sexs = '男';
            } else if ("female" === value.sex) {
                sexs = '女';
            }
            lists += sexs + "</td>" +
                "<td class='am-hide-sm-only'>" + '待定' + "</td>" +
                    console.log(value.address)
                "<td class='am-hide-sm-only'>" + value.location.address + "</td>" +
                "<td class='am-hide-sm-only'>" + '待定' + "</td>"
            "</tr>";

        }
        ;
    });
    $("#user-data").html('');
    $("#user-data").append(lists);
    $("#user-data tr").show();
    $('.none').fadeIn(300);


};
abc();
function abc() {
    var name = location.hash.split('#')[1];
    if (typeof(name)!==('undefined')) {
        $.get(userNickNameUrl + name, function (data) {
            var lists = '';
            var type = '';
            var sexs = '';
            console.log(data);
            var nickName = data.nickName;
            if (name.search(nickName) != -1) {
                lists += "<tr style='display: none' ><td><input type='checkbox'/></td><td>" + data.id +
                    "</td>" +
                    "<td><a href='#'>" + data.nickName + "</a></td>" +
                    "<td><a href='#'>" + data.tel + "</a></td>" +
                    "<td><a href='#'>" + new Date(data.createdDate).pattern("yyyy年MM月dd日") + "</a></td>" +
                    "<td><a href='#'>" + 'xx@qq.com' + "</a></td>" +
                    "<td class='am-hide-sm-only'>";
                if ("pregnancy" === data.motherType) {
                    type = '妊娠:第' + data.pregnancyWeek + '周,第' + data.pregnancyDay + '天;&nbsp&nbsp宝妈生日:' + data.birthday;
                } else if ("mother" === data.motherType) {
                    type = '宝妈生日:' + data.birthday + ';&nbsp&nbsp宝宝生日:' + data.childBirthday;
                }
                lists += type + "</td>" +
                    "<td class='am-hide-sm-only'>";
                if ("male" === data.sex) {
                    sexs = '男';
                } else if ("female" === data.sex) {
                    sexs = '女';
                }
                lists += sexs + "</td>" +
                    "<td class='am-hide-sm-only'>" + '待定' + "</td>" +
                    "<td class='am-hide-sm-only'>" + value.location.address + "</td>" +
                    "<td class='am-hide-sm-only'>" + '待定' + "</td>"
                "</tr>";

            }
            ;

            $("#user-data").html('');
            $("#user-data").append(lists);
            $("#user-data tr").show();
            $('.none').fadeIn(300);
        });
    } else {
        $.get(userInfoUrl, function (data) {
            dataes = data;
            var datas = '';
            var type = '';
            var sexs = '';
            console.log(data)
            $.each(data, function (n, value) {
                datas += "<tr style='display: none' ><td><input type='checkbox'/></td><td>" + value.id +
                    "</td>" +
                    "<td><a href='#'>" + value.nickName + "</a></td>" +
                    "<td><a href='#'>" + value.tel + "</a></td>" +
                    "<td><a href='#'>" + new Date(value.createdDate).pattern("yyyy年MM月dd日") + "</a></td>" +
                    "<td><a href='#'>" + 'xx@qq.com' + "</a></td>" +
                    "<td class='am-hide-sm-only'>";
                if ("pregnancy" === value.motherType) {
                    type = '妊娠:第' + value.pregnancyWeek + '周,第' + value.pregnancyDay + '天;&nbsp&nbsp宝妈生日:' + value.birthday;
                } else if ("mother" === value.motherType) {
                    type = '宝妈生日:' + value.birthday + ';&nbsp&nbsp宝宝生日:' + value.childBirthday;
                }
                datas += type + "</td>" +
                    "<td class='am-hide-sm-only'>";
                if ("male" === value.sex) {
                    sexs = '男';
                } else if ("female" === value.sex) {
                    sexs = '女';
                }
                datas += sexs + "</td>" +
                    "<td class='am-hide-sm-only'>" + '待定' + "</td>" +
                    "<td class='am-hide-sm-only'>" + value.location.address + "</td>" +
                    "<td class='am-hide-sm-only'>" + '待定' + "</td>"
                "</tr>";

            });

            $("#user-data").append(datas);
            $("#user-data tr").fadeIn(300);
            $("#total").append(data.length);
        });
    }
}

