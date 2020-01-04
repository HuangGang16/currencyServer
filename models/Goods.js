import mongoose from 'mongoose'

const goodsSchema = mongoose.Schema({
   /* product_list: [
        {
            name: {type: String, required: true},
            origin_price: {type: Number, required: true},
            price: {type: Number, required: true},
            product_name: {type: String, required: true},
            small_image: {type: String, required: true},
            spec: {type: String, required: true}
        }
    ],*/
    name: {type: String, required: true},
    product_name: {type: String, required: true},
    small_image: {type: String, required: true},
    origin_price: {type: Number, required: true},
    price: {type: Number, required: true},
    spec: {type: String, required: true},
    content: {type: String, required: true},
    c_time: {type: Date, default: Date.now()},
    x_time: {type: Date, default: Date.now()}
});
const Goods = mongoose.model('Goods',goodsSchema);
export default Goods;