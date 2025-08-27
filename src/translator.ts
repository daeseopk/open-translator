import { getApiKey } from "./config";
import type { TranslateOptions } from "./type";

async function translateText(
  textArr: string[],
  options: TranslateOptions
): Promise<string[]> {
  const prompt: string = `
  You are a professional translator.

  You are given a list of Korean text fragments, each labeled with an index (e.g., 1., 2., 3...).

  Each fragment might be:
    - A complete sentence,
    - A partial sentence, or
    - A phrase that continues from or leads to other fragments.

  Your task:
    - Read all fragments together to understand the full context.
    - Translate the fragments naturally and fluently based on their position and surrounding fragments.
    - If some fragments form one sentence split artificially, translate as one natural sentence and then split the translated sentence back into the same number of fragments.
    - Do not translate fragments independently without considering context.
    - If the fragment is originally in English, do NOT translate it; return it as-is.
    - Keep the numbering (1., 2., 3., ...) in your translation output.
    - Maintain the same number of fragments in the output as the input.
    - Output must contain exactly the same number of fragments as the input.
    - If multiple fragments form one sentence in English, translate it naturally first.
    - Then split the translated sentence back into the same number of fragments as the input.
    - When splitting, you may break sentences into smaller phrases or clauses to keep the fragment count identical.
    - Do not merge or remove fragments. The count must always match.
    - *The most important task* The number of requested fragments and the number of response fragments must always be the same

  Target language: ${options.targetLang}
  ${options.tone ? `Tone: ${options.tone}` : ""}

  Here are the text fragments to translate:
  ${textArr.map((t, i) => `${i + 1}. ${t}`).join("\n")}
  `;

  const res = await fetch(
    "https://translator-server-production-0eda.up.railway.app/translate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: getApiKey(),
        prompt,
      }),
    }
  );
  const data = await res.json();
  const rawMessages = data.message;

  const messages = rawMessages
    .trim()
    .split("\n")
    .map((line: string) => line.replace(/^\d+\.\s*/, ""))
    .filter((line: string) => line.trim() !== "");

  return messages;
}

export async function translateTextBatch(
  texts: string[],
  options: TranslateOptions
): Promise<string[]> {
  const messages = await translateText(texts, options);

  if (texts.length !== messages.length) {
    console.warn(
      `원본 배열 길이(${texts.length})와 번역된 배열 길이(${messages.length})가 다릅니다.`
    );
  }

  // 한 번에 묶어서 출력
  const paired = texts
    .map((original, i) => {
      const translated = messages[i] ?? "[번역 없음]";
      return `#${i + 1}\n원본: ${original}\n번역: ${translated}\n`;
    })
    .join("\n");

  console.log(paired);

  return messages.map((m) => m.replace(/^\d+\.\s*/, ""));
}
