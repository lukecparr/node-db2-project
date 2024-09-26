const router = require('express').Router();
const Cars = require('./cars-model');
const {checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique} = require('./cars-middleware');

router.get('/', (req, res, next) => {
	Cars.getAll()
		.then((data) => {
			const sortedCars = data.sort((a, b) => {return a - b})
			res.status(200).json(sortedCars)
		})
		.catch((err) => next(err));
});


router.get('/:id', checkCarId, (req, res, next) => {
	const { id } = req.params;

	Cars.getById(id)
		.then((data) => res.status(200).json(data))
		.catch((err) => next(err));
});


router.post('/', checkCarPayload, checkVinNumberValid, checkVinNumberUnique, (req, res, next) => {
	const newCar = req.body;
	
	Cars.create(newCar)
		.then((data) => res.status(201).json(data))
		.catch((err) => next(err));
});


router.use((err, req, res, next) => { //eslint-disable-line
	res.status(500).json({
		message: 'Something went wrong inside the cars router',
		errMessage: err.message
	});
});

module.exports = router;