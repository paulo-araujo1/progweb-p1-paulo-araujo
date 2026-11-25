const el = {
  form: document.querySelector('#form-veiculo'),
  salvar: document.querySelector('#vei-salvar'),
  cancelar: document.querySelector('#vei-cancelar'),
  anunciante: document.querySelector('#vei-anunciante'),
  filtro: document.querySelector('#filtro-anunciante'),
  carregando: document.querySelector('#veiculos-carregando'),
  erro: document.querySelector('#veiculos-erro'),
  erroMsg: document.querySelector('#veiculos-erro-msg'),
  recarregar: document.querySelector('#veiculos-recarregar'),
  vazio: document.querySelector('#veiculos-vazio'),
  sucesso: document.querySelector('#veiculos-sucesso'),
  linhas: document.querySelector('#veiculos-linhas'),
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

function linha(veiculo, anunciantes, editandoId) {
  const tr = document.createElement('tr');
  if (veiculo.id === editandoId) tr.className = 'editando';
  const anunciante = anunciantes.find((a) => a.id === veiculo.anuncianteId);
  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', veiculo.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', veiculo.id, 'btn-outline-danger'),
  );
  tr.append(
    celula(veiculo.id, 'numero'),
    celula(`${veiculo.marca} ${veiculo.modelo}`),
    celula(veiculo.ano, 'numero'),
    celula(veiculo.placa, 'numero text-nowrap'),
    celula(Number(veiculo.valorDiaria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'numero text-nowrap'),
    celula(anunciante?.nome ?? `Anunciante #${veiculo.anuncianteId}`),
    celula(veiculo.status === 'DISPONIVEL' ? 'Disponível' : 'Inativo'),
    acoes,
  );
  return tr;
}

function preencherSelect(select, anunciantes, valorAtual = '') {
  const anterior = valorAtual || select.value;
  select.replaceChildren(new Option('Selecione um anunciante…', ''));
  anunciantes.forEach((a) => select.add(new Option(`${a.nome} (#${a.id})`, a.id)));
  if (anterior && anunciantes.some((a) => String(a.id) === String(anterior))) {
    select.value = String(anterior);
  }
}

export const veiculoView = {
  render({ status, veiculos, anunciantes, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');
    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...veiculos.map((v) => linha(v, anunciantes, editandoId)));
    el.salvar.disabled = salvando || anunciantes.length === 0;
    el.salvar.textContent = salvando ? 'Salvando…' : editandoId ? 'Salvar alterações' : 'Cadastrar veículo';
    el.cancelar.classList.toggle('d-none', !editandoId);
    preencherSelect(el.anunciante, anunciantes);
    preencherSelect(el.filtro, anunciantes, el.filtro.value);
  },

  preencherForm(v) {
    el.form.anuncianteId.value = String(v.anuncianteId);
    el.form.marca.value = v.marca;
    el.form.modelo.value = v.modelo;
    el.form.ano.value = v.ano;
    el.form.placa.value = v.placa;
    el.form.valorDiaria.value = v.valorDiaria;
    el.form.status.value = v.status;
    el.form.marca.focus();
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
  aoFiltrar(fn) { el.filtro.addEventListener('change', () => fn(el.filtro.value)); },
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
