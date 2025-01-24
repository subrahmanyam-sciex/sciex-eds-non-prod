import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  // Load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // Decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  block.append(footer);

  // Add navigation menu
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <div class='desktop-menu'>
      <div class='menu-title'>Products</div>
      <ul>
        <li><a href='https://sciex.com/products/mass-spectrometers'>Mass spectrometers</a></li>
        <li><a href='https://sciex.com/products/capillary-electrophoresis'>Capillary electrophoresis</a></li>
        <li><a href='https://sciex.com/products/software'>Software</a></li>
      </ul>
    </div>
    <div class='mobile-menu'>
      <button onclick='toggleMenu()'>
        <span>Products</span>
        <svg width='14' height='8' viewBox='0 0 14 8' fill='none'>
          <path d='M13 1L7 7L1 1' stroke='white'></path>
        </svg>
      </button>
      <ul id='mobile-menu-list'>
        <li><a href='https://sciex.com/products/mass-spectrometers'>Mass spectrometers</a></li>
        <li><a href='https://sciex.com/products/capillary-electrophoresis'>Capillary electrophoresis</a></li>
        <li><a href='https://sciex.com/products/software'>Software</a></li>
      </ul>
    </div>
  `;

  footer.prepend(nav);

  // Add toggle function for mobile menu
  window.toggleMenu = function () {
    const menu = document.getElementById('mobile-menu-list');
    menu.style.maxHeight = menu.style.maxHeight ? null : '250px';
  };
}
