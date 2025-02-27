/* eslint-disable */
import {contentTypeFacetController, allFacetController } from "../controller/controllers.js";

function facetAccordion(values, facetElement, facetItemsContainer) {
  if (values.length !== 0) {
    facetElement.appendChild(facetItemsContainer);

    const facetHeader = facetElement.querySelector(".facet-header");
    facetHeader.setAttribute("aria-expanded", "false");

    facetHeader.addEventListener("click", () => {
      const isVisible = facetItemsContainer.style.display === "none";
      const icon = facetHeader.querySelector("span");
      facetItemsContainer.style.display = isVisible ? "flex" : "none";
      icon.innerHTML = isVisible
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11L8 5L14 11" stroke="#0068FA"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 5L8 11L2 5" stroke="#0068FA"/></svg>';

      facetHeader.setAttribute("aria-expanded", !isVisible);
    });
  } else {
    facetElement.innerHTML = "";
  }
}

function createToggleButtons(facetItemsContainer, facetController) {
  const buttonContainer = document.createElement("div"); // Container for buttons
  buttonContainer.classList.add("facet-toggle-buttons"); // Optional class for styling

  const buttons = {
    showMore: createButton("Show More", "show-more-btn", () =>
      toggleValues(true)
    ),
    showLess: createButton("Show Less", "show-less-btn", () =>
      toggleValues(false)
    ),
  };

  function createButton(text, className, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", onClick);
    const icon = document.createElement("span");
    const svg =
      className === "show-more-btn"
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/><path d="M6 0L6 12" stroke="#0068FA"/></svg>'
        : ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M0 6L12 6" stroke="#0068FA"/></svg>';
    icon.innerHTML = svg;
    button.appendChild(icon);
    return button;
  }

  function toggleValues(isShowMore) {
    // Toggle the visibility of the buttons
    buttons.showMore.style.display = isShowMore ? "none" : "inline";
    buttons.showLess.style.display = isShowMore ? "inline" : "none";
    isShowMore
      ? facetController.showMoreValues()
      : facetController.showLessValues();
  }

  // Append buttons to the container
  buttonContainer.appendChild(buttons.showMore);
  buttonContainer.appendChild(buttons.showLess);

  // Add the container to the facetItemsContainer
  facetItemsContainer.appendChild(buttonContainer);

  // Initially hide/show the buttons based on the controller's state
  if (facetController.state.canShowMoreValues) {
    buttons.showMore.style.display = "flex";
  } else {
    buttons.showMore.style.display = "none";
  }

  if (facetController.state.canShowLessValues) {
    buttons.showLess.style.display = "flex";
  } else {
    buttons.showLess.style.display = "none";
  }
}

function renderFacet(facetElementId, facetController, headerText) {

  const facetId = facetController.state.facetId;

  const facetElement = document.getElementById(facetElementId);

  let facetInputElement = null;
  if(facetId == 'massspectrometerscategories' || facetId == 'softwarecategories' ||  facetId =='language' || facetId =='instrumentfamily'){
    let element= document.getElementById(facetId+'-input');
    facetInputElement = element;
  }

  facetElement.innerHTML = `<h3 class="facet-header tw-text-gray-800 tw-text-lg tw-mb-2 tw-pb-1">${headerText}
  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M2 11L8 5L14 11" stroke="#0068FA"/>
</svg></span>
  </h3>`;

  if(facetId == 'massspectrometerscategories' || facetId == 'softwarecategories' ||  facetId =='language' || facetId =='instrumentfamily'){
    const facetInput = document.createElement('input');
    facetInput.type = 'text';
    facetInput.id = facetId+'-input';
    facetInput.classList.add(
      'tw-border',
      'tw-p-2',
      'tw-rounded-lg',
      'tw-mt-2',
      'facet-search-box',
    );
    facetInput.placeholder = 'Search....';

    facetInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();
      if (query.length > 0) {
        facetController.facetSearch.updateText(query);
        facetController.facetSearch.search();
      }
    });

    facetInput.addEventListener('focus', () => {
      sessionStorage.setItem('focusedElement', facetId+'-input');
    });

    facetInput.addEventListener('focusout', () => {
      sessionStorage.removeItem('focusedElement');
    });

    if(facetInputElement == null){
      facetElement.appendChild(facetInput);
    }else {
      facetElement.appendChild(facetInputElement);
      const focusedElementId = sessionStorage.getItem('focusedElement');
      const focusElement = document.getElementById(focusedElementId);
      if(focusElement){
        focusElement.focus();
      }
    }
  }

  const { values } = facetController.state;
  const facetItemsContainer = document.createElement("div");
  facetItemsContainer.className = "facet-items-container";
  if(values.length){
    facetElement.style.borderBottom = '1px solid #ececec'
  }
  values.forEach((value) => {
    const facetItem = document.createElement("div");
    facetItem.className = "facet-item tw-flex tw-items-center tw-gap-2 tw-py-1";
    facetItem.innerHTML = `
      <input type="checkbox" id="${value.value}" ${
      value.state === "selected" ? "checked" : ""
    } class="tw-accent-blue-500 tw-w-4 tw-h-4">
      <label for="${value.value}">${value.value} (${
      value.numberOfResults
    })</label>
    `;

    facetItem.querySelector("input").addEventListener("change", () => {
      facetController.toggleSelect(value);
    });

    facetItemsContainer.appendChild(facetItem);
  });

  facetAccordion(values, facetElement, facetItemsContainer);
  createToggleButtons(facetItemsContainer, facetController);
}

