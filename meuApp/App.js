import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Text, FlatList, TouchableOpacity, 
  ActivityIndicator, Alert, StyleSheet, SafeAreaView 
} from 'react-native';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false); // Item 5
  const [editandoId, setEditandoId] = useState(null); // Item 2
  const [detalhe, setDetalhe] = useState(null); // Item 3

  const API = 'https://redesigned-space-fortnight-wpvgjjrp576hvg6p-3000.app.github.dev/tarefas';

  // LISTAR E ORDENAR
  async function carregar() {
    setLoading(true); // Item 5
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTarefas(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados."); // Item 5
    } finally {
      setLoading(false);
    }
  }

  // SALVAR (ADICIONAR OU EDITAR)
  async function salvar() {
    if (!texto) return;
    setLoading(true);
    
    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `${API}/${editandoId}` : API;

    try {
      await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: texto })
      });
      setTexto('');
      setEditandoId(null);
      carregar();
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  // MARCAR COMO CONCLUÍDA (Item 1)
  async function alternarStatus(item) {
    await fetch(`${API}/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concluida: !item.concluida })
    });
    carregar();
  }

  async function deletar(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    carregar();
  }

  useEffect(() => { carregar(); }, []);

  // TELA DE DETALHES (Item 3)
  if (detalhe) {
    return (
      <SafeAreaView style={styles.containerDetalhe}>
        <Text style={styles.titulo}>Detalhes da Tarefa</Text>
        <View style={styles.cardDetalhe}>
          <Text style={styles.label}>Título:</Text>
          <Text style={styles.valor}>{detalhe.titulo}</Text>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.valor}>{detalhe.concluida ? "Concluída ✅" : "Pendente ⏳"}</Text>
          <Text style={styles.label}>Criada em:</Text>
          <Text style={styles.valor}>{new Date(detalhe.createdAt).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => setDetalhe(null)}>
          <Text style={styles.btnTexto}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Gerenciador de Tarefas</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          value={texto}
          onChangeText={setTexto}
          placeholder="O que precisa ser feito?"
          style={styles.input}
        />
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
          <Text style={styles.btnTexto}>{editandoId ? "✅" : "➕"}</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginBottom: 10 }} />}

      <FlatList
        data={tarefas}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.concluida && styles.cardConcluido]}>
            <TouchableOpacity 
                style={styles.textoArea} 
                onPress={() => alternarStatus(item)} // Item 1
            >
              <Text style={[styles.itemTexto, item.concluida && styles.riscado]}>
                {item.titulo}
              </Text>
            </TouchableOpacity>

            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => setDetalhe(item)}><Text>ℹ️</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditandoId(item._id); setTexto(item.titulo); }}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletar(item._id)}><Text>🗑️</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#1C1C1E' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 10, elevation: 2 },
  btnSalvar: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginLeft: 10, justifyContent: 'center' },
  btnTexto: { color: '#FFF', fontWeight: 'bold' },
  card: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, 
    flexDirection: 'row', alignItems: 'center', elevation: 1 
  },
  cardConcluido: { backgroundColor: '#E5E5EA', opacity: 0.7 },
  textoArea: { flex: 1 },
  itemTexto: { fontSize: 16, color: '#3A3A3C' },
  riscado: { textDecorationLine: 'line-through', color: '#8E8E93' },
  acoes: { flexDirection: 'row', gap: 15 },
  containerDetalhe: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#FFF' },
  cardDetalhe: { padding: 20, backgroundColor: '#F2F2F7', borderRadius: 15, marginBottom: 20 },
  label: { fontWeight: 'bold', color: '#8E8E93', marginTop: 10 },
  valor: { fontSize: 18, color: '#1C1C1E' },
  btnVoltar: { backgroundColor: '#1C1C1E', padding: 15, borderRadius: 10, alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }
});