const CHECK_INTERVAL = 1000;

var onWorkLoadCallback: (element: Element) => void;

export const onAppLoad = (callback: (element: Node) => void) => {
  console.debug("start onAppLoad");
  const timer = setInterval(check, CHECK_INTERVAL);
  function check() {
    console.debug("waiting app loaded");
    const app = document.getElementById("app");
    if (app != null) {
      clearInterval(timer);
      callback(app);
      startObservers();
    }
  }
};

export const onWorkLoad = (callback: (element: Element) => void) => {
  onWorkLoadCallback = callback;
};

const uniq = <T>(array: T[]): T[] => Array.from(new Set(array));

const startObservers = () => {
  document
    .querySelectorAll(
      "#app .page-content .content:nth-child(2) ol.list-work li"
    )
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
      .filter((n) => n != null)
      // <ol> 要素から <li> 要素を展開
      .flatMap((n) => Array.from(n.childNodes));
    uniq(items).forEach((n) => onWorkLoadCallback(n as Element));
  });
  contentObserver.observe(content, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};
