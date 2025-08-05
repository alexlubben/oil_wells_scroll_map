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

// Handle continuous scroll progress
let targetOpacity = 1;
let currentOpacity = 1;
let rafId = null;

function updateOpacity() {
  currentOpacity += (targetOpacity - currentOpacity) * 0.1;
  layer1932.setOpacity(currentOpacity);

  if (Math.abs(targetOpacity - currentOpacity) > 0.01) {
    rafId = requestAnimationFrame(updateOpacity);
  } else {
    currentOpacity = targetOpacity;
    layer1932.setOpacity(currentOpacity);
    rafId = null;
  }
}

function handleScrollProgress(progress) {
  targetOpacity = 1 - Math.max(0, Math.min(1, progress));
  if (!rafId) {
    rafId = requestAnimationFrame(updateOpacity);
  }
}

// Pure JavaScript scroll detection
function initScrollDetection() {
  const steps = Array.from(document.querySelectorAll('.step'));
  const stepOffsets = steps.map(step => step.offsetTop);

  function calculateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const center = scrollTop + windowHeight / 2;

    let progress = 0;

    for (let i = 0; i < stepOffsets.length - 1; i++) {
      const start = stepOffsets[i];
      const end = stepOffsets[i + 1];
      if (center >= start && center < end) {
        const localProgress = (center - start) / (end - start);
        progress = (i + localProgress) / (stepOffsets.length - 1);
        break;
      }
    }

    if (center >= stepOffsets[stepOffsets.length - 1]) {
      progress = 1;
    }

    handleScrollProgress(progress);
  }

  window.addEventListener('scroll', calculateProgress);

  // Initial calculation
  calculateProgress();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing scroll detection');
  initScrollDetection();
});
