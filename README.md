## Mini-Projeto Parte II: CRUD de Lista de Filmes

Este projeto foi atualizado com uma nova funcionalidade completa de CRUD (Create, Read, Update, Delete) para gerenciar uma lista de filmes pessoal.

### Funcionalidades

* **Autenticação**: Todas as rotas de filmes são protegidas e exigem um token JWT válido (obtido via login) no cabeçalho `Authorization: Bearer <token>`.
* **Segurança**: As operações de CRUD são restritas ao usuário autenticado. Um usuário não pode ver, editar ou deletar filmes que pertencem a outro usuário.
* **Rotas Implementadas**:
    * `POST /api/movies`: Adiciona um novo filme à lista do usuário.
    * `GET /api/movies`: Lista todos os filmes do usuário.
    * `GET /api/movies?filter=value`: Permite filtrar a lista (ex: `?genre=Drama`, `?watched=true`).
    * `GET /api/movies/:id`: Obtém detalhes de um filme específico.
    * `PATCH /api/movies/:id`: Atualiza parcialmente um filme.
    * `PUT /api/movies/:id`: Atualiza (substitui) um filme.
    * `DELETE /api/movies/:id`: Remove um filme da lista.

---

### Documentação (Swagger)

A documentação completa da API, com todos os endpoints, schemas e exemplos, está disponível e é gerada automaticamente pelo Swagger.

**Acesso Local**
1. Inicie o servidor com `npm run dev`.
2. Acesse no seu navegador: [http://localhost:3000/docs](http://localhost:3000/docs)

**Acesso em Produção (Vercel)**
A documentação também está disponível no ambiente de produção:

[https://\<seu-link-do-vercel\>.vercel.app/docs](https://<seu-link-do-vercel>.vercel.app/docs)

*(Substitua `<seu-link-do-vercel>` pelo link do seu deploy no Vercel)*