const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'node_prac',
    password: 'darsh2000',
    port: 5432,
})

const getCars = (req, res) => {
    pool.query('SELECT car.id,"name","modelName","makerName" FROM car JOIN model ON "modelId" = model.id JOIN make ON "makerId" = make.id ORDER BY car.id ASC', (error, results) => {
        if (error)
            throw error;
        else {
            res.status(200).json(results.rows);
        }
    })
};

const getCar = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT car.id,"name","modelName","makerName" FROM car JOIN model ON "modelId" = model.id JOIN make ON "makerId" = make.id WHERE car.id = $1', [id], (error, results) => {
        if (error)
            throw error;
        else
            res.status(200).json(results.rows);
    })
};

const addCar = async(req, res) => {
    const carName = req.body.carName;
    const modelName = req.body.modelName;
    const makerName = req.body.makerName;

    //check car is already in database
    let carCheck = await pool.query('SELECT * FROM car WHERE car.name = $1', [carName]);
    if (carCheck.rowCount == 0) {
        
        //check and get makerId
        let makerId;
        let makerIdCheck = await pool.query('SELECT id FROM make WHERE "makerName" = $1', [makerName]);
        if (makerIdCheck.rowCount == 0) {
            await pool.query('INSERT INTO make ("makerName") VALUES ($1)', [makerName]);
            makerIdCheck = await pool.query('SELECT id FROM make WHERE "makerName" = $1', [makerName]);
            makerId =await makerIdCheck.rows[0].id;
        }
        else
            makerId = await makerIdCheck.rows[0].id;

        //check and get modelId
        let modelId;
        let modelIdCheck = await pool.query('SELECT id FROM model WHERE "modelName" = $1', [modelName]);
        if (modelIdCheck.rowCount == 0) {
            await pool.query('INSERT INTO model ("modelName") VALUES ($1)', [modelName]);
            modelIdCheck = await pool.query('SELECT id FROM model WHERE "modelName" = $1', [modelName]);
            modelId = await modelIdCheck.rows[0].id;
        }
        else
            modelId = await modelIdCheck.rows[0].id;
        await console.log(makerId, modelId, carName)

        //add data to database
        await pool.query('INSERT INTO car ("name","makerId","modelId") VALUES ($1,$2,$3)', [carName, makerId, modelId]);
        await res.status(201).json("car added sucessfully");
    }
    else {
        res.json("Car already exists");
    }

}


const updateCar = async (req, res) => {
    const carId = req.params.id;
    const carName = req.body.carName;
    const modelName = req.body.modelName;
    const makerName = req.body.makerName;

    //check car is already in database
    let carCheck = await pool.query('SELECT * FROM car WHERE car.name = $1', [carName]);
    if (carCheck.rowCount == 0) {

        //check and get makerId
        let makerId;
        let makerIdCheck = await pool.query('SELECT id FROM make WHERE "makerName" = $1', [makerName]);
        if (makerIdCheck.rowCount == 0) {
            await pool.query('INSERT INTO make ("makerName") VALUES ($1)', [makerName]);
            makerIdCheck = await pool.query('SELECT id FROM make WHERE "makerName" = $1', [makerName]);
            makerId = await makerIdCheck.rows[0].id;
        }
        else
            makerId = await makerIdCheck.rows[0].id;

        //check and get modelId
        let modelId;
        let modelIdCheck = await pool.query('SELECT id FROM model WHERE "modelName" = $1', [modelName]);
        if (modelIdCheck.rowCount == 0) {
            await pool.query('INSERT INTO model ("modelName") VALUES ($1)', [modelName]);
            modelIdCheck = await pool.query('SELECT id FROM model WHERE "modelName" = $1', [modelName]);
            modelId = await modelIdCheck.rows[0].id;
        }
        else
            modelId = await modelIdCheck.rows[0].id;
        await console.log(makerId, modelId, carName)

        //add data to database
        await pool.query('UPDATE car SET "name" = $1,"makerId"=$2,"modelId"=$3 WHERE car.id = $4', [carName, makerId, modelId, carId]);
        await res.status(200).json(`car with id ${carId} updated sucessfully`);
    }
    else {
        res.json("Car already exists");
    }


}

const deleteCar = async (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM car WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`car with id ${id} deleted sucessfully`)
    })
};
module.exports = {
    getCars,
    getCar,
    addCar,
    updateCar,
    deleteCar
}

