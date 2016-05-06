Template.navbar.helpers({
    isLoggedIn: function () {
        return userLoggedIn();
    },
    
    isMobile: function(){
        return Meteor.isCordova;
    }
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

Template.navbarLinks.helpers({
    isMobile: function(){
        return Meteor.isCordova();
    }
})


Template.loggedInButtons.events({
    'click .logOut': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go("/");
    }
})