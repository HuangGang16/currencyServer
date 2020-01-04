import express  from 'express';
import Address from './../models/Address';
const router = express.Router({});

/*
* 新增地址
* */
router.post('/web/currency/api/address/add', (req, res, next)=>{
    const {user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag,province,city,county,areaCode} = req.body;
    if (user_id) {
        const address = new Address({
           user_id,
           address_name,
           address_phone,
           address_area,
           address_area_detail,
           address_post_code,
           address_tag,
           province,
           city,
           county,
           areaCode
        });
        address.save((err, result)=>{
            if (err) {
                return next(Error(err))
            }
            res.send({
                success_code: 200,
                data: result,
                message: '新增地址成功'
            })
        })
    }else{
        return next(Error('非法用户！'))
    }
});

/*
* 编辑地址
* */
router.post('/web/currency/api/address/edit', (req, res, next)=>{
    const {user_id, address_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag,province,city,county,areaCode} = req.body;
    if (user_id) {
        Address.findById(address_id, (err, address)=>{
            if (err) {
                return next(err)
            }
            address.address_name = address_name;
            address.address_phone = address_phone;
            address.address_area = address_area;
            address.address_area_detail = address_area_detail;
            address.address_post_code = address_post_code;
            address.address_tag = address_tag;
            address.province = province;
            address.city = city;
            address.county = county;
            address.areaCode = areaCode;

            address.save((err, result)=>{
                if (err) {
                    return next(err);
                }
                res.json({
                    success_code: 200,
                    result: '地址修改成功！'
                })
            });
        })
    }else {
        return next(Error('非法用户！'))
    }
});

/*
* 删除联系人
* */
router.get('/web/currency/api/address/del/:addressid', (req, res, next)=>{
    Address.find({_id: req.params.addressid}, (err, result)=>{
        if (err) {
            return next(err);
        }
        res.json({
            success_code: 200,
            result: '删除地址成功！'
        })
    })
});

/*
* 获取地址数据
* */
router.get('/web/currency/api/address/search/:userid', (req, res, next)=>{
    let user_id = req.params.userid;
    if (user_id) {
        Address.find({user_id}).exec((err, result)=>{
            if (err) {
                return next(err);
            }
            res.json({
                success_code: 200,
                data: result
            })
        });
    }else {
        return next(Error('非法用户！'))
    }
});

/*
* 获取单条地址
* */
router.post('/web/currency/api/address/one', (req, res, next)=>{
    const {user_id, address_id} = req.body;
    if (user_id) {
        Address.findOne({_id: address_id, user_id}, (err, result)=>{
            if (err) {
                return next(Error(err));
            }
            if (result) {
                res.json({
                    success_code: 200,
                    data: result
                });
            }else {
                res.send({
                    error_code: 0,
                    message: '没有该条地址信息'
                })
            }
        });
    }else{
        return next(Error('非法用户！'))
    }
});
export default router;