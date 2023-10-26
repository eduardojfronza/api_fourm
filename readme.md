<h2> Guia da construção do banco de dados </h2>

---
Este guia fornece instruções passo a passo para criar, inserir dados e consultar um banco de dados do fórum usando SQL. O banco de dados é criado com tabelas para usuários, postagens e comentários.

## Criar um Banco de Dados

1. Abra seu sistema de gerenciamento de banco de dados ou execute o MySQL.
2. Execute o seguinte comando para criar um banco de dados chamado "forum":

```sql
CREATE DATABASE forum;
```

3. Use o banco de dados recém-criado:

```sql
USE forum;
```

## Tabela de Usuários

A tabela de usuários armazena informações sobre os usuários registrados no fórum.

### Criar Tabela de Usuários

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    senha VARCHAR(120) NOT NULL,
    PRIMARY KEY (id)
);
```

### Inserir Usuários de Exemplo

```sql
INSERT INTO usuarios (nome, email, senha)
VALUES ('Nome1', 'email1@example.com', 'senha1'),
       ('Nome2', 'email2@example.com', 'senha2');
```

### Consultar Todos os Usuários

```sql
SELECT * FROM usuarios;
```

## Tabela de Postagens

A tabela de postagens armazena informações sobre as postagens no fórum.

### Criar Tabela de Postagens

```sql
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    conteudo TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    autor_id INT,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);
```

### Inserir Postagem de Exemplo

```sql
INSERT INTO posts (titulo, conteudo, autor_id)
VALUES ('Título do Post', 'Conteúdo do Post', 1);
```

### Consultar Todas as Postagens com Detalhes do Autor

```sql
SELECT
    posts.id AS post_id,
    posts.titulo AS post_titulo,
    posts.conteudo AS post_conteudo,
    posts.data_criacao AS post_data_criacao,
    usuarios.nome AS autor_nome
FROM
    posts
JOIN
    usuarios ON posts.autor_id = usuarios.id;
```

### Consultar uma Postagem Específica (Substitua 1 pelo ID da Postagem)

```sql
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
    posts.id = 1;
```

## Tabela de Comentários

A tabela de comentários armazena os comentários feitos em postagens.

### Criar Tabela de Comentários

```sql
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    autor_id INT,
    post_id INT,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);
```

### Inserir um Comentário de Exemplo

```sql
INSERT INTO comentarios (texto, autor_id, post_id)
VALUES ('Este é um comentário no post 1', 2, 1);
```

### Consultar Todos os Comentários para uma Postagem Específica (Substitua 1 pelo ID da Postagem)

```sql
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
    comentarios.post_id = 1;
```

---

<h2> Guia dos Endpoints da API do Fórum </h2>

Este guia descreve os endpoints disponíveis na API do Fórum, explicando suas funcionalidades e como utilizá-los.

## userRouter

O roteador `userRouter` é responsável por lidar com as operações relacionadas aos usuários do fórum.

### Listar Usuários

- **Método HTTP:** GET
- **Endpoint:** /users
- **Controlador:** `listUsers` no `userController`
- **Descrição:** Retorna a lista de todos os usuários registrados no fórum.

``` CODE
http://localhost:3008/api/users
```
``` JSON
{
	"success": true,
	"message": "Retorno de usuarios com sucesso!",
	"data": [
		{
			"id": 1,
			"nome": "Eduardo Fronza",
			"email": "edujfronza@gmail.com",
			"senha": "$2b$10$/EyfQUYcoXpPekl0gl7nVuGMj/rFI8jE8y/7Ye/qhRtMuu.44XMrq"
		},
		{
			"id": 2,
			"nome": "a",
			"email": "a@gmail.com",
			"senha": "$2b$10$ABQKHpiI5t43PWASqvZyROyoJ0hjBaaDLZ6A3bt1HSWn8hKVvZ7pu"
		},
	]
}
```

### Criar Usuário

- **Método HTTP:** POST
- **Endpoint:** /user/create
- **Controlador:** `storeUser` no `userController`
- **Descrição:** Cria um novo usuário com base nos dados fornecidos no corpo da requisição.

``` CODE
http://localhost:3008/api/user/create
```
``` JSON
{
	"nome": "Exemplo",
	"email": "Exemplo@gmail.com",
	"senha": "12345"
}
```

### Atualizar Usuário

- **Método HTTP:** PUT
- **Endpoint:** /user/:id
- **Controlador:** `updateUser` no `userController`
- **Descrição:** Atualiza as informações de um usuário específico com base no ID fornecido.
``` CODE
http://localhost:3008/api/user/1
```
``` JSON
{
	"nome": "Exemplo",
	"email": "Exemplo@gmail.com",
	"senha": "12345"
}
```

### Excluir Usuário

- **Método HTTP:** DELETE
- **Endpoint:** /user/:id
- **Controlador:** `deleteUser` no `userController`
- **Descrição:** Remove um usuário específico com base no ID fornecido.
``` CODE
http://localhost:3008/api/user/1
```
``` JSON
{
	"success": true,
	"message": "Sucesso! Usuário deletado.",
	"data": {
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"info": "",
		"serverStatus": 2,
		"warningStatus": 0,
		"changedRows": 0
	}
}
```

## postRouter

O roteador `postRouter` é responsável por operações relacionadas a postagens no fórum.

### Criar Postagem

- **Método HTTP:** POST
- **Endpoint:** /createPost
- **Controlador:** `createPost` no `postController`
- **Descrição:** Cria uma nova postagem com base nos dados fornecidos no corpo da requisição.

### Listar Todas as Postagens

- **Método HTTP:** GET
- **Endpoint:** /posts
- **Controlador:** `getAllPosts` no `postController`
- **Descrição:** Retorna a lista de todas as postagens no fórum.

### Consultar uma Postagem por ID

- **Método HTTP:** GET
- **Endpoint:** /posts/:id
- **Controlador:** `getPostsByUser` no `postController`
- **Descrição:** Retorna os detalhes de uma postagem específica com base no ID do usuario fornecido.

### Consultar uma Postagem por ID do usuario

- **Método HTTP:** GET
- **Endpoint:** /posts/:id
- **Controlador:** `getPostById` no `postController`
- **Descrição:** Retorna os detalhes de uma postagem específica com base no ID fornecido.

### Atualizar uma Postagem por ID do usuario

- **Método HTTP:** PUT
- **Endpoint:** /posts/update/:id
- **Controlador:** `updatePost` no `postController`
- **Descrição:** Atualiza os dados do post 

### Criar Comentário em uma Postagem

- **Método HTTP:** POST
- **Endpoint:** /createComment
- **Controlador:** `createComment` no `postController`
- **Descrição:** Adiciona um novo comentário a uma postagem com base nos dados fornecidos no corpo da requisição.

### Listar Comentários de uma Postagem

- **Método HTTP:** GET
- **Endpoint:** /getCommentsForPost/:id
- **Controlador:** `getCommentsForPost` no `postController`
- **Descrição:** Retorna a lista de comentários de uma postagem específica com base no ID da postagem.

## loginRouter

O roteador `loginRouter` trata das operações relacionadas ao login de usuários.

### Realizar Login

- **Método HTTP:** POST
- **Endpoint:** /login
- **Controlador:** `login` no `loginController`
- **Descrição:** Realiza a autenticação de um usuário com base nos dados de login fornecidos no corpo da requisição.

---
