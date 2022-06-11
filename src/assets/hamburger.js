    // Hamburger Menu
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('nav--visible');
        if (hamburger.classList.contains('hamburger')) {
            hamburger.classList.replace('hamburger', 'hamburger--close')
        }
        else {
            hamburger.classList.replace('hamburger--close', 'hamburger')
        }
    })