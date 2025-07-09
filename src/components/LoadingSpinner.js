class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['visible'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'visible') {
      this.updateVisibility();
    }
  }

  updateVisibility() {
    const spinner = this.shadowRoot.querySelector('.spinner-container');
    if (spinner) {
      spinner.style.display = this.getAttribute('visible') === 'true' ? 'flex' : 'none';
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .spinner-text {
          margin-left: 12px;
          color: #666;
          font-size: 14px;
        }
      </style>
      <div class="spinner-container">
        <div class="spinner"></div>
        <span class="spinner-text">Loading...</span>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.updateVisibility();
  }
}

customElements.define('loading-spinner', LoadingSpinner);