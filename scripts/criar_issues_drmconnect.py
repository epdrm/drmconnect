#!/usr/bin/env python3
"""
Cria as labels e as issues do projeto epdrm/drmconnect usando a CLI do GitHub (gh).

Uso:
    gh auth login                      # uma vez, com a sua conta (precisa de acesso de escrita)
    python3 criar_issues_drmconnect.py            # SIMULAÇÃO: só mostra o que seria criado
    python3 criar_issues_drmconnect.py --run      # cria de verdade

Opções:
    --repo dono/repo    repositório de destino (padrão: epdrm/drmconnect)
    --delay N           segundos entre issues (padrão: 2, evita limite de requisições)
    --only-labels       só cria as labels
    --only-issues       só cria as issues

Pode rodar de novo sem medo: issues com o mesmo título e labels já existentes são puladas.
"""
import argparse
import json
import subprocess
import sys
import time

LABELS = {
    # nome: (cor, descrição)
    "frontend": ("1d76db", "Interface, React and pages"),
    "backend": ("5319e7", "Database, Supabase and server logic"),
    "security": ("b60205", "Keys, access policies and data protection"),
    "testing": ("fbca04", "Test plans and automated tests"),
    "analysis": ("0e8a16", "Requirements, users and process analysis"),
    "market": ("c2e0c6", "Market and competitor research"),
    "marketing": ("f9d0c4", "Promotion, messaging and outreach"),
    "media": ("d876e3", "Video, photos and social media content"),
    "content": ("0e8a16", "Site texts, descriptions and information"),
    "feature": ("1d76db", "Site behavior and JavaScript functionality"),
    "design": ("d876e3", "Visuals, colors, fonts and brand identity"),
    "accessibility": ("5319e7", "Keyboard navigation, screen readers and contrast"),
    "performance": ("e99695", "Loading speed and file size"),
    "responsiveness": ("bfdadc", "Behavior on small screens"),
    "SEO": ("f9d0c4", "Search visibility and link preview"),
    "organization": ("006b75", "Team workflow and repository setup"),
    "high priority": ("b60205", "Do this first"),
    # padrão do GitHub (só garante que existem)
    "bug": ("d73a4a", "Something isn't working"),
    "documentation": ("0075ca", "Improvements or additions to documentation"),
    "enhancement": ("a2eeef", "New feature or request"),
    "good first issue": ("7057ff", "Good for newcomers"),
}

ISSUES = []


def add(title, labels, body):
    ISSUES.append({"title": title, "labels": labels.split(","), "body": body.strip()})


# ---------------------------------------------------------------- Geral e organização
add("Preencher descrição, site e tópicos do repositório", "organization,good first issue", """
A página do repositório mostra "No description, website, or topics provided".

Pronto quando:
- [ ] Descrição curta do projeto preenchida
- [ ] Link do site publicado no campo Website
- [ ] Tópicos adicionados (ex.: react, vite, supabase, education)
""")

add("Escrever o README do projeto", "documentation,high priority", """
O README tem apenas o título `drmconnect`. Quem chega no repositório não sabe o que é o DRM Connect.

Pronto quando:
- [ ] O que é o projeto e qual problema resolve
- [ ] Tecnologias usadas
- [ ] Link do site publicado
- [ ] Como rodar localmente (ver issue de instalação)
- [ ] Lista dos setores e da equipe
- [ ] Capturas de tela
""")

add("Renomear o pacote \"problemas\" no package.json", "organization,good first issue", """
O `package.json` usa `"name": "problemas"` e `"version": "0.0.0"`, nome que não condiz com o projeto.

Pronto quando:
- [ ] Nome do pacote igual ao do projeto
- [ ] Versão inicial definida
- [ ] Conferido que build e deploy continuam funcionando
""")

add("Escrever o CONTRIBUTING.md com o fluxo por setor", "documentation,organization,high priority", """
O repositório só permite PR de colaboradores. Definir como cada setor contribui: quem recebe acesso, nomes de branch, padrão de commit, quem revisa e o que fazer em caso de conflito.

Pronto quando:
- [ ] Regras combinadas com todos os setores
- [ ] `CONTRIBUTING.md` na raiz e linkado no README
- [ ] Definido como setores sem código (design, marketing, mídia) enviam material
""")

add("Criar modelos de issue e de Pull Request", "organization", """
Criar templates em `.github/` para bug, melhoria, tarefa de setor e Pull Request, com checklist do que revisar.

Pronto quando:
- [ ] Templates criados
- [ ] Testados abrindo uma issue de exemplo
""")

add("Padronizar as labels e organizar o quadro por setor", "organization", """
Criar labels fixas por setor, tipo e prioridade, e montar o quadro (Projects) com as colunas Backlog, Em andamento, Em revisão e Concluído.

Pronto quando:
- [ ] Labels criadas com descrição e cor
- [ ] Quadro criado e issues adicionadas
- [ ] Regras documentadas no `CONTRIBUTING.md`
""")

