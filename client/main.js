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

/**
 * Contact page
 */
Router.route("/contact", function(){
    this.render("navbar", { to: "header"} );
    this.render("contact", {to: "main"});
})

/**
 * Iron:Router
 * --- Employee Management System
 */
Router.route("/ems", function(){
    this.render("navbar", { to: "header"} );
    if ( Meteor.user() /*&& Meteor.user().profile.accessLevel >= 4*/ ){ 
        this.render("ems", { to: "main"} );
    }
    else{
        this.render("index", { to: "main"} );
    }
})