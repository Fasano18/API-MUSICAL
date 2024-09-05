const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Importando as rotas de admin
const musicRoutes = require('./routes/musicRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);  // Usando as rotas de admin
app.use('/api/musics', musicRoutes);

// Rota de instalação
app.get('/install', async (req, res) => {
  try {
    const User = require('./models/User');
    const Song = require('./models/Songs'); // Certifique-se que este é o caminho correto

    // Criar administrador padrão se não existir
    let adminUser = await User.findOne({ email: 'admin@biblioteca.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin',
        email: 'adminPadrao@biblioteca.com',
        password: 'admin123', // Lembre-se de que idealmente deve-se hashear a senha
        role: 'admin',
      });
      await adminUser.save();
    }

    // Adicionar 5 músicas exemplo
    const songsCount = await Song.countDocuments();
    if (songsCount === 0) {
      const songs = [
        { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', genre: 'Genre 1', duration: 210, year: 2020 },
        { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', genre: 'Genre 2', duration: 180, year: 2019 },
        { title: 'Song 3', artist: 'Artist 3', album: 'Album 3', genre: 'Genre 3', duration: 240, year: 2021 },
        { title: 'Song 4', artist: 'Artist 4', album: 'Album 4', genre: 'Genre 4', duration: 200, year: 2018 },
        { title: 'Song 5', artist: 'Artist 5', album: 'Album 5', genre: 'Genre 5', duration: 190, year: 2022 },
      ];
      await Song.insertMany(songs);
    }

    res.status(200).json({ msg: 'Instalação concluída com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro na instalação', error: err.message });
  }
});

// Configuração do Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
