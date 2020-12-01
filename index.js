require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./Models/Person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('body',function(req,res) {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons',(req,res) => {
    Person.find({}).then(result => {
        console.log("Getting Phonebook details");
        res.json(result);
    })
});

app.get('/api/persons/:id',(req,res,next) => {
    Person.findById(req.params.id).then(result => {
        if(!result) {
            res.status('404').end();
        }
        else {
            res.json(result);
        }
    })
    .catch(error => {
        next(error);
    });
});

app.get('/info',(req,res) => {
    Person.count({}).then(totalItems => {
        res.send(`<div>Phonebook has info for ${totalItems} people</div>
        <div>${new Date()}</div>`);
    });
});

app.post('/api/persons',(req,res,next) => {
    const body = req.body;
    if(!body.name || !body.number) {
        return res.status('400').json({error: 'Content Missing'});
    }

    const person = new Person({
        name:body.name,
        number:body.number,
        date: new Date()
    });

    person.save().then(result => {
        console.log(`Phonebook entry added ${result}`);
        res.json(result);
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id',(req,res,next) => {
    const body = req.body;

    const person = {
        name:body.name,
        number:body.number
    };

    Person.findByIdAndUpdate(req.params.id,person,{new: true}).then(result => {
        console.log(`Phonebook entry updated ${result}`);
        res.json(result);
    })
    .catch(error => {
        next(error);
    });
});

app.delete('/api/persons/:id',(req,res) => {
    Person.findOneAndDelete(req.params.id).then(result => {
        if(result) {
            res.status('204').end();
        }
        else {
            res.status('404').json({error:'Content not found'});
        }
    });
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
    next(error);
}
  
  app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});