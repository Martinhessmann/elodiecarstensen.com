export const setViewportHeight = () => {
  // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const initViewportHeight = () => {
  // Set the initial value
  setViewportHeight();

  // Update the height on resize and orientation change
  window.addEventListener('resize', () => {
    // Add a small delay to ensure the toolbar has fully shown/hidden
    setTimeout(setViewportHeight, 100);
  });

  window.addEventListener('orientationchange', () => {
    // Add a small delay to ensure the orientation change is complete
    setTimeout(setViewportHeight, 100);
  });
};