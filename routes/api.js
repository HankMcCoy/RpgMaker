var r = require('rethinkdb'),
    connConfig = {
        host: 'localhost',
        port: 28015,
        database: 'rpgmaker',
        timeout: 20
    };

function createCrud(entityName) {
    var pascalEntityName = entityName[0].toUpperCase() + entityName.substring(1);
    
    exports['get' + pascalEntityName + 's'] = function (req, res) {
        r.connect(connConfig, function (err, conn) {
            if (err) throw err;

            r.db('rpgmaker').table(entityName + 's').run(conn, function (err, cur) {
                var jsonResult = {};
                debugger;
                cur.toArray(function (err, docs) {
                    jsonResult[entityName + 's'] = docs;
                    res.json(jsonResult);
                });
            });
        }); 
    };

    exports['get' + pascalEntityName] = function (req, res) {
        r.connect(connConfig, function (err, conn) {
            r.db('rpgmaker').table(entityName + 's').get(req.params[entityName + 'Id']).run(conn, function (err, entity) {
                res.json(entity);
            });
        });
    };

    exports['create' + pascalEntityName] = function (req, res) {
        r.connect(connConfig, function (err, conn) {
            r.db('rpgmaker').table(entityName + 's').insert(req.body).run(conn, function (err, result) {
                res.json({ id: result.generated_keys[0] }, 201);
            });
        });
    };

    exports['update' + pascalEntityName] = function (req, res) {
    };

    exports['delete' + pascalEntityName] = function (req, res) {
        console.log('DELETE');
        r.connect(connConfig, function (err, conn) {
            console.log('CONNECTED');
            r.db('rpgmaker').table(entityName + 's').get(req.params[entityName + 'Id']).delete().run(conn, function (err, result) {
                console.log('RUNNING');
                console.log(err);
                console.log(result);
                if (err !== null || result.errors !== 0)
                    res.send(500);
                else
                    res.send(204);
            });
        });
    };
}

createCrud('system');
createCrud('sheet');
