class MovieModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isVisible = false;
    this.isLoading = false;
    this.movieData = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  show(movieId) {
    this.isVisible = true;
    this.isLoading = true;
    this.movieData = null;
    this.render();
    
    this.dispatchEvent(new CustomEvent('fetch-movie-details', {
      bubbles: true,
      detail: { movieId }
    }));
  }

  hide() {
    this.isVisible = false;
    this.render();
  }

  setMovieData(data) {
    this.movieData = data;
    this.isLoading = false;
    this.render();
  }

  setLoading(loading) {
    this.isLoading = loading;
    this.render();
  }

  setupEventListeners() {
    const modal = this.shadowRoot.querySelector('.modal');
    const closeButton = this.shadowRoot.querySelector('.close-button');
    const modalContent = this.shadowRoot.querySelector('.modal-content');

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hide();
        }
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.hide();
      });
    }

    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .modal {
          display: ${this.isVisible ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.2);
          transform: scale(1.1);
        }

        .loading-container {
          padding: 60px;
          text-align: center;
        }

        .movie-details {
          padding: 40px;
        }

        .movie-header {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
        }

        .movie-poster-large {
          width: 300px;
          height: 450px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .movie-info-main {
          flex: 1;
        }

        .movie-title-large {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .movie-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
        }

        .meta-item {
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          color: #495057;
        }

        .movie-plot {
          font-size: 16px;
          line-height: 1.6;
          color: #495057;
          margin-bottom: 30px;
        }

        .movie-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .detail-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
        }

        .detail-title {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-content {
          color: #495057;
          line-height: 1.5;
        }

        .ratings {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .rating-item {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .no-poster-large {
          width: 300px;
          height: 450px;
          background: #ecf0f1;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          color: #95a5a6;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 10px;
            max-height: 95vh;
          }

          .movie-details {
            padding: 20px;
          }

          .movie-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .movie-poster-large,
          .no-poster-large {
            width: 250px;
            height: 375px;
          }

          .movie-title-large {
            font-size: 24px;
          }

          .movie-details-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="modal">
        <div class="modal-content">
          <button class="close-button">×</button>
          ${this.isLoading ? `
            <div class="loading-container">
              <loading-spinner visible="true"></loading-spinner>
            </div>
          ` : this.movieData ? `
            <div class="movie-details">
              <div class="movie-header">
                ${this.movieData.Poster && this.movieData.Poster !== 'N/A' 
                  ? `<img src="${this.movieData.Poster}" alt="${this.movieData.Title}" class="movie-poster-large">`
                  : `<div class="no-poster-large">🎬</div>`
                }
                <div class="movie-info-main">
                  <h2 class="movie-title-large">${this.movieData.Title}</h2>
                  <div class="movie-meta">
                    <span class="meta-item">${this.movieData.Year}</span>
                    <span class="meta-item">${this.movieData.Rated}</span>
                    <span class="meta-item">${this.movieData.Runtime}</span>
                    <span class="meta-item">${this.movieData.Type}</span>
                  </div>
                  <div class="movie-plot">${this.movieData.Plot}</div>
                  ${this.movieData.Ratings && this.movieData.Ratings.length > 0 ? `
                    <div class="ratings">
                      ${this.movieData.Ratings.map(rating => `
                        <span class="rating-item">${rating.Source}: ${rating.Value}</span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
              <div class="movie-details-grid">
                <div class="detail-section">
                  <div class="detail-title">Genre</div>
                  <div class="detail-content">${this.movieData.Genre}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-title">Director</div>
                  <div class="detail-content">${this.movieData.Director}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-title">Writer</div>
                  <div class="detail-content">${this.movieData.Writer}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-title">Actors</div>
                  <div class="detail-content">${this.movieData.Actors}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-title">Language</div>
                  <div class="detail-content">${this.movieData.Language}</div>
                </div>
                <div class="detail-section">
                  <div class="detail-title">Country</div>
                  <div class="detail-content">${this.movieData.Country}</div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.setupEventListeners();
  }
}

customElements.define('movie-modal', MovieModal);