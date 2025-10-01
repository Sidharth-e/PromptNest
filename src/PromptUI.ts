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
        --pn-text: #333333;
        --pn-text-secondary: #666666;
        --pn-border: #e0e6ed;
        --pn-success: #52c41a;
        --pn-danger: #ff4d4f;
        --pn-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        --pn-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }

      #prompt-nest-extension {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--pn-background);
        border-radius: 12px;
        padding: 20px;
        box-shadow: var(--pn-shadow);
        z-index: 10000;
        font-family: var(--pn-font);
        width: 380px;
        max-height: 85vh;
        display: none;
        flex-direction: column;
        gap: 20px;
      }

      /* Header */
      .pn-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--pn-border);
      }
      .pn-title {
        margin: 0;
        color: var(--pn-primary);
        font-size: 20px;
        font-weight: 600;
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

      /* Form */
      .pn-form {
        padding: 15px;
        background: var(--pn-surface);
        border-radius: 8px;
        border: 1px solid var(--pn-border);
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
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
        font-family: var(--pn-font);
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

      /* Prompts List */
      #prompts-list {
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 5px; /* space for scrollbar */
      }
      #prompts-list::-webkit-scrollbar {
        width: 6px;
      }
      #prompts-list::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
      #prompts-list::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
      .pn-empty-message {
        text-align: center;
        color: var(--pn-text-secondary);
        font-size: 14px;
        margin: 20px 0;
        font-style: italic;
      }
      .pn-prompt-item {
        border: 1px solid var(--pn-border);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 12px;
        background: var(--pn-surface);
        display: flex;
        flex-direction: column;
        gap: 8px;
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
      }
      .pn-prompt-actions {
        display: flex;
        gap: 10px;
        margin-top: 8px;
        align-items: center;
      }
      .pn-icon-button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        transition: background-color 0.2s;
      }
      .pn-icon-button:hover {
        background-color: #eef2f7;
      }
      .pn-icon-button svg {
        width: 16px;
        height: 16px;
      }
      .pn-icon-button.edit svg { fill: var(--pn-success); }
      .pn-icon-button.delete svg { fill: var(--pn-danger); }
    `;
    document.head.appendChild(style);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'prompt-nest-extension';
    container.style.display = 'none'; // Controlled by show/hide methods

    this.createHeader(container);
    this.createAddPromptForm(container);
    this.createPromptsList(container);

    return container;
  }

  private createHeader(container: HTMLDivElement): void {
    const header = document.createElement('div');
    header.className = 'pn-header';

    const title = document.createElement('h2');
    title.textContent = 'PromptNest';
    title.className = 'pn-title';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // Use HTML entity for '×'
    closeButton.className = 'pn-close-button';
    closeButton.addEventListener('click', () => this.hide());

    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);
  }

  private createAddPromptForm(container: HTMLDivElement): void {
    const form = document.createElement('form');
    form.className = 'pn-form';

    const formTitle = document.createElement('h3');
    formTitle.textContent = 'Add New Prompt';

    const keywordLabel = document.createElement('label');
    keywordLabel.textContent = 'Keyword (e.g., ::email)';
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.placeholder = '::email-summary';
    keywordInput.className = 'pn-input';

    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Prompt Content';
    const contentInput = document.createElement('textarea');
    contentInput.placeholder = 'Summarize the following email thread...';
    contentInput.className = 'pn-textarea';

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add Prompt';
    addButton.className = 'pn-button pn-button-primary';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const keyword = keywordInput.value.trim();
      const content = contentInput.value.trim();

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
        keywordInput.value = '';
        contentInput.value = '';
        await this.loadPrompts();
      } catch (error) {
        alert('Error adding prompt: ' + error);
      }
    });

    form.appendChild(formTitle);
    form.appendChild(keywordLabel);
    form.appendChild(keywordInput);
    form.appendChild(contentLabel);
    form.appendChild(contentInput);
    form.appendChild(addButton);
    container.appendChild(form);
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
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No prompts saved. Add your first prompt above! ✨';
      emptyMessage.className = 'pn-empty-message';
      listContainer.appendChild(emptyMessage);
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

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'flex-start';

    const keyword = document.createElement('div');
    keyword.textContent = prompt.keyword;
    keyword.className = 'pn-prompt-keyword';

    const content = document.createElement('div');
    content.textContent = prompt.content;
    content.className = 'pn-prompt-content';

    const actions = document.createElement('div');
    actions.className = 'pn-prompt-actions';

    // SVG Icon for Edit Button
    const editButton = document.createElement('button');
    editButton.className = 'pn-icon-button edit';
    editButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M17.25,2.82L21.18,6.75L19.44,8.5L15.5,4.56L17.25,2.82M9.62,12.5L14.06,8.06L15.94,10L11.5,14.44L9.62,12.5M10.56,19.31L4,20L4.69,13.44L10.56,19.31Z" /></svg>`;
    editButton.title = 'Edit Prompt';

    // SVG Icon for Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'pn-icon-button delete';
    deleteButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;
    deleteButton.title = 'Delete Prompt';
    
    editButton.addEventListener('click', () => this.editPrompt(prompt));
    deleteButton.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this prompt?')) {
        try {
          await this.promptManager.deletePrompt(prompt.id);
          await this.loadPrompts();
        } catch (error) {
          alert('Error deleting prompt: ' + error);
        }
      }
    });

    header.appendChild(keyword);
    header.appendChild(actions);
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(header);
    item.appendChild(content);

    return item;
  }

  private editPrompt(prompt: Prompt): void {
    const newKeyword = window.prompt(`Edit keyword for "${prompt.keyword}":`, prompt.keyword);
    if (newKeyword === null) return;

    const newContent = window.prompt(`Edit content:`, prompt.content);
    if (newContent === null) return;

    this.promptManager.updatePrompt(prompt.id, newKeyword.trim(), newContent.trim())
      .then(() => this.loadPrompts())
      .catch(error => alert('Error updating prompt: ' + error));
  }

  public show(): void {
    if (!this.isVisible) {
      document.body.appendChild(this.container);
      this.container.style.display = 'flex'; // Use flex for layout
      this.isVisible = true;
      this.loadPrompts();
    }
  }

  public hide(): void {
    if (this.isVisible) {
      this.container.style.display = 'none';
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