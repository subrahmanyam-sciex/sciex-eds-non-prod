import {
  div, span, ul, li,
} from '../../scripts/dom-builder.js';

function createMainHeader(section) {
  const menuDiv = div({ class: 'tw-flex tw-w-full tw-bg-grey-900 tw-text-grey-300 tw-z-[100] tw-relative' });
  const containerDiv = div({ class: 'tw-flex tw-container' });
  const parentdiv = div({ class: 'tw-hidden lg:tw-block lg:tw-absolute lg:tw-top-0 lg:tw-right-0 tw-h-64' });
  const ulTag = ul({ class: 'tw-list-none tw-flex tw-items-stretch tw-text-sm tw-h-full' });
  const headerDiv = section.querySelector('.header');
  Array.from(headerDiv.children).forEach((child, index) => {
    const picture = child.querySelector('picture');
    // const img = picture ? picture.querySelector('img') : null;
    const anchorTag = child.querySelector('a');
    if (index === 0) {
      anchorTag.text = '';
      anchorTag.className = 'tw-py-16';
      // anchorTag.target = '_blank';
      anchorTag.appendChild(picture);
      containerDiv.appendChild(anchorTag);
    } else if (headerDiv.children.length !== index + 1) {
      const liTag = li({ class: 'tw-ml-16 tw-flex tw-items-center hover:tw-text-white tw-transition-colors' });
      anchorTag.className = 'tw-inline-flex tw-items-center';
      // anchorTag.target = '_blank';
      if (picture) {
        picture.className = 'tw-mr-8';
        anchorTag.prepend(picture);
      }
      liTag.append(anchorTag);
      ulTag.append(liTag);
    } else {
      const liTag = li({ class: 'tw-ml-32' });
      anchorTag.className = 'tw-text-mobBase md:tw-text-base tw-flex tw-items-center tw-whitespace-nowrap focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-blue-700 tw-rounded tw-border tw-py-12 tw-px-16 md:tw-px-20 active:tw-bg-blue-900 tw-border-blue-700 tw-text-white tw-bg-gradient-to-r tw-bg-blue-700 tw-from-blue-800 tw-via-blue-800 tw-to-blue-800 tw-bg-bottom tw-bg-no-repeat tw-bg-[length:100%_0px] hover:tw-bg-[length:100%_100%] tw-transition-all tw-h-full tw-rounded-none lg:tw-px-32';
      anchorTag.target = '_blank';
      const buttondiv = div({ class: 'tw-flex tw-items-center tw-justify-between' }, span(anchorTag.text));
      anchorTag.text = '';
      anchorTag.append(buttondiv);
      liTag.append(anchorTag);
      ulTag.append(liTag);
    }
  });
  parentdiv.append(ulTag);
  containerDiv.appendChild(parentdiv);
  menuDiv.append(containerDiv);
  return menuDiv;
}

function createMegaMenuTopNav(section) {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'tw-hidden lg:tw-flex tw-w-full tw-bg-white tw-relative tw-z-[100]';
  const container = document.createElement('div');
  container.className = 'tw-container ';

  const border = document.createElement('div');
  border.className = 'tw-border-b  tw-flex tw-items-center desktop-links ';
  const ulTag = document.createElement('ul');
  ulTag.className = 'tw-list-none tw-inline-flex stretch-text tw-text-grey-900';

  const elements = section.querySelector('ul').children;
  Array.from(elements).forEach((element) => {
    element.className = 'tw-py-20 tw-border-b-2 tw-border-white tw-ml-24';
    element.firstChild.className = 'tw-flex tw-items-center tw-group hover:tw-text-blue-700 tw-transition-colors';
    const svg = '<span class="tw-ml-6"><svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M13 1L7 7L1 0.999999" stroke="currentColor"></path></svg></span>';
    if (element.firstChild) {
      element.firstChild.insertAdjacentHTML('beforeend', svg);
    }
    ulTag.append(element);
  });
  border.append(ulTag);
  container.append(border);
  parentDiv.append(container);
  return parentDiv;
}

/**
* Processes and appends the sections to the header block
*/
function processHtml(block, main) {
  const parentDiv = div({ class: 'tw' });
  const nav = document.createElement('nav');
  nav.id = 'mega-menu';
  nav.className = 'tw tw-z-99';
  Array.from(main.children).forEach((section, index) => {
    const iteration = index + 1;
    if (iteration === 1) {
      nav.append(createMainHeader(section));
    } else if (iteration === 2) {
      nav.append(createMegaMenuTopNav(section));
    } else {
      // handleBlockSection(child, block, iteration);
    }
  });

  parentDiv.append(nav);
  block.prepend(parentDiv);
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const resp = await fetch('/nav.plain.html');

  if (resp.ok) {
    const html = await resp.text();
    const main = document.createElement('main');
    main.innerHTML = html;
    processHtml(block, main);
  }
}
