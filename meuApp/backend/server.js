const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tarefa = require('./models/Tarefa');

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

mongoose.connect(
  'mongodb+srv://lopesmatheus334_db_user:1234@tarefas.wm7zylc.mongodb.net/?appName=tarefas',
)
.then(() => console.log('MongoDB Atlas conectado'))
.catch(err => console.log(err));

app.post('/tarefas', async (req,res) => {
  const t = await Tarefa.create(req.body);
  res.json(t);
});

// Listar com Ordenação (Item 4)
app.get('/tarefas', async (req, res) => {
    try {
        const t = await Tarefa.find().sort({ createdAt: -1 }); 
        res.json(t);
    } catch (err) {
        res.status(500).json({ erro: "Falha ao buscar tarefas" });
    }
});

app.put('/tarefas/:id', async (req,res) => {
  const t = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(t);
});

app.delete('/tarefas/:id', async (req,res) => {
  await Tarefa.findByIdAndDelete(req.params.id);
  res.json({ ok:true });
});

app.listen(3000, '0.0.0.0', () => console.log('Servidor rodando'));