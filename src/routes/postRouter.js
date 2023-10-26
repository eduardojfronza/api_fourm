// Importar o modulo de Router do express
const { Router } = require('express');
// Instanciar o Router na variável router
const router = Router();

// Importar as funções (processamento da requisição) do controller
const { 
   createPost,
   getAllPosts,   
   getPostById,
   createComment,
   getCommentsForPost,
   updatePost,
   getPostsByUser,
   getCommentsByUser,
   getCommentById,
   updateComment,
   
} = require('../controllers/postController')

// Criar os endpoints (rotas) que serão acessados a partir dos métodos HTTP (get,post,put,delete)
router.post('/createPost', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.get('/posts/user/:id', getPostsByUser);
router.put('/posts/update/:id', updatePost);


router.post('/createComment', createComment);
router.get('/comments/post/:id', getCommentsForPost);
router.get('/comments/:id', getCommentById);
router.get('/comments/:userId/responses', getCommentsByUser);
router.put('/comments/post/update/:id', updateComment); 



module.exports = router;