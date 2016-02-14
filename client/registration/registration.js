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
    
    'submit form.register-form': function (event) {
        event.preventDefault();
        var name = $('.register-form [name=name]').val();
        var password = $('.register-form [name=password]').val();
        var email = $('.register-form [name=email]').val();
        Accounts.createUser({
            email: email,
            password: password,
            username: name
        }, function(error){
            // TODO: Handle any errors...
            console.log(error);
        });
        Router.go("/");
    },
    
    'submit form.login-form': function(event){
        event.preventDefault();
        var email = $('.login-form input[name=email]').val();
        var password = $('.login-form input[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
            // TODO: Handle any errors...
            console.log(error);
        });
        Router.go("/")
    }
})