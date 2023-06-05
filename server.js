const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Configuração dos middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Rota GET
server.get('/notes', (req, res) => {
  const notes = router.db.get('notes').value();
  res.json(notes);
});

// Rota POST
server.post('/notes', (req, res) => {
  const note = req.body;
  const createdNote = router.db
    .get('notes')
    .insert(note)
    .write();
  res.json(createdNote);
});

// Rota PUT
server.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const updatedNote = router.db
    .get('notes')
    .find({ id: parseInt(id) })
    .assign({ content })
    .write();
  res.json(updatedNote);
});

// Configuração padrão do json-server
server.use(router);

// Inicialização do servidor
server.listen(3001, () => {
  console.log('JSON Server is running on port 3001');
});
