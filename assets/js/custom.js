
jQuery(document).ready(function ($) {

// lenish
const lenis = new Lenis({
  smooth: true,
  lerp: 0.1,
  wheelMultiplier: 1.1
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);


// Detect scroll – header hide/show EXCEPT when menu is open
(function () {
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {

        // If mobile nav OR submenu is open → do NOT hide header
        if ($('html').hasClass('nav-open') || $('.submenu-open').length) {
            return; 
        }

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            document.querySelector(".header").classList.add("hidden");
        } else {
            document.querySelector(".header").classList.remove("hidden");
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
})();


// Toggle main navigation
$('.menubar').on('click', function () {
    $('.nav').toggleClass('open');
    $(this).toggleClass('active');

    // disable or enable scroll
    $('html, body').toggleClass('nav-open');
});


// Close menu OR toggle submenu
$('.header .right_part .nav a').on('click', function (e) {

    // If submenu exists → toggle submenu, do NOT close main menu
    if ($(this).next('ul').length) {
        e.preventDefault();
        $(this).toggleClass('submenu-open');
        $(this).next('ul').slideToggle();
        return;
    }

    // Otherwise close full menu
    $('.nav').removeClass('open');
    $('.menubar').removeClass('active');
    $('html, body').removeClass('nav-open');
});



//  service  tab js
$(".data_content").hide();
$("#tab1").show();
$('[data-tab="tab1"]').addClass("active");

$(".dot_box button").on("click", function () {
    const tabId = $(this).data("tab");

    $(".dot_box button").removeClass("active");
    $(this).addClass("active");

    $(".data_content").hide();
    $("#" + tabId).show();

    $("html, body").animate(
        {
            scrollTop: $("#" + tabId).offset().top - 20
        },
        500
    );
});




        /* ---------------- SPLIT TEXT ---------------- */
        function splitText(selector) {
            const el = document.querySelector(selector);
            const lines = el.innerHTML.split("<br>");
            el.innerHTML = "";

            lines.forEach((line, li) => {
                const words = line.split(" ");
                words.forEach((word, wi) => {
                    const w = document.createElement("span");
                    w.classList.add("word");

                    [...word].forEach(letter => {
                        const span = document.createElement("span");
                        span.classList.add("letter");

                        span.style.setProperty("--x", (Math.random() * 8 - 4) + "vw");
                        span.style.setProperty("--y", (Math.random() * 20 - 10) + "%");
                        span.style.setProperty("--z", (Math.random() * -20) + "vw");
                        span.style.setProperty("--rz", (Math.random() * 10 - 5) + "deg");

                        span.textContent = letter;
                        w.appendChild(span);
                    });

                    el.appendChild(w);

                    if (wi < words.length - 1) {
                        const space = document.createElement("span");
                        space.innerHTML = "&nbsp;";
                        el.appendChild(space);
                    }
                });

                if (li < lines.length - 1) el.appendChild(document.createElement("br"));
            });
        }

        splitText("#title");
        const title = document.querySelector("#title");

        /* ---------------- FLOAT ↔ INLINE LOGIC ---------------- */
        let lastScroll = 0;
        const heroHeight = document.querySelector(".hero_sec").offsetHeight;

        lenis.on("scroll", ({ scroll }) => {
            const direction = scroll > lastScroll ? "down" : "up";

            if (direction === "down") {
                title.classList.add("inline");
            } else {
                if (scroll < heroHeight) {
                    title.classList.remove("inline");
                }
            }

            lastScroll = scroll;
        });

        /* ---------------- MOUSE 3D ---------------- */
        window.addEventListener("mousemove", (e) => {
            if (title.classList.contains("inline")) return;

            const cx = (e.clientX / innerWidth) * 2 - 1;
            const cy = (e.clientY / innerHeight) * 2 - 1;

            title.style.setProperty("--cx", cx);
            title.style.setProperty("--cy", cy);
        });





  // text        
function splitAllTextWithStrong(selector) {
  const element = document.querySelector(selector);
 
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Remove newlines to prevent double <br>
      const text = node.textContent.replace(/\n/g, "");
 
      return [...text].map(char => {
        if (char === " ") {
          return document.createTextNode(char); // keep spaces as text node
        }
        const span = document.createElement("span");
        span.classList.add("letter");
        span.innerText = char;
        return span;
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        return [document.createElement("br")];
      } else if (node.tagName === "STRONG") {
        const strongClone = document.createElement("strong");
        node.childNodes.forEach(child => {
          processNode(child).forEach(el => strongClone.appendChild(el));
        });
        return [strongClone];
      } else {
        return [node.cloneNode(true)];
      }
    }
    return [];
  }
 
  const nodes = Array.from(element.childNodes);
  element.innerHTML = "";
 
  nodes.forEach(node => {
    processNode(node).forEach(el => element.appendChild(el));
  });
}
 
// Usage
splitAllTextWithStrong(".split-text");
 
 
const letters = document.querySelectorAll(".split-text .letter");
const container = document.querySelector(".split-text");
 
function scrollPrintFlow() {
  const rect = container.getBoundingClientRect();
  const scrollProgress = Math.min(Math.max((window.innerHeight/1.3 - rect.top) / rect.height, 0), 1);
  // scrollProgress is 0 (top) → 1 (fully passed)
 
  const lettersToShow = Math.floor(scrollProgress * letters.length);
 
  letters.forEach((letter, i) => {
    if (i < lettersToShow) {
      letter.classList.add("active");
    } else {
      letter.classList.remove("active"); // removes if scrolling back up
    }
  });
}
 
window.addEventListener("scroll", scrollPrintFlow);
window.addEventListener("resize", scrollPrintFlow);
scrollPrintFlow(); // initial check





//  setupMotion hero img
function setupMotion(className, easeValue = 0.08) {
  const elements = document.querySelectorAll(className);
  if (!elements.length) return;
 
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
 
  // Cursor tracking
  document.addEventListener("mousemove", e => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });
 
  // Smooth motion loop
  function animate() {
    currentX += (targetX - currentX) * easeValue;
    currentY += (targetY - currentY) * easeValue;
 
    elements.forEach(el => {
      el.style.setProperty("--cx", currentX.toFixed(10));
      el.style.setProperty("--cy", currentY.toFixed(10));
    });
 
    requestAnimationFrame(animate);
  }
  animate();
 
  // Scroll progress tracking
  lenis.on("scroll", ({ scroll, limit }) => {
    const progress = scroll / limit;
    elements.forEach(el => {
      el.style.setProperty("--scroll-progress", progress);
    });
  });
 
  return { elements, setEase: (newEase) => easeValue = newEase };
}

const motion1 = setupMotion(".motion-item", 0.02);
const motion2 = setupMotion(".motion-item2", 0.005);






// elements to track
const elements = document.querySelectorAll(".slide_down"); // your elements with custom class
 
function setupScrollProgress(elements) {
  // IntersectionObserver to detect when elements enter viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // mark element as "active" so scroll updates it
        entry.target.dataset.inViewport = "true";
      } else {
        entry.target.dataset.inViewport = "false";
      }
    });
  }, { threshold: 0.1 }); // trigger when 10% visible
 
  elements.forEach(el => observer.observe(el));
 
  // Lenis scroll update
  lenis.on("scroll", ({ scroll, limit }) => {
    const progress = scroll / limit;
 
    elements.forEach(el => {
      if (el.dataset.inViewport === "true") {
        el.style.setProperty("--scroll-progress", progress);
      }
    });
  });
}
 
// Usage
setupScrollProgress(elements);
});
