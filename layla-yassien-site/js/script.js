// ===================================================================
// Layla Yassien — Portfolio script.js (FINAL COMPLETED VERSION)
// ===================================================================

// ---- Selected Projects data --------------------------------------
const projectsData = [
  {
    title: "The Base",
    tag: "Branding",
    img: "assets/projects/the-base.jpg",
    href: "projects/the-base.html"
  },
  {
    title: "Nard",
    tag: "Branding",
    img: "assets/projects/nard.jpg",
    href: "projects/nard.html"
  },
  {
    title: "From The Archive",
    tag: "Social Media",
    img: "assets/projects/from-the-archive.jpg",
    href: "projects/from-the-archive.html"
  },
  {
    title: "This Is Loki",
    tag: "Video Motion",
    img: "assets/projects/this-is-loki.jpg",
    href: "projects/this-is-loki.html"
  }
];

const ITEMS_PER_PAGE = 2;

function renderCarousel() {
  const track = document.getElementById("carouselTrack");
  const dotsWrap = document.getElementById("carouselDots");
  if (!track || !dotsWrap) return;

  const pageCount = Math.ceil(projectsData.length / ITEMS_PER_PAGE);
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  for (let p = 0; p < pageCount; p++) {
    const page = document.createElement("div");
    page.className = "carousel-page";

    const items = projectsData.slice(p * ITEMS_PER_PAGE, p * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
    items.forEach(project => {
      const card = document.createElement("a");
      card.className = "project-card";
      card.href = project.href;

      const mediaStyle = project.img
        ? `<img src="${project.img}" alt="${project.title}">`
        : `<div class="placeholder-media"></div>`;

      card.innerHTML = `
        <div class="project-card__media">${mediaStyle}</div>
        <div class="project-card__meta">
          <span class="project-card__tag">${project.tag}</span>
          <div class="project-card__row">
            <span class="project-card__title">${project.title}</span>
            <span class="project-card__link">view project</span>
          </div>
        </div>`;
      page.appendChild(card);
    });

    track.appendChild(page);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Show projects page ${p + 1}`);
    if (p === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToPage(p));
    dotsWrap.appendChild(dot);
  }
}

let currentPage = 0;
function goToPage(index) {
  const track = document.getElementById("carouselTrack");
  const dots = document.querySelectorAll(".carousel-dots button");
  currentPage = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
}

// ---- Scroll reveal --------------------------------------------------
function initReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  // خدعة الـ (-10%) تعني: اجبر العنصر أن يتأخر ولا يظهر حتى تتجاوزه الشاشة للأعلى بمسافة محترمة
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" }); 
  
  targets.forEach(t => io.observe(t));
}

// ---- Header background on scroll ------------------------------------
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---- Mobile nav toggle ------------------------------------------------
function initNavToggle() {
  const btn = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    btn.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

// ---- Eyes video / placeholder swap ------------------------------------
function initEyesVideo() {
  const video = document.getElementById("eyesVideo");
  const placeholder = document.getElementById("eyesPlaceholder");
  if (!video || !placeholder) return;
  if (video.querySelector("source")) {
    placeholder.style.display = "none";
  }
}

// ---- Custom Mouse Cursor (Fixed Dot without hovering expansion) -------
function initCustomCursor() {
  const cursor = document.createElement("div");
  cursor.className = "magic-cursor";
  document.body.appendChild(cursor);

  // جعلها تلاحق إحداثيات الماوس باستمرار فقط لا غير
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
}

// ---- Global Continuous Music & Video Mute Sync -------------------------
function initGlobalMusic() {
  const music = document.getElementById("globalMusic");
  if (!music) return;

  // 1- جلب مكان الأغنية لضمان الاستمرارية
  const savedTime = sessionStorage.getItem("globalMusicTime");
  if (savedTime) {
    music.currentTime = parseFloat(savedTime);
  }

  // حفظ وقت الأغنية عند تحديث أو تغيير الصفحة
  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("globalMusicTime", music.currentTime);
  });

  // 2- التشغيل الصامت والمخفي بعيداً عن أعين IDM Manager
  const tryPlay = () => {
    let playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
         // إذا اشتغل فوراً، ممتاز. المتصفح سيدعم زر الكتم (Mute Tab).
      }).catch(() => {
         // المتصفح طلب التفاعل؟ ننتظر كبسة بالماوس للتشغيل الإجباري السري.
         document.addEventListener("pointerdown", () => {
             let forcedPlay = music.play();
             if (forcedPlay !== undefined) {
                 forcedPlay.catch(() => {});
             }
         }, {once: true});
      });
    }
  };
  setTimeout(tryPlay, 100); // التشغيل بعد لحظة للتهرب من الإضافات الخارجية

  // 3- المزامنة مع الفيديوهات (تسكت الاغنية عندما يشتغل الفيديو وتعود لو توقف)
  const allVideos = document.querySelectorAll("video");
  allVideos.forEach(vid => {
    vid.addEventListener("play", () => {
      // فقط إن كان الفيديو يحتوي صوتاً مفتوحاً، نوقف أغنية الموقع.
      if (!vid.muted && !vid.hasAttribute("muted")) {
        music.pause();
      }
    });

    const resumeMusic = () => {
      // إرجاع موسيقى الموقع متى ما وقف الفيديو
      if (!vid.muted && !vid.hasAttribute("muted")) {
        let resumePromise = music.play();
        if (resumePromise !== undefined) {
             resumePromise.catch(() => {});
        }
      }
    };
    vid.addEventListener("pause", resumeMusic);
    vid.addEventListener("ended", resumeMusic);
  });
}

// ===================================================================
// مركز إطلاق الدوال بأمان وبدون أي تضارب (DOMContentLoaded الوحيد في الملف)
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderCarousel();
  initReveal();
  initHeaderScroll();
  initNavToggle();
  initEyesVideo();
  initCustomCursor(); // نقطة الماوس المستقلة والمميزة
  initGlobalMusic();  // الموسيقى والتحكم بالتوقف مع الفيديوهات
});