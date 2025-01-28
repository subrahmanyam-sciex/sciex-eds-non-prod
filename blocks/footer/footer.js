import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  let iteration = 0;
  let firstSectionContent = document.createElement('div');
  firstSectionContent.classList.add('footer-banner');

  while (fragment.firstElementChild) {
    iteration += 1;
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add(`wrapper-${iteration}`);

    if (iteration === 1) {
      firstSectionContent.append(fragment.firstElementChild);
      continue;
    } else if (iteration === 2) {
      wrapperDiv.classList.add('footer-list');
    } else {
      wrapperDiv.classList.add('black-section');
    }

    wrapperDiv.append(fragment.firstElementChild);
    block.append(wrapperDiv);

    if (iteration === 3) {
      const hr = document.createElement('hr');
      hr.classList.add('footer-divider');
      block.insertBefore(hr, wrapperDiv);
    }
  }

  block.prepend(firstSectionContent);

  const h2 = block.querySelector('.wrapper-2 h2');
  if (h2) {
    h2.style.fontSize = '145px';
  }
}
