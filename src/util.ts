import { DATA_AUTO_TRANSLATE_ATTRIBUTE } from "./domObserver";

export function generateNodeId(node: Node): string {
  const path: string[] = [];

  let current: Node | null = node;
  while (current && current.parentNode) {
    const siblings = Array.from(current.parentNode.childNodes).filter(
      (sibling) => sibling.nodeName === (current as ChildNode).nodeName
    );

    const index = siblings.indexOf(current as ChildNode);

    const nodeInfo = [
      current.nodeName.toLowerCase(),
      `type_${current.nodeType}`,
      `index_${index}`,
    ];

    if (current instanceof Element) {
      if (current.classList.length > 0) {
        nodeInfo.push(`class_${Array.from(current.classList).join(".")}`);
      }
      if (current.id) {
        nodeInfo.push(`id_${current.id}`);
      }
    }

    if (current.nodeType === Node.TEXT_NODE && current.textContent) {
      const text = current.textContent.trim().slice(0, 20).replace(/\s+/g, "");
      if (text) {
        nodeInfo.push(`text_${text}`);
      }
    }

    path.unshift(nodeInfo.join("_"));
    current = current.parentNode;
  }

  return path.join("/");
}

export function extractTextFromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as HTMLElement).innerText || "";
  }
  return "";
}

export function collectAutoTranslateNodes(
  node: Node,
  result: HTMLElement[] = []
): HTMLElement[] {
  if (
    node instanceof HTMLElement &&
    node.getAttribute(DATA_AUTO_TRANSLATE_ATTRIBUTE) === "true"
  ) {
    result.push(node);
  }
  // 자식 노드가 있으면 재귀적으로 탐색
  node.childNodes.forEach((child) => collectAutoTranslateNodes(child, result));
  return result;
}
