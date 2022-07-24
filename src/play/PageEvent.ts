var onWorkLoadCallback: (element: Element) => void;

export const onAppLoad = (callback: (element: Node) => void) => {
  const appObserver = new MutationObserver((mutationsList, observer) => {
    const list1 = mutationsList
      .map((m) => m.target as HTMLElement)
      .filter((e) => e.id === "App" || e.className.includes("Library_inner__"));
    const list2 = uniq(list1);
    list2.forEach((app) => {
      startObservers(app);
    });
  });
  appObserver.observe(document.querySelector("body") as Node, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};

export const onWorkLoad = (callback: (element: Element) => void) => {
  onWorkLoadCallback = callback;
};

const uniq = <T>(array: T[]): T[] => Array.from(new Set(array));

const startObservers = (app: HTMLElement) => {
  const contentObserver = new MutationObserver((mutationsList, observer) => {
    const list1 = mutationsList
      .filter((m) => m.type === "childList")
      .map((m) => m.target as HTMLElement)
      .flatMap((e) =>
        Array.from(
          e.querySelectorAll<HTMLElement>(
            `[class^="WorkList_list__"], [class^="MylistDetailItem_list__"]`
          )
        )
      );
    const list2 = uniq(list1);
    list2.forEach((e) => onWorkLoadCallback(e));
  });
  contentObserver.observe(app, {
    attributes: false,
    childList: true,
    subtree: true,
  });
};