function createFacetRender(facetController, facetElementId, headerText) {
  let isValues = false;
  const { values } = facetController.state;
  if(values.length > 0) {
    isValues = true;
  }
  if(facetElementId.indexOf('product')!=-1) {
    let startIndex = facetElementId.indexOf("product") + "product".length;
    facetElementId  = facetElementId.substring(startIndex,facetElementId.length)
  }
  if(facetElementId.indexOf('course')!=-1) {
    let startIndex = facetElementId.indexOf("course") + "course".length;
    facetElementId  = facetElementId.substring(startIndex,facetElementId.length);
  }
  const id= facetElementId+"-facet";
  const ele= document.getElementById( id);
  if(ele !== null && !isValues) {
    ele.remove();
  }
  createFacetDiv(facetElementId);
  renderFacet(id, facetController, headerText); 
}

function createFacetDiv(id) {
  const ele= document.getElementById( id+'-facet');
  const facetsElement = document.getElementById('facets');
  if(ele == null) {
    const mainFacetDiv = document.createElement('div');
    mainFacetDiv.id = id+'-facet';
    facetsElement.appendChild(mainFacetDiv);
  } 
}

export function callCreateFacet(){
  createFacetRender(contentTypeFacetController, "contenttype-facet", "Content Type");
  const facetController = allFacetController;
  const facetsId = {
    'coursetypecategories':'Course Type',
    'certificatetypecategories':'Certificate Type',
    'capillaryelectrophoresiscategories':'Capillary Electrophoresis',
    'hplcandceproductscategories':'Liquid Chromatography',
    'integratedsolutionscategories':'Integrated Solutions',
    'levelcategories':'Course level',
    'massspectrometerscategories':'Mass Spectrometers',
    'softwarecategories':'Software',
    'standardsandreagentscategories':'Standards and Reagents',
    'techniquescategories':'Techniques',
    'trainingtopiccategories':'Training Topic',
    'trainingtypecategories':'Training Type',
    'assettypes': 'Asset Type',
    'instrumentfamily': 'Instrument family',
    'languagecountry': 'Language-country',
    'language' : 'Language',
    'year': 'Year',
    'location': 'Training Location',
    'applications': 'Applications',
    'technicaldocuments': 'Technical Documents',
    'instrumentfamily': 'Instrument Family'
  };

  for (let item in facetsId) {
    const val = facetController.get(item);
    if(val){
      createFacetRender(val,item,facetsId[item]);
    }
  };

}

/** ********
     *
     *
     *
      function to handle mobile actions
     *
     *
     *
     *  */
export const handleMobileFilters = () => {
  const facets = document.querySelector("#facets");
  const mobileFilterHeader = document.querySelector("#mobile-filter-header");
  if (facets) {
    facets.style.display =
      facets.style.display === "" || facets.style.display === "none"
        ? "block"
        : "none";
  }
  if (mobileFilterHeader) {
    if (mobileFilterHeader.classList.contains("tw-hidden")) {
      mobileFilterHeader.classList.remove("tw-hidden");
    } else {
      mobileFilterHeader.classList.add("tw-hidden");
    }
  }
};