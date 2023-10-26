const connection = require('../config/db');

// ---------------- POSTS ------------------

// Criar os posts
async function createPost(req, res) {
  const { titulo, conteudo, autor_id } = req.body;

  if (!titulo || !conteudo || !autor_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const query = 'INSERT INTO posts (titulo, conteudo, autor_id) VALUES (?, ?, ?)';
  const values = [titulo, conteudo, autor_id];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Erro ao criar o post: ' + error.message);
      return res.status(500).json({ error: 'Erro ao criar o post' });
    }

    res.json({ message: 'Post criado com sucesso', postId: result.insertId });
  });
}

// Consultar todos os posts com JOIN para obter informações do autor
async function getAllPosts(req, res) {
  const query = `
    SELECT
        posts.id AS post_id,
        posts.titulo AS post_titulo,
        posts.conteudo AS post_conteudo,
        posts.data_criacao AS post_data_criacao,
        usuarios.nome AS autor_nome
    FROM
        posts
    JOIN
        usuarios ON posts.autor_id = usuarios.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao recuperar os posts: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar os posts' });
    }

    res.json(results);
  });
}

// Consultar um post por id
async function getPostById(req, res) {
  const postId = req.params.id;

  const query = `
    SELECT
        posts.id AS post_id,
        posts.titulo AS post_titulo,
        posts.conteudo AS post_conteudo,
        posts.data_criacao AS post_data_criacao,
        usuarios.nome AS autor_nome
    FROM
        posts
    JOIN
        usuarios ON posts.autor_id = usuarios.id
    WHERE
        posts.id = ?; 
  `;

  connection.query(query, [postId], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar o post: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar o post' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(results[0]); // Retorna o primeiro resultado (supondo que haverá apenas um resultado)
  });
}

// Consultar todos os posts de um usuário
async function getPostsByUser(req, res) {
  const userId = req.params.id; // Supondo que você obtenha o ID do usuário a partir dos parâmetros da rota

  const query = `
    SELECT
        posts.id AS post_id,
        posts.titulo AS post_titulo,
        posts.conteudo AS post_conteudo,
        posts.data_criacao AS post_data_criacao,
        usuarios.nome AS autor_nome
    FROM
        posts
    JOIN
        usuarios ON posts.autor_id = usuarios.id
    WHERE
        posts.autor_id = ?;
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar os posts do usuário: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar os posts do usuário' });
    }

    res.json(results);
  });
}

// Atualizar um post (somente o autor)
async function updatePost(req, res) {
  const postId = req.params.id;
  const { titulo, conteudo, autor_id } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const query = 'UPDATE posts SET titulo = ?, conteudo = ? WHERE id = ? AND autor_id = ?';
  const values = [titulo, conteudo, postId, autor_id];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Erro ao atualizar o post: ' + error.message);
      return res.status(500).json({ error: 'Erro ao atualizar o post' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Não autorizado a editar este post ou post não encontrado' });
    }

    res.json({ message: 'Post atualizado com sucesso' });
  });
}


// ---------------- COMENTARIOS ------------------

// Criar um comentário
async function createComment(req, res) {
  const { texto, autor_id, post_id } = req.body;

  if (!texto || !autor_id || !post_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const query = 'INSERT INTO comentarios (texto, autor_id, post_id) VALUES (?, ?, ?)';
  const values = [texto, autor_id, post_id];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Erro ao criar o comentário: ' + error.message);
      return res.status(500).json({ error: 'Erro ao criar o comentário' });
    }

    res.json({ message: 'Comentário criado com sucesso', commentId: result.insertId });
  });
}

// Consultar todos os comentários para um post específico
async function getCommentsForPost(req, res) {
  const postId = req.params.id;

  const query = `
  SELECT
    comentarios.id AS comentario_id,
    comentarios.texto AS comentario_texto,
    comentarios.data_criacao AS comentario_data_criacao,
    usuarios.nome AS autor_nome
  FROM
    comentarios
  JOIN
    usuarios ON comentarios.autor_id = usuarios.id
  WHERE
    comentarios.post_id = ${postId};
  `;

  connection.query(query, [postId], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar os comentários: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar os comentários' });
    }

    res.json(results);
  });
}

// Consultar todas as respostas de um usuário em todos os posts
async function getCommentsByUser(req, res) {
  const userId = req.params.userId; // ID do usuário

  const query = `
    SELECT
        comentarios.id AS comentario_id,
        comentarios.texto AS comentario_texto,
        comentarios.data_criacao AS comentario_data_criacao,
        usuarios.nome AS autor_nome,
        posts.titulo AS post_titulo
    FROM
        comentarios
    JOIN
        usuarios ON comentarios.autor_id = usuarios.id
    JOIN
        posts ON comentarios.post_id = posts.id
    WHERE
        comentarios.autor_id = ?;
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar os comentários do usuário: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar os comentários do usuário' });
    }

    res.json(results);
  });
}

// Consultar um comentário por ID
async function getCommentById(req, res) {
  const commentId = req.params.id;

  const query = `
    SELECT
        comentarios.id AS comentario_id,
        comentarios.texto AS comentario_texto,
        comentarios.data_criacao AS comentario_data_criacao,
        usuarios.nome AS autor_nome
    FROM
        comentarios
    JOIN
        usuarios ON comentarios.autor_id = usuarios.id
    WHERE
        comentarios.id = ?; 
  `;

  connection.query(query, [commentId], (error, results) => {
    if (error) {
      console.error('Erro ao recuperar o comentário: ' + error.message);
      return res.status(500).json({ error: 'Erro ao recuperar o comentário' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    res.json(results[0]);
  });
}

// Atualizar um comentário
async function updateComment(req, res) {
  const commentId = req.params.id;
  const { texto, autor_id } = req.body;

  if (!texto) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  const query = 'UPDATE comentarios SET texto = ? WHERE id = ? AND autor_id = ?';
  const values = [texto, commentId, autor_id];

  connection.query(query, values, (error, result) => {
    if (error) {
      console.error('Erro ao atualizar o comentário: ' + error.message);
      return res.status(500).json({ error: 'Erro ao atualizar o comentário' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Não autorizado a editar este comentário ou comentário não encontrado' });
    }

    res.json({ message: 'Comentário atualizado com sucesso' });
  });
}


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  createComment,
  getCommentsForPost,
  updatePost,
  getCommentsByUser,
  getCommentById,
  updateComment,
  
};
