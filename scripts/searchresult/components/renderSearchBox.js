import { searchBoxController } from '../controller/controllers.js';

const renderSearchBox = () => {
  const queryInput = document.getElementById('coveo-query');
  const suggestionPopup = document.getElementById('suggestion-popup');
  const coveoResults = document.getElementById('coveo-results');
  const searchTermValue = document.getElementById('searchTermValue');
  const searchTermContainer = document.getElementById('searchTermContainer');
  searchTermContainer.style.display = 'none';

  const showSuggestions = () => {
    const searchBox = document.getElementById('coveo-query');
    const suggestions = searchBoxController.state.suggestions || [];

    const rect = searchBox.getBoundingClientRect();
    suggestionPopup.style.top = `${rect.bottom + window.scrollY}px`;
    suggestionPopup.style.left = `${rect.left + window.scrollX}px`;

    if (suggestions.length > 0) {
      suggestionPopup.innerHTML = suggestions
        .map((suggestion) => `<div class="suggestion-item" style="padding: 8px; cursor: pointer;" data-raw-value="${suggestion.rawValue}">
            ${suggestion.highlightedValue}
          </div>`)
        .join('');
      suggestionPopup.style.display = 'block';
    } else {
      suggestionPopup.style.display = 'none';
    }
  };

  const showResults = () => {
    coveoResults.style.display = 'block';
    suggestionPopup.style.display = 'none';
    coveoResults.innerHTML = '<h3>Search Results go here...</h3>';
  };

  queryInput.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length > 0) {
      searchBoxController.updateText(query);
      searchBoxController.showSuggestions();
      showSuggestions();
    } else {
      searchBoxController.updateText('');
      suggestionPopup.style.display = 'none';
    }
  });

  queryInput.addEventListener('input', () => {
    if (searchBoxController.state.value === '') {
      searchBoxController.clear();
      searchBoxController.submit();
    }
  });

  queryInput.addEventListener('keydown', (event) => {
    searchTermValue.innerHTML = '';
    searchTermValue.innerHTML = event.target.value;
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      searchTermContainer.style.display = 'block';
      searchBoxController.submit();
      showResults();
    }
    if (event.key === 'Backspace') {
      searchTermContainer.style.display = 'none';
    }
  });

  document.addEventListener('click', (event) => {
    if (!document.querySelector('.coveo-search-component').contains(event.target)) {
      suggestionPopup.style.display = 'none';
    }
  });
};
export default renderSearchBox;
