/**
 * Loads CSS for a block
 * @param {string} blockName - The name of the block
 */
function loadCSS(blockName) {
  const cssPath = `/blocks/${blockName}/${blockName}.css`;
  if (!document.querySelector(`link[href="${cssPath}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }
}

/**
 * Decorates a block by loading its JS and CSS
 * @param {Element} block - The block element to decorate
 */
async function decorateBlock(block) {
  const blockName = block.classList[0];
  if (!blockName) return;

  // Load CSS
  loadCSS(blockName);

  // Load and execute JS
  try {
    const mod = await import(`/blocks/${blockName}/${blockName}.js`);
    if (mod.default) {
      await mod.default(block);
    }
  } catch (error) {
    console.error(`Failed to load block: ${blockName}`, error);
  }
}

/**
 * Decorates all blocks on the page
 */
async function decorateBlocks() {
  const blocks = document.querySelectorAll('main > div > div[class]');
  for (const block of blocks) {
    await decorateBlock(block);
  }
}

/**
 * Initialize the page
 */
async function init() {
  // Decorate all blocks
  await decorateBlocks();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add current year to footer if footer exists
  const footer = document.querySelector('footer');
  if (footer && !footer.textContent.includes('©')) {
    const year = new Date().getFullYear();
    const copyright = document.createElement('p');
    copyright.textContent = `© ${year} Alexander Saar`;
    footer.appendChild(copyright);
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}