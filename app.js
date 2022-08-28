
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const wrapper = document.querySelector('.wrapper')

    if(burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active')
            burger.classList.toggle('burger-close')
            wrapper.classList.toggle('wrapper-blur')
    
            // if (document.body.style.overflow == 'hidden') {
            //     document.body.style.overflow = ''
            // } else {
            //     document.body.style.overflow = 'hidden'
            // }
    
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            })
        })
    }

}

//* below code is for closing the navslide when a link is clicked

const navClose = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const wrapper = document.querySelector('.wrapper')
    // const navLinksA = document.querySelectorAll('.nav-links li a');

    navLinks.forEach(links =>
        links.addEventListener('click', () => {
            nav.classList.remove('nav-active')
            burger.classList.remove('burger-close')
            wrapper.classList.remove('wrapper-blur')

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            })
        })
    )
}

// same code using for loop instead of foreach

// const navClose = () => {
//     const burger = document.querySelector('.burger');
//     const nav = document.querySelector('.nav-links');
//     const navLinks = document.querySelectorAll('.nav-links li');
//     const wrapper = document.querySelector('.wrapper')
//     const navLinksA = document.querySelectorAll('.nav-links li a');

//     for (let i = 0; i < navLinksA.length; i++) {
//         navLinksA[i].addEventListener('click', () => {
//             nav.classList.remove('nav-active')
//             burger.classList.remove('burger-close')
//             wrapper.classList.remove('wrapper-blur')

//             navLinks.forEach((link, index) => {
//                 if (link.style.animation) {
//                     link.style.animation = '';
//                 } else {
//                     link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
//                 }

//             })
//         })
//     }
// }


const scrollPadding = () => {
    const navigationHeight = document.querySelector('nav').offsetHeight;

    document.documentElement.style.setProperty('--scroll-padding', navigationHeight + "px")
}

function themeSetter() {

    const btn = document.querySelector('#darkmode');

    if(btn) { 
        btn.addEventListener('click', () => {
            let theme = getCurrentTheme();
            if(theme === "dark") {
                theme = "light";
            } else {
                theme = "dark"
            }
        
            localStorage.setItem('o-portfolio-theme', `${theme}`)
            loadTheme(theme);
        })
    }
    
    

    function getCurrentTheme() {
        let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        localStorage.getItem('o-portfolio-theme') ? theme = localStorage.getItem('o-portfolio-theme') : null;
    

        return theme;
    }

    
    function loadTheme(theme) {
        const root = document.querySelector(':root');
    
        if(btn) {
            if (theme === "light") {
                // console.log("dark mode off");
                btn.innerHTML = "Dark mode"
        
            } else {
                // console.log("dark mode on");
                btn.innerHTML = "Light mode"
        
            }
        }
    
        root.setAttribute('color-scheme', `${theme}`)
    
    }

    window.addEventListener('DOMContentLoaded', () => {
        loadTheme(getCurrentTheme());
    })
}

function scrollTo() {

    const logo = document.querySelector('.logo');
    logo.addEventListener('click', () => { window.scroll(0,0) })

    const backToTop = document.querySelector('.back-to-top');


    const aboutMe = document.querySelector('#aboutme');
    const aboutMeBtn = document.querySelector('#aboutmebtn');
    
    const projects = document.querySelector('#projects');
    const projectsBtn = document.querySelector('#projectsbtn');
    
    const contact = document.querySelector('#contact');
    const contactBtn = document.querySelector('#contactbtn');

    if(backToTop) {
        backToTop.addEventListener('click', () => { window.scroll(0,0) })
    }
    
    if(aboutMe && projects && contact) {
        aboutMeBtn.addEventListener('click', () => { aboutMe.scrollIntoView() })
        projectsBtn.addEventListener('click', () => { projects.scrollIntoView() })
        contactBtn.addEventListener('click', () => { contact.scrollIntoView() })
    }
}

themeSetter();

scrollTo();

navSlide();

navClose();

// scrollPadding();
