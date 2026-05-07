import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Dados em memória
let tasks: { id: number; title: string; done: boolean }[] = [];
let nextId = 1;

// GET /tasks — listar todas
app.get('/tasks', (_req: Request, res: Response) => {
  res.json(tasks);
});

// POST /tasks — criar tarefa
app.post('/tasks', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Campo "title" é obrigatório.' });
    return;
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id — marcar como concluída
app.put('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
    return;
  }
  task.done = true;
  res.json(task);
});

// DELETE /tasks/:id — remover tarefa
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
    return;
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
