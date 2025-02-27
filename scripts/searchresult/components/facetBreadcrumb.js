import { facetBreadcrumb } from '../controller/controllers.js';

const renderFacetBreadcurm = () => {
  const facetBreadcrumbElement = document.getElementById('facet-readcrumb');
  facetBreadcrumbElement.innerHTML = '';

  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.classList.add('facet-breadcrumb-container');

  const facetsId = {
    coursetypecategories: 'Course Type',
    certificatetypecategories: 'Certificate Type',
    capillaryelectrophoresiscategories: 'Capillary Electrophoresis',
    hplcandceproductscategories: 'Liquid Chromatography',
    integratedsolutionscategories: 'Integrated Solutions',
    levelcategories: 'Course level',
    massspectrometerscategories: 'Mass Spectrometers',
    softwarecategories: 'Software',
    standardsandreagentscategories: 'Standards and Reagents',
    techniquescategories: 'Techniques',
    trainingtopiccategories: 'Training Topic',
    trainingtypecategories: 'Training Type',
    assettypes: 'Asset Type',
    instrumentfamily: 'Instrument family',
    languagecountry: 'Language-country',
    language: 'Language',
    year: 'Year',
    location: 'Training Location',
    applications: 'Applications',
    technicaldocuments: 'Technical Documents',
  };

  facetBreadcrumb.state.facetBreadcrumbs.forEach((value) => {
    value.values.forEach((item) => {
      let fieldName;
      if (value.field === 'contenttype') {
        fieldName = 'Content Type';
      } else {
        fieldName = facetsId[value.field];
      }
      const gridContainer = document.createElement('div');
      gridContainer.classList.add('facet-breadcrumb');
      gridContainer.addEventListener('click', () => item.deselect());

      const gridItem1 = document.createElement('div');
      gridItem1.classList.add('grid-item');
      const box1 = document.createElement('div');
      box1.textContent = `${fieldName} : ${item.value.value}`;
      gridItem1.appendChild(box1);

      const gridItem2 = document.createElement('div');
      gridItem2.classList.add('grid-item');
      const clearIcon = document.createElement('span');
      clearIcon.innerHTML = '&#10005;';

      gridItem2.appendChild(clearIcon);
      gridContainer.appendChild(gridItem1);
      gridContainer.appendChild(gridItem2);
      breadcrumbContainer.appendChild(gridContainer);
    });
  });
  const button = document.createElement('button');
  button.style.marginRight = '0';
  button.style.marginLeft = 'auto';
  button.textContent = 'Clear All';

  button.addEventListener('click', () => {
    facetBreadcrumb.deselectAll();
  });

  if (facetBreadcrumb.state.hasBreadcrumbs) {
    facetBreadcrumbElement.style.display = 'block';
    breadcrumbContainer.appendChild(button);
  } else {
    facetBreadcrumbElement.style.display = 'none';
  }

  facetBreadcrumbElement.appendChild(breadcrumbContainer);
};

export default renderFacetBreadcurm;
