/* eslint-disable */
import {
  buildSearchBox,
  buildFacet,
  buildResultList,
  buildPager,
  buildQuerySummary,
  buildSort,
  buildInteractiveResult,
  buildBreadcrumbManager,
  buildFacetConditionsManager,
  buildCategoryFacet
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine, analyticsEngine }  from '../engine.js';

export const searchBoxController = buildSearchBox(searchEngine, {
  options: {
    numberOfSuggestions: 5,
    highlightOptions: {
      notMatchDelimiters: {
        open: '<strong>',
        close: '</strong>',
      },
      correctionDelimiters: {
        open: '<i>',
        close: '</i>',
      },
    },
  },
});

export const headlessResultsList = buildResultList(searchEngine, {
  options: {
    fieldsToInclude: ['ogimage'],
  },
});

// category facets controller
export const tagsFacetController = buildFacet(searchEngine, {
  options: { 
    numberOfValues: 5,
    field: 'coursecatalog'
  },
});

export const sourceFacetController = buildFacet(searchEngine, {
  options: { 
    numberOfValues: 5,
    field: 'contenttype' 
  },
});

export const contentTypeFacetController = buildFacet(searchEngine, {
  options: { 
    numberOfValues: 5,
    field: 'contenttype',
    facetId: 'contenttype'
  },
});

// pagination controller
export const paginationController = buildPager(searchEngine);

// query summary controller
export const querySummary = buildQuerySummary(searchEngine);

// sorting controller
export const sortController = buildSort(searchEngine, {
  initialState: {
    criterion: { by: 'relevancy' },
  },
});
// Update Sorting
export const updateSorting = (criterion) => {
  return {
    type: 'UPDATE_SORTING',  // Example action type
    payload: criterion,      // The new sorting criterion
  };
};


export const facetBreadcrumb = buildBreadcrumbManager(searchEngine)

export  function handleResultClick(results) {
  const interactiveResult = buildInteractiveResult(analyticsEngine, {
    options: {result : results}
  })
  interactiveResult.select();
}
export const allFacetController = createFacetController();

function createFacetController() {
  const facetsId = [
    'coursetypecategories',
    'capillaryelectrophoresiscategories',
    'certificatetypecategories',
    'hplcandceproductscategories',
    'integratedsolutionscategories',
    'levelcategories',
    'massspectrometerscategories',
    'softwarecategories',
    'standardsandreagentscategories',
    'techniquescategories',
    'trainingtopiccategories',
    'trainingtypecategories',
    'assettypes',
    'instrumentfamily',
    'languagecountry',
    'language',
    'year',
    'location',
    'applications'
  ];
  const controllerMap = new Map();
  facetsId.forEach((item) => {
   const controller = buildCategoryFacet(searchEngine, {
    options: { 
      numberOfValues: 5,
      field: item,
      facetId: item,
      basePath: [],
      delimitingCharacter: '|'
    },
  });
  initDependentFacet(controller, contentTypeFacetController);
  controllerMap.set(item,controller);
});
  return controllerMap;
}

function initDependentFacet(dependentFacet, parentFacets) {
  const facetConditionsManager = buildFacetConditionsManager(searchEngine, {
    facetId: dependentFacet.state.facetId,
    conditions: [
      {
        parentFacetId: parentFacets.state.facetId,
        condition: (parentValues) =>
          parentValues.some(
            (value) =>
              'value' in value &&
              (value.value === 'Products & Services' || 
                value.value === 'Training' || 
                value.value === 'Technotes or Resource library' || 
                value.value === 'Customer Docs' ||
                value.value === 'Regulatory Docs' ||
                value.value === 'Applications') &&
              value.state === 'selected'
          ),
      },
    ],
  });
  return facetConditionsManager.stopWatching;
}


