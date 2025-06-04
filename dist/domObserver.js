import { applyTranslation } from "./applyTranslation";
import { loadCache, saveCache } from "./cache";
import { translateTextBatch } from "./translator";
import { collectAutoTranslateNodes, extractTextFromNode, generateNodeId, } from "./util";
export const DATA_AUTO_TRANSLATE_ATTRIBUTE = "data-auto-translate";
export class MultilangObserver {
    constructor(options) {
        this.options = options;
        this.observer = null;
        this.cache = {};
        this.targetLang = "en";
        this.targetLang = options.targetLang;
        this.cache = loadCache(this.targetLang);
    }
    async start() {
        // DOM 초기 텍스트 번역
        // const nodes = await waitForAutoTranslateNode();
        // this.translate(Array.from(nodes));
        // DOM 변경 감지
        this.observer = new MutationObserver((mutations) => {
            const changedNodes = [];
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
    async translate(nodesToTranslate) {
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
    stop() {
        this.observer?.disconnect();
    }
}
