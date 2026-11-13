import { anuncianteService } from "../services/anuncianteService.js";

export const anuncianteController = {
  listar(req, res) {
    res.json(anuncianteService.listar());
  },

  buscarPorId(req, res) {
    res.json(anuncianteService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = anuncianteService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(anuncianteService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    anuncianteService.remover(Number(req.params.id));
    res.status(204).end();
  }
};
