const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const{ensureAuthenticated} = require('../helpers/auth');

//load DB Schema
require('../models/schema');
const schema = mongoose.model('todo');

//Index page
router.get('/', ensureAuthenticated,(req,res)=> {
    schema.find({user:req.user.id})
    .sort({date:'desc'})
    .then(todo => {
        res.render('todo/index',{
            todo:todo
        })
    })
    // res.render('/todo/index');
});

//Add a todo
router.get('/add', ensureAuthenticated, (req,res) => {
    res.render('todo/add');
});

//Edit a todo
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
    schema.findOne({
        _id:req.params.id
    })
    .then(todo =>{
        if(todo.user != req.user.id){
            req.flash('error_msg','Not authorized');
            res.redirect('/todo');
        }
       else{
        res.render('todo/edit',{
            todo:todo
        });
    }
    });
   
});

//Get list of todo
router.post('/', ensureAuthenticated, (req,res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add details'});
    }
    if(errors.length > 0){
        res.render('/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.title
        });
    }
    else{
        const newUser = {
            title: req.body.title,
            details:req.body.details,
            user: req.user.id
        }
        new schema(newUser).save()
        .then(todo =>{
            req.flash('success_msg', 'Todo item added');
            res.redirect('/todo');
        })
    }
});
//Update form process
router.put('/:id',ensureAuthenticated,(req,res)=>{
   schema.findOne({
       _id:req.params.id
   })
   .then(todo=>{
        todo.title = req.body.title;
        todo.details = req.body.details;
        
        todo.save()
        .then(todo =>{
            req.flash('success_msg', 'Todo item updated');
            res.redirect('/todo');
        })
   });
});

//Delete data
router.delete('/:id',(req,res)=>{
    schema.deleteOne({_id:req.params.id})
    .then(() =>{
        req.flash('success_msg', 'Todo item removed');
        res.redirect('/todo')
    })
});

module.exports = router;