add("Proteger a branch main", "organization", """
Configurar regras para a `main`: PR obrigatório, ao menos uma aprovação e lint passando antes do merge.

Pronto quando:
- [ ] Regra criada em Settings → Branches
- [ ] Testada com um PR de exemplo
""")

add("Definir a licença do projeto", "documentation,good first issue", """
O repositório não tem LICENSE. Combinar com a turma e a escola qual licença usar (ou deixar explícito que é projeto escolar sem licença aberta).

Pronto quando:
- [ ] Decisão registrada
- [ ] Arquivo `LICENSE` adicionado e citado no README
""")

# ---------------------------------------------------------------- Bugs e segurança no frontend
add("Esconder a senha digitada no cadastro e na redefinição", "bug,security,high priority,good first issue", """
A senha aparece em texto puro: `Cadastro.jsx:61` e `ResetSenha.jsx:28` usam `type="text"`. O campo de e-mail do cadastro também usa `type="text"`.

Pronto quando:
- [ ] Campos de senha com `type="password"`
- [ ] Campos de e-mail com `type="email"`
""")

add("Corrigir `toast` não definido no login e no cadastro", "bug,frontend", """
`Login.jsx:39` e `Cadastro.jsx:48` chamam `toast.error(...)` sem importar nada. Se o login pelo Google falhar, ocorre um ReferenceError e o usuário não vê mensagem. Em `Cadastro.jsx:77` a função é chamada com o argumento "google", que ela ignora.

Pronto quando:
- [ ] Erro do Google mostra mensagem ao usuário
- [ ] Argumento sobrando removido
""")

add("Remover endereços fixos do site e do Supabase", "bug,frontend", """
- `Login.jsx:49`: o link de redefinição de senha aponta para `https://drmconnect.vercel.app/resetSenha`. Em ambiente local ou de preview, o e-mail leva para produção.
- `Cadastro.jsx:66`: link dos Termos com URL completa.
- `Cadastro.jsx:24`: avatar padrão com URL completa do Storage.

Pronto quando:
- [ ] Redirecionamento usa `window.location.origin`
- [ ] Termos abre com `<Link to="/termos">`
- [ ] URL do avatar padrão em uma constante ou variável de ambiente
""")

add("Corrigir as imagens de mockup da página inicial", "bug,frontend,good first issue", """
`styles/mockup.css` (linhas 10, 23 e 36) referencia `mockup-*.png`, mas os arquivos são `.webp`. O build avisa "didn't resolve at build time", e em produção essas imagens podem dar 404.

Pronto quando:
- [ ] Caminhos apontando para os `.webp`
- [ ] Mockups aparecendo na página inicial em produção
""")

add("Corrigir pseudo-elemento inválido `::bottom`", "bug,frontend,good first issue", """
`styles/secoes.css:394-396` usa `::bottom`, que não existe. O build emite 3 avisos. Provavelmente a intenção era `::after`.

Pronto quando:
- [ ] Seletor corrigido e visual das seções conferido
- [ ] Build sem avisos de CSS
""")

add("Mostrar data e hora no formato e fuso do Brasil", "bug,frontend", """
`PerguntaDetalhada/index.jsx:8-9` e `layout/Noticias/index.jsx:32` cortam o texto do timestamp (`slice(0,10)` e `slice(11,16)`). Resultado: data no formato `2026-11-11`, hora em UTC (3h a mais que Brasília) e "as" sem acento. As respostas não mostram data.

Pronto quando:
- [ ] Datas formatadas com `toLocaleString("pt-BR")`
- [ ] "às" com acento
- [ ] Respostas com data
- [ ] `useState(create)` desnecessário removido
""")

add("Tratar carregamento, erro e post inexistente em `PerguntaClicada`", "bug,frontend", """
- `carregando` começa em `false`, então a tela pisca vazia.
- Em erro, a função faz `return` sem chamar `setCarregando(false)`: fica "Carregando..." para sempre.
- `/feed/<id inexistente>` só gera `console.error`.
- As respostas são buscadas sem `.order()`, então a ordem não é garantida.

Pronto quando:
- [ ] Estado inicial "carregando"
- [ ] Mensagem de erro e de "post não encontrado" com link para o início
- [ ] Respostas ordenadas por data
""")

add("Evitar post duplicado e avisar quando o upload da imagem falha", "bug,frontend", """
Em `Home.jsx` (`criarPost`):
- O botão "postar" não tem estado de envio, então clique duplo cria dois posts.
- Se `envImagensStorage` falha, ela devolve `null` e o post é criado sem imagem, sem avisar.

Pronto quando:
- [ ] Botão desabilitado durante o envio
- [ ] Falha no upload interrompe o post e mostra mensagem
""")

