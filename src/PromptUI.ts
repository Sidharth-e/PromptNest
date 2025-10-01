// UI Component for Prompt Management
import { PromptManager, Prompt } from './PromptManager';

export class PromptUI {
  private container: HTMLDivElement;
  private promptManager: PromptManager;
  private prompts: Prompt[] = [];
  private isVisible: boolean = false;

  constructor() {
    this.promptManager = new PromptManager();
    this.injectStyles(); // Inject CSS stylesheet into the document
    this.container = this.createContainer();
    this.loadPrompts();
  }

  // Injects a single, modern stylesheet into the document's head
  private injectStyles(): void {
    const styleId = 'prompt-nest-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      :root {
        --pn-primary: #4a90e2;
        --pn-primary-dark: #357ABD;
        --pn-background: #f7f9fc;
        --pn-surface: #ffffff;
        --pn-text: #333333; /* This is the default dark text color */
        --pn-text-secondary: #666666;
        --pn-border: #e0e6ed;
        --pn-success: #4caf50;
        --pn-danger: #f44336;
        --pn-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        --pn-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      
      #prompt-nest-extension * {
          box-sizing: border-box;
      }

      #prompt-nest-extension {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        background: var(--pn-background);
        box-shadow: var(--pn-shadow);
        z-index: 10000;
        font-family: var(--pn-font);
        width: 380px;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s ease-in-out;
        border-left: 1px solid var(--pn-border);
        color: var(--pn-text); /* Ensures all text defaults to dark */
      }

      #prompt-nest-extension.pn-open {
        transform: translateX(0);
      }

      /* Header */
      .pn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid var(--pn-border);
        background: var(--pn-surface);
        flex-shrink: 0;
      }
      .pn-title {
        margin: 0;
        color: var(--pn-primary);
        font-size: 20px;
        font-weight: 600;
      }
      .pn-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pn-close-button {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: var(--pn-text-secondary);
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s, color 0.2s;
        line-height: 1;
      }
      .pn-close-button:hover {
        background-color: #eef2f7;
        color: var(--pn-text);
      }

      /* Form Container (Collapsible) */
      .pn-form-container {
          background: var(--pn-surface);
          border-bottom: 1px solid var(--pn-border);
          padding: 0 20px;
          margin: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
      }
      .pn-form-container.active {
          padding: 20px;
          max-height: 400px; /* Adjust as needed */
      }
      .pn-form h3 {
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--pn-text);
      }
      .pn-form label {
        display: block;
        margin-bottom: 6px;
        font-size: 13px;
        color: var(--pn-text-secondary);
        font-weight: 500;
      }
      .pn-input, .pn-textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--pn-border);
        border-radius: 6px;
        font-size: 14px;
        margin-bottom: 12px;
        transition: border-color 0.2s, box-shadow 0.2s;
        font-family: var(--pn-font);
        color: var(--pn-text); /* Explicitly set input color */
      }
      .pn-input:focus, .pn-textarea:focus {
        outline: none;
        border-color: var(--pn-primary);
        box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
      }
      .pn-textarea {
        min-height: 70px;
        resize: vertical;
      }

      /* Buttons */
      .pn-button {
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
      }
      .pn-button:active {
        transform: translateY(1px);
      }
      .pn-button-primary {
        background: var(--pn-primary);
        color: white;
      }
      .pn-button-primary:hover {
        background: var(--pn-primary-dark);
      }
       .pn-button-secondary {
        background: #eef2f7;
        color: var(--pn-text);
      }
       .pn-button-secondary:hover {
        background: #e0e6ed;
      }

      /* Prompts List */
      #prompts-list {
        flex-grow: 1;
        overflow-y: auto;
        padding: 12px 20px;
      }
      #prompts-list::-webkit-scrollbar { width: 6px; }
      #prompts-list::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
      #prompts-list::-webkit-scrollbar-thumb:hover { background: #aaa; }
      
      .pn-empty-message {
        text-align: center;
        color: var(--pn-text-secondary);
        font-size: 14px;
        margin-top: 40px;
        font-style: italic;
      }
      
      .pn-prompt-item {
        border: 1px solid transparent;
        border-bottom: 1px solid var(--pn-border);
        padding: 15px 10px;
        margin-bottom: 4px;
        background: transparent;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-radius: 8px;
        transition: background-color 0.2s, border-color 0.2s;
      }
      .pn-prompt-item:hover {
          background-color: var(--pn-surface);
          border-color: var(--pn-border);
      }
      .pn-prompt-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
      }
      .pn-prompt-keyword {
        font-weight: 600;
        color: var(--pn-primary);
        font-size: 14px;
        background-color: #eef2f7;
        padding: 4px 8px;
        border-radius: 4px;
        align-self: flex-start;
      }
      .pn-prompt-content {
        color: var(--pn-text);
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
        padding-left: 2px;
      }
      .pn-prompt-actions {
        display: flex;
        gap: 10px;
        align-items: center;
        opacity: 0; /* Hidden by default */
        transition: opacity 0.2s ease-in-out;
      }
      .pn-prompt-item:hover .pn-prompt-actions {
        opacity: 1; /* Visible on hover */
      }
      .pn-icon-button {
        background: none; border: none; padding: 4px; cursor: pointer;
        border-radius: 50%; display: flex; align-items: center;
        justify-content: center; width: 28px; height: 28px;
        transition: background-color 0.2s;
      }
      .pn-icon-button:hover { background-color: #e0e6ed; }
      .pn-icon-button svg { width: 18px; height: 18px; }
      .pn-icon-button.edit svg { fill: var(--pn-success); }
      .pn-icon-button.delete svg { fill: var(--pn-danger); }

      /* Edit Modal */
      .pn-modal-backdrop {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
      }
      .pn-modal-backdrop.active {
        opacity: 1;
        visibility: visible;
      }
      .pn-modal-content {
        background: var(--pn-surface);
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 420px;
        transform: scale(0.95);
        transition: transform 0.2s;
      }
      .pn-modal-backdrop.active .pn-modal-content {
          transform: scale(1);
      }
      .pn-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
      }
      .pn-modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: var(--pn-text);
      }
      .pn-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 16px;
      }
    `;
    document.head.appendChild(style);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'prompt-nest-extension';

    this.createHeader(container);
    this.createAddPromptForm(container);
    this.createPromptsList(container);
    this.createEditModal(container); // Create the modal structure once

    return container;
  }

  private createHeader(container: HTMLDivElement): void {
    const header = document.createElement('div');
    header.className = 'pn-header';

    const title = document.createElement('h2');
    title.textContent = 'PromptNest';
    title.className = 'pn-title';

    const headerActions = document.createElement('div');
    headerActions.className = 'pn-header-actions';

    const newPromptButton = document.createElement('button');
    newPromptButton.textContent = 'New Prompt';
    newPromptButton.className = 'pn-button pn-button-primary';
    newPromptButton.addEventListener('click', () => {
        this.container.querySelector('.pn-form-container')?.classList.toggle('active');
    });

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'pn-close-button';
    closeButton.title = 'Close';
    closeButton.addEventListener('click', () => this.hide());
    
    headerActions.appendChild(newPromptButton);
    headerActions.appendChild(closeButton);
    header.appendChild(title);
    header.appendChild(headerActions);
    container.appendChild(header);
  }

  private createAddPromptForm(container: HTMLDivElement): void {
    const formContainer = document.createElement('div');
    formContainer.className = 'pn-form-container';

    const form = document.createElement('form');
    form.className = 'pn-form';
    form.id = 'pn-add-form';
    form.innerHTML = `
        <h3>Add New Prompt</h3>
        <label>Keyword (e.g., ::email)</label>
        <input type="text" placeholder="::email-summary" class="pn-input" name="keyword">
        <label>Prompt Content</label>
        <textarea placeholder="Summarize the following email thread..." class="pn-textarea" name="content"></textarea>
        <button type="submit" class="pn-button pn-button-primary">Add Prompt</button>
    `;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const keywordInput = form.querySelector<HTMLInputElement>('input[name="keyword"]');
      const contentInput = form.querySelector<HTMLTextAreaElement>('textarea[name="content"]');
      
      const keyword = keywordInput?.value.trim() ?? '';
      const content = contentInput?.value.trim() ?? '';

      if (!keyword || !content) {
        alert('Please fill in both keyword and content.');
        return;
      }
      if (!keyword.startsWith('::')) {
        alert('Keyword must start with ::');
        return;
      }

      try {
        await this.promptManager.createPrompt(keyword, content);
        if(keywordInput) keywordInput.value = '';
        if(contentInput) contentInput.value = '';
        formContainer.classList.remove('active'); // Hide form on success
        await this.loadPrompts();
      } catch (error) {
        alert('Error adding prompt: ' + error);
      }
    });

    formContainer.appendChild(form);
    container.appendChild(formContainer);
  }

  private createPromptsList(container: HTMLDivElement): void {
    const listContainer = document.createElement('div');
    listContainer.id = 'prompts-list';
    container.appendChild(listContainer);
  }

  private async loadPrompts(): Promise<void> {
    this.prompts = await this.promptManager.getAllPrompts();
    this.renderPrompts();
  }

  private renderPrompts(): void {
    const listContainer = this.container.querySelector('#prompts-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (this.prompts.length === 0) {
      listContainer.innerHTML = `<p class="pn-empty-message">No prompts saved. Add one to get started! ✨</p>`;
      return;
    }

    this.prompts.forEach(prompt => {
      const promptItem = this.createPromptItem(prompt);
      listContainer.appendChild(promptItem);
    });
  }

  private createPromptItem(prompt: Prompt): HTMLDivElement {
    const item = document.createElement('div');
    item.className = 'pn-prompt-item';

    item.innerHTML = `
        <div class="pn-prompt-header">
            <div class="pn-prompt-keyword">${prompt.keyword}</div>
            <div class="pn-prompt-actions">
                <button class="pn-icon-button edit" title="Edit Prompt">
                    <svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25Z" /></svg>
                </button>
                <button class="pn-icon-button delete" title="Delete Prompt">
                    <svg viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                </button>
            </div>
        </div>
        <div class="pn-prompt-content">${prompt.content}</div>
    `;

    // --- Event Listeners ---
    item.querySelector('.edit')?.addEventListener('click', () => {
        this.showEditModal(prompt);
    });

    item.querySelector('.delete')?.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this prompt?')) {
        try {
          await this.promptManager.deletePrompt(prompt.id);
          await this.loadPrompts();
        } catch (error) {
          alert('Error deleting prompt: ' + error);
        }
      }
    });

    return item;
  }
  
  private createEditModal(container: HTMLDivElement): void {
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'pn-modal-backdrop';
      modalBackdrop.id = 'pn-edit-modal';
      
      modalBackdrop.innerHTML = `
        <div class="pn-modal-content">
            <div class="pn-modal-header">
                <h3>Edit Prompt</h3>
                <button class="pn-close-button">&times;</button>
            </div>
            <form id="pn-edit-form">
                <label>Keyword</label>
                <input type="text" class="pn-input" name="keyword">
                <label>Content</label>
                <textarea class="pn-textarea" name="content"></textarea>
                <div class="pn-modal-actions">
                    <button type="button" class="pn-button pn-button-secondary" id="pn-edit-cancel">Cancel</button>
                    <button type="submit" class="pn-button pn-button-primary" id="pn-edit-save">Save Changes</button>
                </div>
            </form>
        </div>
      `;
      
      // Close modal events
      const closeModal = () => modalBackdrop.classList.remove('active');
      modalBackdrop.querySelector('.pn-close-button')?.addEventListener('click', closeModal);
      modalBackdrop.querySelector('#pn-edit-cancel')?.addEventListener('click', closeModal);
      
      // Close on backdrop click
      modalBackdrop.addEventListener('click', (e) => {
          if (e.target === modalBackdrop) {
              closeModal();
          }
      });

      container.appendChild(modalBackdrop);
  }
  
  private showEditModal(prompt: Prompt): void {
      const modal = this.container.querySelector<HTMLDivElement>('#pn-edit-modal');
      const form = modal?.querySelector<HTMLFormElement>('#pn-edit-form');
      if (!modal || !form) return;

      const keywordInput = form.querySelector<HTMLInputElement>('input[name="keyword"]');
      const contentInput = form.querySelector<HTMLTextAreaElement>('textarea[name="content"]');

      // Populate form with existing prompt data
      if (keywordInput) keywordInput.value = prompt.keyword;
      if (contentInput) contentInput.value = prompt.content;

      // Handle form submission
      const handleSubmit = async (e: Event) => {
          e.preventDefault();
          const newKeyword = keywordInput?.value.trim() ?? '';
          const newContent = contentInput?.value.trim() ?? '';
          if (!newKeyword || !newContent) {
              alert('Please provide both keyword and content.');
              return;
          }
          try {
              await this.promptManager.updatePrompt(prompt.id, newKeyword, newContent);
              modal.classList.remove('active');
              await this.loadPrompts();
          } catch (error) {
              alert('Error updating prompt: ' + error);
          }
      };

      // We remove and re-add the listener to ensure it captures the correct 'prompt' object
      form.removeEventListener('submit', (form as any).__handleSubmit__);
      form.addEventListener('submit', handleSubmit);
      (form as any).__handleSubmit__ = handleSubmit; // Store reference for removal

      modal.classList.add('active');
  }

  // --- Public Methods ---
  public show(): void {
    if (!this.isVisible) {
      document.body.appendChild(this.container);
      setTimeout(() => this.container.classList.add('pn-open'), 10); // small delay for transition
      this.isVisible = true;
      this.loadPrompts();
    }
  }

  public hide(): void {
    if (this.isVisible) {
      this.container.classList.remove('pn-open');
      // Optional: remove from DOM after transition
      // setTimeout(() => this.container.remove(), 300); 
      this.isVisible = false;
    }
  }

  public toggle(): void {
    this.isVisible ? this.hide() : this.show();
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }
}