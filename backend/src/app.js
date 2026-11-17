import express from 'express';

import anuncianteRouter from './routes/anunciante.js';
import veiculoRouter from './routes/veiculo.js';

import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

// Health check
app.get('/', (req, res) => {
  res.json({
    api: 'VemDeCar API',
    versao: '1.0.0',
    rotas: ['/anunciantes', '/veiculos']
  });
});

// Rotas
app.use('/anunciantes', anuncianteRouter);
app.use('/veiculos', veiculoRouter);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    erro: `Rota ${req.method} ${req.url} não existe`
  });
});

// Tratamento de erros
app.use(errorHandler);

export default app;