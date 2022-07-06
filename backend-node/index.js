
const fastify = require('fastify')({
    logger: true
})

fastify.register(require('fastify-mysql'), {
  promise: true,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'pouletmayo',
})

fastify.register(require('fastify-cors'), { 
  origin: ['http://localhost:9000', 'https://www.sandwichpouletmayonnaise.com']
})

fastify.get('/api/entreesdujour', async (req, res) => {
  const d = new Date();
  let day = d.getDay();

  try {
    const con = await fastify.mysql.getConnection()
    const sql = 'SELECT * FROM Entrees WHERE jour = ?';
    const [rows, fields] = await con.execute(sql, [day])
    res.status(200).send(rows); 
    con.release(); 
  } catch (error) {
    fastify.log.error(error);
    res.status(500).send({ error: error.message });
  }
})

fastify.get('/health', (req, res) => {
  res.status(200).send('ok');  
})

// Server port
const HTTP_PORT = 8000;
// Start server
fastify.listen(HTTP_PORT,'0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})