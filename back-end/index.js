import express from 'express';
import mssql from 'mssql';

const app = express();

var dbconfig = {
    user: 'admin',
    password: '123Aghogho',
    server: 'dbmaster.cycoiftlmkqq.eu-west-2.rds.amazonaws.com', 
    database: 'speedtest',
    options:
    {
        "enableArithAbort": true
    }
};

app.get('/api/data', function (req, res) {
    mssql.connect(dbconfig, function (err) {
        if (err) console.log(err);

        var request = new mssql.Request();
        request.query('SELECT * FROM testresults', function (err, recordset) {
            if (err) console.log(err);
            // send records as a response
            console.log('Successful Request');
            res.send(recordset);
        });
    });
});

app.listen(3600, () => {
    console.log(`Server is listening on port 3600`)
});

module.exports = app;