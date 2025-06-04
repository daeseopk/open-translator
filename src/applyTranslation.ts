export function applyTranslation(node: Node, translatedText: string) {
  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = translatedText;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;

    if (el.hasAttribute("aria-label")) {
      el.setAttribute("aria-label", translatedText);
    } else if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
      el.setAttribute("placeholder", translatedText);
    } else {
      // 텍스트 노드만 바꾸는 방식
      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = translatedText;
          return;
        }
      }

      // 만약 텍스트 노드가 아예 없으면 그냥 맨 앞에 추가
      el.insertBefore(document.createTextNode(translatedText), el.firstChild);
    }
  }
}
