const router                = require('express').Router();
const { Rental, validate }  = require("../models/rental");
const { Movie }             = require('../models/movie');
const { Customer }          = require('../models/customer');
const mongoose              = require('mongoose');
const Fawn                  = require('fawn');

Fawn.init(mongoose);

router.get('/',  async (req, res) => 
{
    const rentals = await Rental.find().sort({dateOut:-1}); 
    res.send(rentals);
});

router.post('/', async (req, res) => {

    const {error} = validate(req.body);

    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);

    if(!customer)
    {
        return res.status(400).send('Invalid Customer');
    }

    const movie = await Movie.findById(req.body.movieId);

    if(!movie)
    {
        return res.status(400).send('Invalid Movie');
    }

    if(movie.numberInStock === 0)
    {
        return res.status(400).send('Movie Out of Stock');
    }

    let rental = new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }, 
    });

    try
    {
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', 
        {_id:movie._id}, 
        {
            $inc:{numberInStock:-1}
        })
        .run();
        res.send(rental);
    }
    catch (ex)
    {
        res.status(500).send('Something Failed');
    }
});

router.put('/:id', async (req, res) => {

    const {error} = validate(req.body);

    if(error)
    {
        return res.status(400).send(error.details[0].message);
    }

    const movie = await Rental.findByIdAndUpdate(req.params.id, 
    {
        title:req.body.title, 
        genre:req.body.genre,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
    }, 
    {
        new:true
    });

    if(!movie)
    {
        return res.status(404).send('The movie with the given Id Not Found');
    }

    res.send(movie);
});

router.delete('/:id', async (req, res) => {

    const movie = await Rental.findByIdAndRemove(req.params.id);

    if(!movie)
    {
        return res.status(404).send('The movie with the given Id Not Found');
    }

    res.send(movie);
});

router.get('/:id', async (req, res)=>{

    const movie = Rental.findById(req.params.id);

    if(!movie)
    {
        return res.status(404).send('The movie with the given Id Not Found');
    }

    res.send(movie);
});

module.exports = router;

