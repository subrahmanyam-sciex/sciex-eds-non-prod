import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function handleFirstSection(child, firstSectionContent) {
  firstSectionContent.append(child);
}

function handleMiddleSections(child, block, iteration) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add(`wrapper-${iteration}`, 'footer-list');

  const nav = document.createElement('nav');
  const newContainer = document.createElement("div");
  newContainer.classList.add("image-box");
  nav.classList.add('footer-navigation');

  const sections = child.querySelectorAll('p');

  sections.forEach((section) => {
    const sectionTitle = section.textContent.trim();
    const list = section.nextElementSibling;

    if (list && list.tagName === 'UL') {
      const sectionDiv = document.createElement('div');
      sectionDiv.classList.add('footer-section');

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('footer-section-title');
      titleDiv.textContent = sectionTitle;

      const ul = document.createElement('ul');
      ul.classList.add('footer-section-list');

      list.querySelectorAll('li a').forEach((link) => {
        const li = document.createElement('li');
        li.classList.add('footer-item');

        const a = document.createElement('a');
        a.classList.add('footer-link');
        a.href = link.href;
        a.textContent = link.textContent;

        li.appendChild(a);
        ul.appendChild(li);
      });

      sectionDiv.appendChild(titleDiv);
      sectionDiv.appendChild(ul);
      nav.appendChild(sectionDiv);
    } else {
      const paragraphWithImage = section.querySelector('p > picture');
      if (paragraphWithImage) {
        newContainer.appendChild(paragraphWithImage.cloneNode(true));
      }
    }
  });
  wrapperDiv.appendChild(nav);

  const header = child.querySelector('h2');
  if (header) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('footer-heading');
    headerDiv.textContent = header.textContent;
    wrapperDiv.appendChild(headerDiv);
  }
  const hr = document.createElement('hr');
  hr.classList.add('footer-divider');
  wrapperDiv.appendChild(newContainer);
  wrapperDiv.appendChild(hr);
  block.appendChild(wrapperDiv);
}

function handleBlockSection(child, block, iteration) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add(`wrapper-${iteration}`, 'black-section');
  const uniqueId = getMetadata('pageorder');
  console.log("description....", getMetadata('pageorder'))
  wrapperDiv.append(child);
  wrapperDiv.append(uniqueId);
  block.append(wrapperDiv);
}

function handleLogoSection(child, block, iteration) {
  const pictures = child.querySelectorAll("picture");
  const links = child.querySelectorAll('a');

  const linkMap = [];
  links.forEach((link, index) => {
    linkMap[index] = link.getAttribute("href");
  });

  const ul = document.createElement("ul");
  ul.classList.add("logo-container");

  pictures.forEach((picture, index) => {
    const img = picture.querySelector("img");
    if (!img) return;

    const altText = img.getAttribute("alt") || "Logo";
    const anchor = document.createElement("a");

    anchor.href = linkMap[index] || "#";
    anchor.target = "_blank";
    anchor.setAttribute("aria-label", `${altText} Link`);
    anchor.rel = "noreferrer";
    anchor.classList.add("logo-link");

    anchor.appendChild(img);

    const li = document.createElement("li");
    li.classList.add("logo-item");
    li.appendChild(anchor);

    ul.appendChild(li);
  });

  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add(`wrapper-${iteration}`, "black-section-logo");
  wrapperDiv.append(ul);

  block.append(wrapperDiv);
}

/**
 * Creates and returns the language selector dropdown
 */
