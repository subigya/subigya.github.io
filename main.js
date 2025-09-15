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