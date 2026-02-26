export interface TrackedMutation {
  target: Node;
  oldValue: string | null;
}

export function createObserver(originalContent: Map<Element, string>) {
  let observer: MutationObserver | null = null;
  const mutations: TrackedMutation[] = [];

  function isTracked(node: Node): boolean {
    // Walk up from the mutation target to find a tracked element
    let current: Node | null = node;
    while (current) {
      if (current instanceof Element && originalContent.has(current)) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function start() {
    if (observer) return;

    observer = new MutationObserver((records) => {
      for (const record of records) {
        // Only track mutations on elements we're watching
        if (!isTracked(record.target)) continue;

        if (record.type === "characterData") {
          mutations.push({
            target: record.target,
            oldValue: record.oldValue,
          });
        }

        if (record.type === "childList") {
          mutations.push({
            target: record.target,
            oldValue: null,
          });
        }
      }
    });

    observer.observe(document.body, {
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true,
    });
  }

  function stop() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function getChanges() {
    return [...mutations];
  }

  function clear() {
    mutations.length = 0;
  }

  return { start, stop, getChanges, clear };
}
