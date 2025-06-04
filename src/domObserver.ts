import { applyTranslation } from "./applyTranslation";
import { loadCache, saveCache } from "./cache";
import { translateTextBatch } from "./translator";
import type { TranslateOptions, TranslationCache } from "./type";
import {
  collectAutoTranslateNodes,
  extractTextFromNode,
  generateNodeId,
} from "./util";

export const DATA_AUTO_TRANSLATE_ATTRIBUTE = "data-auto-translate";

export class MultilangObserver {
  private observer: MutationObserver | null = null;
  private cache: TranslationCache = {};
  private targetLang: string = "en";

  constructor(private options: TranslateOptions) {
    this.targetLang = options.targetLang;
    this.cache = loadCache(this.targetLang);
  }

  public async start() {
    // DOM 초기 텍스트 번역
    // const nodes = await waitForAutoTranslateNode();
    // this.translate(Array.from(nodes));

    // DOM 변경 감지
    this.observer = new MutationObserver((mutations) => {
      const changedNodes: HTMLElement[] = [];
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          // 자식 노드 중 data-auto-translate 속성이 있는 노드들 재귀적으로 탐색
          collectAutoTranslateNodes(node, changedNodes);
        });
      });
      if (changedNodes.length > 0) {
        this.translate(changedNodes);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private async translate(nodesToTranslate: Node[]) {
    const texts = nodesToTranslate.map((node) => extractTextFromNode(node));
    const translatedTexts = await translateTextBatch(texts, this.options);

    nodesToTranslate.forEach((node, ix) => {
      const id = generateNodeId(node);
      if (this.cache[id]) {
        const cachedText = this.cache[id];
        applyTranslation(node, cachedText);
        return;
      }

      applyTranslation(node, translatedTexts[ix]);

      this.cache[id] = translatedTexts[ix];
      saveCache(this.targetLang, this.cache);
    });
  }

  public stop() {
    this.observer?.disconnect();
  }
}
