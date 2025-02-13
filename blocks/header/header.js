import {
  div, span, ul, li, a, p,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';

const menuLinks = {};
function createMainHeader(section) {
  const menuDiv = div({ class: 'tw-flex tw-w-full tw-bg-grey-900 tw-text-grey-300 tw-z-[100] tw-relative' });
  const containerDiv = div({ class: 'tw-flex tw-container' });
  const parentdiv = div({ class: 'tw-hidden lg:tw-block lg:tw-absolute lg:tw-top-0 lg:tw-right-0 tw-h-64' });
  const ulTag = ul({ class: 'tw-list-none tw-flex tw-items-stretch tw-text-sm tw-h-full' });
  const headerDiv = section.querySelector('.header');
  Array.from(headerDiv.children).forEach((child, index) => {
    const picture = child.querySelector('picture');
    const anchorTag = child.querySelector('a');
    if (index === 0) {
      anchorTag.text = '';
      anchorTag.className = 'tw-py-16';
      // anchorTag.target = '_blank';
      anchorTag.appendChild(picture);
      containerDiv.appendChild(anchorTag);
    } else if (headerDiv.children.length !== index + 1) {
      const liTag = li({ class: 'tw-ml-16 tw-flex tw-items-center hover:tw-text-white tw-transition-colors' });
      const liId = anchorTag.text;
      liTag.id = liId.replace(/ /g, '-').toLowerCase();
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
function hideAllActiveDivs() {
  const maninNavliList = document.querySelectorAll('.mainmenu-ul li');
  Array.from(maninNavliList).forEach((ele) => {
    ele.classList.remove('menu-active');
  });
  const activediv = document.querySelector('div .secondnav-active');
  if (activediv) {
    activediv.classList.remove('secondnav-active');
    const liList = activediv.querySelectorAll('ul li');
    Array.from(liList).forEach((elem) => {
      if (elem.querySelector('a .submenu-active') && elem.querySelector('a .submenu-active') === 'submenu-active') {
        elem.querySelector('a').classList.remove('submenu-active');
      }
    });
    activediv.style.display = 'none';
  }
  document.getElementById('menu-button').style.display = 'none';
  document.getElementById('menu-overlay').style.display = 'none';
}

function createMegaMenuTopNav(section) {
  const parentDiv = document.createElement('div');
  parentDiv.className = 'tw-hidden lg:tw-flex tw-w-full tw-bg-white tw-relative tw-z-[100]';
  const container = document.createElement('div');
  container.className = 'tw-container ';

  const border = document.createElement('div');
  border.className = 'tw-border-b  tw-flex tw-items-center desktop-links ';
  const ulTag = document.createElement('ul');
  ulTag.className = 'mainmenu-ul tw-list-none tw-inline-flex stretch-text tw-text-grey-900';

  const elements = section.querySelector('ul').children;
  Array.from(elements).forEach((element) => {
    element.className = 'tw-py-20 tw-border-b-2 tw-border-white tw-ml-24';
    element.id = element.firstChild.text.replace(/ /g, '-');
    element.firstChild.className = 'tw-flex tw-items-center tw-group hover:tw-text-blue-700 tw-transition-colors';
    const svg = '<span class="tw-ml-6"><svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M13 1L7 7L1 0.999999" stroke="currentColor"></path></svg></span>';
    if (element.firstChild) {
      element.firstChild.insertAdjacentHTML('beforeend', svg);
    }
    ulTag.append(element);
    element.addEventListener('click', (event) => {
      const menuId = event.currentTarget.id;

      const overlayDiv = document.getElementById('menu-overlay');
      const buttoniv = document.getElementById('menu-button');
      if (menuLinks[menuId] && menuLinks[menuId].length > 0) {
        const firstLi = menuLinks[menuId][0].firstElementChild.text;
        if (firstLi) {
          const className = firstLi.trim().replace(/ /g, '-').toLowerCase();
          const myDiv = document.getElementById(`submenu-${className}`);
          if (myDiv && myDiv.style.display === 'none') {
            hideAllActiveDivs();
            // showing current active div
            event.currentTarget.classList.add('menu-active');
            myDiv.querySelector('ul li a').classList.add('submenu-active');
            myDiv.classList.add('secondnav-active');
            myDiv.style.display = '';
            // showing ovelay and button
            overlayDiv.style.display = '';
            buttoniv.style.display = '';
          } else {
            hideAllActiveDivs();
          }
        }
      } else {
        const myDiv = document.getElementById(`submenu-${menuId.toLowerCase()}`);
        if (myDiv && myDiv.style.display === 'none') {
          hideAllActiveDivs();
          event.currentTarget.classList.add('menu-active');
          myDiv.classList.add('secondnav-active');
          myDiv.style.display = '';
          // showing ovelay and button
          overlayDiv.style.display = '';
          buttoniv.style.display = '';
        } else {
          hideAllActiveDivs();
        }
      }
    });
  });
  border.append(ulTag);
  container.append(border);
  parentDiv.append(container);
  return parentDiv;
}

function createMegaMenuSubNav(child) {
  // Select all section headings (e.g., "Products", "Applications", etc.)
  const sections = child.querySelectorAll('p');
  sections.forEach((section) => {
    const sectionTitle = section.textContent.trim().replace(/ /g, '-');
    const list = section.nextElementSibling;
    const subMenuLinks = [];
    list.querySelectorAll('ul > li').forEach((childMenuItem) => {
      subMenuLinks.push(childMenuItem);
    });
    menuLinks[sectionTitle] = subMenuLinks;
  });
}

function createSubMenuItems(section, containerDiv, firstpartdiv) {
  const sectionTitle = section.textContent.trim();
  if (sectionTitle.includes('|')) {
    const nameArray = sectionTitle.split('|');
    const productTitle = nameArray[0].trim().replace(/ /g, '-');
    const subNavClass = nameArray[1].trim().replace(/ /g, '-').toLowerCase();
    const secondLevelList = menuLinks[productTitle];
    // First part preparation
    const ulTag = document.createElement('ul');
    const anchorTag = document.createElement('a');
    ulTag.className = `${subNavClass}-ul`;
    containerDiv.id = `submenu-${subNavClass}`;
    if (secondLevelList) {
      Array.from(secondLevelList).forEach((element) => {
        const liEle = document.createElement('li');
        if (element.firstChild) {
          const litext = element.firstChild.text;
          if (litext.includes('#view-all#')) {
            anchorTag.href = element.firstChild.href;
            anchorTag.className = 'tw-mt-32 tw-transition tw-duration-300 tw-group tw-flex tw-font-bold tw-items-center tw-text-blue-700 hover:tw-text-blue-800';
            const anchDiv = div({ class: 'tw-text-mobBase md:tw-text-base tw-relative tw-overflow-hidden tw-pb-2' });
            const textArray = litext.split('#');
            const lastValue = textArray[textArray.length - 1];
            anchDiv.textContent = lastValue;
            const spanTag = span({ class: 'ttw-absolute tw-left-0 tw-bottom-0 tw-block tw-w-full group-hover:tw-left-[100%] tw-transition-all tw-duration-500 tw-h-1 tw-bg-blue-700 hover:tw-bg-blue-800 ' });
            anchDiv.appendChild(spanTag);
            const arrowSvg = span({ class: 'icon icon-arrow tw-transition-all tw-duration-500 tw-block tw-ml-8 tw-mb-4 group-hover:tw-ml-12' });
            anchorTag.append(anchDiv);
            anchorTag.appendChild(arrowSvg);
          } else {
            const liClass = litext.trim().replace(/ /g, '-').toLowerCase();
            liEle.className = liClass;
            liEle.append(a(
              {
                class: 'tw-relative submenu tw-font-light tw-text-lg tw-text-grey-900 tw-flex tw-items-center tw-justify-between tw-w-full tw-group hover:tw-text-blue-700 tw-transition-all tw-duration-200',
                title: subNavClass,
                href: '#',
              },
              span({ class: 'tw-mr-3' }, `${element.firstChild.text}`),
            ));
            ulTag.append(liEle);
          }
        }
        liEle.addEventListener('click', (event) => {
          const liClassName = event.currentTarget.className;
          const myDiv = document.getElementById(`submenu-${liClassName}`);
          if (myDiv && myDiv.style.display === 'none') {
            // hiding current div
            const activediv = document.querySelector('div .secondnav-active');
            activediv.querySelector('ul li a').classList.remove('submenu-active');
            activediv.classList.remove('secondnav-active');
            activediv.style.display = 'none';
            // showing selected div
            const liList = myDiv.querySelectorAll('ul li');
            Array.from(liList).forEach((ele) => {
              if (ele.className === liClassName) {
                ele.querySelector('a').classList.add('submenu-active');
              }
            });
            myDiv.classList.add('secondnav-active');
            myDiv.style.display = '';
          } else {
            hideAllActiveDivs();
          }
        });
      });
      firstpartdiv.append(ulTag);
      firstpartdiv.append(anchorTag);
    }
  }
}

function createViewallTag(list, viewAllTag) {
  Array.from(list).forEach((element) => {
    if (element.textContent.includes('#view-all#')) {
      viewAllTag.href = element.href;
      viewAllTag.className = 'tw-mt-32 tw-transition tw-duration-300 tw-group tw-flex tw-font-bold tw-items-center tw-text-blue-700 hover:tw-text-blue-800';
      const anchDiv = div({ class: 'tw-text-mobBase md:tw-text-base tw-relative tw-overflow-hidden tw-pb-2' });
      const textArray = element.textContent.split('#');
      const lastValue = textArray[textArray.length - 1];
      anchDiv.textContent = lastValue;
      const spanTag = span({ class: 'ttw-absolute tw-left-0 tw-bottom-0 tw-block tw-w-full group-hover:tw-left-[100%] tw-transition-all tw-duration-500 tw-h-1 tw-bg-blue-700 hover:tw-bg-blue-800 ' });
      anchDiv.appendChild(spanTag);
      const arrowSvg = span({ class: 'icon icon-arrow tw-transition-all tw-duration-500 tw-block tw-ml-8 tw-mb-4 group-hover:tw-ml-12' });
      viewAllTag.append(anchDiv);
      viewAllTag.appendChild(arrowSvg);
    }
  });
}

function createMegaMenuThirdLevel(child) {
  const parentDiv = div({ class: 'tw-w-full tw-bg-white tw-relative tw-z-[100]' });
  const containerDiv = document.createElement('div');
  containerDiv.className = 'submenu-container tw-hidden lg:tw-flex tw-container tw-pt-32 tw-pb-40 tw-columns-12';
  containerDiv.style.display = 'none';
  const sections = child.querySelectorAll('p');
  const isImages = child.querySelectorAll('img');
  let isSubItems = true;
  if (sections.length > 0 && !sections[0].textContent.includes('|')) {
    isSubItems = false;
  }

  // First part preparation
  const firstpartdiv = div({ class: 'tw-w-3/12 tw-border-r tw-relative tw-pr-24' });

  const secondPartdiv = div({ class: 'tw-w-6/12 tw-px-32 tw-pr-40 tw-border-r' });
  const wrapdiv = div({ class: 'tw-flex tw-flex-wrap tw-h-fit' });
  const viewAllTag = document.createElement('a');

  const thirdPartdiv = div({ class: 'tw-w-3/12 tw-pl-32' });
  if (sections.length > 0 && isImages.length > 0) {
    sections.forEach((section, index) => {
      if (index === 0) {
        createSubMenuItems(section, containerDiv, firstpartdiv);
      } else {
        const list = section.querySelectorAll('a');
        if (list.length > 0 && section.querySelector('strong')) {
          const listDiv = div({ class: 'lg:tw-w-full xl:tw-w-1/2 tw-pr-48 ' });
          if (index > 2) {
            listDiv.classList.add('tw-mt-24');
          }
          Array.from(list).forEach((element, ind) => {
            element.className = 'tw-group';
            const spanTag = span({ class: 'tw-text-mobBase md:tw-text-base tw-text-grey-500 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ' }, element.text);
            if (ind === 0) {
              spanTag.classList.add('tw-font-bold');
              spanTag.classList.replace('tw-text-grey-500', 'tw-text-grey-900');
            }
            element.text = '';
            element.append(spanTag);
            const chevronRight = span({ class: 'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2' });
            spanTag.append(chevronRight);
            listDiv.append(element);
          });
          wrapdiv.append(listDiv);
        } else {
          const img = section.querySelector('img');
          const listDiv = div({ class: '' });
          if (img != null) {
            const picDiv = div({ class: 'tw-relative tw-overflow-hidden tw-pt-[56.25%]' });
            img.className = 'tw-transition-all tw-duration-500 tw-absolute tw-inset-0 tw-top-0 tw-left-0 tw-w-full tw-h-full tw-object-cover hover:tw-scale-[1.05]';
            picDiv.append(img);
            listDiv.append(picDiv);
            thirdPartdiv.append(listDiv);
          }
          if (section.previousElementSibling.querySelector('picture')) {
            const anchTag = section.querySelector('a');
            if (anchTag) {
              const spanTag = span({ class: 'tw-block tw-pt-16 tw-text-grey-900 tw-font-bold tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-colors' }, anchTag.text);
              const chevronRight = span({ class: 'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2' });
              spanTag.append(chevronRight);
              anchTag.text = '';
              anchTag.append(spanTag);
              const pTag = section.nextElementSibling;
              pTag.className = 'tw-mt-2 tw-text-grey-500 tw-text-sm tw-mb-0';
              anchTag.append(pTag);
              listDiv.append(anchTag);
              thirdPartdiv.append(listDiv);
              thirdPartdiv.append(document.createElement('br'));
            }
          } else {
            createViewallTag(list, viewAllTag);
          }
        }
      }
    });
  } else if (sections.length > 0 && isSubItems) {
    secondPartdiv.className = 'tw-w-9/12 tw-px-32 tw-pr-40';
    wrapdiv.className = 'tw-flex tw-flex-wrap tw-h-fit';
    sections.forEach((section, index) => {
      if (index === 0) {
        createSubMenuItems(section, containerDiv, firstpartdiv);
      } else {
        const list = section.querySelectorAll('a');
        if (list.length > 0 && section.querySelector('strong')) {
          const listDiv = div({ class: 'tw-w-1/2 xl:tw-w-1/3 tw-pr-48 ' });
          if (index > 3) {
            listDiv.classList.add('tw-mt-24');
          }
          Array.from(list).forEach((element, ind) => {
            element.className = 'tw-group';
            const spanTag = span({ class: 'tw-text-mobBase md:tw-text-base tw-text-grey-500 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ' }, element.text);
            if (ind === 0) {
              spanTag.classList.add('tw-font-bold');
              spanTag.classList.replace('tw-text-grey-500', 'tw-text-grey-900');
            }
            element.text = '';
            element.append(spanTag);
            const chevronRight = span({ class: 'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2' });
            spanTag.append(chevronRight);
            listDiv.append(element);
          });
          wrapdiv.append(listDiv);
        } else {
          createViewallTag(list, viewAllTag);
        }
      }
    });
  } else if (sections.length > 0) {
    parentDiv.className = 'tw-w-full tw-bg-white tw-relative tw-z-[100] tw-pt-32 tw-pb-40';
    parentDiv.style.display = 'none';
    containerDiv.style.display = '';
    containerDiv.className = 'tw-hidden tw-container lg:tw-flex  tw-columns-12';
    wrapdiv.className = 'tw-w-full tw-pr-40 tw-flex tw-flex-wrap';
    secondPartdiv.className = 'tw-flex tw-flex-wrap tw-h-fit';
    sections.forEach((section, index) => {
      if (index === 0) {
        const sectionTitle = section.textContent.trim().toLowerCase();
        parentDiv.id = `submenu-${sectionTitle}`;
      } else {
        const list = section.querySelectorAll('a');
        const listDiv = div({ class: 'tw-w-1/4 tw-pr-48 ' });
        if (index > 4) {
          listDiv.classList.add('tw-mt-24');
        }
        if (list.length === 1 && !list[0].innerText.includes('#view-all#')) {
          const anchorTag = list[0];
          anchorTag.className = 'tw-group';
          const spanTag = span({ class: 'tw-font-bold tw-text-mobBase md:tw-text-base tw-text-grey-900 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ' }, anchorTag.text);
          anchorTag.text = '';
          anchorTag.append(spanTag);
          const chevronRight = span({ class: 'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2' });
          spanTag.append(chevronRight);
          const { childNodes } = section;
          let decription = '';
          childNodes.forEach((element) => {
            if (element.nodeName === '#text') decription = element.nodeValue;
          });
          const ptag = p({ class: 'tw-text-grey-500 tw-text-sm tw-mt-2 tw-mb-0' }, decription);
          anchorTag.appendChild(ptag);
          listDiv.append(anchorTag);
          wrapdiv.append(listDiv);
        } else if (list.length > 0 && section.querySelector('strong')) {
          Array.from(list).forEach((element, ind) => {
            element.className = 'tw-group';
            const spanTag = span({ class: 'tw-text-mobBase md:tw-text-base tw-text-grey-500 tw-flex tw-items-center group-hover:tw-text-blue-700 tw-transition-all tw-duration-200 ' }, element.text);
            if (ind === 0) {
              spanTag.classList.add('tw-font-bold');
              spanTag.classList.replace('tw-text-grey-500', 'tw-text-grey-900');
            }
            element.text = '';
            element.append(spanTag);
            const chevronRight = span({ class: 'icon icon-chevron-right tw-ml-8 tw-duration-500 group-hover:tw-pl-2' });
            spanTag.append(chevronRight);
            listDiv.append(element);
          });
          wrapdiv.append(listDiv);
        } else {
          createViewallTag(list, viewAllTag);
        }
      }
    });
  }
  secondPartdiv.append(wrapdiv);
  secondPartdiv.appendChild(viewAllTag);
  if (isSubItems) {
    containerDiv.appendChild(firstpartdiv);
  }
  containerDiv.appendChild(secondPartdiv);
  if (isImages.length > 0) {
    containerDiv.appendChild(thirdPartdiv);
  }
  parentDiv.append(containerDiv);
  return parentDiv;
}

function createOverlay(nav) {
  const overlayDiv = div({ class: 'tw-hidden lg:tw-block tw-fixed tw-inset-0 tw-bg-black tw-opacity-60 tw-z-50' });
  overlayDiv.id = 'menu-overlay';
  overlayDiv.style.display = 'none';
  const buttondiv = document.createElement('button');
  buttondiv.className = 'tw-hidden lg:tw-block tw-flex tw-w-32 tw-h-32 tw-rounded-full tw-mx-auto tw-bg-gray-900/30 hover:tw-bg-gray-900/40 tw-transition tw-relative tw-z-[100] tw-mt-24 tw-cursor-pointer';
  buttondiv.id = 'menu-button';
  const chevronUp = span({ class: 'icon icon-chevron-up tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full' });
  buttondiv.append(chevronUp);
  buttondiv.style.display = 'none';
  nav.appendChild(buttondiv);
  nav.appendChild(overlayDiv);
  overlayDiv.addEventListener('click', () => {
    hideAllActiveDivs();
  });
  buttondiv.addEventListener('click', () => {
    hideAllActiveDivs();
  });
}

/**
* Processes and appends the sections to the header block
*/
function processHtml(block, main) {
  const parentDiv = div({ class: 'tw' });
  const nav = document.createElement('nav');
  nav.id = 'mega-menu';
  nav.className = 'tw tw-z-99';
  const sections = main.children;
  Array.from(sections).forEach((section, index, array) => {
    const iteration = index + 1;
    if (iteration === 1) {
      nav.append(createMainHeader(section));
    } else if (iteration === 2) {
      nav.append(createMegaMenuTopNav(section));
    } else if (iteration === 3) {
      createMegaMenuSubNav(section);
    } else {
      nav.appendChild(createMegaMenuThirdLevel(section));
      if (iteration === array.length) {
        createOverlay(nav);
      }
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
  decorateIcons(block);

  async function getUserDetails() {
    try {
      const response = await fetch('/bin/sciex/currentuserdetails', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  // Conditionally shwoing the login/logout links
  const userData = await getUserDetails();
  if (userData && userData.loggedIn) {
    document.getElementById('view-profile').style.display = '';
    document.getElementById('logout').style.display = '';
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'none';
  } else {
    document.getElementById('view-profile').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
    document.getElementById('register').style.display = '';
    document.getElementById('login').style.display = '';
  }
}
