import express from 'express'
const router = express.Router({});

/*******************后端页面路由***********************/
router.get('/back', (req, res)=>{
    res.render('back/goods_list.html');
});

router.get('/', (req, res)=>{
    res.redirect('/back');
});
export default router;