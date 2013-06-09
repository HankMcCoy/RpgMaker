var mongo = require("mongodb"),
    mongoServer = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT),
    db = new mongo.Db('rpgr', mongoServer);

exports.getSystems = function (req, res) {
    db.open(function (err, db) {
        db.collection('systems', function (err, systems) {
            systems.find().toArray(function (err, documents) {
                debugger;
                res.json({ systems: documents });
                db.close();
            });
        });
    });
};

exports.getSystem = function (req, res) {
    db.open(function (err, db) {
        db.collection('systems', function (err, systems) {
            systems.findOne({ _id: new mongo.BSONPure.ObjectID(req.params.systemId) }, function (err, system) {
                res.json(system);
                db.close();
            });
        });
    });
};

exports.createSystem = function (req, res) {
    // create the system
    // return the system with a 201
};
