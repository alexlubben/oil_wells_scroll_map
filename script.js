// Initialize the map
const map = L.map('map', {
  center: [29.4, -89.65],
  zoom: 10,
  zoomControl: false,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  touchZoom: false,
  keyboard: false,
  attributionControl: false
});

// Create the 2020 layer (base layer)
const layer2020 = L.tileLayer('tiles/2020/{z}/{x}/{y}.png', {
  minZoom: 7,
  maxZoom: 10,
  errorTileUrl: ''
}).addTo(map);

// Create the 1932 layer (overlay layer that will fade)
const layer1932 = L.tileLayer('tiles/1932/{z}/{x}/{y}.png', {
  opacity: 1,
  minZoom: 7,
  maxZoom: 10,
  errorTileUrl: ''
}).addTo(map);

// Handle scroll step changes
function handleStepEnter(step) {
  console.log('Step entered:', step);
  
  switch(step) {
    case 1:
      console.log('Setting 1932 layer opacity to 1');
      layer1932.setOpacity(1);
      break;
    case 2:
      console.log('Setting 1932 layer opacity to 0.5');
      layer1932.setOpacity(0.5);
      break;
    case 3:
      console.log('Setting 1932 layer opacity to 0');
      layer1932.setOpacity(0);
      break;
  }
}

// Pure JavaScript scroll detection
function initScrollDetection() {
  const steps = document.querySelectorAll('.step');
  let currentStep = 0;

  function checkSteps() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight / 2; // Middle of screen

    steps.forEach((step, index) => {
      const stepTop = step.offsetTop;
      const stepBottom = stepTop + step.offsetHeight;
      
      // Check if the middle of the screen intersects with this step
      if (scrollTop + triggerPoint >= stepTop && scrollTop + triggerPoint <= stepBottom) {
        if (currentStep !== index + 1) {
          currentStep = index + 1;
          console.log('Pure JS detected step:', currentStep);
          handleStepEnter(currentStep);
        }
      }
    });
  }

  // Check on scroll
  window.addEventListener('scroll', checkSteps);
  
  // Initial check
  checkSteps();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing scroll detection');
  initScrollDetection();
});