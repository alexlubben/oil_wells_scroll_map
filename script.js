const tileBounds = L.latLngBounds([28.8, -99], [29.7, -88.3]);

// Function to get appropriate zoom and center based on screen size
function getMapSettings() {
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  if (isSmallMobile) {
    return {
      center: [29.1, -89.25],
      zoom: 10,
    };
  } else if (isMobile) {
    return {
      center: [29.1, -89.25],
      zoom: 10,
    };
  } else {
    return {
      center: [29.1, -89.5],
      zoom: 10,
    };
  }
}

const mapSettings = getMapSettings();

const map = L.map('map', {
  center: mapSettings.center,
  zoom: mapSettings.zoom,
  zoomControl: false,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  touchZoom: false,
  keyboard: false,
  attributionControl: false,
  maxBounds: tileBounds,
  maxBoundsViscosity: 1.0,
  fadeAnimation: true,
  zoomAnimation: true,
  markerZoomAnimation: true,
});

const layer2020 = L.tileLayer('tiles/2020/{z}/{x}/{y}.png', {
  minZoom: 8,
  maxZoom: 14,
  bounds: tileBounds,
  errorTileUrl: '',
}).addTo(map);

const layer1932 = L.tileLayer('tiles/1932/{z}/{x}/{y}.png', {
  opacity: 1,
  minZoom: 8,
  maxZoom: 14,
  bounds: tileBounds,
  errorTileUrl: '',
}).addTo(map);

const scroller = scrollama();

function handleStepEnter(response) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('is-active'));
  response.element.classList.add('is-active');
}

function handleStepExit(response) {
  response.element.classList.remove('is-active');
}

function handleStepProgress(response) {
  const step = parseInt(response.element.dataset.step);
  const progress = response.progress;
  const totalSteps = 8;
  const overallProgress = (step - 1 + progress) / totalSteps;

  // Smoother easing function for opacity transition
  const easedProgress = 1 - Math.pow(overallProgress, 0.6);
  const opacity = Math.max(0, Math.min(1, easedProgress));

  layer1932.setOpacity(opacity);
}

scroller
  .setup({
    step: '.step',
    offset: 0.5,
    progress: true,
    debug: false,
  })
  .onStepEnter(handleStepEnter)
  .onStepExit(handleStepExit)
  .onStepProgress(handleStepProgress);

window.addEventListener('resize', function () {
  scroller.resize();

  // Update map settings on resize
  const newSettings = getMapSettings();
  map.setView(newSettings.center, newSettings.zoom);
});
