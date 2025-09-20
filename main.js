document.addEventListener('DOMContentLoaded', () => {
    // Initialize page animation
    setTimeout(() => {
        document.querySelectorAll('.page-animate').forEach(element => {
            element.classList.add('page-animate-in');
        });
    }, 100);

    // Setup hover effect
    const MOBILE_BREAKPOINT = 768;
    let isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
    const hoverBackground = document.getElementById('hover-background');
    let currentTarget = null;

    function updateHover(element, instant = false) {
        if (!element || !isDesktop) return;
        
        const rect = element.getBoundingClientRect();
        const padding = { x: 12, y: 4 };

        if (instant) {
            hoverBackground.style.transition = 'none';
        }
        
        requestAnimationFrame(() => {
            // Update size and position
            hoverBackground.style.width = `${rect.width + padding.x * 2}px`;
            hoverBackground.style.height = `${rect.height + padding.y * 2}px`;
            hoverBackground.style.transform = `translate3d(${rect.left - padding.x}px, ${rect.top - padding.y}px, 0)`;
            hoverBackground.style.opacity = '1';
            
            if (instant) {
                requestAnimationFrame(() => {
                    hoverBackground.style.transition = '';
                });
            }
        });
    }

    // Track window resize for mobile/desktop switch
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
        if (!isDesktop) {
            hoverBackground.style.opacity = '0';
            hoverBackground.style.transform = 'none';
            currentTarget = null;
        } else if (currentTarget) {
            updateHover(currentTarget, true);
        }
    }, { passive: true });

    // Handle mouse movement
    document.addEventListener('mousemove', (e) => {
        if (!isDesktop) return;
        
        const target = e.target.closest('.hover-style');
        
        if (target) {
            if (currentTarget !== target) {
                currentTarget = target;
                updateHover(target, currentTarget === null);
            }
        } else if (currentTarget) {
            currentTarget = null;
            hoverBackground.style.opacity = '0';
        }
    });

    // Update on scroll
    window.addEventListener('scroll', () => {
        if (currentTarget && isDesktop) {
            updateHover(currentTarget);
        }
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
