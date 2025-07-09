class MovieItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['movie-data'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.render();
      this.setupEventListeners();
    }
  }

  get movieData() {
    const data = this.getAttribute('movie-data');
    return data ? JSON.parse(data) : null;
  }

  setupEventListeners() {
    const detailsButton = this.shadowRoot.querySelector('.details-button');
    if (detailsButton) {
      detailsButton.addEventListener('click', () => {
        const movie = this.movieData;
        if (movie) {
          this.dispatchEvent(new CustomEvent('show-details', {
            bubbles: true,
            detail: { movieId: movie.imdbID }
          }));
        }
      });
    }
  }

  render() {
    const movie = this.movieData;
    if (!movie) return;

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .movie-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .movie-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .movie-poster {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 16px;
          background: #f0f0f0;
        }

        .movie-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .movie-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .movie-year {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .movie-type {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
          margin-bottom: 16px;
          align-self: flex-start;
        }

        .details-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .details-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .no-poster {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecf0f1;
          color: #95a5a6;
          font-size: 48px;
        }
      </style>
      <div class="movie-card">
        ${movie.Poster && movie.Poster !== 'N/A' 
          ? `<img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster" loading="lazy">`
          : `<div class="movie-poster no-poster">🎬</div>`
        }
        <div class="movie-info">
          <h3 class="movie-title">${movie.Title}</h3>
          <div class="movie-year">${movie.Year}</div>
          <span class="movie-type">${movie.Type}</span>
          <button class="details-button">View Details</button>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('movie-item', MovieItem);