add("Validar as imagens enviadas (tipo, tamanho e nome)", "security,frontend", """
`services/uploadImages.js` e a edição de perfil (`PaginaDeUsuario.jsx:112`) só dependem do `accept` do input. Não há limite de tamanho, e o nome do arquivo (`${Date.now()}-${arquivo.name}`) não trata espaços nem acentos.

Pronto quando:
- [ ] Tipo e tamanho máximo checados antes do envio, com mensagem clara
- [ ] Nome do arquivo sanitizado
- [ ] Mesma regra no post e no perfil
""")

# ---------------------------------------------------------------- Qualidade do código
add("Corrigir variáveis e imports não usados (lint)", "frontend,good first issue", """
`npm run lint` aponta, entre outros:
- `Home.jsx`: `use`, `Sidebar`, `scrollBody`/`setScrollBody`, `irPara`, `desFazerLogin`, `res`, `error`
- `PaginaDeUsuario.jsx`: `replace`, `res`
- `RespostasPergunta/index.jsx`: `Heart`
- `PerguntaClicada.jsx`: `error`
- `uploadImages.js`: `data`

Pronto quando:
- [ ] Todos os erros `no-unused-vars` resolvidos
""")

add("Corrigir lint de `setState` dentro de `useEffect` e de dependências", "frontend,enhancement", """
Erros da regra `react-hooks/set-state-in-effect`: `Home.jsx:174`, `layout/Noticias/index.jsx:22` e `PerguntaClicada.jsx:78`. Avisos de dependência: `PaginaDeUsuario.jsx:101` e `PerguntaClicada.jsx:79`.

Pronto quando:
- [ ] `npm run lint` sem erros
- [ ] Padrão de busca de dados em efeito combinado com a turma
""")

add("Remover código sem uso e a dependência `react-icons`", "frontend,organization", """
- `layout/Sidebar`: importada em `Home.jsx` e nunca renderizada. O botão "Ajuda DRM" aponta para `/perguntas`, que não existe.
- `RespostasPergunta/elements/EnviarResposta.jsx`: grava na tabela antiga `respostas`, não em `post_respostas`.
- `RespostasPergunta/elements/RespostasVisor.jsx`: sem uso.
- `components/InicialCard`: sem uso.
- `react-icons`: está no `package.json`, mas nenhum arquivo importa.

Pronto quando:
- [ ] Decisão da turma: remover ou integrar cada item
- [ ] `react-icons` removido
- [ ] Build e navegação conferidos
""")

add("Usar `key` estável nas listas", "bug,frontend,good first issue", """
- `Home.jsx:216`: `key={index}` nos posts (o `Link` interno tem `key={item.id}`).
- `layout/Noticias/index.jsx:29`: item sem `key` e com `id={index}`.
- `RespostasVisor.jsx`: sem `key`.

Pronto quando:
- [ ] Todas as listas com `key={item.id}`
""")

add("Extrair o modal de denúncia, que está duplicado", "frontend,enhancement", """
`Home.jsx` e `PerguntaClicada.jsx` repetem os estados, a função `report()`, o bloqueio de scroll e o HTML do modal. Também:
- `report()` usa `user.id` sem checar se `user` existe
- depois de denunciar, a página faz `window.location.reload()`

Pronto quando:
- [ ] Componente `ModalDenuncia` e hook de bloqueio de scroll
- [ ] Post denunciado some da lista sem recarregar a página
""")

add("Criar um contexto de autenticação", "frontend,enhancement", """
`App.jsx` já guarda o usuário, mas `Navbar`, `Home` (via `buscarImagem`), `RespostasPergunta`, `criarPost` e `report` chamam `supabase.auth.getUser()` de novo. `Home` busca o avatar a cada página carregada.

Pronto quando:
- [ ] `AuthContext` e hook `useAuth()` com usuário e avatar
- [ ] Chamadas repetidas a `getUser()` removidas
""")

add("Padronizar nomes e documentar a estrutura de `src/`", "frontend,documentation,organization", """
Estrutura atual: `pages`, `components`, `layout`, `ui`, `services`, `styles`, `supabase`, `assets`. Inconsistências:
- `sercheAvatar.js` (nome com erro de digitação)
- `PrivateRouter.jsx` exporta `PrivateRoute`
- pasta `hooks` dentro de `components`
- `FeedBack.jsx` vs "Feedback"
- CSS em `src/styles` e também ao lado de cada componente
- nomes de CSS misturados (`feedBackCSS.css`, `Login.css`, `home.css`)

Pronto quando:
- [ ] Convenção de nomes e de lugar do CSS combinada
- [ ] Arquivos renomeados
- [ ] Estrutura documentada em `docs/` ou no README
""")

# ---------------------------------------------------------------- Experiência do usuário
add("Trocar os 33 `alert()` por mensagens na interface", "frontend,enhancement", """
O projeto tem 33 chamadas a `alert()`, entre elas "login feito!" e "olha o console" (`Home.jsx:63`, mensagem de desenvolvedor para o usuário). `services/sercheAvatar.js` também chama `alert`, e um serviço não deveria interagir com a tela.

Pronto quando:
- [ ] Componente de aviso (toast ou faixa de mensagem) criado
- [ ] Todos os `alert()` trocados
- [ ] Mensagens revisadas com o setor de documentação
""")

