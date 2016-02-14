Router.configure({
    layoutTemplate: 'ApplicationLayout',
    
    waitOn: function(){
        // We will add Meteor-Mongo subscriptions here later...
        return;
    }
});

/**
 * Iron:Router
 * --- Index Page
 */
Router.route("/", function(){
    this.render("navbar", { to: "header"} );
    this.render("index", { to: "main"} );
});

/**
 * Iron:Router
 * --- Login/Registration Page
 */
Router.route("/login", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() ){
        this.render("index", { to: "main"} );
    }
    else { 
        this.render("registration", { to: "main"} );
    }
});