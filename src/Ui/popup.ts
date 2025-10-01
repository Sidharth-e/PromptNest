// UI Component for Hello World Extension
export class HelloWorldUI {
  private container: HTMLDivElement;

  constructor() {
    this.container = this.createContainer();
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.id = 'hello-world-extension';
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
      min-width: 200px;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Hello World';
    title.style.cssText = `
      margin: 0 0 10px 0;
      color: #007acc;
      font-size: 18px;
      font-weight: 600;
    `;

    const message = document.createElement('p');
    message.textContent = 'Welcome to your TypeScript browser extension!';
    message.style.cssText = `
      margin: 0;
      color: #333;
      font-size: 14px;
      line-height: 1.4;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    `;

    closeButton.addEventListener('click', () => {
      this.hide();
    });

    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(closeButton);

    return container;
  }

  public show(): void {
    if (!document.getElementById('hello-world-extension')) {
      document.body.appendChild(this.container);
    }
  }

  public hide(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  public isVisible(): boolean {
    return document.getElementById('hello-world-extension') !== null;
  }
}
