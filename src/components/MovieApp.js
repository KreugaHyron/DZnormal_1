import { MovieService } from '../services/MovieService.js';

class MovieApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.movieService = new MovieService();
    this.currentQuery = '';
    this.currentPage = 1;
    this.isLoading = false;
  }

  connectedCallback() {
    console.log('MovieApp connected');
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('MovieApp setting up event listeners');
    
    // Search event
    this.addEventListener('search', async (e) => {
      console.log('MovieApp received search event:', e.detail);
      const { query } = e.detail;
      this.currentQuery = query;
      this.currentPage = 1;
      await this.searchMovies(true);
    });

    // Load more event
    this.addEventListener('load-more', async () => {
      this.currentPage++;
      await this.searchMovies(false);
    });

    // Show details event
    this.addEventListener('show-details', (e) => {
      const { movieId } = e.detail;
      const modal = this.shadowRoot.querySelector('movie-modal');
      modal.show(movieId);
    });

    // Fetch movie details event
    this.addEventListener('fetch-movie-details', async (e) => {
      const { movieId } = e.detail;
      await this.fetchMovieDetails(movieId);
    });
  }

  async searchMovies(isNewSearch = true) {
    console.log('=== searchMovies START ===');
    console.log('searchMovies called with isNewSearch:', isNewSearch);
    console.log('Current query:', this.currentQuery);
    console.log('Current page:', this.currentPage);
    
    if (this.isLoading) {
      console.log('Already loading, skipping');
      return;
    }

    this.isLoading = true;
    const movieList = this.shadowRoot.querySelector('movie-list');
    const searchSpinner = this.shadowRoot.querySelector('.search-spinner loading-spinner');

    console.log('Found movieList:', movieList);
    console.log('Found searchSpinner:', searchSpinner);

    try {
      if (isNewSearch && searchSpinner) {
        console.log('Setting spinner visible');
        searchSpinner.setAttribute('visible', 'true');
      } else if (!isNewSearch && movieList) {
        console.log('Setting movieList loading');
        movieList.setLoading(true);
      }

      console.log('About to call movieService.search with:', {
        query: this.currentQuery,
        page: this.currentPage
      });
      
      const result = await this.movieService.search(this.currentQuery, '', this.currentPage);
      console.log('Search result received:', result);

      if (movieList) {
        if (isNewSearch) {
          console.log('Setting movies for new search');
          movieList.setMovies(result.movies, result.hasMore);
          if (searchSpinner) {
            searchSpinner.setAttribute('visible', 'false');
          }
        } else {
          console.log('Adding movies for load more');
          movieList.addMovies(result.movies, result.hasMore);
          movieList.setLoading(false);
        }
      } else {
        console.error('MovieList component not found!');
      }
    } catch (error) {
      console.error('Search failed:', error);
      console.error('Error details:', error.message, error.stack);
      
      if (movieList) {
        if (isNewSearch) {
          movieList.setMovies([]);
          if (searchSpinner) {
            searchSpinner.setAttribute('visible', 'false');
          }
        } else {
          movieList.setLoading(false);
        }
      }
      this.showError('Search failed: ' + error.message);
    } finally {
      this.isLoading = false;
      console.log('=== searchMovies END ===');
    }
  }

  async fetchMovieDetails(movieId) {
    const modal = this.shadowRoot.querySelector('movie-modal');
    
    try {
      modal.setLoading(true);
      const movieData = await this.movieService.getMovie(movieId);
      modal.setMovieData(movieData);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      modal.hide();
      this.showError('Failed to load movie details. Please try again.');
    }
  }

  showError(message) {
    console.error('Showing error:', message);
    alert(message);
  }

  render() {
    console.log('MovieApp rendering');
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .app-container {
          min-height: 100vh;
          padding: 20px 0;
        }

        .search-spinner {
          margin: 20px 0;
          text-align: center;
        }

        .app-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        }
      </style>
      <div class="app-container">
        <div class="app-content">
          <movie-search-form></movie-search-form>
          <div class="search-spinner">
            <loading-spinner visible="false"></loading-spinner>
          </div>
          <movie-list></movie-list>
          <movie-modal></movie-modal>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    console.log('MovieApp rendered');
  }
}

customElements.define('movie-app', MovieApp);