document.addEventListener('DOMContentLoaded', () => {
    const startupScreen = document.getElementById('startup-screen');
    const startupSound = document.getElementById('startup-sound');
    const startButton = document.getElementById('start-btn');
    const loadingBarContainer = document.querySelector('.loading-bar-container');
    const loadingBar = document.querySelector('.loading-bar');
    const totalDuration = 4000;
    const fadeOutDuration = 700;

    // Hide the loading bar container initially
    if (loadingBarContainer) {
        loadingBarContainer.style.display = 'none';
    }

    if (!startupScreen || !startButton || !startupSound || !loadingBar) {
        console.error("Missing startup elements!");
        return;
    }

    startButton.addEventListener('click', () => {
        // Play the startup sound
        startupSound.play().catch(err => {
            console.warn("Startup sound failed to play:", err);
        });

        startButton.disabled = true;

        // Show and animate loading bar
        loadingBarContainer.style.display = 'block';
        loadingBar.style.animation = 'load 3.5s linear forwards';

        // Fade out startup screen
        setTimeout(() => {
            startupScreen.style.opacity = '0';
            setTimeout(() => {
                startupScreen.style.display = 'none';
            }, fadeOutDuration);
        }, totalDuration);
    });
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

        if(minimizeButton) minimizeButton.addEventListener('click', (e) => {
             e.stopPropagation();
             console.log('Minimize clicked (not implemented)')
        });
        if(maximizeButton) maximizeButton.addEventListener('click', (e) => {
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

     document.addEventListener('mouseleave', () => {
       if (activeDragTarget && event.relatedTarget === null) {
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


    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    if (startButton && startMenu) {
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = startMenu.style.display === 'block';
            startMenu.style.display = isVisible ? 'none' : 'block';
             if (!isVisible) {
                 bringToFront(startMenu); 
             }
        });

        document.addEventListener('click', (e) => {
            if (startMenu.style.display === 'block' && !startMenu.contains(e.target) && e.target !== startButton) {
                startMenu.style.display = 'none';
            }
        });

        const menuItemsToOpenWindows = startMenu.querySelectorAll('li[data-opens-window]');
        menuItemsToOpenWindows.forEach(item => {
            item.addEventListener('click', () => {
                const windowSelector = item.getAttribute('data-opens-window');
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
                    console.warn(`Menu item clicked, but window with selector "${windowSelector}" not found.`);
                }
                startMenu.style.display = 'none';
            });
        });

        const shutdownButton = document.getElementById('shutdown-button');
        if (shutdownButton) {
            shutdownButton.addEventListener('click', () => {
                alert('Shut Down clicked! (Functionality not implemented)');
                startMenu.style.display = 'none';
            });
        }

         startMenu.querySelectorAll('li:not([data-opens-window]):not(.separator):not(#shutdown-button)').forEach(item => {
            item.addEventListener('click', (e) => {
                 const spanElement = item.querySelector('span');
                 const text = spanElement ? spanElement.textContent.trim().split(/[\s\n(]/)[0] : '';
                 if (text) {
                    alert(`${text} clicked! (Functionality not implemented)`);
                    startMenu.style.display = 'none';
                 } else {
                     console.log("Clicked an item without specific action:", item);
                 }
            });
         });

    } else {
        console.error("Start button or start menu element not found!");
    }


    const images = [
        "/assets/ChatGPT Image Apr 29, 2025, 02_15_10 PM.png",
        "/assets/ChatGPT Image Apr 29, 2025, 01_49_49 AM.png",
        "/assets/ChatGPT Image Apr 29, 2025, 02_16_54 PM.png",
    ];
    let currentIndex = 0;
    const galleryImageElement = document.getElementById("gallery-image");
    const nextButton = document.getElementById("next-image-button");
    const prevButton = document.getElementById("prev-image-button");

    function showImage(index) {
        if (galleryImageElement && images.length > 0) {
             currentIndex = (index + images.length) % images.length; 
             galleryImageElement.src = images[currentIndex];
        }
    }

    if (nextButton && prevButton && galleryImageElement) {
        nextButton.addEventListener('click', () => {
            showImage(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            showImage(currentIndex - 1);
        });

        
        showImage(0);
    } else {
         console.warn("Gallery elements (image or buttons) not found.");
    }



document.addEventListener('DOMContentLoaded', () => {
    const startupScreen = document.getElementById('startup-screen');
    const startupSound = document.getElementById('startup-sound');
    const totalDuration = 4000;
    const fadeOutDuration = 700;

    // --- STARTUP LOGIC (Keep As Is) ---
    if (startupScreen) {
        if (startupSound) {
            startupSound.play().catch(error => {
                console.warn("Startup sound autoplay failed:", error);
            });
        }
        setTimeout(() => {
            startupScreen.style.opacity = '0';
            setTimeout(() => {
                startupScreen.style.display = 'none';
            }, fadeOutDuration);
        }, totalDuration);
    } else {
        console.error("Startup screen element not found!");
    }
    // --- END STARTUP LOGIC ---


    let highestZIndex = 1000;
    let activeDragTarget = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    const windows = document.querySelectorAll('.win95-window');
    const icons = document.querySelectorAll('.desktop-icon[data-opens-window]');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const taskbarAppsContainer = document.getElementById('taskbar-apps'); // Get the new container

    // --- Taskbar Button Management ---
    function createTaskbarButton(windowElement) {
        if (!windowElement || !taskbarAppsContainer) return;
        const windowId = windowElement.id;
        if (!windowId || taskbarAppsContainer.querySelector(`[data-window-id="${windowId}"]`)) {
            return; // Don't create if no ID or button already exists
        }

        const button = document.createElement('button');
        button.className = 'taskbar-app-button';
        button.dataset.windowId = windowId; // Link button to window ID

        // Try to get icon and text
        const titleBarText = windowElement.querySelector('.title-bar-text');
        let iconSrc = '';
        // Find the desktop icon that opens this window to get its image src
        const correspondingIcon = document.querySelector(`.desktop-icon[data-opens-window="#${windowId}"] img`);
         if (correspondingIcon) {
             iconSrc = correspondingIcon.src;
         } else {
             // Fallback: Find icon from start menu if possible
             const startMenuItem = document.querySelector(`#start-menu li[data-opens-window="#${windowId}"] img`);
             if (startMenuItem) {
                 iconSrc = startMenuItem.src;
             }
         }


        if (iconSrc) {
            const img = document.createElement('img');
            img.src = iconSrc;
            img.alt = ''; // Decorative
            button.appendChild(img);
        }
        button.appendChild(document.createTextNode(titleBarText ? titleBarText.textContent : windowId));

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetWindow = document.getElementById(windowId);
            if (targetWindow) {
                // If clicking the active window's button, minimize (basic toggle)
                // More complex minimize/restore would need state tracking
                if (button.classList.contains('active')) {
                     targetWindow.style.display = 'none';
                     // Remove active state, but don't remove button
                     setActiveTaskbarButton(null); // Deselect all
                } else {
                    targetWindow.style.display = 'flex'; // Ensure visible
                    setActiveWindow(targetWindow); // Bring to front and set active
                }
            }
        });

        taskbarAppsContainer.appendChild(button);
        return button;
    }

    function removeTaskbarButton(windowId) {
        if (!taskbarAppsContainer || !windowId) return;
        const button = taskbarAppsContainer.querySelector(`[data-window-id="${windowId}"]`);
        if (button) {
            button.remove();
        }
    }

    function setActiveTaskbarButton(windowId) {
        if (!taskbarAppsContainer) return;
        const buttons = taskbarAppsContainer.querySelectorAll('.taskbar-app-button');
        buttons.forEach(btn => {
            if (btn.dataset.windowId === windowId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Window Activation Logic ---
    function setActiveWindow(windowElement) {
        if (!windowElement) {
             setActiveTaskbarButton(null); // No window, no active button
             return;
         }
        highestZIndex++;
        windowElement.style.zIndex = highestZIndex;
        setActiveTaskbarButton(windowElement.id); // Set corresponding taskbar button active
    }

    // --- Window Opening Function (Refactored) ---
    function openWindow(windowId) {
        const windowToOpen = document.getElementById(windowId);
        if (!windowToOpen) {
            console.warn(`Window with ID "${windowId}" not found.`);
            return;
        }

        // Make visible and position (only set position if opening for the first time?)
        // For simplicity, we'll always re-center/position when opened via icon/menu
         if (windowToOpen.style.display !== 'flex') { // Only reposition if hidden
            const windowWidth = windowToOpen.offsetWidth || 450; // Use default if not rendered yet
            const windowHeight = windowToOpen.offsetHeight || 300;
            const viewWidth = window.innerWidth;
            const viewHeight = window.innerHeight;
            const taskbarHeight = taskbarAppsContainer?.parentElement?.offsetHeight || 30;
            const menuBarHeight = document.querySelector('.win95-menu-bar')?.offsetHeight || 25;
            const availableHeight = viewHeight - taskbarHeight - menuBarHeight;

            let centeredLeft = Math.max(0, (viewWidth - windowWidth) / 2);
            let centeredTop = Math.max(menuBarHeight + 5, menuBarHeight + (availableHeight - windowHeight) / 2);

            windowToOpen.style.left = `${centeredLeft}px`;
            windowToOpen.style.top = `${centeredTop}px`;
        }
        windowToOpen.style.display = 'flex';


        // Create taskbar button if it doesn't exist
        createTaskbarButton(windowToOpen);

        // Bring to front and set active
        setActiveWindow(windowToOpen);
    }


    // --- Event Listeners ---

    // Window Dragging (Add setActiveWindow on grab)
    windows.forEach(windowElement => {
        const titleBar = windowElement.querySelector('.title-bar');
        const closeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Close"]');

        if (!titleBar || !closeButton) {
             console.warn(`Window missing essential elements:`, windowElement);
             return;
        }

         if (window.getComputedStyle(windowElement).position === 'static') {
            windowElement.style.position = 'absolute';
        }


        titleBar.addEventListener('mousedown', (e) => {
            if (e.target === titleBar || e.target.classList.contains('title-bar-text')) {
                activeDragTarget = windowElement;
                dragOffsetX = e.clientX - activeDragTarget.offsetLeft;
                dragOffsetY = e.clientY - activeDragTarget.offsetTop;
                activeDragTarget.style.cursor = 'grabbing';
                activeDragTarget.style.opacity = '0.9';
                setActiveWindow(activeDragTarget); // Set active when starting drag
                e.preventDefault();
            }
        });

        // Set active when clicking anywhere on the window
        windowElement.addEventListener('mousedown', () => {
            setActiveWindow(windowElement);
        }, true); // Use capture phase to ensure it runs before drag logic potentially stops propagation


        // Close Button (Add removeTaskbarButton)
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            windowElement.style.display = 'none';
            removeTaskbarButton(windowElement.id); // Remove button when closed
            // Optionally activate the next available window
            let nextActiveWindow = null;
            let maxZ = 0;
            windows.forEach(win => {
                if(win !== windowElement && win.style.display === 'flex') {
                     const z = parseInt(win.style.zIndex || '0');
                     if (z > maxZ) {
                         maxZ = z;
                         nextActiveWindow = win;
                     }
                }
            });
            setActiveWindow(nextActiveWindow); // Activate the next top-most window or null

        });

        // Minimize/Maximize (Just log for now, ensure they don't break activation)
         const minimizeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Minimize"]');
         const maximizeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Maximize"]');
         if(minimizeButton) minimizeButton.addEventListener('click', (e) => {
              e.stopPropagation();
              console.log('Minimize clicked (not implemented)')
         });
         if(maximizeButton) maximizeButton.addEventListener('click', (e) => {
             e.stopPropagation();
             console.log('Maximize clicked (not implemented)')
         });

    }); // End windows.forEach

    // Document Mouse Move/Up (Keep As Is)
    document.addEventListener('mousemove', (e) => {
        if (activeDragTarget) {
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;
            // Boundary checks (keep as is or adjust if needed)
             const taskbarHeight = taskbarAppsContainer?.parentElement?.offsetHeight || 30;
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
     document.addEventListener('mouseleave', (event) => { // Check if mouse left window entirely
       if (activeDragTarget && !event.relatedTarget) { // relatedTarget is null when leaving the viewport
            activeDragTarget.style.cursor = '';
            activeDragTarget.style.opacity = '1';
            activeDragTarget = null;
       }
    });


    // Desktop Icon Clicks (Use openWindow function)
    icons.forEach(icon => {
        const windowId = icon.getAttribute('data-opens-window').substring(1); // Remove #
        const action = () => openWindow(windowId);

        icon.addEventListener('click', action);
        icon.addEventListener('dblclick', action);
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                action();
            }
        });
    });

    // Start Menu (Keep Toggle Logic As Is)
    if (startButton && startMenu) {
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = startMenu.style.display === 'block';
            startMenu.style.display = isVisible ? 'none' : 'block';
             if (!isVisible) {
                // Make sure start menu has a high enough z-index, but below active windows
                 startMenu.style.zIndex = highestZIndex + 1;
             }
        });
        document.addEventListener('click', (e) => {
            if (startMenu.style.display === 'block' && !startMenu.contains(e.target) && e.target !== startButton) {
                startMenu.style.display = 'none';
            }
        });

        // Start Menu Item Clicks (Use openWindow function)
        const menuItemsToOpenWindows = startMenu.querySelectorAll('li[data-opens-window]');
        menuItemsToOpenWindows.forEach(item => {
            const windowId = item.getAttribute('data-opens-window').substring(1); // Remove #
            item.addEventListener('click', () => {
                openWindow(windowId);
                startMenu.style.display = 'none'; // Close menu after click
            });
        });

        // Other Start Menu Items (Keep As Is)
        const shutdownButton = document.getElementById('shutdown-button');
        if (shutdownButton) {
            shutdownButton.addEventListener('click', () => {
                alert('Shut Down clicked! (Functionality not implemented)');
                startMenu.style.display = 'none';
            });
        }
         startMenu.querySelectorAll('li:not([data-opens-window]):not(.separator):not(#shutdown-button)').forEach(item => {
            item.addEventListener('click', (e) => {
                 const spanElement = item.querySelector('span');
                 const text = spanElement ? spanElement.textContent.trim().split(/[\s\n(]/)[0] : '';
                 if (text) {
                    alert(`${text} clicked! (Functionality not implemented)`);
                    startMenu.style.display = 'none';
                 }
            });
         });
    } else {
        console.error("Start button or start menu element not found!");
    }


    // Image Gallery (Keep As Is or Refactor if needed)
    const images = [
        "/assets/ChatGPT Image Apr 29, 2025, 02_15_10 PM.png",
        "/assets/ChatGPT Image Apr 29, 2025, 01_49_49 AM.png",
        "/assets/ChatGPT Image Apr 29, 2025, 02_16_54 PM.png",
    ];
    let currentIndex = 0;
    const galleryImageElement = document.getElementById("gallery-image");
    const nextButton = document.getElementById("next-image-button");
    const prevButton = document.getElementById("prev-image-button");

    function showImage(index) {
        if (galleryImageElement && images.length > 0) {
             currentIndex = (index + images.length) % images.length;
             galleryImageElement.src = images[currentIndex];
        }
    }

    if (nextButton && prevButton && galleryImageElement) {
        nextButton.addEventListener('click', () => showImage(currentIndex + 1));
        prevButton.addEventListener('click', () => showImage(currentIndex - 1));
        showImage(0);
    } else if (document.getElementById('art-window')) { 
         console.warn("Gallery elements (image or buttons) not found inside #art-window.");
    }

});