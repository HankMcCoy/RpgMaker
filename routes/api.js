var mongo = require("mongodb"),
    mongoServer = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT),
    db = new mongo.Db('rpgr', mongoServer),
    BSONObjectId = mongo.BSONPure.ObjectID;

function withCollection(db, collectionName, callback) {
    db.open(function (err, db) {
        db.collection(collectionName, function (err, collection) {
            if (!err)
                callback(db, collection)
        });
    });
}

function createCrud(entityName) {
    var pascalEntityName = entityName[0].toUpperCase() + entityName.substring(1);
    
    exports['get' + pascalEntityName + 's'] = function (req, res) {
        withCollection(db, entityName + 's', function (db, entities) {
            entities.find().toArray(function (err, docs) {
                var jsonResult = {};
                jsonResult[entityName + 's'] = docs;
                res.json(jsonResult);
                db.close();
            });
        }); 
    };

    exports['get' + pascalEntityName] = function (req, res) {
        withCollection(db, entityName + 's', function (db, entities) {
            entities.findOne({ _id: new BSONObjectId(req.params[entityName + 'Id']) }, function (err, entity) {
                res.json(entity);
                db.close();
            });
        });
    };

    exports['create' + pascalEntityName] = function (req, res) {
        withCollection(db, entityName + 's', function (db, entities) {
            entities.insert(req.body, { safe: true }, function (err, records) {
                res.json(records[0], 201);
                db.close();
            });
        });
    };

    exports['update' + pascalEntityName] = function (req, res) {
    };

    exports['delete' + pascalEntityName] = function (req, res) {
        withCollection(db, entityName + 's', function (db, entities) {
            entities.remove({ _id: new BSONObjectId(req.params[entityName + 'Id']) }, true, function (err, entity) {
                res.status(204);
                db.close();
            });
        });
    };
}

createCrud('system');
createCrud('sheet');
