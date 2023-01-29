const express = require('express');
const app = express();

const db = require('./models');
const { Member } = db;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('URL should contain /api/...');
});

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({ where: { team } }); 
    res.send(teamMembers);
  } else {
    const members = await Member.findAll(); 
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
    // const id = req.params.id;
    const { id } = req.params;

    const member = await Member.findOne({ where: { id } });
    if(member){
        res.send(member);
    } else {
        res.status(404).send({ message : 'There is no such memeber' });
    }
});

app.post('/api/members', async (req, res) => {
    // console.log(req.body);
    const newMember = req.body;
    const member = Member.build(newMember);
    await member.save();
    res.send(newMember);
});

app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const result = await Member.update(newInfo, { where: { id } });

    if(result[0]) {
        res.send({ message: `${result[0]} row(s) affected`});
    }else{
        res.status(404).send({ message: 'there is no id' });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCount = await Member.destroy({ where: { id } });
    if(deletedCount) {
        res.send({ message: `${deletedCount} row(s) Deleted!!` });
    } else {
        res.status(404).send({ message: 'there is no id' });
    }

});

app.listen(process.env.PORT || 3000, () => {
    console.log('server is listening...');
});