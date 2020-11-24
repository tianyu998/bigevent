$(function () {
    //1.点击去注册链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();

    })
    // 点击去登录页面
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 2.为 layui 添加 登录校验规则
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码须6-12位，不能出现空格'
        ],
        repwd: function (pwd2) {//使用函数作为 自定义规则 形参是pwd2 是确认密码框中的 密码
            //如果出错 返回消息，如果正常，啥也不返回
            //1.获取 密码框密码
            let pwd1 = $('.reg-box [name=password]').val();
            // 2.比较两个密码是否相同
            if (pwd1 != pwd2) return '两次密码好像不一致哦'
        }
        // 验证表单时，会将元素的value 值传给 repwd的形参
    });

    //3.注册表提交事件--------------
    $("#regForm").on('submit', submitData);
    // 4.注册表单提交事件(登录)-----------
    $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        // a.获取登录表单数据
        let dataStr = $(this).serialize();
        // b.异步提交到 登录接口
        $.ajax({
            url: baseUrl + '/api/login',
            method: 'post',
            data: dataStr,
            success(res) {
                //登录失败
                if (res.status != 0) return layui.layer.msg(res.message);
                //登录成功
                layui.layer.msg(res.message, {
                    iconk: 6,
                    time: 1500//1.5秒关闭(如果不配置，默认是3秒)
                }, function () {
                    // a.保存 tocken 值到localstorage
                    localStorage.setItem('token', res.token);
                    console.log(res);
                    //b.跳转到 index.html
                    location.href = '/index.html'
                });


            }
        })
    })

})
//根路径
let baseUrl = 'http://ajax.frontend.itheima.net';
// 1.注册函数--------------------------
function submitData(e) {
    console.log(1);
    e.preventDefault();
    // 获得表单数据
    let dataStr = $(this).serialize();
    console.log(dataStr);
    // 异步请求
    $.ajax({
        url: baseUrl + '/api/reguser',
        method: 'post',
        data: dataStr,
        success(res) {
            // if (res.status != 0) return alert(res.message);
            // alert(res.message);
            layui.layer.msg(res.message);

            // 注册出错
            if (res.status != 0) return;
            //注册成功

            // 将用户名 密码 自动 填充到登录表单中
            let uname = $('.reg-box[name=username]').val().trim();
            $('.login-box[name=username]').val(uname);

            let upwd = $('.reg-box[name=password]').val().trim();
            $('.login-box[name=password]').val(upwd);

            //清空注册表单
            $('#regForm')[0].reset();
            //切换到登录div
            $('#link_login').click();
        }
    })
}



//表单的默认行为 action 默认提交到里面的网址
//lay-submit是为当前按钮所在的表单添加一个unsubmit事件 （不会立即提交） 1.当于加了e.preventDefalt 2.校验包含lay-varify的表单元素 3.校验都通过之后，才提交表单
// layui.form从lay.all.js里面来 有verify属性

// 查找 verify 属性