Template.registration.helpers({
    isLoggedIn: function(){
        return userLoggedIn();
    }
})

Template.registration.events({
    'click p.message' : function(event){
        event.preventDefault();
        
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    },
    
    /**
     * Handle Register new user
     */
    'submit form.register-form': function (event) {
        event.preventDefault();
        var name = $('.register-form [name=name]').val();
        var password = $('.register-form [name=password]').val();
        var email = $('.register-form [name=email]').val();
        // Using Track static, create user...
        SMBC.Track.createUser(name, email, password, function(error){
            /**
             * Callback handler function.
             * Only if a error does not occur, create a new Track object session variable
             * for the user, and move the user to the index.
             * TODO: (if necessary) If an error has occured, handle it.
             * Some error handling is done within SMBC.Track.createUser()
             */
            if ( !error ){
                var track = new SMBC.Track(Meteor.user().username, Meteor.userId(), Meteor.user().profile.title, Meteor.user().profile.access );
                Session.set("track", track);
                Router.go("/");
            }
            else {
                // TODO: (if necessary) If an error has occured, handle it.
            }
        });
    },
    
    /**
     * Handle login existing user
     */
    'submit form.login-form': function(event){
        event.preventDefault();
        // Grab the necessary form data
        var email = $('.login-form input[name=email]').val();
        var password = $('.login-form input[name=password]').val();
        
        // Using Track static, login user
        SMBC.Track.loginUser(email, password, function(error){
            /**
             * Callback handler function.
             * If a login error occurs, keep the user on the login screen
             * Otherwise ship them to the index.
             */
            if (error){
                Router.go("/login");
            }
            else {
                var track = new SMBC.Track(Meteor.user().username, Meteor.userId(), Meteor.user().profile.title, Meteor.user().profile.access );
                Session.set("track", track);
                Router.go("/");
            }
        }); 
    }
})