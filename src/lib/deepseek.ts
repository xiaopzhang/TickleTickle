type TranslateInput = {
  title: string;
  excerpt?: string;
  body: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type TranslateOutput = {
  title: string;
  excerpt: string;
  body: string[];
  seoTitle: string;
  seoDescription: string;
};

type DeepSeekMessage = {
  role: "system" | "user";
  content: string;
};

function containsCjk(value: unknown): boolean {
  return /[\u3400-\u9fff]/.test(JSON.stringify(value));
}

export async function translateToEnglish(input: TranslateInput): Promise<TranslateOutput> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const baseSystemPrompt =
    "You are a professional Chinese-to-English translator for a trustworthy bilingual content site. Translate every Chinese sentence into natural English. Do not copy Chinese text into the output. Return only valid JSON with title, excerpt, body, seoTitle, and seoDescription. The body field is an array of Markdown lines. Preserve the Markdown structure exactly: headings should remain headings with the same # level, bullet and numbered lists should remain lists, quotes should remain quotes, and inline Markdown such as **bold**, *italic*, `code`, and links should remain valid Markdown.";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const messages: DeepSeekMessage[] = [
      {
        role: "system",
        content:
          attempt === 1
            ? baseSystemPrompt
            : `${baseSystemPrompt} Your previous style of response may have copied Chinese text. This time, the output must contain zero Chinese characters. Translate titles, headings, list items, and every body paragraph into English.`
      },
      {
        role: "user",
        content: JSON.stringify({
          instruction: "Translate this entire JSON object from Chinese to English. Output JSON only.",
          sourceLanguage: "zh",
          targetLanguage: "en",
          content: input
        })
      }
    ];

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek translation failed with status ${response.status}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("DeepSeek translation returned an empty response");
    }

    const translation = JSON.parse(content) as TranslateOutput;
    if (!containsCjk(translation)) return translation;
  }

  throw new Error("DeepSeek translation still contained Chinese after retry");
}
