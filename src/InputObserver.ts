// Input Observer for detecting keyword typing and auto-filling prompts
import { PromptManager } from './PromptManager';

export class InputObserver {
  private promptManager: PromptManager;
  private observer: MutationObserver | null = null;
  private inputListeners: Map<HTMLInputElement | HTMLTextAreaElement, (event: Event) => void> = new Map();

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
            const inputs = element.querySelectorAll('input, textarea');
            inputs.forEach(input => this.attachListenersToElement(input));
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
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => this.attachListenersToElement(input));
  }

  private attachListenersToElement(element: Element): void {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // Skip if already has listener
      if (this.inputListeners.has(element)) {
        return;
      }

      // Skip certain input types that shouldn't be monitored
      if (element instanceof HTMLInputElement) {
        const skipTypes = ['password', 'hidden', 'submit', 'button', 'reset', 'checkbox', 'radio', 'file'];
        if (skipTypes.includes(element.type.toLowerCase())) {
          return;
        }
      }

      const listener = this.createInputListener(element);
      this.inputListeners.set(element, listener);
      element.addEventListener('input', listener);
    }
  }

  private createInputListener(element: HTMLInputElement | HTMLTextAreaElement): (event: Event) => void {
    return async (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
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

  private showFeedback(element: HTMLInputElement | HTMLTextAreaElement, message: string): void {
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
  }

  public restartObserving(): void {
    this.stopObserving();
    this.startObserving();
  }
}
