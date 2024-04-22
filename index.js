import axios from 'axios';
import express from 'express';
import _ from 'lodash';
import moment from 'moment';
import { nanoid } from 'nanoid'
import exphbs from 'express/handlebars';


const app = express()
app.engine('handlebars', exphbs({
    extname: '.handlebars',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'handlebars');

const users = []


app.get('/usuarios', (req, res) => {
    const usuariosPorSexo = _.partition(users, 'gender');
    res.render('usuarios', {
        male: usuariosPorSexo[0],
        female: usuariosPorSexo[1]
    });
});

app.get('/', async (req, res) => {


    const response = await axios.get('https://randomuser.me/api/')

    const gender = response.data.results[0].gender
    const first = response.data.results[0].name.first
    const last = response.data.results[0].name.last

    const user = {
        gender,
        first,
        last,
        id: nanoid(),
        timestamp: moment().format('LLL')

    }

    users.push(user)

    const newUsers = _.partition(users,(item ) => item.gender === 'male')
    
    const male = users.filter(item => item.gender === 'male')
    const female = users.filter(item => item.gender === 'female')
    res.send({
        male, female


    })

})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`example app listening on port ${PORT}`)
}) 
