const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var onSwitch = false;

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'hbs');

//////////////////////////////////////////////////////////////////////
// M I D D L E W A R E
//////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method}: ${req.url} `;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to append to server.log');
    }
  });
  if(!onSwitch){
    res.render('maintenance.hbs', {
      pageTitle: 'Maintenance Page',
      welcomeMessage: 'Site is currently offline...go away'
    })
  }else{
    next();
  }
});

app.use(express.static(__dirname+'/public'));
//////////////////////////////////////////////////////////////////////
// H E L P E R S
//////////////////////////////////////////////////////////////////////

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//////////////////////////////////////////////////////////////////////
// R O U T I N G   F U N C T I O N S
//////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this amazing website!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

//////////////////////////////////////////////////////////////////////
// L I S T E N E R
//////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
