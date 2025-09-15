// Shared hover overlay for .hover-style elements
    document.addEventListener('DOMContentLoaded', function () {
      const overlay = document.createElement('div');
      overlay.className = 'shared-hover-overlay';
      overlay.style.position = 'absolute';
      overlay.style.pointerEvents = 'none';
      overlay.style.transition = 'opacity 0.4s cubic-bezier(.4,0,.2,1), left 0.3s cubic-bezier(.4,0,.2,1), top 0.3s cubic-bezier(.4,0,.2,1), width 0.3s cubic-bezier(.4,0,.2,1), height 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1)';
      overlay.style.opacity = '0';
      overlay.style.zIndex = '100';
      overlay.style.border = '1px solid rgba(255,255,255,0.25)';
      overlay.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)';
      overlay.style.borderRadius = '1rem';
      overlay.style.background = 'rgba(255,255,255,0.18)';
      overlay.style.backdropFilter = 'blur(12px)';
      overlay.style.webkitBackdropFilter = 'blur(12px)';
      overlay.style.mixBlendMode = 'lighten';
      overlay.style.pointerEvents = 'none';
      document.body.appendChild(overlay);

      let currentHovered = null;
      let fadeTimeout;
      let mouseX = 0, mouseY = 0;

      function updateOverlay(target, event) {
        const rect = target.getBoundingClientRect();
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.style.left = (rect.left + window.scrollX) + 'px';
        overlay.style.top = (rect.top + window.scrollY) + 'px';
        overlay.style.transform = 'scale(1)';
        overlay.style.opacity = '1';
        if (event) {
          mouseX = event.clientX;
          mouseY = event.clientY;
        }
      }

      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function (e) {
          clearTimeout(fadeTimeout);
          currentHovered = el;
          updateOverlay(el, e);
        });
        el.addEventListener('mousemove', function (e) {
          updateOverlay(el, e);
        });
        el.addEventListener('mouseleave', function (e) {
          // Only fade out if not moving to another .hover-style element
          const related = e.relatedTarget;
          if (related && (related.classList && related.classList.contains('hover-style') || related.closest && related.closest('.hover-style'))) {
            return;
          }
          currentHovered = null;
          fadeTimeout = setTimeout(() => {
            if (!currentHovered) {
              overlay.style.opacity = '0';
              overlay.style.transform = 'scale(0.98)';
            }
          }, 10);
        });
      });
    });

    window.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        var main = document.querySelector('.page-animate');
        if (main) main.classList.add('page-animate-in');
      }, 100);
    });

    document.addEventListener('DOMContentLoaded', () => {
      // Create the popover element
      const popover = document.createElement('div');
      popover.className = 'image-popover';
      const popoverImage = document.createElement('img');
      popover.appendChild(popoverImage);
      document.querySelector('.page-animate').appendChild(popover); // Append to .page-animate

      // Default sizes for portrait and landscape orientations
      const sizes = {
        portrait: { width: '243px', height: '526px' },
        landscape: { width: '384px', height: '256px' },
      };

      // Function to check if the screen is large enough
      const isLargeScreen = () => window.innerWidth > 1024;

      // Event listeners for hover-show links
      const hoverLinks = document.querySelectorAll('.hover-show');
      hoverLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          if (!isLargeScreen()) return; // Disable on small screens

          const targetImage = link.getAttribute('data-image'); // Get the target image from data-image attribute
          const orientation = link.getAttribute('data-orientation') || 'landscape'; // Default to landscape

          if (targetImage) {
            popoverImage.src = targetImage;

            // Dynamically set the size based on orientation
            const { width, height } = sizes[orientation] || sizes.landscape;
            popover.style.width = width;
            popover.style.height = height;

            // Ensure inline styles take precedence
            popover.style.setProperty('width', width, 'important');
            popover.style.setProperty('height', height, 'important');

            // Position relative to the hovered trigger element
            const triggerRect = link.getBoundingClientRect();
            popover.style.right = `-${parseInt(width) / 1.25}px`;
            popover.style.top = `0px`;

            // Cancel any ongoing fade-out animation
            clearTimeout(popover.fadeTimeout);

            // Reset animation state
            popover.classList.remove('show');
            setTimeout(() => {
              popover.classList.add('show');
            }, 10); // Slight delay to re-trigger animation
          }
        });

        link.addEventListener('mouseleave', () => {
          if (!isLargeScreen()) return; // Disable on small screens

          // Add a delay before hiding to allow for smooth transitions
          popover.fadeTimeout = setTimeout(() => {
            popover.classList.remove('show');
          }, 50); // Short delay to ensure animation plays
        });
      });

      // Hide the popover on window resize if the screen becomes small
      window.addEventListener('resize', () => {
        if (!isLargeScreen()) {
          popover.classList.remove('show');
        }
      });
    });