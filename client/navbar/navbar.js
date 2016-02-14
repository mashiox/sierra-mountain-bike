Template.navbar.helpers({
    isLoggedIn: function () {
        return userLoggedIn();
    },
    
    
});

Template.navbar.events({
    
});

/**
 * loggedInButtons methods
 */
Template.loggedInButtons.helpers({
    username: function () {
        return getUsername();
    }
})


Template.loggedInButtons.events({
    'click .logOut': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go("/");
    }
})