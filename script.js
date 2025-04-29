document.addEventListener('DOMContentLoaded', () => {
    const windowElement = document.querySelector('.win95-window');
    if (!windowElement) return; 

    const titleBar = windowElement.querySelector('.title-bar');
    const closeButton = windowElement.querySelector('.title-bar-controls button[aria-label="Close"]');

    if (!titleBar || !closeButton) return; 
    let isDragging = false;
    let offsetX, offsetY; 

    // --- Make the window draggable ---

    titleBar.addEventListener('mousedown', (e) => {
        
        if (e.target === titleBar || e.target.classList.contains('title-bar-text')) {
            isDragging = true;

            
            offsetX = e.clientX - windowElement.offsetLeft;
            offsetY = e.clientY - windowElement.offsetTop;

            
            windowElement.style.cursor = 'grabbing'; 
            windowElement.style.opacity = '0.9';     
            windowElement.style.zIndex = '1000';     

            
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            windowElement.style.left = `${newX}px`;
            windowElement.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            
            windowElement.style.cursor = 'default'; 
            windowElement.style.opacity = '1';      
        }
    });

   
     document.addEventListener('mouseleave', () => {
         if (isDragging) {
             isDragging = false;
             windowElement.style.cursor = 'default';
             windowElement.style.opacity = '1';
         }
     });


    

    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); 
        windowElement.style.display = 'none'; 
    });

    
     if (window.getComputedStyle(windowElement).position === 'static') {
         console.warn("Window element needs 'position: absolute' or 'position: fixed' in CSS for dragging to work correctly.");
         windowElement.style.position = 'absolute'; 
     }

}); 

document.addEventListener('DOMContentLoaded', () => {

    
    let highestZIndex = 999; 

    function bringToFront(element) {
        highestZIndex++;
        element.style.zIndex = highestZIndex;
        console.log(`Bringing ${element.id || 'window'} to front, z-index: ${highestZIndex}`);
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
            console.warn(`Window element #${windowElement.id} needs 'position: absolute' or 'position: fixed' in CSS.`);
            windowElement.style.position = 'absolute'; 
         }

        let isDragging = false;
        let offsetX, offsetY;

        // -- Make Window Draggable --
        titleBar.addEventListener('mousedown', (e) => {
           
            if (e.target === titleBar || e.target.classList.contains('title-bar-text')) {
                isDragging = true;
                offsetX = e.clientX - windowElement.offsetLeft;
                offsetY = e.clientY - windowElement.offsetTop;

                windowElement.style.cursor = 'grabbing';
                windowElement.style.opacity = '0.9';
                bringToFront(windowElement); 

                e.preventDefault();
            }
        });

        
        windowElement.addEventListener('mousedown', () => {
             bringToFront(windowElement);
        }, true); 


        // -- Make Window Closable --
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation(); 
            windowElement.style.display = 'none'; 
        });

       
        if(minimizeButton) minimizeButton.addEventListener('click', () => console.log('Minimize clicked (not implemented)'));
        if(maximizeButton) maximizeButton.addEventListener('click', () => console.log('Maximize clicked (not implemented)'));

    }); 

    
    let currentlyDraggedWindow = null;

    document.addEventListener('mousemove', (e) => {
        
        currentlyDraggedWindow = null;
        windows.forEach(win => {
            
        });
        
    });
    
    let activeDragTarget = null; 
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    windows.forEach(windowElement => {
        const titleBar = windowElement.querySelector('.title-bar');
        if (!titleBar) return;

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
    });

    document.addEventListener('mousemove', (e) => {
        if (activeDragTarget) { 
            let newX = e.clientX - dragOffsetX;
            let newY = e.clientY - dragOffsetY;

            


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
         if (activeDragTarget) {
            activeDragTarget.style.cursor = '';
            activeDragTarget.style.opacity = '1';
            activeDragTarget = null;
         }
     });


    // --- Icon Click Setup ---
    const icons = document.querySelectorAll('.desktop-icon[data-opens-window]');

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const windowSelector = icon.getAttribute('data-opens-window');
            const windowToOpen = document.querySelector(windowSelector);

            if (windowToOpen) {
               
                windowToOpen.style.display = 'flex';

                // Center the window
                const windowWidth = windowToOpen.offsetWidth;
                const windowHeight = windowToOpen.offsetHeight;
                
                const viewWidth = window.innerWidth;
                const viewHeight = window.innerHeight;

                let centeredLeft = Math.max(0, (viewWidth - windowWidth) / 2);
                let centeredTop = Math.max(10, (viewHeight - windowHeight) / 2); 

                windowToOpen.style.left = `${centeredLeft}px`;
                windowToOpen.style.top = `${centeredTop}px`;

               
                bringToFront(windowToOpen);

            } else {
                console.warn(`Icon clicked, but window with selector "${windowSelector}" not found.`);
            }
        });

        
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                 icon.click(); 
            }
        });
    });

}); 
 
const images = [
    "/assets/ChatGPT Image Apr 29, 2025, 02_15_10 PM.png",
    "/assets/ChatGPT Image Apr 29, 2025, 01_49_49 AM.png",
    "/assets/ChatGPT Image Apr 29, 2025, 02_16_54 PM.png",
  ];
  
  let currentIndex = 0;
  
  function showImage(index) {
    document.getElementById("gallery-image").src = images[index];
  }
  
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }
  