# FocoVest — Organizador de Estudos ENEM & ITA

Aplicação web leve, responsiva e pronta para publicar na Vercel. Não exige framework nem instalação de dependências para a interface.

## Recursos

- Escolha entre ENEM e ITA.
- Cronograma automático de 8 semanas.
- Checklist por assunto: Aula, Resumo, Autoexplicação, Exercícios, Caderno de erros, Revisão e Simulado.
- Revisão espaçada inspirada no Anki/SM-2.
- Dashboard com horas, acertos, progresso, projeção e desempenho por matéria.
- Simulados rápidos e links para provas antigas oficiais.
- Biblioteca de videoaulas gratuitas.
- Pomodoro, folha em branco e caderno de erros.
- Correção de redação ENEM, FUVEST e ITA com texto ou foto usando a OpenAI API.
- Backup e restauração do progresso em JSON.

## Publicar na Vercel

1. Envie esta pasta para um repositório no GitHub.
2. Na Vercel, clique em **Add New > Project** e importe o repositório.
3. Em **Framework Preset**, escolha **Other**.
4. Não preencha Build Command nem Output Directory.
5. Em **Settings > Environment Variables**, crie:
   - `OPENAI_API_KEY`: sua chave da OpenAI.
   - `OPENAI_MODEL`: `gpt-5.4-mini` (opcional).
6. Clique em **Deploy**.

A chave fica somente na função serverless `api/corrigir-redacao.js`; nunca é enviada ao navegador.

## Rodar localmente

Instale a Vercel CLI e execute:

```bash
npx vercel dev
```

Crie um arquivo `.env.local` com:

```env
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-5.4-mini
```

## Observações importantes

- O progresso é salvo no `localStorage` do navegador. Para trocar de aparelho, use **Exportar progresso**.
- A nota da redação é uma estimativa pedagógica, não uma nota oficial.
- O banco local de questões é demonstrativo. Para produção, conecte um banco próprio de questões licenciadas ou de domínio permitido.
- Links de provas usam fontes oficiais do INEP e do ITA.
