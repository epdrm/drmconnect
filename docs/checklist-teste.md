# Checklist de testes - DrmConnect

## Informacoes da rodada

- **Ambiente:** produção em `https://drmconnect.vercel.app`
- **Ambiente local:** `http://localhost:5173`
- **Data:** 2026-11-19
- **Status geral:** rodada executada com uma conta autenticada compartilhada. Cadastro publico,
  login por credenciais/Google e redefinicao exigiriam sair da conta ou acessar outro fluxo;
  esses itens nao foram alterados nesta rodada.
- **Legenda:** `[ ]` nao executado, `[x]` aprovado, `[!]` falha aberta

Use uma conta de teste real para os fluxos autenticados. Em cada item registre o navegador,
a largura usada, o resultado observado e o link ou numero da issue.

## Dados e pre-requisitos

- Conta de teste valida criada por e-mail.
- Conta Google de teste nao institucional.
- Acesso ao e-mail da conta de teste para confirmar cadastro e redefinir senha.
- Pelo menos uma imagem PNG/JPEG pequena.
- Pelo menos outro usuario com perfil e posts para os testes de perfil.

## Como testar cada largura

Para cada fluxo, repita a validacao nas larguras:

1. **320 px** - viewport mobile estreito.
2. **768 px** - viewport tablet.
3. **Acima de 1024 px** - use 1280 px ou mais.

Em 1024 px exatamente, a coluna de noticias deve desaparecer da Home e o acesso deve ocorrer
pelo link Noticias da navbar. Em larguras maiores que 1024 px, a coluna deve reaparecer na Home.

## Cadastro

1. Abra `/cadastro`.
2. Confirme que o botao Cadastrar fica desabilitado sem aceitar os Termos de Uso.
3. Preencha nome, e-mail valido e senha.
4. Aceite os termos e clique em Cadastrar.

**Resultado esperado:** a conta recebe solicitação de verificacao por e-mail e a interface informa
para verificar o e-mail. Nao deve haver cadastro sem aceitar os termos.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [ ] 1280 px
- Evidencia/issue: nao executado nesta rodada; a sessão compartilhada ja estava autenticada.

## Login por e-mail

1. Abra `/login`.
2. Informe um e-mail e senha cadastrados.
3. Clique em Logar.

**Resultado esperado:** login aprovado, alerta de sucesso e redirecionamento para `/home`.
Credenciais invalidas exibem erro sem criar sessao.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [ ] 1280 px
- Evidencia/issue: nao executado nesta rodada; evitaria alterar a sessao ativa da conta compartilhada.

## Login com Google

1. Abra `/login` ou `/cadastro`.
2. Clique no botao do Google.
3. Conclua o consentimento com uma conta nao institucional.
4. Aguarde o retorno para a aplicacao.

**Resultado esperado:** login aprovado, redirecionamento para `/home` e sessao reconhecida.
Contas institucionais podem ser recusadas pelo provedor.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [ ] 1280 px
- Evidencia/issue: nao executado nesta rodada; evitaria alterar a senha da conta compartilhada.

## Redefinir senha

1. Em `/login`, informe o e-mail da conta.
2. Clique em Esqueci minha senha.
3. Abra o e-mail recebido e use o link.
4. Informe uma nova senha em `/resetSenha` e confirme.
5. Faca login com a nova senha.

**Resultado esperado:** o pedido pede um e-mail valido, o link abre a tela de redefinicao,
a nova senha e salva e o login antigo deixa de funcionar.

**Status:**

- [x] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: post criado com sucesso em 1280 px e o campo foi limpo. Validado visualmente em 320 px sem overflow. Post removido apos a rodada.

## Criar post sem imagem

1. Entre em `/home`.
2. Digite um texto valido na caixa de novo post.
3. Clique em postar sem selecionar arquivo.

**Resultado esperado:** post aparece no inicio da lista com texto, autor e foto; campos sao
limpos apos o envio; no celular o textarea nao corta o texto nem transborda.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: upload concluido, imagem exibida no feed e texto limpo. Post removido apos a rodada.

## Criar post com imagem

1. Em `/home`, digite o texto.
2. Selecione uma imagem PNG/JPEG.
3. Clique em postar.

**Resultado esperado:** upload concluido e post exibido com imagem redimensionada sem sobrepor
o layout. Abrir o post detalhado mostra a imagem inteira em proporcao correta.

**Status:**

- [x] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: contador passou de 0 para 1 no post detalhado. A reversao nao foi executada nesta rodada.

## Curtir

1. Abra um post no feed ou no detalhamento.
2. Clique no icone de curtida.
3. Atualize a pagina e clique novamente para retirar.

**Resultado esperado:** contador muda imediatamente, icone fica vermelho ao curtir e volta ao
estado neutro ao retirar; estado persiste apos recarregar.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: motivo vazio exibiu "digite o motivo!"; motivo preenchido exibiu "obrigado por sua contribuição!".

