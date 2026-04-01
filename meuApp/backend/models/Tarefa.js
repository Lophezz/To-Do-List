const mongoose = require('mongoose');

const TarefaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    concluida: { type: Boolean, default: false } // Item 1
}, { 
    timestamps: true // Item 4: Necessário para ordenar por data
});

module.exports = mongoose.model('Tarefa', TarefaSchema);