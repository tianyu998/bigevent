$ajaxPrefilter(function
    (ajaxOpt) {
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

})