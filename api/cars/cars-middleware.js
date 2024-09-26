const vinValidator = require('vin-validator');
const Cars = require('./cars-model');

exports.checkCarId = (req, res, next) => {
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

exports.checkCarPayload = (req, res, next) => {
	const payload = req.body;

	const badRequest400 = (field) => {
		res.status(400).json({ message: `${field} is missing` });
	};

	if (!payload.vin) {
		badRequest400('vin');
	} else if (!payload.make) {
		badRequest400('make');
	} else if (!payload.model) {
		badRequest400('model');
	} else if (!payload.mileage) {
		badRequest400('mileage');
	} else {
		next();
	}
};


exports.checkVinNumberValid = (req, res, next) => {
  const vin = req.body.vin;

  if (!vinValidator.validate(vin)) {
    res.status(400).json({ message: `vin ${vin} is invalid` })
  } else {
    next();
  }
};

exports.checkVinNumberUnique = (req, res, next) => {
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
				res.status(400).json({ message: `vin ${vin} already exists` });
			} else {
				next();
			}
		})
		.catch(err => res.status(500).json({ message: err.message }));
};

exports.logger = (req, res, next) => {
  const currentDate = new Date();
  const formatedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  console.log(`${req.method} | ${req.url} | ${formatedTime}`)
  next();
};
