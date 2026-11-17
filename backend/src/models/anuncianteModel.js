// Dados temporários em memória. Na etapa de persistência, esta camada será adaptada para SQLite.
let anunciantes = [];
let proximoId = 1;

export const anuncianteModel = {
  listar() {
    return anunciantes;
  },

  buscarPorId(id) {
    return anunciantes.find((anunciante) => anunciante.id === id) ?? null;
  },

  existeDocumento(documento, ignorarId = null) {
    return anunciantes.some(
      (anunciante) =>
        anunciante.documento === documento && anunciante.id !== ignorarId
    );
  },

  inserir({ nome, tipo, documento, email, telefone }) {
    const novo = { id: proximoId++, nome, tipo, documento, email, telefone };
    anunciantes.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const indice = anunciantes.findIndex((anunciante) => anunciante.id === id);
    if (indice === -1) return null;

    anunciantes[indice] = { ...anunciantes[indice], ...dados, id };
    return anunciantes[indice];
  },

  remover(id) {
    const quantidadeAntes = anunciantes.length;
    anunciantes = anunciantes.filter((anunciante) => anunciante.id !== id);
    return anunciantes.length < quantidadeAntes;
  }
};
