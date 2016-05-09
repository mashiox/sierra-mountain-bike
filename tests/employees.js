'use strict'

//tests/employees.js
var assert = require('assert');


suite('Posts', function(){
    
    /**
     * SERVER SIDE TEST
     */
    test('employees_server', function(done, server){
        server.eval(function(){
            // Insert an item into Employees
            Employees.insert({title: 'ticket test, server'});
            var docs = Employees.find().fetch();
            emit('docs', docs);
        });
        
        // Check the length in the ticket table is 1
        server.once('docs', function(docs){
            assert.equal(docs.length, 1);
            done();
        });
    });
    
    /**
     * Server + Client test
     */ 
    test('employees_client_and_server', function(done, server, client){
        server.eval(function(){
            Employees.find().observe({
                added: addedNewPost
            });
            
            function addedNewPost(post){
                emit('post', post);
            }
        }).once('post', function(post){
            assert.equal(post.title, 'hello title');
            done();
        });
        
        client.eval(function(){
            Posts.insert({title: 'hello title'});
        })
    })
    
});