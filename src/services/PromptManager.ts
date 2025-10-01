// Prompt Manager for handling CRUD operations with chrome.storage.local
export interface Prompt {
  id: string;
  keyword: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PromptManager {
  private static readonly STORAGE_KEY = 'promptNest_prompts';

  // Create a new prompt
  async createPrompt(keyword: string, content: string): Promise<Prompt> {
    const prompt: Prompt = {
      id: this.generateId(),
      keyword: keyword.trim(),
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const prompts = await this.getAllPrompts();
    prompts.push(prompt);
    await this.savePrompts(prompts);
    
    return prompt;
  }

  // Get all prompts
  async getAllPrompts(): Promise<Prompt[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get([PromptManager.STORAGE_KEY], (result) => {
        const prompts = result[PromptManager.STORAGE_KEY] || [];
        // Convert date strings back to Date objects
        const parsedPrompts = prompts.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        resolve(parsedPrompts);
      });
    });
  }

  // Get prompt by keyword
  async getPromptByKeyword(keyword: string): Promise<Prompt | null> {
    const prompts = await this.getAllPrompts();
    return prompts.find(p => p.keyword === keyword.trim()) || null;
  }

  // Update an existing prompt
  async updatePrompt(id: string, keyword?: string, content?: string): Promise<Prompt | null> {
    const prompts = await this.getAllPrompts();
    const index = prompts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }

    const prompt = prompts[index];
    if (keyword !== undefined) prompt.keyword = keyword.trim();
    if (content !== undefined) prompt.content = content.trim();
    prompt.updatedAt = new Date();

    await this.savePrompts(prompts);
    return prompt;
  }

  // Delete a prompt
  async deletePrompt(id: string): Promise<boolean> {
    const prompts = await this.getAllPrompts();
    const filteredPrompts = prompts.filter(p => p.id !== id);
    
    if (filteredPrompts.length === prompts.length) {
      return false; // Prompt not found
    }

    await this.savePrompts(filteredPrompts);
    return true;
  }

  // Delete prompt by keyword
  async deletePromptByKeyword(keyword: string): Promise<boolean> {
    const prompts = await this.getAllPrompts();
    const filteredPrompts = prompts.filter(p => p.keyword !== keyword.trim());
    
    if (filteredPrompts.length === prompts.length) {
      return false; // Prompt not found
    }

    await this.savePrompts(filteredPrompts);
    return true;
  }

  // Save prompts to storage
  private async savePrompts(prompts: Prompt[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [PromptManager.STORAGE_KEY]: prompts }, () => {
        resolve();
      });
    });
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all prompts
  async clearAllPrompts(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([PromptManager.STORAGE_KEY], () => {
        resolve();
      });
    });
  }
}


