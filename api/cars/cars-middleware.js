const vinValidator = require('vin-validator');
const Cars = require('./cars-model');

const checkCarId = (req, res, next) => {
  const { id } = req.params;

  Cars.getById(id)
    .then((data) => {
      if (!data) {
        res.status(404).json({message: `Car with id ${id} is not found` })
      } else {
        next();
      }
    })
		.catch((err) => res.status(500).json({ message: err.message }));
};

const checkCarPayload = (req, res, next) => {
	const payload = req.body;

	const badRequest400 = field => {
		res.status(400).json({ message: `${field} is missing.` });
	};

	if (!payload.vin) {
		badRequest400('Vin');
	} else if (!payload.make) {
		badRequest400('Make');
	} else if (!payload.model) {
		badRequest400('Model');
	} else if (!payload.mileage) {
		badRequest400('Mileage');
	} else {
		next();
	}
};


const checkVinNumberValid = (req, res, next) => {
  const vin = req.body.vin;

  if (!vinValidator.validate(vin)) {
    res.status(400).json({ message: `Vin ${vin} is invalid.` })
  } else {
    next();
  }
};

const checkVinNumberUnique = (req, res, next) => {
  const { vin } = req.body;

  Cars.getAll()
		.then(data => {
			let vinExists = false;
			
      data.find(car => {
				if (car.vin === vin) {
					vinExists = true;
				}
			});

			if (vinExists) {
				res.status(400).json({ message: `Vin ${vin} already exists.` });
			} else {
				next();
			}
		})
		.catch(err => res.status(500).json({ message: err.message }));
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
};