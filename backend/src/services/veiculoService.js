import { veiculoModel } from "../models/veiculoModel.js";
import { anuncianteModel } from "../models/anuncianteModel.js";
import { erro } from "../utils/erro.js";

const STATUS_VALIDOS = ["DISPONIVEL", "INATIVO"];

function validarDados(
  { anuncianteId, marca, modelo, ano, placa, valorDiaria, status } = {},
  idIgnorado = null
) {
  if (
    anuncianteId === undefined ||
    !marca ||
    !modelo ||
    ano === undefined ||
    typeof placa !== "string" ||
    !placa.trim() ||
    valorDiaria === undefined
  ) {
    throw erro(
      400,
      'Campos "anuncianteId", "marca", "modelo", "ano", "placa" e "valorDiaria" são obrigatórios'
    );
  }

  if (!Number.isInteger(anuncianteId) || anuncianteId <= 0) {
    throw erro(400, 'O campo "anuncianteId" deve ser um número inteiro positivo');
  }

  if (!Number.isInteger(ano) || ano < 1886) {
    throw erro(400, 'O campo "ano" deve ser um número inteiro válido');
  }

  if (!Number.isFinite(valorDiaria) || valorDiaria <= 0) {
    throw erro(400, 'O campo "valorDiaria" deve ser maior que zero');
  }

  if (!STATUS_VALIDOS.includes(status ?? "DISPONIVEL")) {
    throw erro(400, 'O status deve ser "DISPONIVEL" ou "INATIVO"');
  }

  if (veiculoModel.existePlaca(placa.trim(), idIgnorado)) {
    throw erro(409, "Já existe um veículo cadastrado com esta placa");
  }

  // Regra do relacionamento 1:N: o anunciante informado precisa existir.
  if (!anuncianteModel.buscarPorId(anuncianteId)) {
    throw erro(422, "O anunciante informado não existe");
  }
}

export const veiculoService = {
  listar(anuncianteId) {
    if (anuncianteId === undefined) return veiculoModel.listar();

    if (!Number.isInteger(anuncianteId) || anuncianteId <= 0) {
      throw erro(400, 'O parâmetro "anuncianteId" deve ser um número inteiro positivo');
    }

    if (!anuncianteModel.buscarPorId(anuncianteId)) {
      throw erro(422, "O anunciante informado não existe");
    }

    return veiculoModel.listarPorAnunciante(anuncianteId);
  },

  buscarPorId(id) {
    const veiculo = veiculoModel.buscarPorId(id);
    if (!veiculo) throw erro(404, "Veículo não encontrado");
    return veiculo;
  },

  criar({ anuncianteId, marca, modelo, ano, placa, valorDiaria, status } = {}) {
    const dados = {
      anuncianteId: anuncianteId === undefined ? undefined : Number(anuncianteId),
      marca,
      modelo,
      ano: ano === undefined || ano === "" ? undefined : Number(ano),
      placa: typeof placa === "string" ? placa.trim() : placa,
      valorDiaria:
        valorDiaria === undefined || valorDiaria === ""
          ? undefined
          : Number(valorDiaria),
      status: status ?? "DISPONIVEL"
    };

    validarDados(dados);
    return veiculoModel.inserir(dados);
  },

  atualizar(id, dados = {}) {
    const atual = veiculoModel.buscarPorId(id);
    if (!atual) throw erro(404, "Veículo não encontrado");

    const dadosAtualizados = {
      ...atual,
      ...dados,
      anuncianteId:
        dados.anuncianteId === undefined
          ? atual.anuncianteId
          : Number(dados.anuncianteId),
      ano: dados.ano === undefined ? atual.ano : Number(dados.ano),
      valorDiaria:
        dados.valorDiaria === undefined
          ? atual.valorDiaria
          : Number(dados.valorDiaria),
      placa:
        dados.placa === undefined
          ? atual.placa
          : String(dados.placa).trim()
    };

    validarDados(dadosAtualizados, id);
    return veiculoModel.atualizar(id, dadosAtualizados);
  },

  remover(id) {
    const removido = veiculoModel.remover(id);
    if (!removido) throw erro(404, "Veículo não encontrado");
  }
};
