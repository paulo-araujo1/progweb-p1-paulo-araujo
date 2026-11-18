import { criarStore } from './state/store.js';
import { aviso } from './ui/aviso.js';
import { anuncianteService } from './services/anuncianteService.js';
import { veiculoService } from './services/veiculoService.js';
import { anuncianteView } from './ui/anuncianteView.js';
import { veiculoView } from './ui/veiculoView.js';

const anunciantes = criarStore({
  status: 'carregando', anunciantes: [], erro: null, editandoId: null, salvando: false,
});
const veiculos = criarStore({
  status: 'carregando', veiculos: [], erro: null, editandoId: null, salvando: false,
});

anunciantes.assinar(anuncianteView.render);
veiculos.assinar((estado) => veiculoView.render({ ...estado, anunciantes: anunciantes.get().anunciantes }));

async function carregarAnunciantes() {
  anunciantes.set({ status: 'carregando', erro: null });
  try {
    const lista = await anuncianteService.listar();
    anunciantes.set({ status: lista.length ? 'sucesso' : 'vazio', anunciantes: lista });
    // Atualiza o select e os nomes dos anunciantes exibidos na tabela de veículos.
    veiculos.set({ anunciantes: lista });
  } catch (e) {
    anunciantes.set({ status: 'erro', erro: e.message });
  }
}

async function carregarVeiculos() {
  veiculos.set({ status: 'carregando', erro: null });
  try {
    const filtro = document.querySelector('#filtro-anunciante').value;
    const lista = await veiculoService.listar(filtro);
    veiculos.set({ status: lista.length ? 'sucesso' : 'vazio', veiculos: lista });
  } catch (e) {
    veiculos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarAnunciante(dados) {
  const { editandoId } = anunciantes.get();
  aviso.limpar();
  anunciantes.set({ salvando: true });
  try {
    if (editandoId) await anuncianteService.atualizar(editandoId, dados);
    else await anuncianteService.criar(dados);
    aviso.sucesso(editandoId ? 'Anunciante atualizado.' : 'Anunciante cadastrado.');
    anuncianteView.limparForm();
    anunciantes.set({ editandoId: null });
    await carregarAnunciantes();
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    anunciantes.set({ salvando: false });
  }
}

function editarAnunciante(id) {
  const anunciante = anunciantes.get().anunciantes.find((a) => a.id === id);
  if (!anunciante) return;
  anuncianteView.preencherForm(anunciante);
  anunciantes.set({ editandoId: id });
}

function cancelarEdicaoAnunciante() {
  anuncianteView.limparForm();
  anunciantes.set({ editandoId: null });
}

async function removerAnunciante(id) {
  if (!confirm(`Remover o anunciante #${id}? A API poderá impedir a operação caso existam veículos vinculados.`)) return;
  aviso.limpar();
  try {
    await anuncianteService.remover(id);
    aviso.sucesso('Anunciante removido.');
    if (anunciantes.get().editandoId === id) cancelarEdicaoAnunciante();
    await carregarAnunciantes();
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  }
}

async function salvarVeiculo(dados) {
  const { editandoId } = veiculos.get();
  aviso.limpar();
  veiculos.set({ salvando: true });
  try {
    if (editandoId) await veiculoService.atualizar(editandoId, dados);
    else await veiculoService.criar(dados);
    aviso.sucesso(editandoId ? 'Veículo atualizado.' : 'Veículo cadastrado.');
    veiculoView.limparForm();
    veiculos.set({ editandoId: null });
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    veiculos.set({ salvando: false });
  }
}

function editarVeiculo(id) {
  const veiculo = veiculos.get().veiculos.find((v) => v.id === id);
  if (!veiculo) return;
  veiculoView.preencherForm(veiculo);
  veiculos.set({ editandoId: id });
}

function cancelarEdicaoVeiculo() {
  veiculoView.limparForm();
  veiculos.set({ editandoId: null });
}

async function removerVeiculo(id) {
  if (!confirm(`Remover o veículo #${id}?`)) return;
  aviso.limpar();
  try {
    await veiculoService.remover(id);
    aviso.sucesso('Veículo removido.');
    if (veiculos.get().editandoId === id) cancelarEdicaoVeiculo();
    await carregarVeiculos();
  } catch (e) {
    aviso.erro(e.message);
  }
}

anuncianteView.aoEnviar(salvarAnunciante);
anuncianteView.aoCancelar(cancelarEdicaoAnunciante);
anuncianteView.aoRecarregar(carregarAnunciantes);
anuncianteView.aoClicarNaLista({ editar: editarAnunciante, remover: removerAnunciante });

veiculoView.aoEnviar(salvarVeiculo);
veiculoView.aoCancelar(cancelarEdicaoVeiculo);
veiculoView.aoRecarregar(carregarVeiculos);
veiculoView.aoFiltrar(carregarVeiculos);
veiculoView.aoClicarNaLista({ editar: editarVeiculo, remover: removerVeiculo });

await carregarAnunciantes();
await carregarVeiculos();
