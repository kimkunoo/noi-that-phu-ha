// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom smooth ease
const easeSpring = "power4.out";

// Hero Animations (run immediately on load)
const heroTl = gsap.timeline({ defaults: { ease: easeSpring, duration: 1.4 } });

heroTl.from(".display-title", {
    y: 60,
    opacity: 0,
    duration: 1.6
})
.from(".hero-subtext", {
    y: 30,
    opacity: 0
}, "-=1.2")
.from(".hero-actions", {
    y: 30,
    opacity: 0
}, "-=1.2")
.from(".hero-img", {
    scale: 1.15,
    opacity: 0,
    duration: 2,
    ease: "power2.out"
}, "-=1.6");

// Hide header on scroll down, show on scroll up
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
        header.style.transform = "translateY(0)";
        return;
    }
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scroll down
        header.style.transform = "translateY(-100%)";
    } else {
        // Scroll up
        header.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll;
}, { passive: true });

// Stagger reveals for sections
const revealSections = document.querySelectorAll('.quote-section, .about-section, .collections-section, .contact-section');

revealSections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 85%", // Trigger when the top of the section hits 85% of viewport
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: easeSpring
    });
});

// Image parallax inside About
gsap.from(".about-img", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    },
    y: 50,
    scale: 1.1
});

// Bento grid stagger
const bentoCards = document.querySelectorAll('.bento-card');
if (bentoCards.length > 0) {
    gsap.from(bentoCards, {
        scrollTrigger: {
            trigger: ".bento-grid",
            start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: easeSpring
    });
}
