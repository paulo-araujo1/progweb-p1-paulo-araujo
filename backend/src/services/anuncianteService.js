import { anuncianteModel } from "../models/anuncianteModel.js";
import { erro } from "../utils/erro.js";

const TIPOS_VALIDOS = ["PESSOA_FISICA", "EMPRESA"];

function validarDados({ nome, tipo, documento, email, telefone } = {}) {
  if (!nome || !tipo || !documento || !email || !telefone) {
    throw erro(
      400,
      'Campos "nome", "tipo", "documento", "email" e "telefone" são obrigatórios'
    );
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw erro(400, 'O campo "tipo" deve ser "PESSOA_FISICA" ou "EMPRESA"');
  }
}

export const anuncianteService = {
  listar() {
    return anuncianteModel.listar();
  },

  buscarPorId(id) {
    const anunciante = anuncianteModel.buscarPorId(id);
    if (!anunciante) throw erro(404, "Anunciante não encontrado");
    return anunciante;
  },

  criar({ nome, tipo, documento, email, telefone } = {}) {
    validarDados({ nome, tipo, documento, email, telefone });

    if (anuncianteModel.existeDocumento(documento)) {
      throw erro(409, "Já existe um anunciante com este documento");
    }

    return anuncianteModel.inserir({ nome, tipo, documento, email, telefone });
  },

  atualizar(id, dados = {}) {
    const atual = anuncianteModel.buscarPorId(id);
    if (!atual) throw erro(404, "Anunciante não encontrado");

    const dadosAtualizados = { ...atual, ...dados };
    validarDados(dadosAtualizados);

    if (anuncianteModel.existeDocumento(dadosAtualizados.documento, id)) {
      throw erro(409, "Já existe um anunciante com este documento");
    }

    return anuncianteModel.atualizar(id, dadosAtualizados);
  },

  remover(id) {
    const removido = anuncianteModel.remover(id);
    if (!removido) throw erro(404, "Anunciante não encontrado");
  }
};
