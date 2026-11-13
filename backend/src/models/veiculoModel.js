// Dados temporários em memória. Na etapa de persistência, esta camada será adaptada para SQLite.
let veiculos = [];
let proximoId = 1;

export const veiculoModel = {
  listar() {
    return veiculos;
  },

  listarPorAnunciante(anuncianteId) {
    return veiculos.filter((veiculo) => veiculo.anuncianteId === anuncianteId);
  },

  buscarPorId(id) {
    return veiculos.find((veiculo) => veiculo.id === id) ?? null;
  },

  existePlaca(placa, ignorarId = null) {
    const placaNormalizada = placa.toUpperCase();
    return veiculos.some(
      (veiculo) =>
        veiculo.placa === placaNormalizada && veiculo.id !== ignorarId
    );
  },

  inserir({ anuncianteId, marca, modelo, ano, placa, valorDiaria, status }) {
    const novo = {
      id: proximoId++,
      anuncianteId,
      marca,
      modelo,
      ano,
      placa: placa.toUpperCase(),
      valorDiaria,
      status: status ?? "DISPONIVEL"
    };

    veiculos.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const indice = veiculos.findIndex((veiculo) => veiculo.id === id);
    if (indice === -1) return null;

    veiculos[indice] = {
      ...veiculos[indice],
      ...dados,
      id,
      placa: dados.placa.toUpperCase()
    };

    return veiculos[indice];
  },

  remover(id) {
    const quantidadeAntes = veiculos.length;
    veiculos = veiculos.filter((veiculo) => veiculo.id !== id);
    return veiculos.length < quantidadeAntes;
  }
};
