const Category = require('../model/categoryModel');

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (error) => {
    if (error) console.log('몽고디비 연결 에러', error);
    else console.log('몽고디비 연결 성공');
});
(async function main() {
    await Category.deleteMany({});
    let query = [
        {
            cate_id: 'hair_salon',
            cate_name: 'Hair Salon',
            cate_order:1,
            group_id: 'beauty',
            group_name: 'Beauty',
            group_order:1
        },
        {
            cate_id: 'spa',
            cate_name: 'SPA',
            cate_order:2,
            group_id: 'beauty',
            group_name: 'Beauty',
            group_order:1
        },
        {
            cate_id: 'nail_shop',
            cate_name: 'Nail Shop',
            cate_order:3,
            group_id: 'beauty',
            group_name: 'Beauty',
            group_order:1
        },
        {
            cate_id: 'infortainment',
            cate_name: 'Infortainment',
            cate_order:1,
            group_id: 'living',
            group_name: 'Living',
            group_order:2
        },
        {
            cate_id: 'home_appliances',
            cate_name: 'Home appliances',
            cate_order:2,
            group_id: 'living',
            group_name: 'Living',
            group_order:2
        },
        {
            cate_id: 'interior',
            cate_name: 'Interior',
            cate_order:3,
            group_id: 'living',
            group_name: 'Living',
            group_order:2
        },
        {
            cate_id: 'adult_care_support',
            cate_name: 'Adult care & Support',
            cate_order:1,
            group_id: 'health',
            group_name: 'Health',
            group_order:3
        },
        {
            cate_id: 'silver_care_support',
            cate_name: 'Silver care & Support',
            cate_order:2,
            group_id: 'health',
            group_name: 'Health',
            group_order:3
        },
        {
            cate_id: 'baby_care_support',
            cate_name: 'Baby care & Support',
            cate_order:3,
            group_id: 'health',
            group_name: 'Health',
            group_order:3
        },
        {
            cate_id: 'smart_mobility',
            cate_name: 'Smart Mobility',
            cate_order:1,
            group_id: 'transport',
            group_name: 'Transport',
            group_order:4
        },
        {
            cate_id: 'drone',
            cate_name: 'Drone',
            cate_order:2,
            group_id: 'transport',
            group_name: 'Transport',
            group_order:4
        },
        {
            cate_id: 'public_transportation',
            cate_name: 'Public Transportation',
            cate_order:3,
            group_id: 'transport',
            group_name: 'Transport',
            group_order:4
        },
        {
            cate_id: 'restaurant_cafe',
            cate_name: 'Restaurant & Cafe',
            cate_order:1,
            group_id: 'food_beverage',
            group_name: 'Food & Beverage',
            group_order:5
        },
        {
            cate_id: 'delivery',
            cate_name: 'Delivery',
            cate_order:2,
            group_id: 'food_beverage',
            group_name: 'Food & Beverage',
            group_order:5
        },
        {
            cate_id: 'franchise',
            cate_name: 'Franchise',
            cate_order:3,
            group_id: 'food_beverage',
            group_name: 'Food & Beverage',
            group_order:5
        },
        {
            cate_id: 'pc_mobile_shopping',
            cate_name: 'PC & Mobile shopping',
            cate_order:1,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        },
        {
            cate_id: 'consumer',
            cate_name: 'Consumer',
            cate_order:2,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        },
        {
            cate_id: 'producer',
            cate_name: 'Producer',
            cate_order:3,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        }
    ];
    let result = await Category.insertMany(query);
    console.log('result : ', result);
})();