add("Validar os formulários de login e cadastro e usar `<form>`", "frontend,enhancement", """
- Login e cadastro não usam `<form>`: Enter não envia e o autopreenchimento do navegador atrapalha.
- Cadastro não valida nome vazio, e-mail inválido nem tamanho mínimo de senha, e não diferencia "e-mail já cadastrado".
- O checkbox dos Termos não tem `htmlFor`.
- A regra "não é possível entrar pelo Google com e-mail institucional" existe só como texto.

Pronto quando:
- [ ] Formulários com `<form>`, `autoComplete` e `onSubmit`
- [ ] Mensagens de erro específicas por campo
- [ ] Regra do e-mail institucional documentada e, se possível, validada
""")

add("Melhorar a página de redefinição de senha", "frontend,design", """
`ResetSenha.jsx` não tem estilo, não pede confirmação da senha e não verifica se existe uma sessão de recuperação (acessar `/resetSenha` direto só falha no `updateUser`).

Pronto quando:
- [ ] Layout igual ao do login
- [ ] Campo de confirmação de senha
- [ ] Mensagem clara quando o link for inválido ou expirado
""")

add("Criar página 404", "frontend,feature", """
O `App.jsx` não tem rota `*`, e com o rewrite do `vercel.json` qualquer endereço inválido mostra tela em branco. Também há rotas com nomes parecidos (`/home/seuUser` e `/perfil/:id`).

Pronto quando:
- [ ] Página 404 com link para o início
- [ ] Lista de rotas documentada
""")

add("Trocar os avatares de placeholder externo por imagem local", "frontend,bug,good first issue", """
`Home.jsx:179` usa `https://placeholder.com`, que não é uma imagem. `RespostasPergunta/index.jsx:100` usa `via.placeholder.com`, serviço de terceiros. `PerguntaDetalhada` passa `src={undefined}` quando não há avatar.

Pronto quando:
- [ ] Avatar padrão local (ou letra inicial, como no perfil)
- [ ] Mesmo padrão em todas as telas
""")

add("Revisar ortografia e padronizar textos da interface", "content,frontend,good first issue", """
Encontrados: "Patriocinadores" (Footer), "Descreva sua Denuncia", "mudaça n funcionou", "sem noticas por hoje!", "Nome de Usuario", "Mesquita.Tire" (sem espaço, `Inicial.jsx:69`), "FeedBack" vs "Feedback", "DRMConnect" vs "DRM Connect".

Pronto quando:
- [ ] Textos corrigidos
- [ ] Nome do projeto padronizado (com ou sem espaço)
""")

add("Substituir `<marquee>` da página inicial", "frontend,accessibility", """
`Inicial.jsx:80-106` usa `<marquee>`, elemento obsoleto do HTML.

Pronto quando:
- [ ] Faixas animadas com CSS
- [ ] Animação desligada com `prefers-reduced-motion`
""")

# ---------------------------------------------------------------- Acessibilidade
add("Adicionar `alt` nas imagens que não têm", "accessibility,good first issue", """
Sem `alt`: `Home.jsx:203` (avatar do formulário), `PostComunidade/index.jsx:22,26` (avatar e imagem do post), `RespostasVisor.jsx:9`.

Pronto quando:
- [ ] Avatares com o nome do usuário
- [ ] Imagens de post com texto descritivo
""")

add("Trocar elementos clicáveis que não são botões ou links", "accessibility,frontend", """
Avatar e nome do autor são `<span>` e `<img>` com `onClick` em `PostComunidade`, `PerguntaDetalhada` e `RespostasPergunta`. No `Footer`, "Termos de Uso" é `<a>` sem `href`. Esses itens não recebem foco nem funcionam com Enter.

Pronto quando:
- [ ] Usar `<Link>` ou `<button>`
- [ ] Foco visível em todos
""")

add("Dar nome acessível aos botões só de ícone e às opções do feedback", "accessibility,frontend", """
- Curtir e denunciar (`AcoesPost`) e o botão de voltar do modal só têm ícone.
- Em `Estrelas.jsx`, os emojis de avaliação são `input` com `label` só de ícone, sem texto.

Pronto quando:
- [ ] `aria-label` nos botões
- [ ] Legenda de cada nota ("Muito ruim" a "Ótimo")
- [ ] Teste com navegação só por teclado
""")

add("Tornar os modais acessíveis", "accessibility,frontend", """
Os modais de denúncia e de edição de perfil não têm `role="dialog"`, não prendem o foco, não fecham com ESC nem com clique fora.

Pronto quando:
- [ ] `role="dialog"` e `aria-modal`
- [ ] Foco preso dentro e devolvido ao fechar
- [ ] ESC e clique fora fecham
""")

