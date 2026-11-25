import { api } from '../api.js';

function preparar({ anuncianteId, marca, modelo, ano, placa, valorDiaria, status }) {
  const dados = {
    anuncianteId: Number(anuncianteId),
    marca: (marca ?? '').trim(),
    modelo: (modelo ?? '').trim(),
    ano: Number(ano),
    placa: (placa ?? '').trim().toUpperCase(),
    valorDiaria: Number(valorDiaria),
    status: status || 'DISPONIVEL',
  };

  if (!dados.anuncianteId || !dados.marca || !dados.modelo || !dados.placa || !ano || !valorDiaria) {
    throw new Error('Preencha todos os campos obrigatórios do veículo.');
  }
  if (!Number.isInteger(dados.ano) || dados.ano < 1886) {
    throw new Error('Informe um ano válido para o veículo.');
  }
  if (!Number.isFinite(dados.valorDiaria) || dados.valorDiaria <= 0) {
    throw new Error('O valor da diária deve ser maior que zero.');
  }
  if (!['DISPONIVEL', 'INATIVO'].includes(dados.status)) {
    throw new Error('Selecione um status válido.');
  }

  return dados;
}

export const veiculoService = {
  listar(anuncianteId) {
    const caminho = anuncianteId ? `/veiculos?anuncianteId=${encodeURIComponent(anuncianteId)}` : '/veiculos';
    return api.get(caminho);
  },
  async criar(dados) { return api.post('/veiculos', preparar(dados)); },
  async atualizar(id, dados) { return api.put(`/veiculos/${id}`, preparar(dados)); },
  remover(id) { return api.delete(`/veiculos/${id}`); },
};
