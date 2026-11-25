import { api } from '../api.js';

function preparar({ nome, tipo, documento, email, telefone }) {
  const dados = {
    nome: (nome ?? '').trim(),
    tipo: (tipo ?? '').trim(),
    documento: (documento ?? '').replace(/\D/g, ''),
    email: (email ?? '').trim(),
    telefone: (telefone ?? '').trim(),
  };

  if (!dados.nome || !dados.tipo || !dados.documento || !dados.email || !dados.telefone) {
    throw new Error('Preencha todos os campos do anunciante.');
  }
  if (!['PESSOA_FISICA', 'EMPRESA'].includes(dados.tipo)) {
    throw new Error('Selecione um tipo de anunciante válido.');
  }
  const tamanhoEsperado = dados.tipo === 'PESSOA_FISICA' ? 11 : 14;
  if (dados.documento.length !== tamanhoEsperado) {
    throw new Error(`O documento deve conter ${tamanhoEsperado} dígitos.`);
  }

  return dados;
}

export const anuncianteService = {
  listar() { return api.get('/anunciantes'); },
  async criar(dados) { return api.post('/anunciantes', preparar(dados)); },
  async atualizar(id, dados) { return api.put(`/anunciantes/${id}`, preparar(dados)); },
  remover(id) { return api.delete(`/anunciantes/${id}`); },
};