# ---------------------------------------------------------------- Desempenho e SEO
add("Comprimir as imagens pesadas e dividir o bundle", "performance,frontend", """
`logoEP.png` tem 1,4 MB, `iconeBackground.png` 1,27 MB e `Instagram_logo.png` 282 KB. O JS gerado tem 500 kB (143 kB com gzip) e o build avisa. Tudo carrega junto, inclusive a página inicial e os Termos.

Pronto quando:
- [ ] Imagens convertidas para WebP e redimensionadas
- [ ] Rotas com `React.lazy`
- [ ] Lighthouse mobile registrado antes e depois
""")

add("Corrigir o carregamento das fontes", "performance,frontend,good first issue", """
`index.css` tem dois `@import` do Google Fonts repetidos. O primeiro tem URL malformada (`1,1001,200`) e há famílias possivelmente sem uso (Playfair, Ubuntu).

Pronto quando:
- [ ] Só as fontes usadas, carregadas por `<link>` com `preconnect`
""")

add("Revisar `index.html`", "SEO,frontend,good first issue", """
- Favicon declarado como `image/svg+xml`, mas o arquivo é `.ico`
- `lang="pt-br"` (o correto é `pt-BR`)
- Sem `meta description` nem tags Open Graph
- Comentário `<!-- <h1>em manutenção</h1> -->` esquecido

Pronto quando:
- [ ] Todos os itens corrigidos
- [ ] Prévia do link testada no WhatsApp
""")

# ---------------------------------------------------------------- Rodapé e conteúdo
add("Criar as páginas \"Política de Privacidade\" e \"Fale Conosco\"", "documentation,content", """
`Footer/index.jsx:23` e `:25` apontam para `href="#"`. A plataforma é usada por alunos do ensino médio técnico, então vale alinhar o texto da política com a coordenação da escola.

Pronto quando:
- [ ] Texto da política aprovado pela escola
- [ ] Canal de contato definido
- [ ] Páginas criadas e links do rodapé atualizados
""")

add("Adicionar `rel=\"noopener noreferrer\"` aos links externos", "security,frontend,good first issue", """
Links com `target="_blank"` sem `rel`: `Footer/index.jsx` (4) e `Cadastro.jsx:66`.

Pronto quando:
- [ ] `rel="noopener noreferrer"` em todos
""")

add("Confirmar as contas oficiais nas redes sociais", "marketing", """
O rodapé aponta para `@2anodesenv.sistemas` (Instagram) e `@segundo.ds2025` (TikTok). Os nomes sugerem a turma do 2º ano. Confirmar se são as contas oficiais do DRM Connect.

Pronto quando:
- [ ] Contas confirmadas ou links atualizados
""")

add("Definir se o produto é \"comunidade\" ou \"perguntas e respostas\"", "analysis,high priority", """
A página inicial promete perguntas e respostas ("Tire dúvidas sobre as disciplinas…") e os mockups mostram pergunta e resposta, mas o app é um feed de posts ("Comunidade"). O botão "Ajuda DRM" (`/perguntas`) não existe, os componentes se chamam `PerguntaDetalhada` e `PerguntaClicada`, e a coluna `titulo` é lida mas nunca preenchida.

Pronto quando:
- [ ] Decisão registrada
- [ ] Texto da página inicial e mockups ajustados
- [ ] Backlog do que falta para cumprir a promessa
""")

# ---------------------------------------------------------------- Backend (Supabase)
add("Documentar tabelas, funções e buckets", "backend,documentation", """
O código usa as tabelas `posts`, `post_respostas`, `profiles`, `reports`, `feedbacks`, `news`, a função `gerenciar_curtida` e os buckets `imagens-posts` e `perfilFotoDefault`. A tabela `respostas` só aparece no componente sem uso. Nomes de colunas variam (`create_at` em posts e `created_at` em news; `user` e `user_responde`).

Pronto quando:
- [ ] Diagrama e descrição de cada tabela, coluna, função e bucket
- [ ] Inconsistências de nome listadas para decidir se padroniza
""")

add("Confirmar a sincronização entre `profiles` e `user_metadata`", "backend,bug", """
O próprio perfil lê nome, avatar, série e "sobre mim" de `user_metadata`; o perfil dos outros lê a tabela `profiles`. `editar()` só atualiza `user_metadata`. Se não houver trigger sincronizando, os outros veem dados antigos.

Pronto quando:
- [ ] Mecanismo de sincronização confirmado (ou criado)
- [ ] Teste: editar perfil e abrir `/perfil/:id` em outra conta
""")

add("Parar de copiar nome e avatar para posts e respostas", "backend,enhancement", """
Nome e foto são gravados em `posts` (`user`, `avatar`) e `post_respostas` (`user_responde`, `user_avatar`) na hora do post. Quem muda o perfil continua aparecendo com nome e foto antigos nos posts antigos.

Pronto quando:
- [ ] Posts e respostas buscam nome e avatar de `profiles` (join) ou os dados são atualizados junto
- [ ] Colunas redundantes removidas, se for o caso
""")

