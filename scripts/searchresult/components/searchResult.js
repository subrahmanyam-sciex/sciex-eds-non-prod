import { headlessResultsList, handleResultClick } from '../controller/controllers.js';

const renderSearchResults = () => {
  const resultsElement = document.getElementById('coveo-results');
  const noResultsElement = document.getElementById('coveo-no-results');
  const querySortElement = document.getElementsByClassName('query-sort-section')[0];
  resultsElement.innerHTML = '';

  const results = headlessResultsList.state.results || [];
  const selectElement = document.getElementById('sort-element');
  const selectedValue = selectElement.value;
  const selectedCriterion = JSON.parse(selectedValue);
  let sortedResults;
  if (selectedCriterion.by === 'relevancy') {
    sortedResults = results;
  } else if (selectedCriterion.by === 'field' && selectedCriterion.field === 'title') {
    sortedResults = [...results].sort((a, b) => a.title.localeCompare(b.title));
  } else if (selectedCriterion.by === 'indexeddate') {
    sortedResults = [...results].sort((a, b) => {
      const dateA = new Date(a.indexeddate);
      const dateB = new Date(b.indexeddate);
      return dateB - dateA;
    });
  } else {
    sortedResults = results; // No sorting
  }

  if (sortedResults.length > 0) {
    noResultsElement.style.display = 'none';
    querySortElement.style.display = '';
    sortedResults.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
          <div class="item-details"> 
            <h3>${result.title || 'No Title Available'}</h3>
            <p>${result.Excerpt || 'No description available.'}</p>
            <p class="source-type">${result.raw.source}</p>
            ${result.raw.ogimage
    ? `<img src="${result.raw.ogimage}" alt="ogimage" width="200" height="200">`
    : ''}
          </div>
          <a class="view-details-btn" href="${result.printableUri}">View</a>
        `;

      const viewDetailsBtn = resultItem.querySelector('.view-details-btn');
      viewDetailsBtn.addEventListener('click', () => {
        handleResultClick(result);
      });

      resultsElement.appendChild(resultItem);
    });
  } else {
    const divElement = document.getElementById('noresults-text1');
    // Access the data attribute 'data-example' using dataset
    const { text1 } = divElement.dataset;
    const inputText = document.getElementById('coveo-query').value;
    if (inputText.trim() !== '') {
      const updatedtext1 = `${text1} "${inputText}"`;
      document.getElementById('noresults-text1').innerText = updatedtext1;
    }
    noResultsElement.style.display = '';
    querySortElement.style.display = 'none';
  }
};

export default renderSearchResults;
