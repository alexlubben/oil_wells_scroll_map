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

    const TOTAL_STEPS = 8;
    let touchStartY = null;
    let listenersActive = false;

    function handleStepEnter(response) {
      document.querySelectorAll('.step').forEach(s => s.classList.remove('is-active'));
      response.element.classList.add('is-active');

      const stepNum = parseInt(response.element.dataset.step, 10);
      if (stepNum === TOTAL_STEPS) {
        addExitListeners();
      } else {
        removeExitListeners();
      }
    }

    function handleStepExit(response) {
      response.element.classList.remove('is-active');

      const stepNum = parseInt(response.element.dataset.step, 10);
      if (stepNum === TOTAL_STEPS) {
        removeExitListeners();
      }
    }

    function handleStepProgress(response) {
      const step = parseInt(response.element.dataset.step);
      const progress = response.progress;
      const overallProgress = (step - 1 + progress) / TOTAL_STEPS;

      // Smoother easing function for opacity transition
      const easedProgress = 1 - Math.pow(overallProgress, 0.6);
      const opacity = Math.max(0, Math.min(1, easedProgress));

      layer1932.setOpacity(opacity);
    }

    function addExitListeners() {
      if (listenersActive) return;
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      listenersActive = true;
    }

    function removeExitListeners() {
      if (!listenersActive) return;
      document.removeEventListener('wheel', handleWheel, { passive: false });
      document.removeEventListener('touchstart', handleTouchStart, { passive: false });
      document.removeEventListener('touchmove', handleTouchMove, { passive: false });
      document.removeEventListener('touchend', handleTouchEnd, { passive: false });
      listenersActive = false;
      touchStartY = null;
    }

    function handleWheel(e) {
      if (e.deltaY > 0) {
        e.preventDefault();
        sendParentScroll('down');
        removeExitListeners();
      }
    }

    function handleTouchStart(e) {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    }

    function handleTouchMove(e) {
      if (touchStartY === null) return;
      const currentY = e.touches[0].clientY;
      if (touchStartY - currentY > 0) {
        e.preventDefault();
        sendParentScroll('down');
        removeExitListeners();
      }
    }

    function handleTouchEnd() {
      touchStartY = null;
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