export class MovieService {
  constructor() {
    this.apiKey = '72bf51d2';
    this.baseUrl = 'https://www.omdbapi.com/';
  }

  async search(title, type = '', page = 1) {
    console.log('=== MovieService.search START ===');
    try {
      console.log('MovieService.search called with:', { title, type, page });
      const params = new URLSearchParams({
        apikey: this.apiKey,
        s: title,
        page: page.toString()
      });

      if (type) {
        params.append('type', type);
      }

      const url = `${this.baseUrl}?${params}`;
      console.log('Making request to:', url);
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      console.log('Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('API response:', data);

      if (data.Response === 'True') {
        const result = {
          movies: data.Search,
          totalResults: parseInt(data.totalResults),
          hasMore: page * 10 < parseInt(data.totalResults)
        };
        console.log('Returning successful result:', result);
        return result;
      } else {
        console.error('API returned error:', data.Error);
        throw new Error(data.Error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error stack:', error.stack);
      throw error;
    } finally {
      console.log('=== MovieService.search END ===');
    }
  }

  async getMovie(movieId) {
    try {
      const params = new URLSearchParams({
        apikey: this.apiKey,
        i: movieId,
        plot: 'full'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (data.Response === 'True') {
        return data;
      } else {
        throw new Error(data.Error || 'Movie not found');
      }
    } catch (error) {
      console.error('Get movie error:', error);
      throw error;
    }
  }
}