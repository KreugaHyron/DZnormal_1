class MovieSearchForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    console.log('MovieSearchForm connected');
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot.querySelector('form');
    const input = this.shadowRoot.querySelector('input');

    console.log('Setting up event listeners, form:', form, 'input:', input);

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        console.log('Form submitted with query:', query);
        
        if (query) {
          const searchEvent = new CustomEvent('search', {
            bubbles: true,
            composed: true, // Важливо для Shadow DOM
            detail: { query }
          });
          console.log('Dispatching search event:', searchEvent);
          this.dispatchEvent(searchEvent);
        }
      });

      // Додаємо обробник для Enter
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          form.dispatchEvent(new Event('submit'));
        }
      });

      // Тестовий обробник для перевірки що input працює
      input.addEventListener('input', (e) => {
        console.log('Input value changed:', e.target.value);
      });

    } else {
      console.error('Form or input not found!');
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .search-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .form-title {
          text-align: center;
          margin: 0 0 24px 0;
          color: #2c3e50;
          font-size: 28px;
          font-weight: 600;
        }

        .search-container {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .search-input {
          flex: 1;
          padding: 16px 20px;
          border: 2px solid #e1e8ed;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .search-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .search-form {
            margin: 16px;
            padding: 24px;
          }
          
          .search-container {
            flex-direction: column;
          }
          
          .search-button {
            padding: 14px 24px;
          }
        }
      </style>
      <div class="search-form">
        <h1 class="form-title">🎬 Movie Search</h1>
        <form>
          <div class="search-container">
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search for movies, series, episodes..."
              required
            >
            <button type="submit" class="search-button">Search</button>
          </div>
        </form>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('movie-search-form', MovieSearchForm);