add("Revisar as políticas de acesso (RLS) tabela por tabela", "backend,security,high priority", """
O frontend confia nas políticas do banco (ex.: `excluirPost` conta com RLS para impedir apagar post alheio). Verificar:
- `posts` e `post_respostas`: insert só com `id_user = auth.uid()`, delete só do dono
- `reports`: insert com `id_user = auth.uid()`, leitura só para moderação
- `feedbacks`: o envio não grava `id_user`; decidir se é anônimo e como evitar spam
- `news`: só leitura para usuários, escrita só admin
- `profiles`: quem pode ler e atualizar o quê

Pronto quando:
- [ ] RLS ativo em todas as tabelas
- [ ] Política de cada tabela documentada
- [ ] Teste com usuário dono, outro usuário e sem login
""")

add("Impedir curtida repetida", "backend,bug", """
`AcoesPost` chama `gerenciar_curtida(operacao, p_id)` sem usuário, e o estado "curtido" fica só no `localStorage`. Limpar o navegador ou trocar de dispositivo permite curtir de novo, e o botão aparece como não curtido.

Pronto quando:
- [ ] Tabela de curtidas com par único (usuário, post)
- [ ] Função usando `auth.uid()` e sem permitir contagem negativa
- [ ] Frontend lendo o estado do banco, não do `localStorage`
""")

add("Definir o fluxo de moderação das denúncias", "backend,analysis", """
As denúncias vão para `reports`, mas não há tela nem regra. O post só some para quem denunciou (`localStorage` `block_<id>`); para os outros usuários continua visível.

Pronto quando:
- [ ] Regra definida (quem revisa, prazo, quando ocultar)
- [ ] Forma de consultar as denúncias (painel ou consulta no Supabase)
- [ ] Ocultação feita no banco, não só no navegador
""")

add("Apagar a imagem do Storage ao excluir post e proteger os buckets", "backend,security", """
`excluirPost` (`PaginaDeUsuario.jsx`) remove só a linha do banco; o arquivo continua em `imagens-posts`. Os buckets são públicos e não sabemos quais políticas de upload existem.

Pronto quando:
- [ ] Imagem removida junto com o post
- [ ] Políticas de upload: só logado, só pasta do próprio usuário, tipos e tamanho limitados
- [ ] Avatar padrão separado dos avatares enviados pelos usuários
""")

add("Criar índices e paginar respostas e notícias", "backend,performance", """
Os posts já são paginados de 10 em 10, mas respostas e notícias são carregadas sem limite.

Pronto quando:
- [ ] Índices em `posts(create_at)`, `posts(id_user)` e `post_respostas(id_post)`
- [ ] Paginação ou limite em respostas e notícias
""")

add("Limitar tamanho e frequência de envio no banco", "backend,security", """
O limite de 200 caracteres do post existe só no front-end; respostas e feedbacks não têm limite. Qualquer um pode contornar o formulário.

Pronto quando:
- [ ] Restrições de tamanho no banco (posts, respostas, feedbacks, denúncias, "sobre mim")
- [ ] Limite de envios por usuário em um intervalo
""")

add("Criar um ambiente de desenvolvimento separado", "backend,organization", """
O código aponta para um único projeto Supabase (a URL aparece no avatar padrão), que parece ser o de produção. Testes e seeds de dados fictícios podem afetar usuários reais.

Pronto quando:
- [ ] Projeto Supabase de desenvolvimento
- [ ] Scripts SQL de criação e dados de exemplo versionados
- [ ] Passo a passo para recriar o ambiente
""")

add("Criar `.env.example` e documentar as variáveis e o deploy", "backend,documentation,security,high priority", """
`supabase/supabase.js` lê `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` sem checar. Se faltar uma, o app quebra com tela em branco. O `.gitignore` cobre `.env`, mas o histórico não foi conferido.

Pronto quando:
- [ ] `.env.example` com os nomes, sem valores
- [ ] Aviso claro quando falta variável
- [ ] URLs de redirecionamento do Supabase Auth e variáveis do Vercel documentadas
- [ ] Histórico do Git buscado por chaves; chaves trocadas se aparecer alguma
- [ ] Confirmado que só a chave pública (anon) vai para o front-end
""")

# ---------------------------------------------------------------- Testes e CI
add("Rodar lint e build automaticamente em cada Pull Request", "testing,organization", """
O repositório não tem workflow. Criar um GitHub Actions que rode `npm ci`, `npm run lint` e `npm run build` em todo PR, e exigir que passe antes do merge (junto com a issue de proteger a `main`). Depende das issues de lint, para o lint passar.

Pronto quando:
- [ ] Workflow em `.github/workflows/`
- [ ] Verificação obrigatória no PR
""")

