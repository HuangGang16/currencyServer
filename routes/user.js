import express from 'express'
import User from './../models/User'
import md5 from 'blueimp-md5'
import {basename} from 'path'
import config from './../src/config'
import formidable from 'formidable'
const router = express.Router({});

const S_KEY = '@WaLk1314?.ItikE.Com.#';

/***************接口API***************/
/*
* 生成管理员
* */
router.post('/user/api/add',(req, res, next)=>{
   const user_name = req.body.user_name || '';
   const user_pwd = md5(req.body.user_pwd + S_KEY) || '';

   const user = new User({
      user_name: user_name,
      user_pwd: user_pwd
   });
   user.save((err, result)=>{
      if (err) {
         return next(err);
      }
      res.json({
         status: 200,
         result: '添加管理员成功！'
      });
   });
});

/*
* 用户名和密码进行登录
* */
router.post('/user/api/login',(req, res, next)=>{
   const user_name = req.body.user_name;
   const user_pwd = req.body.user_pwd;

   User.findOne({user_name: user_name}, (err, user)=>{
      if (err) {
         return next(err);
      }
      if (user !== null) {
         if (user.user_pwd === user_pwd) {
            // 登录成功，存储session
            req.session.token = user._id;
            res.json({
               status: 200,
               result: {
                  token: user._id,
                  message: '登录成功'
               }
            });
         }else{
            res.json({
               status: 1,
               result: '密码错误'
            })
         }
      }else{
         res.json({
            status: 1,
            result: '输入口令不存在'
         });
      }
   });
});

/*
* 退出登录
* */
router.get('/back/user/api/logout', (req, res, next)=>{
   // 销毁session 将cookie的时间设置为0
   req.session.cookie.maxAge = 0;
   res.json({
      status: 200,
      result: '退出登录成功！'
   })
});

/*
* 获取用户信息-部分
* */
router.get('/back/user/api/u_msg/:token', (req, res, next)=>{
   User.findById(req.params.token, "-_id icon_url real_name intro_self points rank gold", (err, user)=>{
      if (err) {
         return next(err);
      }
      if (user) {
         res.json({
            status: 200,
            result: user
         });
      }else{
         req.session.cookie.maxAge = 0
      }

   });
});

/*
* 获取用户信息-所有
* */
router.get('/back/user/api/u_msg_all:token', (req, res, next)=>{
   User.findById(req.params.token, "-_id -user_name -user_pwd -l_edit -c_time", (err, user)=>{
      if (err) {
         return next(err);
      }
      if (user) {
         res.json({
            status: 200,
            result: user
         })
      }else{
         req.session.cookie.maxAge = 0;
      }
   });
});

/*
* 修改用户信息，根据token
* */
router.post('/back/user/api/edit', (req, res, next)=>{
   const form = new formidable.IncomingForm();//实例化formidable
   form.uploadDir = config.uploadPath;// 设置上传目录
   form.keepExtensions = true;
   form.parse(req, (err, fields, files)=>{
      if (err) {
         return next(err);
      }
      // 取出普通字段
      let body = fields;
      // console.log(fields);
      User.findById(body.token, (err, user)=>{
         user.real_name = body.real_name;
         user.icon_url = body.icon_url || basename(files.icon_url.path);
         user.phone = body.phone;
         user.e_main = body.e_mail;
         user.join_time = body.join_time;
         user.intro_self = body.intro_self;
         // 保存
         user.save((err, result)=>{
            if (err) {
               return next(err);
            }
            res.json({
               status: 200,
               result: '用户信息修改成功!'
            });
         })
      });
   });
});

/*
* 根据token去修改密码
* */
router.post('/back/user/api/reset', (req, res, next)=>{
   let token = req.body.token;
   let old_pwd = req.body.old_pwd;
   let new_pwd = req.body.new_pwd;
   User.findById(token,(err, user)=>{
      if (err) {
         return next(err)
      }
      if (user) {
         if (user.user_pwd !== old_pwd) {
            res.json({
               status:1,
               result: '密码不正确'
            })
         }
         user.user_pwd = new_pwd;

         user.save((err, result)=>{
            if (err) {
               return next(err);
            }
            res.json({
               status: 200,
               result: '密码修改成功！'
            })
         });
      }else{
         res.json({
            status: 1,
            result: '非法用户'
         })
      }
   })
});


/***************页面路由***************/
router.get('/back/login', (req, res, next)=>{
   res.render('back/login.html');
});

router.get('/back/u_center',(req, res, next)=>{
   res.render('back/user_center.html')
});

router.get('/back/u_set', (req, res, next)=>{
   res.render('back/user_message.html')
});

router.get('/back/u_reset_pwd', (req, res, next)=>{
   res.render('back/reset_pwd.html')
});

export default router