function createSocialLinks() {
  return `
  <nav>
    <ul>
      <li>
        <a href="https://www.linkedin.com/company/sciex" aria-label="LinkedIn">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3.91708 15.3333H0.825185V5.50271H3.91708V15.3333ZM2.41077 4.15496C1.45942 4.15496 0.666626 3.36217 0.666626 2.41082C0.666626 1.45947 1.45942 0.666672 2.41077 0.666672C3.36212 0.666672 4.15491 1.45947 4.15491 2.41082C4.15491 3.36217 3.36212 4.15496 2.41077 4.15496ZM15.3333 15.3333H12.2414V10.5766C12.2414 9.46667 12.2414 7.96037 10.6558 7.96037C9.07023 7.96037 8.83239 9.22883 8.83239 10.4973V15.3333H5.7405V5.50271H8.75311V6.85046H8.83239C9.22879 6.05766 10.2594 5.26487 11.6864 5.26487C14.7783 5.26487 15.3333 7.32613 15.3333 9.94235V15.3333Z" fill="currentColor"></path>
          </svg>
        </a>
      </li>
      <li>
        <a href="https://twitter.com/SCIEXnews" aria-label="Twitter">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M5.02682 14.3295C11.0345 14.3295 14.3448 9.36398 14.3448 5.07279C14.3448 4.95019 14.3448 4.76628 14.3448 4.64367C14.9579 4.15325 15.5096 3.60153 16 2.9272C15.387 3.17241 14.7739 3.35632 14.0996 3.41762C14.7739 2.9885 15.2644 2.37547 15.5096 1.57854C14.8966 1.94636 14.1609 2.25287 13.4253 2.37547C12.8123 1.76245 11.954 1.33333 11.0345 1.33333C9.2567 1.33333 7.78544 2.80459 7.78544 4.58237C7.78544 4.82758 7.78544 5.07279 7.84674 5.318C5.14943 5.2567 2.69732 3.96934 1.10345 2.00766C0.858238 2.49808 0.67433 3.0498 0.67433 3.66283C0.67433 4.82758 1.22605 5.80842 2.14559 6.36015C1.59387 6.36015 1.10345 6.17624 0.613027 5.93103C0.613027 5.93103 0.613027 5.93103 0.613027 5.99233C0.613027 7.5862 1.71648 8.87356 3.24904 9.18007C3.00383 9.24137 2.69732 9.30268 2.3908 9.30268C2.2069 9.30268 1.96169 9.30268 1.77778 9.24137C2.2069 10.5287 3.37165 11.5096 4.84291 11.5096C3.73946 12.3678 2.3295 12.9195 0.796935 12.9195C0.551724 12.9195 0.245211 12.9195 0 12.8582C1.47126 13.7778 3.18774 14.3295 5.02682 14.3295Z" fill="currentColor"></path>
          </svg>
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/SCIEXnews" aria-label="Facebook">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8.91101 15.3333V8.63047H11.1674L11.4992 6.04224H8.91101V4.38311C8.91101 3.6531 9.11011 3.12218 10.1719 3.12218H11.5656V0.799402C11.3002 0.799402 10.5038 0.666672 9.57466 0.666672C7.58371 0.666672 6.25641 1.86124 6.25641 4.11765V6.04224H4V8.63047H6.25641V15.3333H8.91101Z" fill="currentColor"></path>
          </svg>
        </a>
      </li>
      <li>
        <a href="https://instagram.com/instasciex" aria-label="Instagram">
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"></circle>
            <circle cx="12.5" cy="3.5" r="1" fill="currentColor"></circle>
            <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentColor" stroke-width="1.5"></rect>
          </svg>
        </a>
      </li>
    </ul>
  </nav>
      `;
}

function processFragment(block, fragment) {
  const firstSectionContent = document.createElement('div');
  firstSectionContent.classList.add('footer-social-links');
  firstSectionContent.innerHTML = createSocialLinks();

  Array.from(fragment.children).forEach((child, index) => {
    const iteration = index + 1;

    if (iteration === 1) {
      handleFirstSection(child, firstSectionContent);
    } else if (iteration === 2) {
      handleMiddleSections(child, block, iteration);
    } else if (iteration === 3) {
      handleBlockSection(child, block, iteration);
    } else if (iteration === 4) {
      handleLogoSection(child, block, iteration);
    }
  });

  const countrySelect = firstSectionContent.querySelector('.default-content-wrapper');
  const ul = countrySelect.querySelector('ul');
  const select = document.createElement('select');
  select.classList.add('dropdown');

  const listItems = ul.getElementsByTagName('li');
  for (let i = 0; i < listItems.length; i++) {
    const option = document.createElement('option');
    option.value = i + 1;
    option.textContent = listItems[i].textContent;
    select.appendChild(option);
  }
  ul.remove();
  countrySelect.appendChild(select);

  block.prepend(firstSectionContent);
  adjustHeaderFontSize(block);
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  processFragment(block, fragment);
}
