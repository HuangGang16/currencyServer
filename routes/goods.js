import express from 'express'
import Goods from './../models/Goods'
import formidable from 'formidable'
import config from './../src/config'
import {basename} from 'path'
const router = express.Router({});

/*****************接口API*******************/
/*
* 图片上传uploads文件夹
* */
router.post('/back/goods/api/add_img',(req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
       if (err) {
           return next(err);
       }
       if (files.image_url) {
           let image_url = 'http://localhost:3000/uploads/' + basename(files.image_url.path);
           res.json({
               status: 200,
               result: image_url
           });
       }else{
           res.json({
               status: 1,
               result: '删除文件路径出现问题！'
           })
       }
    });
});

/*
* 添加商品
* */
router.post('/back/goods/api/add', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;
    form.keepExtensions = true;
    form.parse(req,(err, fields,files)=>{
        if (err) {
            return next(err);
        }
        let body = fields;
        body.small_image = basename(files.small_image.path);
        const goods = new Goods({
            name: body.name,
            small_image: body.small_image,
            origin_price: body.origin_price,
            price: body.price,
            product_name: body.product_name,
            spec: body.spec,
            content: body.content,
/*            c_time: body.c_time,
            x_time: body.x_time*/
        });
        goods.save((err, result)=>{
            if (err) {
                return next(err)
            }
            res.json({
                status: 200,
                result: '商品添加成功'
            });
        });
    });
});

/*
* 获取所有商品
* */
router.get('/back/goods/api/a_list',(req, res, next)=>{
   Goods.find({}, (err, goodsAll)=>{
       if (err) {
           return next(err)
       }
       res.json({
           status: 200,
           result: goodsAll
       })
   })
});

/*
* 获取一个商品
* */
router.get('/back/goods/api/singer/:goodsId', (req, res, next)=>{
    Goods.findById(req.params.goodsId, (err, goods)=>{
        if (err) {
            return next(err)
        }
        res.json({
            status: 200,
            result: goods
        })
    })
});

/*
* 根据id去修改一商品
* */
router.post('/back/goods/api/edit', (req, res, next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadPath;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files)=>{
        if (err) {
            return next(err);
        }
        let body = fields;
        Goods.findById(body.id, (err, goods)=>{
           if (err) {
               return next(err)
           }
           goods.name = body.name;
           goods.small_image = body.small_image || basename(files.small_image.path);
           goods.origin_price = body.origin_price;
           goods.price = body.price;
           goods.spec = body.spec;
           goods.content = body.content;

           goods.save((err, result)=>{
               if (err) {
                   return next(err)
               }
               res.json({
                   status: 200,
                   result: '商品修改成功！'
               })
           })
        });
    })
});

/*
* 根据id删除某一商品
* */
router.get('/back/goods/api/remove/:goodsId', (req, res, next)=>{
    Goods.deleteOne({_id: req.params.goodsId}, (err, result)=>{
       if (err) {
           return next(err)
       }
       res.json({
           status: 200,
           result: '成功删除商品!'
       })
    });
});

/*
* 分页
* 获取总页数
* */
router.get('/back/goods/api/count', (req, res, next)=>{
    Goods.countDocuments((err, count)=>{
        if(err){
            return next(err);
        }
        // 数据返回
        res.json({
            status: 200,
            result: count
        })
    })
});

/*
* 获取列表页面的数据
* */
router.get('/back/goods/api/list', (req, res, next)=>{
    let page = Number.parseInt(req.query.page, 10) || 1; //当前第几页
    let pageSize = Number.parseInt(req.query.pageSize, 10) || 10;// 每页要显示多少条数据

    // 查询所有的数据
    Goods.find().skip((page - 1) * pageSize ).limit(pageSize).exec((err, goodsCount)=>{
        if(err){
            return next(err);
        }
        res.json({
            status: 200,
            result: goodsCount
        });
    });
});

/*router.get('/back/goods/api/list', (req, res, next)=>{
    let {page, pageSize, sortBy} = req.query;
    page = Number.parseInt(page, 10) || 10;
    pageSize = Number.parseInt(pageSize, 10) || 10;

    let sortObj;
    if (sortBy === 'price') {
        sortObj = {'price': -1}
    }else {
        sortObj = {'read_count': 1}
    }

    Goods.find({}, 'title small_price').sort(sortObj).skip((page -1) * pageSize).limit(pageSize).exec((err, goods)=>{
        if (err) {
            return next(err)
        }
        res.json({
            status: 200,
            result: goods
        })
    })
});*/

router.get('/web/currency/goods/api/listApi', (req, res, next)=>{
    let page = Number.parseInt(req.query.page, 10) || 1;
    let pageSize = Number.parseInt(req.query.pageSize, 10) || 10;
    Goods.find().skip((page - 1) * pageSize ).limit(pageSize).exec((err, goodsList)=>{
        if(err){
            return next(err);
        }
        res.json({
            status: 200,
            result: goodsList
        });
    });
});

/*****************页面路由*******************/
router.get('/back/goods_list',(req, res, next)=>{
    Goods.find((err, goodsAll)=>{
        if (err) {
            return next(err);
        }
        res.render('back/goods_list.html', {goodsAll});
    });
});

router.get('/back/goods_add', (req, res, next)=>{
    res.render('back/goods_add.html');
});

router.get('/back/goods_edit', (req, res, next)=>{
    res.render('back/goods_edit.html');
});

export default router;