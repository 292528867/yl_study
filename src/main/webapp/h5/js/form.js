/**
 * Created by Jeffrey on 15/5/13.
 */
$(function() {
    $('#doc-vld-msg').validator({
        onValid: function(validity) {
            $(validity.field).closest('.am-form-group').find('.am-alert').hide();
        },

        onInValid: function(validity) {
            var $field = $(validity.field);
            var $group = $field.closest('.am-form-group');
            var $alert = $group.find('.am-alert');
            // 使用自定义的提示信息 或 插件内置的提示信息
            var msg = $field.data('validationMessage') || this.getValidationMessage(validity);

            if (!$alert.length) {
                $alert = $('<div class="am-alert am-alert-danger"></div>').hide().
                    appendTo($group);
            }

            $alert.html(msg).show();
        }
    });
});
function addImages(){
    var count = $('#imageCount').val()+1;
    var imageList= "<div class='am-form-group am-form-file'> " +
        "<button type='button' class='am-btn am-btn-primary am-btn-sm am-round'>" +
        "<i class='am-icon-cloud-upload'></i></button>" +
        "<input id='image-form"+count+"' type='file' multiple accept='image/*' class='image-form' name='files'>  " +
        "<div id='image"+count+"' class='image-text'></div></div>";
    $('#images-page').append(imageList);
    $('.image-form').on('change', function () {
        var fileNames = '';
        $.each(this.files, function () {
            fileNames += '<span class="am-badge">' + this.name + '</span> ';
        });
        $(this).next('.image-text').html(fileNames);
    });
}
function addAudios(){
    var count = $('#audioCount').val()+1;
    var audioList= "<div class='am-form-group am-form-file'> " +
        "<button type='button' class='am-btn am-btn-success am-btn-sm am-round'>" +
        "<i class='am-icon-cloud-upload'></i></button>" +
        "<input id='audio-form"+count+"' type='file' multiple accept='audio/*' class='audio-form' name='files'>  " +
        "<div id='audio"+count+"' class='audio-text'></div></div>";
    $('#audios-page').append(audioList);
    $('.audio-form').on('change', function () {
        var fileNames = '';
        $.each(this.files, function () {
            fileNames += '<span class="am-badge">' + this.name + '</span> ';
        });
        $(this).next('.audio-text').html(fileNames);
    });
}
$(function () {
    $('.image-form').on('change', function () {
        var fileNames = '';
        $.each(this.files, function () {
            fileNames += '<span class="am-badge">' + this.name + '</span> ';
        });
        $(this).next('.image-text').html(fileNames);
    });
    $('.audio-form').on('change', function () {
        var fileNames = '';
        $.each(this.files, function () {
            fileNames += '<span class="am-badge">' + this.name + '</span> ';
        });
        $(this).next('.audio-text').html(fileNames);
    });
});
