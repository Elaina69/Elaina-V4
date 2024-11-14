// Constants for callback types
const CALLBACK_TYPES = {
  ID: 'id',
  TAG: 'tag',
  CLASS: 'class'
};

// Callback storage
const callbackStore = {
  creation: {
    [CALLBACK_TYPES.ID]: new Map(),
    [CALLBACK_TYPES.TAG]: new Map(),
    [CALLBACK_TYPES.CLASS]: new Map()
  },
  deletion: {
    [CALLBACK_TYPES.ID]: new Map(),
    [CALLBACK_TYPES.TAG]: new Map(),
    [CALLBACK_TYPES.CLASS]: new Map()
  }
};

/**
 * Handles element mutations.
 * @param {Element} element - The mutated element.
 * @param {boolean} isCreation - Whether this is a creation event.
 * @param {Object} callbacks - The callback object to use.
 */
export function handleElementMutation(element: any, isCreation: boolean, callbacks: Object): void {
  if (!callbacks || typeof callbacks !== 'object') {
    console.error('Invalid callbacks object:', callbacks);
    return;
  }

  const { id, tagName, classList } = element;

  if (id && callbacks[CALLBACK_TYPES.ID] && callbacks[CALLBACK_TYPES.ID].get) {
    callbacks[CALLBACK_TYPES.ID].get(id)?.forEach(cb => cb(element));
  }

  if (callbacks[CALLBACK_TYPES.TAG] && callbacks[CALLBACK_TYPES.TAG].get) {
    callbacks[CALLBACK_TYPES.TAG].get(tagName.toLowerCase())?.forEach(cb => cb(element));
  }

  if (classList && callbacks[CALLBACK_TYPES.CLASS] && callbacks[CALLBACK_TYPES.CLASS].get) {
    classList.forEach(className => {
      callbacks[CALLBACK_TYPES.CLASS].get(className.toLowerCase())?.forEach(cb => cb(element));
    });
  }

  Array.from(element.children).forEach(child => handleElementMutation(child, isCreation, callbacks));

  if (element.shadowRoot) {
    Array.from(element.shadowRoot.children).forEach(child => handleElementMutation(child, isCreation, callbacks));

    if (isCreation) {
      observerInstance.observe(element.shadowRoot, observerConfig);
    }
  }

  if (element.tagName.toLowerCase() === 'iframe') {
    try {
      const iframeDocument = element.contentDocument || element.contentWindow.document;
      if (iframeDocument) {
        observerInstance.observe(iframeDocument, observerConfig);
        Array.from(iframeDocument.body.children).forEach(child => 
          handleElementMutation(child, isCreation, callbacks)
        );
      }
    } catch (e) {
      console.warn('Unable to access iframe content. It may be cross-origin.', e);
    }
  }
}

/**
 * Callback function for the MutationObserver.
 * @param {MutationRecord[]} mutations - List of mutations.
 */
function observerCallback(mutations: MutationRecord[]): void {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        handleElementMutation(node, true, callbackStore.creation);
      }
    });

    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        handleElementMutation(node, false, callbackStore.deletion);
      }
    });
  });
}

// MutationObserver configuration
const observerConfig = {
  attributes: false,
  childList: true,
  subtree: true
};

// Create and start the MutationObserver
const observerInstance = new MutationObserver(observerCallback);
observerInstance.observe(document, observerConfig);