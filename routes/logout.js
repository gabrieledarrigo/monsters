/**
* LOGOUT ROUTES. 
* Query for a specific user and if it exists set the active status to 0.
*/
module.exports = function (model) {

    return function (req, res) {
        
        if (req.query.nickname) {

            var queryUser = model.user.find({
                nickname : req.query.nickname
            });

            queryUser.exec(function (error, user) {
                if (error) throw error;
                
                if (user) {
                    var updateUser = model.user.findOneAndUpdate({
                            nickname : req.query.nickname 
                        }, {active : 0});

                    updateUser.exec(function(error, updated) {
                        res.send(updated);
                    });
                }
            });
        }
    };
};