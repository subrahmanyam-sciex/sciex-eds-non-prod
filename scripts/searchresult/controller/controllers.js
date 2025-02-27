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
    'applications',
    'technicaldocuments'
  ];
  const controllerMap = new Map();
  facetsId.forEach((item) => {
   const controller = buildFacet(searchEngine, {
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
  const conditionForParentValues = (parentValues, allowedValues) =>
    parentValues.some(
      (value) =>
        'value' in value &&
        allowedValues.includes(value.value) &&
        value.state === 'selected'
    );

  const facetConditionsMap = {
    'massspectrometerscategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'capillaryelectrophoresiscategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'hplcandceproductscategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'integratedsolutionscategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'softwarecategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'standardsandreagentscategories': ['Products & Services', 'Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'levelcategories': ['Training'],
    'techniquescategories': ['Training'],
    'trainingtopiccategories': ['Training'],
    'trainingtypecategories': ['Training'],
    'assettypes': ['Technotes or Resource library', 'Customer Docs'],
    'instrumentfamily': ['Regulatory Docs'],
    'languagecountry': ['Regulatory Docs'],
    'language': ['Resource Library', 'Customer Docs', 'Training', 'Technotes or Resource library'],
    'year': ['Resource Library', 'Customer Docs', 'Regulatory Docs'],
    'location': ['Training'],
    'applications': ['Applications', 'Technotes or Resource library'],
    'technicaldocuments': ['Regulatory Docs'],
    'certificatetypecategories': ['Training']
  };

  const facetId = dependentFacet.state.facetId;
  const allowedValues = facetConditionsMap[facetId];

  if (!allowedValues) return;

  const facetConditionsManager = buildFacetConditionsManager(searchEngine, {
    facetId: dependentFacet.state.facetId,
    conditions: [
      {
        parentFacetId: parentFacets.state.facetId,
        condition: (parentValues) => conditionForParentValues(parentValues, allowedValues),
      },
    ],
  });

  return facetConditionsManager.stopWatching;
}