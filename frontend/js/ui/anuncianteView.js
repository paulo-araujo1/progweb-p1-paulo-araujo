const el = {
  form: document.querySelector('#form-anunciante'),
  salvar: document.querySelector('#anun-salvar'),
  cancelar: document.querySelector('#anun-cancelar'),
  carregando: document.querySelector('#anunciantes-carregando'),
  erro: document.querySelector('#anunciantes-erro'),
  erroMsg: document.querySelector('#anunciantes-erro-msg'),
  recarregar: document.querySelector('#anunciantes-recarregar'),
  vazio: document.querySelector('#anunciantes-vazio'),
  sucesso: document.querySelector('#anunciantes-sucesso'),
  linhas: document.querySelector('#anunciantes-linhas'),
};

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto ?? '—';
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(anunciante, editandoId) {
  const tr = document.createElement('tr');
  if (anunciante.id === editandoId) tr.className = 'editando';
  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', anunciante.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', anunciante.id, 'btn-outline-danger'),
  );
  tr.append(
    celula(anunciante.id, 'numero'),
    celula(anunciante.nome),
    celula(anunciante.tipo === 'PESSOA_FISICA' ? 'Pessoa física' : 'Empresa'),
    celula(anunciante.documento, 'numero'),
    celula(anunciante.email),
    celula(anunciante.telefone),
    acoes,
  );
  return tr;
}

export const anuncianteView = {
  render({ status, anunciantes, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');
    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...anunciantes.map((a) => linha(a, editandoId)));
    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando ? 'Salvando…' : editandoId ? 'Salvar alterações' : 'Cadastrar anunciante';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(a) {
    el.form.nome.value = a.nome;
    el.form.tipo.value = a.tipo;
    el.form.documento.value = a.documento;
    el.form.email.value = a.email;
    el.form.telefone.value = a.telefone;
    el.form.nome.focus();
  },

  limparForm() { el.form.reset(); },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },
  aoCancelar(fn) { el.cancelar.addEventListener('click', fn); },
  aoRecarregar(fn) { el.recarregar.addEventListener('click', fn); },
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
