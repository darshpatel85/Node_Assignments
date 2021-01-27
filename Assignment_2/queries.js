const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'node_prac',
    password: 'darsh2000',
    port: 5432,
})

const getCars = (req, res) => {
    pool.query('SELECT "name","modelName","makerName" FROM car JOIN model ON car.modelid = model.modelid JOIN make ON car.makerid = make.makerid ORDER BY car.id ASC', (error, results) => {
        if (error)
            throw error;
        else {
            res.status(200).json(results.rows);
        }
    })
};

const getCar = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT "name","modelName","makerName" FROM car JOIN model ON car.modelid = model.modelid JOIN make ON car.makerid = make.makerid WHERE id = $1', [id], (error, results) => {
        if (error)
            throw error;
        else
            res.status(200).json(results.rows);
    })
};


module.exports = {
    getCars,
    getCar
}

