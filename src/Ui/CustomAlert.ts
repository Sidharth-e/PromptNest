// Lightweight, modern custom alert utility for the extension UI
// Provides a Promise-based API to show dismissible alerts

export type CustomAlertType = 'info' | 'success' | 'warning' | 'error';

export interface CustomAlertOptions {
	// Title text shown in bold at the top of the alert
	title?: string;
	// One of preset styles
	type?: CustomAlertType;
	// Auto close in ms; if omitted, requires user action
	autoCloseMs?: number;
}

export class CustomAlert {
	private static stylesInjected = false;

	private static ensureStyles(): void {
		if (this.stylesInjected) return;
		this.stylesInjected = true;

		const style = document.createElement('style');
		style.id = 'pn-custom-alert-styles';
		style.innerHTML = `
		  :root {
		    --pn-primary: #4a90e2;
		    --pn-success: #4caf50;
		    --pn-danger: #f44336;
		    --pn-warning: #ff9800;
		    --pn-surface: #ffffff;
		    --pn-text: #333333;
		    --pn-border: #e0e6ed;
		    --pn-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
		    --pn-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		  }

		  .pn-alert-backdrop {
		    position: fixed;
		    inset: 0;
		    background: transparent;
		    display: flex;
		    align-items: flex-start;
		    justify-content: center;
		    z-index: 10002;
		    opacity: 0;
		    visibility: hidden;
		    transition: opacity 0.2s ease, visibility 0.2s ease;
			font-family: var(--pn-font);
			padding-top: 16px;
		  }
		  .pn-alert-backdrop.pn-open { opacity: 1; visibility: visible; }

		  .pn-alert {
		    background: var(--pn-surface);
		    border: 1px solid var(--pn-border);
		    border-left: 6px solid var(--pn-primary);
		    border-radius: 10px;
		    width: calc(min(92vw, 440px));
		    box-shadow: var(--pn-shadow);
		    transform: translateY(-12px);
		    opacity: 0;
		    transition: transform 0.2s ease, opacity 0.2s ease;
		  }
		  .pn-alert-backdrop.pn-open .pn-alert { transform: translateY(0); opacity: 1; }

		  .pn-alert-header { display:flex; justify-content: space-between; align-items:center; padding: 14px 16px 0 16px; }
		  .pn-alert-title { margin: 0; font-size: 16px; font-weight: 700; color: var(--pn-text); }
		  .pn-alert-close { background:none; border:none; font-size: 22px; line-height: 1; cursor:pointer; color:#777; width:28px; height:28px; border-radius: 6px; }
		  .pn-alert-close:hover { background:#f2f4f8; color:#333; }

		  .pn-alert-body { padding: 10px 16px 16px 16px; color: var(--pn-text); font-size: 14px; line-height: 1.5; }
		  .pn-alert-actions { display:flex; gap:10px; justify-content:flex-end; padding: 0 16px 16px 16px; }
		  .pn-alert-button { border:none; padding: 8px 14px; border-radius: 6px; font-size: 14px; cursor:pointer; }
		  .pn-alert-button-primary { background: var(--pn-primary); color: #fff; }
		  .pn-alert-button-primary:hover { filter: brightness(0.95); }
		  .pn-alert-button-secondary { background: #eef2f7; color: #333; }
		  .pn-alert-button-secondary:hover { filter: brightness(0.98); }

		  /* Types */
		  .pn-alert.type-success { border-left-color: var(--pn-success); }
		  .pn-alert.type-warning { border-left-color: var(--pn-warning); }
		  .pn-alert.type-error { border-left-color: var(--pn-danger); }
		`;
		document.head.appendChild(style);
	}

	public static show(message: string, options: CustomAlertOptions = {}): Promise<void> {
		this.ensureStyles();
		const { title = 'Notice', type = 'info', autoCloseMs } = options;

		return new Promise((resolve) => {
			const backdrop = document.createElement('div');
			backdrop.className = 'pn-alert-backdrop';

			const alertBox = document.createElement('div');
			alertBox.className = `pn-alert type-${type}`;

			alertBox.innerHTML = `
			  <div class="pn-alert-header">
			    <h3 class="pn-alert-title">${title}</h3>
			    <button class="pn-alert-close" aria-label="Close">&times;</button>
			  </div>
			  <div class="pn-alert-body">${message}</div>
			  <div class="pn-alert-actions">
			    <button class="pn-alert-button pn-alert-button-secondary" data-action="dismiss">Dismiss</button>
			    <button class="pn-alert-button pn-alert-button-primary" data-action="ok">OK</button>
			  </div>
			`;

			const cleanup = () => {
				backdrop.classList.remove('pn-open');
				setTimeout(() => backdrop.remove(), 180);
			};

			const complete = () => {
				cleanup();
				resolve();
			};

			backdrop.addEventListener('click', (e) => {
				if (e.target === backdrop) complete();
			});

			alertBox.querySelector('.pn-alert-close')?.addEventListener('click', complete);
			alertBox.querySelector('[data-action="dismiss"]')?.addEventListener('click', complete);
			alertBox.querySelector('[data-action="ok"]')?.addEventListener('click', complete);

			backdrop.appendChild(alertBox);
			document.body.appendChild(backdrop);
			requestAnimationFrame(() => backdrop.classList.add('pn-open'));

			if (typeof autoCloseMs === 'number' && autoCloseMs > 0) {
				setTimeout(() => complete(), autoCloseMs);
			}
		});
	}
}

export default CustomAlert;


