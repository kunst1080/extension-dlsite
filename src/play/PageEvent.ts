const CHECK_INTERVAL = 1000;

var onWorkLoadCallback: (element: Element) => void;

export const onAppLoad = (callback: (element: Node) => void) => {
  let isInitialize = true;
  const appRoot = document.querySelector("body") as Node;
  const appObserver = new MutationObserver((mutationsList, observer) => {
    if (mutationsList.some((m) => (m.target as Element).id === "app")) {
      const app = mutationsList[0].target;
      if (isInitialize) {
        callback(app);
      }
      isInitialize = false;
      setTimeout(() => {
        startObservers();
      }, 10);
    }
  });
  appObserver.observe(appRoot, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

export const onWorkLoad = (callback: (element: Element) => void) => {
  onWorkLoadCallback = callback;
};

const uniq = <T>(array: T[]): T[] => Array.from(new Set(array));

const startObservers = () => {
  document
    .querySelectorAll("#app .page-content .content ol.list-work li.work")
    .forEach((n) => onWorkLoadCallback(n));
  const content = document.querySelector("#app .page-content") as Node;
  const contentObserver = new MutationObserver((mutationsList, observer) => {
    const items = mutationsList
      .filter((m) => m.type === "childList")
      .filter((m) => !(m.target as Element).classList.contains("thumbnail"))
      // 変更のあった <ol> 要素を抽出
      .flatMap((m) => {
        if (m.target.nodeName === "OL") {
          // <li> 要素が単体で挿入されたとき
          return m.target;
        } else {
          if (
            m.addedNodes.length == 1 &&
            (m.addedNodes[0] as HTMLElement).classList?.contains("content")
          ) {
            // contents 全体が書き換わったとき
            const content = m.addedNodes[0] as HTMLElement;
            return Array.from(content.querySelectorAll("ol.list-work"));
          } else {
            // 購入日別の <ol> 要素が挿入されたとき
            return Array.from(m.addedNodes).filter((n) => n.nodeName === "OL");
          }
        }
      })
      // <ol> 要素から <li> 要素を展開
      .flatMap((n) => Array.from(n.childNodes))
      .filter((e) => (e as Element).classList.contains("work"));
    uniq(items).forEach((n) => onWorkLoadCallback(n as Element));
  });
  contentObserver.observe(content, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};
