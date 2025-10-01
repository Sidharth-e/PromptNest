// UI Component for Prompt Management
import { PromptManager, Prompt } from './PromptManager';

export class PromptUI {
  private container: HTMLDivElement;
  private promptManager: PromptManager;
  private prompts: Prompt[] = [];
  private isVisible: boolean = false;

  constructor() {
    this.promptManager = new PromptManager();
    this.container = this.createContainer();
    this.loadPrompts();
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'prompt-nest-extension';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ffffff;
      border: 2px solid #007acc;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-width: 350px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      display: none;
    `;

    this.createHeader(container);
    this.createAddPromptForm(container);
    this.createPromptsList(container);

    return container;
  }

  private createHeader(container: HTMLDivElement): void {
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    `;

    const title = document.createElement('h2');
    title.textContent = 'PromptNest';
    title.style.cssText = `
      margin: 0;
      color: #007acc;
      font-size: 18px;
      font-weight: 600;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
    `;

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#f0f0f0';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });

    closeButton.addEventListener('click', () => {
      this.hide();
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);
  }

  private createAddPromptForm(container: HTMLDivElement): void {
    const form = document.createElement('form');
    form.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    `;

    const formTitle = document.createElement('h3');
    formTitle.textContent = 'Add New Prompt';
    formTitle.style.cssText = `
      margin: 0 0 15px 0;
      color: #333;
      font-size: 14px;
      font-weight: 600;
    `;

    const keywordLabel = document.createElement('label');
    keywordLabel.textContent = 'Keyword (e.g., ::email):';
    keywordLabel.style.cssText = `
      display: block;
      margin-bottom: 5px;
      font-size: 12px;
      color: #555;
      font-weight: 500;
    `;

    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.placeholder = '::email';
    keywordInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
      box-sizing: border-box;
    `;

    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Prompt Content:';
    contentLabel.style.cssText = `
      display: block;
      margin-bottom: 5px;
      font-size: 12px;
      color: #555;
      font-weight: 500;
    `;

    const contentInput = document.createElement('textarea');
    contentInput.placeholder = 'Write a mail to my manager...';
    contentInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 10px;
      min-height: 60px;
      resize: vertical;
      box-sizing: border-box;
      font-family: inherit;
    `;

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add Prompt';
    addButton.style.cssText = `
      background: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    addButton.addEventListener('mouseenter', () => {
      addButton.style.backgroundColor = '#005a9e';
    });

    addButton.addEventListener('mouseleave', () => {
      addButton.style.backgroundColor = '#007acc';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const keyword = keywordInput.value.trim();
      const content = contentInput.value.trim();

      if (!keyword || !content) {
        alert('Please fill in both keyword and content');
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
    listContainer.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `;

    container.appendChild(listContainer);
  }

  private async loadPrompts(): Promise<void> {
    this.prompts = await this.promptManager.getAllPrompts();
    this.renderPrompts();
  }

  private renderPrompts(): void {
    const listContainer = document.getElementById('prompts-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (this.prompts.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No prompts saved yet. Add your first prompt above!';
      emptyMessage.style.cssText = `
        text-align: center;
        color: #666;
        font-size: 12px;
        margin: 20px 0;
        font-style: italic;
      `;
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
    item.style.cssText = `
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      background: #fff;
    `;

    const keyword = document.createElement('div');
    keyword.textContent = prompt.keyword;
    keyword.style.cssText = `
      font-weight: 600;
      color: #007acc;
      font-size: 12px;
      margin-bottom: 5px;
    `;

    const content = document.createElement('div');
    content.textContent = prompt.content;
    content.style.cssText = `
      color: #333;
      font-size: 11px;
      line-height: 1.4;
      margin-bottom: 8px;
      word-wrap: break-word;
    `;

    const actions = document.createElement('div');
    actions.style.cssText = `
      display: flex;
      gap: 8px;
    `;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.style.cssText = `
      background: #28a745;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.cssText = `
      background: #dc3545;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 10px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    editButton.addEventListener('click', () => {
      this.editPrompt(prompt);
    });

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

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(keyword);
    item.appendChild(content);
    item.appendChild(actions);

    return item;
  }

  private editPrompt(prompt: Prompt): void {
    const newKeyword = prompt(`Edit keyword for "${prompt.keyword}":`, prompt.keyword);
    if (newKeyword === null) return;

    const newContent = prompt(`Edit content:`, prompt.content);
    if (newContent === null) return;

    this.promptManager.updatePrompt(prompt.id, newKeyword, newContent)
      .then(() => this.loadPrompts())
      .catch(error => alert('Error updating prompt: ' + error));
  }

  public show(): void {
    if (!this.isVisible) {
      document.body.appendChild(this.container);
      this.container.style.display = 'block';
      this.isVisible = true;
    }
  }

  public hide(): void {
    if (this.isVisible) {
      this.container.style.display = 'none';
      this.isVisible = false;
    }
  }

  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }
}