add("Criar o plano de testes manuais", "testing,documentation", """
Checklist em `docs/` com passos e resultado esperado de: cadastro, login (e-mail e Google), redefinir senha, criar post com e sem imagem, curtir, denunciar, responder, editar perfil, excluir post, ver perfil de outro usuário, notícias e feedback. Testar em 320px, 768px e acima de 1024px (a coluna de notícias some em 1024px).

Pronto quando:
- [ ] Checklist publicado
- [ ] Executado uma vez, com bugs abertos como issues
""")

# ---------------------------------------------------------------- Análise e mercado
add("Documentar o problema que o projeto resolve", "analysis,documentation,high priority", """
Descrever com clareza qual problema o DRM Connect resolve, para quem e por que isso importa. Esse texto alimenta o README, o marketing e a apresentação.

Pronto quando:
- [ ] Problema, público e objetivo escritos em uma página
- [ ] Aprovado por todos os setores
""")

add("Levantar requisitos funcionais e não funcionais", "analysis", """
Listar o que o sistema deve fazer e as restrições (desempenho, segurança, acessibilidade, dispositivos).

Pronto quando:
- [ ] Lista de requisitos numerada
- [ ] Cada requisito ligado a uma tela ou funcionalidade
""")

add("Definir personas e jornadas de uso", "analysis,design", """
Criar 2 ou 3 perfis de usuário e mapear o caminho de cada um no sistema.

Pronto quando:
- [ ] Personas descritas
- [ ] Jornada de cada persona desenhada
""")

add("Fazer a análise de mercado e de soluções semelhantes", "market,analysis", """
Pesquisar soluções parecidas, comparar funcionalidades, pontos fortes e fracos e apontar o que o DRM Connect faz de diferente.

Pronto quando:
- [ ] Pelo menos 3 soluções analisadas
- [ ] Tabela comparativa
- [ ] Conclusões compartilhadas com o frontend, o backend e o marketing
""")

add("Criar o backlog priorizado a partir dos requisitos", "analysis,organization", """
Transformar os requisitos em issues, com prioridade (alta, média, baixa) e setor responsável.

Pronto quando:
- [ ] Requisitos viraram issues
- [ ] Prioridade e setor definidos em cada uma
""")

# ---------------------------------------------------------------- Design
add("Definir a identidade visual (logo, cores e fontes)", "design", """
Escolher logo, paleta e tipografia do DRM Connect e entregar os arquivos para o frontend.

Pronto quando:
- [ ] Propostas apresentadas e uma escolhida pela turma
- [ ] Logo em PNG e SVG
- [ ] Paleta e fontes documentadas
""")

add("Criar protótipos das telas e linkar no repositório", "design,documentation", """
Desenhar wireframes e protótipos de todas as telas (Figma ou similar) e colocar o link no README.

Pronto quando:
- [ ] Todas as telas prototipadas
- [ ] Versão mobile e desktop
- [ ] Link no README e acesso liberado ao frontend
""")

add("Criar o guia de estilo e a biblioteca de componentes", "design,documentation", """
Padronizar botões, campos, cards, espaçamentos e estados (hover, foco, erro) para o frontend seguir.

Pronto quando:
- [ ] Componentes desenhados
- [ ] Guia publicado em `docs/`
""")

add("Revisar contraste e consistência visual", "design,accessibility", """
Conferir se as cores têm contraste suficiente (WCAG AA) e se o visual está igual em todas as telas.

Pronto quando:
- [ ] Pontos de baixo contraste listados e corrigidos
- [ ] Inconsistências entre telas ajustadas
""")

# ---------------------------------------------------------------- Documentação
add("Documentar como instalar e rodar o projeto", "documentation,good first issue", """
Escrever o passo a passo: requisito (Node), `npm install`, criar o `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, `npm run dev`, `npm run build` e `npm run preview`.

Pronto quando:
- [ ] Passo a passo no README
- [ ] Testado por alguém que não escreveu
""")

add("Escrever o manual do usuário", "documentation", """
Explicar, com capturas de tela, como usar cada funcionalidade do sistema, em linguagem simples.

Pronto quando:
- [ ] Uma seção por funcionalidade
- [ ] Revisado por alguém de fora da turma
""")

add("Documentar a arquitetura técnica", "documentation", """
Descrever como as partes se conectam (front-end React, Supabase, Vercel) com um diagrama e o fluxo dos dados.

Pronto quando:
- [ ] Diagrama de arquitetura
- [ ] Texto explicando cada parte
- [ ] Publicado em `docs/`
""")

# ---------------------------------------------------------------- Marketing
add("Definir nome, slogan e proposta de valor", "marketing,content", """
Escrever em uma frase o que o DRM Connect oferece, para quem e por que é diferente. Usar o resultado da análise de mercado.

Pronto quando:
- [ ] Slogan e proposta de valor aprovados pela turma
- [ ] Textos enviados ao frontend e ao README
""")

