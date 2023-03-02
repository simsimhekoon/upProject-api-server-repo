const express = require('express');
const router = express.Router();

const db = require("../../models");
const { Member } = db;

router.use(express.json());

// //읽기
// router.get('/members', async (req, res) => {
//   const { team } = req.query;
//   if (team) {
//     const teamMembers = await Member.findAll({ where: { team } }); 
//     res.send(teamMembers);
//   } else {
//     const members = await Member.findAll(); 
//     res.send(members);
//   }
// });

// //쓰기
// router.post('/members', async (req, res) => {
//     console.log(req);
//     console.log(req.body);
//     const newMember = req.body;
//     const member = Member.build(newMember);
//     await member.save();
//     res.send(newMember);
// });

// //수정
// router.put('/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, { where: { id } });

//     if(result[0]) {
//         res.send({ message: `${result[0]} row(s) affected`});
//     }else{
//         res.status(404).send({ message: 'there is no id' });
//     }
// });

// //삭제
// router.delete('/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const deletedCount = await Member.destroy({ where: { id } });
//     if(deletedCount) {
//         res.send({ message: `${deletedCount} row(s) Deleted!!` });
//     } else {
//         res.status(404).send({ message: 'there is no id' });
//     }

// });


module.exports = router;