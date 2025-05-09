document.addEventListener('DOMContentLoaded', () => {
    const startupScreen = document.getElementById('startup-screen');
    const startupSound = document.getElementById('startup-sound');
    const startButton = document.getElementById('start-btn');
    const loadingBarContainer = document.querySelector('.loading-bar-container');
    const loadingBar = document.querySelector('.loading-bar');
    const totalDuration = 4000;
    const fadeOutDuration = 700;
  
    if (loadingBarContainer) {
      loadingBarContainer.style.display = 'none';
    }
  
    if (!startupScreen || !startButton || !startupSound || !loadingBar) {
      console.error("Missing startup elements!");
      return;
    }
  
    startButton.addEventListener('click', () => {
  
      startupSound.play().catch(err => {
        console.warn("Startup sound failed to play:", err);
      });
  
      startButton.disabled = true;
  
  
      loadingBarContainer.style.display = 'block';
      loadingBar.style.animation = 'load 3.5s linear forwards';
  
  
      setTimeout(() => {
        startupScreen.style.opacity = '0';
        setTimeout(() => {
          startupScreen.style.display = 'none';
        }, fadeOutDuration);
      }, totalDuration);
    });
  
    let highestZIndex = 1000;
    let activeDragTarget = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
  
    function bringToFront(element) {
      highestZIndex++;
      element.style.zIndex = highestZIndex;
    }
  
    const windows = document.querySelectorAll('.win95-window');
  
    windows.forEach(windowElement => {
      const titleBar = windowElement.querySelector('.title-bar');
      const closeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Close"]');
      const minimizeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Minimize"]');
      const maximizeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Maximize"]');
  
      if (!titleBar || !closeButton) {
        console.warn(`Window element missing title bar or close button:`, windowElement);
        return;
      }
  
      if (window.getComputedStyle(windowElement).position === 'static') {
        console.warn(`Window element #${windowElement.id || 'undefined'} needs 'position: absolute' or 'position: fixed' in CSS.`);
        windowElement.style.position = 'absolute';
      }
  
      titleBar.addEventListener('mousedown', (e) => {
        if (e.target === titleBar || e.target.classList.contains('title-bar-text')) {
          activeDragTarget = windowElement;
          dragOffsetX = e.clientX - activeDragTarget.offsetLeft;
          dragOffsetY = e.clientY - activeDragTarget.offsetTop;
  
          activeDragTarget.style.cursor = 'grabbing';
          activeDragTarget.style.opacity = '0.9';
          bringToFront(activeDragTarget);
          e.preventDefault();
        }
      });
  
      windowElement.addEventListener('mousedown', () => {
        bringToFront(windowElement);
      }, true);
  
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        windowElement.style.display = 'none';
      });
  
      if (minimizeButton) minimizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Minimize clicked (not implemented)')
      });
      if (maximizeButton) maximizeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Maximize clicked (not implemented)')
      });
    });
  
    document.addEventListener('mousemove', (e) => {
      if (activeDragTarget) {
        let newX = e.clientX - dragOffsetX;
        let newY = e.clientY - dragOffsetY;
  
        const taskbarHeight = document.querySelector('.win95-taskbar')?.offsetHeight || 30;
        const menuBarHeight = document.querySelector('.win95-menu-bar')?.offsetHeight || 25;
        const windowWidth = activeDragTarget.offsetWidth;
        const windowHeight = activeDragTarget.offsetHeight;
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
  
        newX = Math.max(0, Math.min(newX, viewWidth - windowWidth));
        newY = Math.max(menuBarHeight, Math.min(newY, viewHeight - windowHeight - taskbarHeight));
  
  
        activeDragTarget.style.left = `${newX}px`;
        activeDragTarget.style.top = `${newY}px`;
      }
    });
  
    document.addEventListener('mouseup', () => {
      if (activeDragTarget) {
        activeDragTarget.style.cursor = '';
        activeDragTarget.style.opacity = '1';
        activeDragTarget = null;
      }
    });
  
    document.addEventListener('mouseleave', (event) => {
      if (activeDragTarget && !event.relatedTarget) {
        activeDragTarget.style.cursor = '';
        activeDragTarget.style.opacity = '1';
        activeDragTarget = null;
      }
    });
  
  
    const icons = document.querySelectorAll('.desktop-icon[data-opens-window]');
  
    icons.forEach(icon => {
      const openWindowAction = () => {
        const windowSelector = icon.getAttribute('data-opens-window');
        const windowToOpen = document.querySelector(windowSelector);
  
        if (windowToOpen) {
          windowToOpen.style.display = 'flex';
  
          const windowWidth = windowToOpen.offsetWidth;
          const windowHeight = windowToOpen.offsetHeight;
          const viewWidth = window.innerWidth;
          const viewHeight = window.innerHeight;
          const taskbarHeight = document.querySelector('.win95-taskbar')?.offsetHeight || 30;
          const menuBarHeight = document.querySelector('.win95-menu-bar')?.offsetHeight || 25;
          const availableHeight = viewHeight - taskbarHeight - menuBarHeight;
  
          let centeredLeft = Math.max(0, (viewWidth - windowWidth) / 2);
          let centeredTop = Math.max(menuBarHeight + 5, menuBarHeight + (availableHeight - windowHeight) / 2);
  
          windowToOpen.style.left = `${centeredLeft}px`;
          windowToOpen.style.top = `${centeredTop}px`;
  
          bringToFront(windowToOpen);
        } else {
          console.warn(`Icon clicked, but window with selector "${windowSelector}" not found.`);
        }
      };
  
      icon.addEventListener('click', openWindowAction);
      icon.addEventListener('dblclick', openWindowAction);
  
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          openWindowAction();
        }
      });
    });
  
    const audio = document.getElementById("mouseclick");
    document.addEventListener('mousedown', function(event) {
      if (event.button === 0) {
        audio.currentTime = 0;
        audio.play();
      }
    });
  
  });

  document.addEventListener('DOMContentLoaded', function() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    skillProgressBars.forEach(bar => {
        const level = bar.dataset.level;
        bar.style.width = level + '%';
    });
});