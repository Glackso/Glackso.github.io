const AppManager = {
    // 1. Open the app using your specific HTML structure
    openApp: function(appId) {
        const app = this.registry[appId];
        
        // Create the window wrapper
        const win = document.createElement('div');
        win.className = 'window draggable'; // 'window' class from your xp.css
        win.style.width = app.width || "400px";
        win.style.position = "absolute";
        win.style.left = "100px";
        win.style.top = "100px";

        // Inject your XP.css structure
        win.innerHTML = `
          <div class="title-bar">
            <div class="title-bar-text">${app.name}</div>
            <div class="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close" class="close-btn"></button>
            </div>
          </div>
          <div class="window-body">
            ${app.content}
          </div>
        `;

        document.getElementById('desktop').appendChild(win);

        // 2. Setup Close Logic
        win.querySelector('.close-btn').onclick = () => win.remove();

        // 3. Make it draggable with interact.js
        this.initDraggable(win);
    },

    initDraggable: function(el) {
        interact(el).draggable({
            allowFrom: '.title-bar', // Drag only by the blue bar
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        });
    }
};
