const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'node_prac',
    password: 'darsh2000',
    port: 5432,
})

const addImage = async (req, res, next) => {


    if (!req.file) {
        res.status(500);
        return next(err);
    }
    
    else {
        await pool.query('SELECT id FROM car WHERE id = $1', [req.body.carId], (err, result) => {
            if (err)
                res.json(err);
            else 
                if (result.rowCount == 0) 
                    res.status(500).json("carID is not present in car table");

        });
        let carId = req.body.carId;
        let imageName = await req.file.filename;
        let createdDate = await new Date().toDateString();
        await pool.query('INSERT INTO "carImage" ( "carId","imageName", "createdDate") VALUES ($1,$2,$3)', [carId, imageName, createdDate], (err, result) => {
            if (err)
                throw err;
            else
                res.json("added");
        });
    }
    
}
const getImages = async (req, res) => {
    let result = await pool.query('SELECT * FROM "carImage"');
    result.rows.forEach(element => {
        element.imageName = 'http://localhost:3000/car_images/' + element.imageName;
    })
    res.json( result.rows);
}
module.exports = {
    addImage,
    getImages
}