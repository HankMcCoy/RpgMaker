var r = require('rethinkdb'),
    connConfig = {
        host: 'localhost',
        port: 28015,
        database: 'rpgmaker',
        timeout: 20
    };

function createCrud(entityName) {
    var pascalEntityName = entityName[0].toUpperCase() + entityName.substring(1);
    function handleErrors(fn, res) {
        return function () {
            try {
                fn.apply(this, arguments);
            }
            catch (e) {
                if (e.name === 'RqlDriverError')
                    res.status(500).json({ error: 'RqlDriverException.' });
                else
                    res.status(500).json({ error: 'Unknown' });
            }
        }
    }
    
    exports['get' + pascalEntityName + 's'] = function (req, res) {
        r.connect(connConfig, handleErrors(function (err, conn) {
            if (err) throw err;

            r.db('rpgmaker').table(entityName + 's').run(conn, function (err, cur) {
                var jsonResult = {};
                debugger;
                cur.toArray(function (err, docs) {
                    jsonResult[entityName + 's'] = docs;
                    res.json(jsonResult);
                });
            });
        }, res));
    };

    exports['get' + pascalEntityName] = function (req, res) {
        r.connect(connConfig, handleErrors(function (err, conn) {
            r.db('rpgmaker').table(entityName + 's').get(req.params[entityName + 'Id']).run(conn, function (err, entity) {
                res.json(entity);
            });
        }, res));
    };

    exports['create' + pascalEntityName] = function (req, res) {
        r.connect(connConfig, handleErrors(function (err, conn) {
            r.db('rpgmaker').table(entityName + 's').insert(req.body).run(conn, function (err, result) {
                if (err)
                    throw new Error(err);
                res.json({ id: result.generated_keys[0] }, 201);
            });
        }, res));
    };

    exports['update' + pascalEntityName] = function (req, res) {
    };

    exports['delete' + pascalEntityName] = function (req, res) {
        console.log('DELETE');
        r.connect(connConfig, handleErrors(function (err, conn) {
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
        }, res));
    };
}

createCrud('system');
createCrud('sheet');
