const Category = require('../model/categoryModel');

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (error) => {
    if (error) console.log('몽고디비 연결 에러', error);
    else console.log('몽고디비 연결 성공');
});
(async function main() {
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
            cate_id: 'hotel',
            cate_name: 'Hotel',
            cate_order:1,
            group_id: 'o2o',
            group_name: 'O2O',
            group_order:2
        },
        {
            cate_id: 'delivery',
            cate_name: 'Delivery',
            cate_order:2,
            group_id: 'o2o',
            group_name: 'O2O',
            group_order:2
        },
        {
            cate_id: 'sharing',
            cate_name: 'Sharing',
            cate_order:3,
            group_id: 'o2o',
            group_name: 'O2O',
            group_order:2
        },
        {
            cate_id: 'health_care_support',
            cate_name: 'Health care & Support',
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
            cate_id: 'electronic_vehicles',
            cate_name: 'Electronic Vehicles',
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
            cate_id: 'smart_mobility',
            cate_name: 'Smart Mobility',
            cate_order:3,
            group_id: 'transport',
            group_name: 'Transport',
            group_order:4
        },
        {
            cate_id: 'restaurant',
            cate_name: 'Restaurant',
            cate_order:1,
            group_id: 'food_beverage',
            group_name: 'Food & Beverage',
            group_order:5
        },
        {
            cate_id: 'cafe',
            cate_name: 'Cafe',
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
            cate_id: 'b2b_commerce',
            cate_name: 'B2B Commerce',
            cate_order:1,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        },
        {
            cate_id: 'b2c_commerce',
            cate_name: 'B2C Commerce',
            cate_order:2,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        },
        {
            cate_id: 'c2c_commerce',
            cate_name: 'C2C Commerce',
            cate_order:3,
            group_id: 'e_commerce',
            group_name: 'E-Commerce',
            group_order:6
        }
    ];
    let result = await Category.insertMany(query);
    console.log('result : ', result);
})();