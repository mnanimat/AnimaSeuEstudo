const MAX_BODY_BYTES = 10 * 1024 * 1024;

function criteriaFor(model) {
  if (model === 'ENEM') return `Avalie cinco competências, cada uma de 0 a 200: domínio da modalidade escrita formal; compreensão da proposta e repertório; organização e defesa do ponto de vista; mecanismos de coesão; proposta de intervenção detalhada, viável e respeitosa aos direitos humanos. A soma deve ir de 0 a 1000.`;
  if (model === 'ITA') return `Avalie em cinco critérios, cada um de 0 a 2, total de 0 a 10: Tema; Tipo de texto; Coerência; Coesão; Modalidade escrita. Considere tangenciamento, fuga ao tema, projeto argumentativo, progressão, precisão vocabular e norma-padrão.`;
  return `Avalie em cinco critérios, cada um de 0 a 2, total de 0 a 10: desenvolvimento do tema e gênero solicitado; estrutura e progressão argumentativa; coerência e articulação; domínio da língua e precisão vocabular; autoria, repertório e adequação à proposta. A FUVEST pode solicitar gêneros diferentes da dissertação tradicional, portanto verifique a adequação ao comando informado.`;
}

function promptFor({ model, theme, text, hasImage }) {
  return `Você é um corretor pedagógico rigoroso de redações de vestibulares brasileiros. Corrija no modelo ${model}.
Tema informado: ${theme || 'não informado'}.
${criteriaFor(model)}
${hasImage ? 'A redação está em uma imagem. Primeiro transcreva mentalmente com cuidado; quando algo estiver ilegível, não invente e sinalize a incerteza.' : ''}
Texto digitado: ${text || '(usar a imagem anexada)'}

Regras:
- Não trate a nota como oficial; use estimativa fundamentada.
- Aponte evidências concretas do texto, sem citações longas.
- Diferencie problema de conteúdo, estrutura, coesão e gramática.
- Dê ações específicas e priorizadas para reescrita.
- Não invente erros que não estejam visíveis.
- Retorne APENAS JSON válido, sem markdown.

Formato exato:
{
  "modelo": "${model}",
  "nota_aproximada": número,
  "nivel_geral": "texto curto",
  "diagnostico_geral": "texto detalhado",
  "criterios": [
    {"nome":"critério", "nota": número, "analise":"evidências e justificativa", "como_melhorar":"ação prática"}
  ],
  "pontos_fortes": ["..."],
  "prioridades_melhoria": ["..."],
  "erros_linguisticos": [{"erro":"trecho ou padrão", "correcao":"forma sugerida", "explicacao":"regra"}],
  "plano_de_reescrita": "passos numerados em texto",
  "exemplo_melhoria": "um parágrafo curto reescrito, preservando as ideias do estudante"
}`;
}

function extractText(data) {
  if (data.output_text) return data.output_text;
  const pieces = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) pieces.push(content.text);
    }
  }
  return pieces.join('\n');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'Configure OPENAI_API_KEY nas variáveis de ambiente da Vercel.' });

  try {
    const rawLength = Number(req.headers['content-length'] || 0);
    if (rawLength > MAX_BODY_BYTES) return res.status(413).json({ error: 'Arquivo muito grande.' });
    const { model = 'ENEM', theme = '', text = '', image = null } = req.body || {};
    if (!['ENEM', 'FUVEST', 'ITA'].includes(model)) return res.status(400).json({ error: 'Modelo de correção inválido.' });
    if (!text && !image) return res.status(400).json({ error: 'Envie o texto ou uma imagem da redação.' });
    if (text.length > 30000) return res.status(400).json({ error: 'Texto excessivamente longo.' });
    if (image && (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > MAX_BODY_BYTES * 1.4)) return res.status(400).json({ error: 'Imagem inválida ou muito grande.' });

    const content = [{ type: 'input_text', text: promptFor({ model, theme, text, hasImage: !!image }) }];
    if (image) content.push({ type: 'input_image', image_url: image, detail: 'high' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
        input: [{ role: 'user', content }],
        max_output_tokens: 4200
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || 'A API de IA não concluiu a análise.';
      return res.status(response.status).json({ error: message });
    }

    let output = extractText(data).trim();
    output = output.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    let parsed;
    try { parsed = JSON.parse(output); }
    catch { return res.status(502).json({ error: 'A resposta da IA veio em formato inesperado. Tente novamente.' }); }
    return res.status(200).json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao processar a redação.' });
  }
};
