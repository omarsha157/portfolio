

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const wrapper = document.querySelector('.wrapper')

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

//* below code is for closing the navslide when a link is clicked

const navClose = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const wrapper = document.querySelector('.wrapper')
    const navLinksA = document.querySelectorAll('.nav-links li a');

    navLinksA.forEach(links => 
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

navSlide();

navClose();

// scrollPadding();
