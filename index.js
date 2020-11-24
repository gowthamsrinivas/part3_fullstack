const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors());

app.use(express.json());

morgan.token('body',function(req,res) {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let phoneBook = [
    {
        id:1,
        name:'xyz',
        number:"809999999"
    },
    {
        id:2,
        name:'abc',
        number:"98899999"
    },
    {
        id:3,
        name:'ghi',
        number:"8099999969"
    },
    {
        id:4,
        name:'xyz1111',
        number:"789865467"
    },
];

const generateId = () => {
    return Math.floor(Math.random() * 100);
}

app.get('/api/persons',(req,res) => {
    res.json(phoneBook);
});

app.get('/api/persons/:id',(req,res) => {
    let person = phoneBook.find((item) => item.id === Number(req.params.id));
    if(!person) {
        res.status('404').end();
    }
    else {
        res.json(person);
    }    
});

app.get('/info',(req,res) => {
    res.send(`<div>Phonebook has info for ${phoneBook.length} people</div>
        <div>${new Date()}</div>`);
});

app.post('/api/persons',(req,res) => {
    const body = req.body;
    if(!body.name || !body.number) {
        return res.status('400').end();
    }
    const redundantData = phoneBook.map((entry) => entry.name).indexOf(body.name) > -1;
    if(redundantData) {
        return res.status('409').json({error:'Name must be unique'});
    }

    const person = {
        name:body.name,
        number:body.number,
        id:generateId()
    }

    phoneBook = phoneBook.concat(person);
    res.json(person);
});

app.delete('/api/persons/:id',(req,res) => {
    phoneBook = phoneBook.filter((entry) => entry.id !== Number(req.params.id));
    res.status('204').end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});