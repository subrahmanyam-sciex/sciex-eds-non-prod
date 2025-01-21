export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.innerHTML = 'Hello World!';
  block.textContent = '';
  block.append(ul);
}
