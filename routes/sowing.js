import express from 'express'
import Sowing from './../models/Sowing'
import config from './../src/config'
import {basename} from 'path'
import formidable from 'formidable'
import SowingController from './../controller/sowing/SowingController'
const router = express.Router({});


/*****************接口API*******************/
/*
  往数据库中插入一条新纪录
*/
/*router.post('/back/sowing/api/add', (req, res,next)=>{
    const form = new formidable.IncomingForm();// 实例化formidable对象
    form.uploadDir = config.uploadPath; // 上传图片放置的文件夹
    form.keepExtensions = true;// 保持文件的原始扩展名
    form.parse(req, (err, fields, files)=>{
        if (err) {
            return next(err);
        }
        // 取出普通字段
        let body = fields;
        // 解析上传的文件路径，取出文件名保存到数据库
        body.image_url = basename(files.image_url.path);
        // 操作数据库
        const sowing = new Sowing({
            image_title: body.image_title,
            image_url: body.image_url,
            image_link: body.image_link,
            s_time: body.s_time,
            e_time: body.e_time
        });
        sowing.save((err, result)=>{
            if(err){
                return next(err);
            }
            res.json({
                status: 200,
                result: '添加轮播图成功'
            })
        });
    });
});*/
router.post('/back/sowing/api/add',SowingController.insertOneSowing);

/*
* 获取所有轮播图列表
* */
router.get('/back/sowing/api/list', (req, res, next)=>{
    Sowing.find({}, "_id image_title image_url image_link s_time e_time", (err, docs)=>{
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: docs
        })
    });
});

/*
* 根据id找到对应的轮播图
* */
router.get('/back/sowing/api/singer/:sowingId', (req, res, next)=>{
   // console.log(req.params.sowingId);
    Sowing.findById(req.params.sowingId, "_id image_title image_url image_link s_time e_time", (err, docs)=>{
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: docs
        })
    });
});

/*
* 根据id修改一条轮播图
* */
router.post('/back/sowing/api/edit',(req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
       if (err) {
           return next(err);
       }
       let body = fields;
       // 根据id查询文档
       Sowing.findById(body.id, (err, sowing)=>{
           if (err) {
               return next(err);
           }
           sowing.image_title = body.image_title;
           sowing.image_url = body.image_url || basename(files.image_url.path);
           sowing.image_link = body.image_link;
           sowing.s_time = body.s_time;
           sowing.e_time = body.e_time;

           // 保存
           sowing.save((err, result)=>{
               if (err) {
                   return next(err);
               }
               res.json({
                   status: 200,
                   result: '修改数据成功！'
               })
           })
       })
    });
});

/*根据id删除一条轮播图*/
router.get('/back/sowing/api/remove/:sowingId', (req, res, next)=>{
    Sowing.deleteOne({_id: req.params.sowingId},(err, result)=>{
       if (err) {
           return next(err);
       }
       res.json({
           status: 200,
           result: '成功删除轮播图'
       });
       let tag = ['one','two', 'three', 'four'];
    });
});


router.get('/web/currency/sowing/api/listApi', (req, res, next)=>{
    Sowing.find((err, sowings)=>{
        if (err) {
            return next(err);
        }
        res.json({
            status: 200,
            result: sowings
        });
    })
});


/*****************页面路由*******************/
router.get('/back/s_list', (req, res, next)=>{
    Sowing.find((err, sowings)=>{
        if (err) {
            return next(err);
        }
        res.render('back/sowing_list.html', {sowings});
    });

});

router.get('/back/s_add', (req, res, next)=>{
   res.render('back/sowing_add.html')
});

/*修改轮播图*/
router.get('/back/s_edit', (req, res, next)=>{
    res.render('back/sowing_edit.html')
});

export default router;