## Denunciar

1. Clique no icone de bandeira de um post.
2. Tente enviar sem motivo.
3. Digite o motivo e envie.

**Resultado esperado:** motivo vazio e bloqueado; envio valido confirma a denuncia e oculta/bloqueia
o post no navegador atual conforme a implementacao. Modal abre, rola corretamente e fecha.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: resposta vazia nao foi testada; resposta valida apareceu na lista e identificou o autor.

## Responder

1. Abra um post em `/feed/:id`.
2. Tente enviar uma resposta vazia.
3. Digite uma resposta valida e clique em Responder.

**Resultado esperado:** resposta vazia e rejeitada; resposta valida aparece na lista sem recarregar
a pagina, identifica o autor e limpa o campo.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: nome alterado para "davysonzzs QA" e restaurado para "davysonzzs". Serie/foto/Sobre mim nao foram alterados.

## Editar perfil

1. Clique no avatar da navbar e abra seu perfil.
2. Clique em Editar.
3. Mude nome, serie, texto Sobre mim e opcionalmente a foto.
4. Clique em Alterar.

**Resultado esperado:** dados e foto sao salvos, o perfil atualizado aparece em `/home/seuUser`
e o texto respeita o limite de 300 caracteres.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: Cancelar preservou o post no estado de confirmacao. Confirmacao removeu os dois posts de teste e a atividade ficou em zero.

## Excluir post

1. Abra `/home/seuUser`.
2. Encontre um post proprio.
3. Clique em Excluir e depois em Cancelar em uma tentativa.
4. Repita e confirme Excluir.

**Resultado esperado:** Cancelar preserva o post. Confirmar exclui o post com sucesso e remove
da atividade sem apagar post de outro usuario.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: `/perfil/a9f3a861-c725-4797-b7c2-f3322440ae74` mostrou usuario, atividades e posts sem botoes de editar/excluir.

## Ver perfil de outro usuario

1. Abra um post proprio ou de terceiro.
2. Clique no nome ou avatar do autor.

**Resultado esperado:** navega para `/perfil/:id`, mostra nome, foto, serie, Sobre mim e atividade
do usuario sem permitir edicao ou exclusao de posts alheios. Ao clicar no proprio id, redireciona
para `/home/seuUser`. Perfil inexistente exibe estado nao encontrado.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [x] 1280 px
- Evidencia/issue: formulario carregou sem overflow em 1280 px; titulo e descricao vazios nao foram testados; envio valido com 5 estrelas exibiu alerta de sucesso e limpou os campos.

## Noticias

1. Em largura maior que 1024 px, confira a coluna de noticias na Home.
2. A 1024 px e abaixo, confirme que a coluna some da Home.
3. Em 320 px e 768 px, abra o link Noticias da navbar.

**Resultado esperado:** acima de 1024 px, noticias aparecem na coluna da Home. Em 1024 px e
abaixo, a coluna nao aparece e `/noticias` exibe a mesma lista responsiva pela navbar.
Lista vazia mostra o estado "sem noticias por hoje!".

**Status:**

- [x] 320 px
- [x] 768 px
- [x] 1280 px
- [x] 1024 px exato
- Evidencia/issue: em 320 px e 768 px a coluna sumiu e o link Noticias apareceu; em 1024 px a coluna sumiu; em 1280 px a coluna reapareceu. `/noticias` em 320 px mostrou "sem noticas por hoje!".

## Feedback

1. Abra `/feedback` pela navbar.
2. Tente enviar sem titulo e descricao.
3. Preencha titulo e descricao, escolha uma avaliacao em estrelas e envie.

**Resultado esperado:** campos vazios sao bloqueados ou exigidos; envio valido confirma sucesso
e limpa o formulario. Avaliacao selecionada fica refletida no envio.

**Status:**

- [ ] 320 px
- [ ] 768 px
- [ ] 1280 px
- Evidencia/issue:

## Resumo da rodada

### Verificacao obrigatoria no PR

- [ ] O workflow `CI` concluiu com sucesso: `npm ci`, `npm run lint` e `npm run build`.
- [ ] A protecao da branch `main` exige o check `npm-ci-lint-build` antes do merge.

### Evidencia automatizada confirmada

- `npm ci` restaurou as dependencias sem falha.
- `npm run build` concluiu com sucesso.
- `/login` foi carregada em 320 px, sem overflow horizontal detectado.
- `/cadastro` foi carregada em 1280 px, sem overflow horizontal detectado.
- `/cadastro` em 1280 px mostrou o botao Cadastrar desabilitado ate marcar os termos.
- `/termos` foi carregada e exibiu o conteudo completo.
- A producao respondeu em `https://drmconnect.vercel.app`.
- A conta compartilhada executou posts, curtida, resposta, denuncia, perfil, exclusao e feedback.
- 320 px, 768 px, 1024 px e 1280 px foram medidos em interface autenticada.

