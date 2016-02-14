/**
 * Library of functions to use in Meteor 
 * methods in order to keep from repeating
 * ourselves.
 */

userLoggedIn = function (){
    return Meteor.userId();
}

getUsername = function(){
    return ( Meteor.user() ? Meteor.user().username : undefined );
}