add("Criar o plano de divulgação", "marketing", """
Definir público, canais (redes sociais, mural da escola, grupos), mensagens e calendário de divulgação.

Pronto quando:
- [ ] Plano em documento
- [ ] Datas e responsáveis definidos
""")

add("Escrever o texto de apresentação (pitch)", "marketing,content", """
Criar uma versão curta (30 segundos) e uma longa (3 minutos) para apresentar o projeto à escola, à turma e a possíveis usuários.

Pronto quando:
- [ ] Duas versões escritas e ensaiadas
- [ ] Revisadas por alguém de outro setor
""")

add("Coletar feedback dos usuários", "marketing,analysis", """
Criar um formulário curto para quem testar o sistema, aplicar com um grupo e resumir os resultados para os outros setores.

Pronto quando:
- [ ] Formulário criado
- [ ] Pelo menos 10 respostas
- [ ] Resumo com melhorias sugeridas, enviado ao backlog
""")

# ---------------------------------------------------------------- Mídia
add("Montar o calendário de conteúdo para as redes", "media,marketing", """
Planejar as publicações do projeto (progresso, bastidores, novidades): formato, data e responsável.

Pronto quando:
- [ ] Calendário de pelo menos 4 semanas
- [ ] Pautas definidas
""")

add("Produzir o vídeo de demonstração", "media", """
Gravar um vídeo curto mostrando o sistema em uso, com roteiro aprovado pelo marketing.

Pronto quando:
- [ ] Roteiro aprovado
- [ ] Vídeo gravado, editado e com legenda
- [ ] Link adicionado ao README
""")

add("Produzir capturas de tela e banners", "media,design", """
Gerar imagens do sistema para README, apresentações e redes sociais, seguindo a identidade visual.

Pronto quando:
- [ ] Capturas das telas principais (desktop e mobile)
- [ ] Banner do README
- [ ] Arquivos organizados em pasta compartilhada
""")


# ================================================================ execução
def gh(args, check=True, capture=True):
    return subprocess.run(["gh", *args], check=check, capture_output=capture, text=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", default="epdrm/drmconnect")
    ap.add_argument("--run", action="store_true", help="cria de verdade (sem isso é só simulação)")
    ap.add_argument("--delay", type=float, default=2.0)
    ap.add_argument("--only-labels", action="store_true")
    ap.add_argument("--only-issues", action="store_true")
    a = ap.parse_args()

    used = {l for i in ISSUES for l in i["labels"]}
    missing = used - set(LABELS)
    if missing:
        sys.exit(f"Labels usadas nas issues e não definidas em LABELS: {sorted(missing)}")

    modo = "CRIANDO" if a.run else "SIMULAÇÃO (use --run para criar de verdade)"
    print(f"Repositório: {a.repo} | {len(LABELS)} labels | {len(ISSUES)} issues | {modo}\n")

    if a.run:
        try:
            gh(["auth", "status"])
        except (subprocess.CalledProcessError, FileNotFoundError):
            sys.exit("A CLI do GitHub (gh) não está instalada ou logada. Rode: gh auth login")

    if not a.only_issues:
        print("== Labels ==")
        for nome, (cor, desc) in LABELS.items():
            if a.run:
                r = gh(["label", "create", nome, "--repo", a.repo, "--color", cor,
                        "--description", desc, "--force"], check=False)
                print(("  ok   " if r.returncode == 0 else "  ERRO ") + nome + ("" if r.returncode == 0 else f" -> {r.stderr.strip()}"))
            else:
                print(f"  criaria/atualizaria label: {nome} (#{cor})")

    if not a.only_labels:
        print("\n== Issues ==")
        existentes = set()
        if a.run:
            r = gh(["issue", "list", "--repo", a.repo, "--state", "all", "--limit", "1000",
                    "--json", "title"])
            existentes = {i["title"] for i in json.loads(r.stdout)}
        criadas = puladas = erros = 0
        for n, i in enumerate(ISSUES, 1):
            if i["title"] in existentes:
                print(f"  [{n:02d}] pulada (já existe): {i['title']}")
                puladas += 1
                continue
            if not a.run:
                print(f"  [{n:02d}] {i['title']}  [{', '.join(i['labels'])}]")
                continue
            cmd = ["issue", "create", "--repo", a.repo, "--title", i["title"], "--body", i["body"]]
            for l in i["labels"]:
                cmd += ["--label", l]
            r = gh(cmd, check=False)
            if r.returncode == 0:
                print(f"  [{n:02d}] criada: {r.stdout.strip()}")
                criadas += 1
            else:
                print(f"  [{n:02d}] ERRO em '{i['title']}': {r.stderr.strip()}")
                erros += 1
            time.sleep(a.delay)
        if a.run:
            print(f"\nResumo: {criadas} criadas, {puladas} puladas, {erros} com erro.")
        else:
            print(f"\nSimulação: {len(ISSUES)} issues seriam processadas.")


if __name__ == "__main__":
    main()
