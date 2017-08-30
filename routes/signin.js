let express = require('express'),
    router = express.Router(),
    sha1=require('sha1'),
    UserModel= require('../models/users'),
    checkNotLogin = require('../middlewares/check').checkNotLogin;
//登录页
router.get('/',checkNotLogin,(req,res,next)=>{
    res.render('signin');
});

//用户登录
router.post('/',checkNotLogin,(req,res,next)=>{
    let name = req.fields.name,
        password = req.fields.password;
    
    UserModel.getUserByName(name)
            .then(user=>{
                if(!user){
                    req.flash('error','用户不存在');
                    return res.redirect('back');
                }

                if(sha1(password) !==user.password){
                    req.flash('error','用户名或密码错误');
                    return res.redirect('back');
                }
                req.flash('success','登录成功');
                // 用户信息写入session
                delete user.password;
                req.session.user = user;
                res.redirect('/posts');
            })
            .catch(next);
});

module.exports = router;