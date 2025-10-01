// Input Observer for detecting keyword typing and auto-filling prompts
import { PromptManager } from './PromptManager';

export class InputObserver {
  private promptManager: PromptManager;
  private observer: MutationObserver | null = null;
  private inputListeners: Map<HTMLTextAreaElement, (event: Event) => void> = new Map();
  private contentEditableListeners: Map<HTMLElement, (event: Event) => void> = new Map();

  constructor() {
    this.promptManager = new PromptManager();
    this.startObserving();
  }

  private startObserving(): void {
    // Observe for new input elements being added to the DOM
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            this.attachListenersToElement(element);
            
            // Also check child elements
            const textareas = element.querySelectorAll('textarea');
            textareas.forEach(input => this.attachListenersToElement(input));
            
            const contentEditables = element.querySelectorAll('[contenteditable="true"]');
            contentEditables.forEach(editable => this.attachListenersToElement(editable));
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Attach listeners to existing input elements
    this.attachListenersToExistingElements();
  }

  private attachListenersToExistingElements(): void {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(input => this.attachListenersToElement(input));
    
    const contentEditables = document.querySelectorAll('[contenteditable="true"]');
    contentEditables.forEach(editable => this.attachListenersToElement(editable));
  }

  private attachListenersToElement(element: Element): void {
    if (element instanceof HTMLTextAreaElement) {
      // Skip if already has listener
      if (this.inputListeners.has(element)) {
        return;
      }

      const listener = this.createTextAreaListener(element);
      this.inputListeners.set(element, listener);
      element.addEventListener('input', listener);
    } else if (element instanceof HTMLElement && element.contentEditable === 'true') {
      // Skip if already has listener
      if (this.contentEditableListeners.has(element)) {
        return;
      }

      const listener = this.createContentEditableListener(element);
      this.contentEditableListeners.set(element, listener);
      element.addEventListener('input', listener);
      element.addEventListener('keyup', listener);
    }
  }

  private createTextAreaListener(element: HTMLTextAreaElement): (event: Event) => void {
    return async (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      const value = target.value;
      
      // Look for keyword patterns (::keyword)
      const keywordMatch = value.match(/::\w+$/);
      
      if (keywordMatch) {
        const keyword = keywordMatch[0];
        
        try {
          const prompt = await this.promptManager.getPromptByKeyword(keyword);
          
          if (prompt) {
            // Replace the keyword with the prompt content
            const newValue = value.replace(keyword, prompt.content);
            target.value = newValue;
            
            // Trigger input event to notify other scripts
            target.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Show a brief visual feedback
            this.showFeedback(target, 'Prompt inserted!');
          }
        } catch (error) {
          console.error('Error retrieving prompt:', error);
        }
      }
    };
  }

  private createContentEditableListener(element: HTMLElement): (event: Event) => void {
    return async (event: Event) => {
      const target = event.target as HTMLElement;
      const textContent = target.textContent || '';
      
      // Look for keyword patterns (::keyword)
      const keywordMatch = textContent.match(/::\w+$/);
      
      if (keywordMatch) {
        const keyword = keywordMatch[0];
        
        try {
          const prompt = await this.promptManager.getPromptByKeyword(keyword);
          
          if (prompt) {
            // Get current selection
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              
              // Find the text node containing the keyword
              const walker = document.createTreeWalker(
                target,
                NodeFilter.SHOW_TEXT
              );
              
              let textNode: Text | null = null;
              let node: Node | null = null;
              
              while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.includes(keyword)) {
                  textNode = node as Text;
                  break;
                }
              }
              
              if (textNode) {
                const startIndex = textNode.textContent!.lastIndexOf(keyword);
                const endIndex = startIndex + keyword.length;
                
                // Create new range for replacement
                const newRange = document.createRange();
                newRange.setStart(textNode, startIndex);
                newRange.setEnd(textNode, endIndex);
                
                // Replace the keyword with prompt content
                newRange.deleteContents();
                newRange.insertNode(document.createTextNode(prompt.content));
                
                // Clear selection and set cursor to end
                selection.removeAllRanges();
                const endRange = document.createRange();
                endRange.setStartAfter(newRange.endContainer);
                endRange.collapse(true);
                selection.addRange(endRange);
                
                // Show feedback
                this.showFeedback(target, 'Prompt inserted!');
              }
            }
          }
        } catch (error) {
          console.error('Error retrieving prompt:', error);
        }
      }
    };
  }

  private showFeedback(element: HTMLElement, message: string): void {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
      position: absolute;
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 10001;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Position the feedback near the input element
    const rect = element.getBoundingClientRect();
    feedback.style.left = `${rect.left}px`;
    feedback.style.top = `${rect.top - 30}px`;

    document.body.appendChild(feedback);

    // Remove feedback after 2 seconds
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  }

  public stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove all input listeners
    this.inputListeners.forEach((listener, element) => {
      element.removeEventListener('input', listener);
    });
    this.inputListeners.clear();

    // Remove all contenteditable listeners
    this.contentEditableListeners.forEach((listener, element) => {
      element.removeEventListener('input', listener);
      element.removeEventListener('keyup', listener);
    });
    this.contentEditableListeners.clear();
  }

  public restartObserving(): void {
    this.stopObserving();
    this.startObserving();
  }
}
