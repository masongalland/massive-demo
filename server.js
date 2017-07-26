const express = require('express');
const bodyParser = require('body-parser');
const React = require('react');
const {renderToString} = require('react-dom/server');
const massive = require('massive')

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => {
  const db = req.app.get('db');

  db.getAllInjuries().then(injuries => {
    res.send(injuries)
  })
});

app.get('/incidents', (req, res) => {
  const db = req.app.get('db');
  const state = req.query.state;

  if(state) {
    db.getIncidentsByState([state]).then(incidents => {
      res.send(incidents)
    })
  }
  else {
    db.getAllIncidents().then(incidents => {
      res.send(incidents)
    })
  }
});

app.post('/incidents', (req, res) => {
  const db = req.app.get('db');
  const incident = req.body;
  
  db.createIncident([incident.state, incident.causeId, incident.injuryId])
  .then(results => {
    res.send(results)
  })
});

massive ('postgres://zkddtdawkhgcsp:e9e91625b4cf703e5d9c02f5b95fec1c02976f3fcb9f57343d6dd9b0a16efa04@ec2-50-19-95-47.compute-1.amazonaws.com:5432/db7p94efjckrqa?ssl=true')
.then(db => {
  app.set('db', db)

app.listen(port, () => {
  console.log('Started server on port', port);
});
})

