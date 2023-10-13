        const menuContainer = document.getElementById('menu-container');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'menu', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                menuContainer.innerHTML = xhr.responseText;
                const currentPath = window.location.pathname;
                const navLinks = menuContainer.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === currentPath) {
                        link.classList.add('active');
                    }
                });
            }
        };
        xhr.send();