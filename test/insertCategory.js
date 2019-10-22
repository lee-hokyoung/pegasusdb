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
            group_id: 'beauty',
            group_name: 'Beauty'
        },
        {
            cate_id: 'spa',
            cate_name: 'SPA',
            group_id: 'beauty',
            group_name: 'Beauty'
        },
        {
            cate_id: 'nail_shop',
            cate_name: 'Nail Shop',
            group_id: 'beauty',
            group_name: 'Beauty'
        },
        {
            cate_id: 'hotel',
            cate_name: 'Hotel',
            group_id: 'o2o',
            group_name: 'O2O'
        },
        {
            cate_id: 'delivery',
            cate_name: 'Delivery',
            group_id: 'o2o',
            group_name: 'O2O'
        },
        {
            cate_id: 'sharing',
            cate_name: 'Sharing',
            group_id: 'o2o',
            group_name: 'O2O'
        },
        {
            cate_id: 'health_care_support',
            cate_name: 'Health care & Support',
            group_id: 'health',
            group_name: 'Health'
        },
        {
            cate_id: 'silver_care_support',
            cate_name: 'Silver care & Support',
            group_id: 'health',
            group_name: 'Health'
        },
        {
            cate_id: 'baby_care_support',
            cate_name: 'Baby care & Support',
            group_id: 'health',
            group_name: 'Health'
        },
        {
            cate_id: 'electronic_vehicles',
            cate_name: 'Electronic Vehicles',
            group_id: 'transport',
            group_name: 'Transport'
        },
        {
            cate_id: 'drone',
            cate_name: 'Drone',
            group_id: 'transport',
            group_name: 'Transport'
        },
        {
            cate_id: 'smart_mobility',
            cate_name: 'Smart Mobility',
            group_id: 'transport',
            group_name: 'Transport'
        },
        {
            cate_id: 'restaurant',
            cate_name: 'Restaurant',
            group_id: 'food_beverage',
            group_name: 'Food & Beverage'
        },
        {
            cate_id: 'cafe',
            cate_name: 'Cafe',
            group_id: 'food_beverage',
            group_name: 'Food & Beverage'
        },
        {
            cate_id: 'franchise',
            cate_name: 'Franchise',
            group_id: 'food_beverage',
            group_name: 'Food & Beverage'
        },
        {
            cate_id: 'b2b_commerce',
            cate_name: 'B2B Commerce',
            group_id: 'e_commerce',
            group_name: 'E-Commerce'
        },
        {
            cate_id: 'b2c_commerce',
            cate_name: 'B2C Commerce',
            group_id: 'e_commerce',
            group_name: 'E-Commerce'
        },
        {
            cate_id: 'c2c_commerce',
            cate_name: 'C2C Commerce',
            group_id: 'e_commerce',
            group_name: 'E-Commerce'
        }
    ];
    let result = await Category.insertMany(query);
    console.log('result : ', result);
})();