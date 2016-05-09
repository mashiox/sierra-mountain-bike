'use strict'

//tests/common_problems.js
var assert = require('assert');


suite('Posts', function(){
    
    /**
     * SERVER SIDE TEST
     */
    test('common_problems_server', function(done, server){
        server.eval(function(){
            // Insert an item into CommonProblems
            CommonProblems.insert({title: 'ticket test, server'});
            var docs = CommonProblems.find().fetch();
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
    test('common_problems_client_and_server', function(done, server, client){
        server.eval(function(){
            CommonProblems.find().observe({
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