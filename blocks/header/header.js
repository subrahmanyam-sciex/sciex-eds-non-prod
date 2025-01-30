import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'mega-menu';
  nav.className = 'tw tw-z-99';

  const parentDiv = document.createElement('div');
  parentDiv.className = 'tw-hidden lg:tw-flex tw-w-full tw-bg-white tw-relative tw-z-[100]';
  const container = document.createElement('div');
  container.className = 'tw-container ';

  const border = document.createElement('div');
  border.className = 'tw-border-b  tw-flex tw-items-center desktop-links ';
  const ul = document.createElement('ul');
  ul.className = 'tw-list-none tw-inline-flex stretch-text tw-text-grey-900';

  const elements = fragment.querySelector('ul').children;
  Array.from(elements).forEach((element) => {
    element.className = 'tw-py-20 tw-border-b-2 tw-border-white tw-ml-24';
    element.firstChild.className = 'tw-flex tw-items-center tw-group hover:tw-text-blue-700 tw-transition-colors';
    const svg = '<span class="tw-ml-6"><svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M13 1L7 7L1 0.999999" stroke="currentColor"></path></svg></span>';
    if (element.firstChild) {
      element.firstChild.insertAdjacentHTML('beforeend', svg);
    }
    ul.append(element);
  });
  border.append(ul);

  container.append(border);
  parentDiv.append(container);
  nav.append(parentDiv);
  block.append(nav);
}
