/**
 * SMBC.Track.loginUser, void, static
 * Logs in user given email and plaintext password. (!!!)THIS IS Client-ONLY(!!!)
 * Note: the callback lambda param requires one parameter. 
 */
SMBC.Track.loginUser = function(email, password, callback){
    Meteor.loginWithPassword(email, password, function(error){
        // TODO: Handle any errors...
        if ( Meteor.userId() ) callback(false);
        else {
            console.log(error);
            callback(true);
        }
    });
};

/**
 * SMBC.Track.createUser, void, static
 */
SMBC.Track.createUser = function(name, email, password, callback){
    Accounts.createUser({
        email: email,
        password: password,
        username: name,
        profile: {
            name: name,
            title: "Associate",
            access: 0
        }
    }, function(error){
        console.log(error);
        if ( error ){
            console.log(error);
            callback(true); // Existent error
        } 
        else callback(false);
    });
}

/**
 * Track.getEmployeeId, string
 */
SMBC.Track.getEmployeeId = function(){
    return this._ein;
};

/**
 * Track.getEmployeeId, string
 */
SMBC.Track.prototype.getName = function(){
    return this._name;
};

/**
 * Track.getEmployeeId, string
 */
SMBC.Track.prototype.getEIN = function(){
    return this._ein;
};

/**
 * Track.getEmployeeId, string
 */
SMBC.Track.prototype.getTitle = function(){
    return this._title;
}

/**
 * Track.getEmployeeId, int
 */
SMBC.Track.prototype.getAccess = function(){
    return this._access;
};