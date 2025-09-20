document.addEventListener('DOMContentLoaded', () => {
    // Initialize page animation
    setTimeout(() => {
        document.querySelectorAll('.page-animate').forEach(element => {
            element.classList.add('page-animate-in');
        });
    }, 100);

    // Setup hover effect
    const hoverBackground = document.getElementById('hover-background');
    let currentTarget = null;
    let isFirstHover = true;

    function updateHover(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const padding = { x: 12, y: 4 };

        if (isFirstHover) {
            hoverBackground.style.transition = 'none';
            isFirstHover = false;
        } else {
            hoverBackground.style.transition = '';
        }
        
        requestAnimationFrame(() => {
            // Update size and position
            hoverBackground.style.width = `${rect.width + padding.x * 2}px`;
            hoverBackground.style.height = `${rect.height + padding.y * 2}px`;
            hoverBackground.style.transform = `translate(${rect.left - padding.x}px, ${rect.top - padding.y}px)`;
            hoverBackground.style.opacity = '1';
            
            if (hoverBackground.style.transition === 'none') {
                requestAnimationFrame(() => {
                    hoverBackground.style.transition = '';
                });
            }
        });
    }

    // Handle mouse movement
    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('.hover-style');
        
        if (target) {
            if (currentTarget !== target) {
                currentTarget = target;
                updateHover(target);
            }
        } else if (currentTarget) {
            currentTarget = null;
            hoverBackground.style.opacity = '0';
        }
    });

    // Update hover effect on scroll
    window.addEventListener('scroll', () => {
        if (currentTarget) updateHover(currentTarget);
    }, { passive: true });
    
    // Update hover effect on resize
    window.addEventListener('resize', () => {
        if (currentTarget) updateHover(currentTarget);
    }, { passive: true });

    // Handle image popovers
    const contentContainer = document.querySelector('.md\\:flex.md\\:flex-row.md\\:justify-center');
    const popover = document.createElement('div');
    popover.className = 'image-popover';
    document.body.appendChild(popover);

    const img = document.createElement('img');
    img.addEventListener('load', () => {
        if (window.innerWidth >= 1024) { // Only show on desktop
            requestAnimationFrame(() => {
                popover.classList.add('show');
            });
        }
    });
    popover.appendChild(img);

    function updatePopoverPosition() {
        if (!contentContainer || window.innerWidth < 1024) return;
        
        const mainContent = document.querySelector('.md\\:max-w-2xl');
        const pageAnimateSection = document.querySelector('.page-animate');
        
        if (!mainContent || !pageAnimateSection) return;
        
        const mainRect = mainContent.getBoundingClientRect();
        const animateRect = pageAnimateSection.getBoundingClientRect();
        const popoverWidth = popover.offsetWidth || 384;

        // Update popover position relative to viewport
        popover.style.left = `${mainRect.right - popoverWidth * 0.75}px`;
        popover.style.top = `${animateRect.top}px`;
    }

    // Update position on scroll and resize with throttling
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updatePopoverPosition();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updatePopoverPosition, { passive: true });

    const hoverLinks = document.querySelectorAll('.hover-show');
    hoverLinks.forEach(link => {
        if (!link.getAttribute('data-image')) return;

        link.addEventListener('mouseenter', () => {
            if (window.innerWidth <= 1024) return;

            const orientation = link.getAttribute('data-orientation') || 'landscape';
            
            // Update image and reset popover state
            popover.classList.remove('show');
            img.src = link.getAttribute('data-image');

            // Apply size based on orientation
            if (orientation === 'portrait') {
                popover.style.width = '243px';
                popover.style.height = '526px';
            } else {
                popover.style.width = '384px';
                popover.style.height = '256px';
            }

            // Update position
            updatePopoverPosition();
        });

        link.addEventListener('mouseleave', () => {
            popover.classList.remove('show');
        });
    });
});
