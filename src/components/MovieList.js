class MovieList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.movies = [];
    this.hasMore = false;
    this.isLoading = false;
  }

  connectedCallback() {
    this.render();
  }

  setMovies(movies, hasMore = false) {
    this.movies = movies;
    this.hasMore = hasMore;
    this.render();
  }

  addMovies(newMovies, hasMore = false) {
    this.movies = [...this.movies, ...newMovies];
    this.hasMore = hasMore;
    this.render();
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.updateLoadMoreButton();
  }

  updateLoadMoreButton() {
    const loadMoreButton = this.shadowRoot.querySelector('.load-more-button');
    const spinner = this.shadowRoot.querySelector('loading-spinner');
    
    if (loadMoreButton && spinner) {
      loadMoreButton.disabled = this.isLoading;
      loadMoreButton.textContent = this.isLoading ? 'Loading...' : 'Load More';
      spinner.setAttribute('visible', this.isLoading.toString());
    }
  }

  setupEventListeners() {
    const loadMoreButton = this.shadowRoot.querySelector('.load-more-button');
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', () => {
        if (!this.isLoading) {
          this.dispatchEvent(new CustomEvent('load-more', {
            bubbles: true
          }));
        }
      });
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .movie-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .load-more-container {
          text-align: center;
          margin: 32px 0;
        }

        .load-more-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .load-more-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .load-more-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }

        .no-results-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .no-results-text {
          font-size: 18px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }
        }
      </style>
      <div class="movie-list-container">
        ${this.movies.length > 0 ? `
          <div class="movies-grid">
            ${this.movies.map(movie => `
              <movie-item movie-data='${JSON.stringify(movie)}'></movie-item>
            `).join('')}
          </div>
          ${this.hasMore ? `
            <div class="load-more-container">
              <button class="load-more-button">Load More</button>
              <loading-spinner visible="false"></loading-spinner>
            </div>
          ` : ''}
        ` : `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <p class="no-results-text">No movies found. Try a different search term.</p>
          </div>
        `}
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.setupEventListeners();
    this.updateLoadMoreButton();
  }
}

customElements.define('movie-list', MovieList);