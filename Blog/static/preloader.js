        // INICIO DEL LOADER
        window.addEventListener('load', () => {
            setTimeout(() => {
                const preloader = document.getElementById('preloader');
                preloader.style.opacity = '0';

                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        });
        // FIN DEL LOADER