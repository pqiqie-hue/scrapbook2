/* =========================================================
   GREEN BIRTHDAY BOOK V2
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   HELPER
========================================================= */

const $ = (selector, root = document) => {
  return root.querySelector(selector);
};


const $$ = (selector, root = document) => {
  return [...root.querySelectorAll(selector)];
};


/* =========================================================
   DOM
========================================================= */

const pages = $$(".book-page");

const shell = $("#bookShell");

const editor = $("#editor");

const audio = $("#audio");

const confettiLayer = $("#confettiLayer");


/* =========================================================
   STATE
========================================================= */

let current = 0;

let musicURL = null;

let bgURL = null;

let photoURLs = [];


/* =========================================================
   THEMES
========================================================= */

const themes = {

  sage: {
    green: "#83b79a",
    dark: "#285a43",
    deep: "#173d2c",
    light: "#e7f3ea",
    accent: "#4d8a68"
  },

  mint: {
    green: "#75c6a2",
    dark: "#247255",
    deep: "#124735",
    light: "#e4f7ee",
    accent: "#3a9873"
  },

  matcha: {
    green: "#9eae67",
    dark: "#53652a",
    deep: "#34451b",
    light: "#f0f4df",
    accent: "#71853c"
  },

  forest: {
    green: "#659c78",
    dark: "#214e36",
    deep: "#133421",
    light: "#e2eee5",
    accent: "#3f7958"
  }

};


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaults = {

  theme: "sage",

  polka: true,

  fontSize: 100,

  texts: {

    coverEyebrow:
      "A LITTLE SURPRISE FOR YOU",

    coverTitle1:
      "Happy",

    coverTitle2:
      "Birthday",

    name:
      "Someone Special",

    coverHint:
      "tap the envelope to open your little book",

    coverDate:
      "01 · 10 · 2026",

    letterTitle:
      "A tiny letter for my favorite person",

    letter:
      "Happy birthday to you! Today is a tiny reminder of how grateful I am that you exist. I hope this new chapter brings you soft days, loud laughter, brave dreams, and lots of little reasons to smile.",

    signature:
      "with love, always ♡",

    quote:
      "“May this year feel like a collection of beautiful little moments.”",

    memoryTitle:
      "Us, in little frames",

    cap1:
      "one of my favorite moments",

    cap2:
      "your smile makes everything warmer",

    cap3:
      "a moment I want to keep",

    cap4:
      "more memories, please ♡",

    memoryNote:
      "four little frames, a thousand memories.",

    reasonsTitle:
      "Things I love about you",

    reason1:
      "You make ordinary days feel special.",

    reason2:
      "You keep being yourself, and that is beautiful.",

    reason3:
      "Your laughter can turn a whole mood around.",

    reason4:
      "You deserve good things, not just today, but always.",

    featuredCaption:
      "keep this smile",

    wishTitle:
      "For your new chapter",

    wish1:
      "more courage to chase what you want",

    wish2:
      "more peaceful mornings",

    wish3:
      "more adventures worth remembering",

    wish4:
      "more reasons to be proud of yourself",

    birthdayDate:
      "01 OCTOBER 2026",

    finalTitle:
      "You are loved.",

    finalMessage:
      "Thank you for being part of so many beautiful memories. Here's to another year of becoming, growing, laughing, and making life a little sweeter.",

    finalSign:
      "Happy birthday, always ♡"

  }

};


/* =========================================================
   APP STATE
========================================================= */

let state = structuredClone(defaults);


/* =========================================================
   ALL TEXT CUSTOMIZER — EVERY BOOK TEXT
========================================================= */

function ensureTextKeys() {

  $$(".editable[data-key]").forEach(element => {

    const key = element.dataset.key;

    if (!(key in state.texts)) {

      state.texts[key] =
        element.innerText.trim();

    }

  });

}


function makeTextLabel(
  key,
  value
) {

  const label =
    document.createElement("label");

  label.className =
    "all-text-field";


  const title =
    document.createElement("span");

  title.textContent =
    key
      .replace(
        /([A-Z])/g,
        " $1"
      )
      .replace(
        /^./,
        s => s.toUpperCase()
      );


  const input =
    value.length > 85 ||
    key.toLowerCase().includes("message") ||
    key.toLowerCase().includes("letter") ||
    key.toLowerCase().includes("quote")

      ? document.createElement("textarea")

      : document.createElement("input");


  input.value =
    value;


  input.dataset.text =
    key;


  input.rows =
    3;


  label.append(
    title,
    input
  );


  return label;

}


function buildAllTextEditor() {

  const box =
    $("#allTextEditor");


  if (!box) return;


  box.innerHTML =
    "";


  ensureTextKeys();


  Object.entries(
    state.texts
  ).forEach(
    ([key, value]) => {

      box.appendChild(
        makeTextLabel(
          key,
          value || ""
        )
      );

    }
  );

}


function applyAllText() {

  $$("#allTextEditor [data-text]")
    .forEach(input => {

      state.texts[
        input.dataset.text
      ] =
        input.value;

    });


  renderTexts();

  persist();

  buildAllTextEditor();


  showToast(
    "Semua teks berhasil diperbarui ✨"
  );

}


/* =========================================================
   CSS VARIABLE
========================================================= */

function cssVar(
  name,
  value
) {

  document.documentElement.style.setProperty(
    name,
    value
  );

}


/* =========================================================
   APPLY THEME
========================================================= */

function applyTheme(name) {

  const theme =
    themes[name] ||
    themes.sage;


  cssVar(
    "--green",
    theme.green
  );


  cssVar(
    "--green-dark",
    theme.dark
  );


  cssVar(
    "--green-deep",
    theme.deep
  );


  cssVar(
    "--green-light",
    theme.light
  );


  cssVar(
    "--accent",
    theme.accent
  );


  state.theme =
    name;


  $$(".theme-grid button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.theme === name
      );

    });

}


/* =========================================================
   PAGE DOTS
========================================================= */

function renderDots() {

  const box =
    $("#progressDots");


  if (!box) return;


  box.innerHTML =
    "";


  pages.forEach(
    (page, index) => {

      const dot =
        document.createElement(
          "span"
        );


      dot.className =
        "dot" +
        (
          index === current
            ? " active"
            : ""
        );


      dot.setAttribute(
        "aria-label",
        `Halaman ${index + 1}`
      );


      dot.setAttribute(
        "role",
        "button"
      );


      dot.tabIndex =
        0;


      dot.onclick =
        () => {

          goTo(index);

        };


      dot.onkeydown =
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            goTo(index);

          }

        };


      box.appendChild(
        dot
      );

    }
  );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function goTo(
  number,
  animate = true
) {

  const target =
    Math.max(
      0,
      Math.min(
        pages.length - 1,
        number
      )
    );


  if (
    target === current &&
    animate === false
  ) {

    return;

  }


  if (
    target > current
  ) {

    for (
      let index = current;
      index < target;
      index++
    ) {

      pages[index]
        .classList
        .add("flipped");

    }

  } else {

    for (
      let index = target;
      index < current;
      index++
    ) {

      pages[index]
        .classList
        .remove("flipped");

    }

  }


  current =
    target;


  renderDots();


  if (
    current ===
    pages.length - 1
  ) {

    setTimeout(
      () => {

        celebrate(true);

      },
      450
    );

  }

}


function next() {

  if (
    current <
    pages.length - 1
  ) {

    goTo(
      current + 1
    );

  }

}


function prev() {

  if (
    current > 0
  ) {

    goTo(
      current - 1
    );

  }

}


/* =========================================================
   NAV BUTTONS
========================================================= */

$("#nextBtn").onclick =
  next;


$("#prevBtn").onclick =
  prev;


/* =========================================================
   OPEN BOOK
========================================================= */

$("#openBook").onclick =
  () => {

    openEnvelope();


    setTimeout(
      () => {

        goTo(1);

      },
      500
    );

  };


/* =========================================================
   RESTART
========================================================= */

$("#restartBtn").onclick =
  () => {

    pages.forEach(
      page => {

        page.classList.remove(
          "flipped"
        );

      }
    );


    goTo(
      0,
      false
    );

  };


/* =========================================================
   ENVELOPE
========================================================= */

$("#envelopeWrap").onclick =
  () => {

    openEnvelope();

  };


$("#envelopeWrap").onkeydown =
  event => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openEnvelope();

    }

  };


function openEnvelope() {

  $("#envelopeWrap")
    .classList
    .add("opened");

}


/* =========================================================
   EDITABLE TEXT
========================================================= */

function bindEditable() {

  $$(".editable").forEach(
    element => {

      element.addEventListener(
        "dblclick",
        () => {

          element.contentEditable =
            "true";


          element.classList.add(
            "editing"
          );


          element.focus();


          const range =
            document.createRange();


          range.selectNodeContents(
            element
          );


          const selection =
            window.getSelection();


          selection.removeAllRanges();


          selection.addRange(
            range
          );

        }
      );


      element.addEventListener(
        "blur",
        () => {

          element.contentEditable =
            "false";


          element.classList.remove(
            "editing"
          );


          const key =
            element.dataset.key;


          if (key) {

            state.texts[key] =
              element.innerText.trim();


            syncInputs();

            persist();

          }

        }
      );


      element.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Escape"
          ) {

            element.blur();

          }

        }
      );

    }
  );

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
  key,
  value
) {

  state.texts[key] =
    value;


  $$(
    `[data-key="${key}"]`
  ).forEach(
    element => {

      element.textContent =
        value;

    }
  );

}


/* =========================================================
   RENDER TEXT
========================================================= */

function renderTexts() {

  Object.entries(
    state.texts
  ).forEach(
    ([key, value]) => {

      setText(
        key,
        value
      );

    }
  );


  syncInputs();

}


/* =========================================================
   SYNC INPUTS
========================================================= */

function syncInputs() {

  $$("[data-text]")
    .forEach(
      input => {

        input.value =
          state.texts[
            input.dataset.text
          ] || "";

      }
    );

}


/* =========================================================
   QUICK INPUT
========================================================= */

$$("[data-text]")
  .forEach(
    input => {

      input.addEventListener(
        "input",
        () => {

          state.texts[
            input.dataset.text
          ] =
            input.value;

        }
      );

    }
  );


/* =========================================================
   APPLY TEXT
========================================================= */

$("#applyText").onclick =
  () => {

    $$("[data-text]")
      .forEach(
        input => {

          setText(
            input.dataset.text,
            input.value
          );

        }
      );


    persist();


    showToast(
      "Tulisan berhasil diterapkan ✨"
    );

  };


/* =========================================================
   LOCAL STORAGE
========================================================= */

function persist() {

  try {

    localStorage.setItem(
      "greenBirthdayBookV3",
      JSON.stringify(state)
    );

  } catch (error) {

    console.warn(
      "Gagal menyimpan state:",
      error
    );

  }

}


/* =========================================================
   RESTORE
========================================================= */

function restore() {

  const raw =
    localStorage.getItem(
      "greenBirthdayBookV3"
    );


  if (raw) {

    try {

      const parsed =
        JSON.parse(
          raw
        );


      state = {

        ...defaults,

        ...parsed,

        texts: {

          ...defaults.texts,

          ...(parsed.texts || {})

        }

      };

    } catch (error) {

      console.warn(
        "Data localStorage tidak valid.",
        error
      );


      state =
        structuredClone(
          defaults
        );

    }

  }


  applyTheme(
    state.theme
  );


  $("#polkaToggle").checked =
    state.polka;


  document.body.classList.toggle(
    "no-polka",
    !state.polka
  );


  $("#fontRange").value =
    state.fontSize;


  applyFontScale();


  ensureTextKeys();

  renderTexts();

  buildAllTextEditor();

}


/* =========================================================
   FONT SCALE
========================================================= */

function applyFontScale() {

  const factor =
    state.fontSize / 100;


  $(
    ".page-content, .cover-main, .final-content"
  ).forEach(
    element => {

      element.style.fontSize =
        `${factor}em`;

    }
  );

}


/* =========================================================
   THEME BUTTONS
========================================================= */

$$(".theme-grid button")
  .forEach(
    button => {

      button.onclick =
        () => {

          applyTheme(
            button.dataset.theme
          );


          persist();

        };

    }
  );


/* =========================================================
   POLKA TOGGLE
========================================================= */

$("#polkaToggle").onchange =
  event => {

    state.polka =
      event.target.checked;


    document.body.classList.toggle(
      "no-polka",
      !state.polka
    );


    persist();

  };


/* =========================================================
   FONT RANGE
========================================================= */

$("#fontRange").oninput =
  event => {

    state.fontSize =
      Number(
        event.target.value
      );


    applyFontScale();

    persist();

  };


/* =========================================================
   EDITOR
========================================================= */

$("#editBtn").onclick =
  () => {

    editor.classList.add(
      "open"
    );

  };


$("#closeEditor").onclick =
  () => {

    editor.classList.remove(
      "open"
    );

  };


/* =========================================================
   PHOTO UPLOAD
========================================================= */

$("#photoInput").onchange =
  event => {

    const files =
      [...event.target.files]
        .slice(
          0,
          12
        );


    if (!files.length) {

      return;

    }


    photoURLs.forEach(
      url => {

        URL.revokeObjectURL(
          url
        );

      }
    );


    photoURLs =
      files.map(
        file =>
          URL.createObjectURL(
            file
          )
      );


    const images =
      $$(".photo-img[data-photo-index]");


    images.forEach(
      image => {

        image.removeAttribute(
          "src"
        );


        image.parentElement
          .classList
          .remove(
            "has-photo"
          );

      }
    );


    $("#featuredPhoto")
      ?.removeAttribute(
        "src"
      );


    $("#featuredPhoto")
      ?.parentElement
      .classList
      .remove(
        "has-photo"
      );


    images.forEach(
      image => {

        const index =
          Number(
            image.dataset.photoIndex
          );


        if (
          photoURLs[index]
        ) {

          image.src =
            photoURLs[index];


          image.parentElement
            .classList
            .add(
              "has-photo"
            );

        }

      }
    );


    if (
      photoURLs[0] &&
      $("#featuredPhoto")
    ) {

      $("#featuredPhoto").src =
        photoURLs[0];


      $("#featuredPhoto")
        .parentElement
        .classList
        .add(
          "has-photo"
        );

    }


    showToast(
      `${photoURLs.length} foto berhasil dimasukkan 📸`
    );

  };


/* =========================================================
   CLEAR PHOTOS
========================================================= */

$("#clearPhotos").onclick =
  () => {

    photoURLs.forEach(
      url => {

        URL.revokeObjectURL(
          url
        );

      }
    );


    photoURLs =
      [];


    $$(".photo-img")
      .forEach(
        image => {

          image.removeAttribute(
            "src"
          );


          image.parentElement
            .classList
            .remove(
              "has-photo"
            );

        }
      );


    $("#photoInput").value =
      "";


    showToast(
      "Semua foto dihapus."
    );

  };


/* =========================================================
   BACKGROUND
========================================================= */

$("#bgInput").onchange =
  event => {

    const file =
      event.target.files[0];


    if (!file) {

      return;

    }


    if (bgURL) {

      URL.revokeObjectURL(
        bgURL
      );

    }


    bgURL =
      URL.createObjectURL(
        file
      );


    const cover =
      $(".cover");


    const paper =
      cover.querySelector(
        ".page-paper"
      );


    const existingVideo =
      $(".cover-video");


    if (existingVideo) {

      existingVideo.remove();

    }


    cover.classList.add(
      "custom-bg"
    );


    if (
      file.type.startsWith(
        "image/"
      )
    ) {

      paper.style.backgroundImage =
        `url("${bgURL}")`;


      paper.style.backgroundSize =
        "cover";


      paper.style.backgroundPosition =
        "center";

    }


    if (
      file.type.startsWith(
        "video/"
      )
    ) {

      paper.style.backgroundImage =
        "";


      const video =
        document.createElement(
          "video"
        );


      video.className =
        "cover-video";


      video.muted =
        true;


      video.loop =
        true;


      video.autoplay =
        true;


      video.playsInline =
        true;


      video.src =
        bgURL;


      paper.prepend(
        video
      );


      video.play()
        .catch(
          () => {}
        );

    }


    showToast(
      "Background berhasil diterapkan 🖼️"
    );

  };


/* =========================================================
   CLEAR BACKGROUND
========================================================= */

$("#clearBg").onclick =
  () => {

    if (bgURL) {

      URL.revokeObjectURL(
        bgURL
      );

    }


    bgURL =
      null;


    const cover =
      $(".cover");


    const paper =
      cover.querySelector(
        ".page-paper"
      );


    cover.classList.remove(
      "custom-bg"
    );


    paper.style.backgroundImage =
      "";


    paper.style.backgroundSize =
      "";


    paper.style.backgroundPosition =
      "";


    const video =
      $(".cover-video");


    if (video) {

      video.pause();

      video.remove();

    }


    $("#bgInput").value =
      "";


    showToast(
      "Background dikembalikan ke hijau 🌿"
    );

  };


/* =========================================================
   MUSIC
========================================================= */

$("#musicInput").onchange =
  event => {

    const file =
      event.target.files[0];


    if (!file) {

      return;

    }


    if (musicURL) {

      URL.revokeObjectURL(
        musicURL
      );

    }


    musicURL =
      URL.createObjectURL(
        file
      );


    audio.src =
      musicURL;


    audio.volume =
      .65;


    audio.play()
      .then(
        () => {

          $("#musicBtn")
            .textContent =
            "❚❚ Music";

        }
      )
      .catch(
        () => {

          $("#musicBtn")
            .textContent =
            "♫ Music";


          showToast(
            "Klik tombol Music untuk memulai audio."
          );

        }
      );

  };


/* =========================================================
   MUSIC BUTTON
========================================================= */

$("#musicBtn").onclick =
  () => {

    if (!audio.src) {

      showToast(
        "Upload musik terlebih dahulu dari Customize."
      );


      return;

    }


    if (
      audio.paused
    ) {

      audio.play()
        .then(
          () => {

            $("#musicBtn")
              .textContent =
              "❚❚ Music";

          }
        )
        .catch(
          () => {}
        );

    } else {

      audio.pause();


      $("#musicBtn")
        .textContent =
        "♫ Music";

    }

  };


/* =========================================================
   REMOVE MUSIC
========================================================= */

$("#removeMusic").onclick =
  () => {

    audio.pause();


    audio.removeAttribute(
      "src"
    );


    if (musicURL) {

      URL.revokeObjectURL(
        musicURL
      );

    }


    musicURL =
      null;


    $("#musicInput").value =
      "";


    $("#musicBtn")
      .textContent =
      "♫ Music";


    showToast(
      "Musik dihapus."
    );

  };


/* =========================================================
   PRINT
========================================================= */

function printBook() {

  pages.forEach(
    page => {

      page.classList.remove(
        "flipped"
      );

    }
  );


  window.print();

}


function restoreFlipState() {

  pages.forEach(
    (page, index) => {

      page.classList.toggle(
        "flipped",
        index < current
      );

    }
  );

}


$("#printBtn").onclick =
  printBook;


$("#printFromPanel").onclick =
  printBook;


/* =========================================================
   SAVE SETTINGS
========================================================= */

$("#saveBtn").onclick =
  () => {

    $("#downloadSettings").click();

  };


$("#downloadSettings").onclick =
  () => {

    const data = {

      app:
        "Green Birthday Book V3 — 10 Slide",

      version:
        3,

      savedAt:
        new Date().toISOString(),

      state:
        state

    };


    const blob =
      new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      "green-birthday-book-v3-settings.json";


    document.body.appendChild(
      link
    );


    link.click();


    link.remove();


    setTimeout(
      () => {

        URL.revokeObjectURL(
          url
        );

      },
      1000
    );


    showToast(
      "Settings berhasil disimpan 💾"
    );

  };


/* =========================================================
   UPLOAD SETTINGS
========================================================= */

$("#uploadSettings").onchange =
  event => {

    const file =
      event.target.files[0];


    if (!file) {

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      () => {

        try {

          const data =
            JSON.parse(
              reader.result
            );


          state = {

            ...defaults,

            ...(data.state || {}),

            texts: {

              ...defaults.texts,

              ...(data.state?.texts || {})

            }

          };


          applyTheme(
            state.theme
          );


          $("#polkaToggle").checked =
            state.polka;


          $("#fontRange").value =
            state.fontSize;


          document.body.classList.toggle(
            "no-polka",
            !state.polka
          );


          applyFontScale();


          ensureTextKeys();

          renderTexts();

          buildAllTextEditor();


          persist();


          showToast(
            "Settings berhasil dimuat ✨"
          );

        } catch (error) {

          console.error(
            error
          );


          showToast(
            "File settings tidak valid."
          );

        }

      };


    reader.readAsText(
      file
    );

  };


/* =========================================================
   RESET
========================================================= */

$("#resetAll").onclick =
  () => {

    const confirmed =
      confirm(
        "Kembalikan semua teks dan tema ke template awal?"
      );


    if (!confirmed) {

      return;

    }


    state =
      structuredClone(
        defaults
      );


    applyTheme(
      state.theme
    );


    $("#polkaToggle").checked =
      true;


    $("#fontRange").value =
      100;


    document.body.classList.remove(
      "no-polka"
    );


    ensureTextKeys();

    renderTexts();

    buildAllTextEditor();


    applyFontScale();

    persist();


    showToast(
      "Template berhasil direset 🌿"
    );

  };


/* =========================================================
   CONFETTI
========================================================= */

function celebrate(
  auto = false
) {

  const amount =
    auto
      ? 70
      : 130;


  const greens = [

    "#285a43",

    "#4d8a68",

    "#83b79a",

    "#b8d9c0",

    "#e7f3ea",

    "#f5d58c"

  ];


  for (
    let index = 0;
    index < amount;
    index++
  ) {

    const piece =
      document.createElement(
        "span"
      );


    piece.className =
      "confetti";


    piece.style.background =
      greens[
        Math.floor(
          Math.random() *
          greens.length
        )
      ];


    piece.style.left =
      Math.random() *
      100 +
      "vw";


    piece.style.setProperty(
      "--x",
      `${Math.random() * 240 - 120}px`
    );


    piece.style.setProperty(
      "--dur",
      `${2.5 + Math.random() * 2.7}s`
    );


    piece.style.setProperty(
      "--rot",
      `${Math.random() * 180 - 90}deg`
    );


    piece.style.animationDelay =
      `${Math.random() * .35}s`;


    confettiLayer.appendChild(
      piece
    );


    setTimeout(
      () => {

        piece.remove();

      },
      6000
    );

  }

}


$("#celebrateBtn").onclick =
  () => {

    celebrate(
      false
    );

  };


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  let toast =
    document.querySelector(
      ".app-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "app-toast";


    Object.assign(
      toast.style,
      {

        position:
          "fixed",

        left:
          "50%",

        bottom:
          "28px",

        transform:
          "translateX(-50%) translateY(15px)",

        padding:
          "11px 18px",

        borderRadius:
          "999px",

        background:
          "rgba(23,61,44,.94)",

        color:
          "#fff",

        fontSize:
          "12px",

        fontWeight:
          "700",

        zIndex:
          "500",

        opacity:
          "0",

        pointerEvents:
          "none",

        transition:
          ".25s ease",

        boxShadow:
          "0 10px 25px rgba(0,0,0,.18)"

      }
    );


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.style.opacity =
    "1";


  toast.style.transform =
    "translateX(-50%) translateY(0)";


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      () => {

        toast.style.opacity =
          "0";


        toast.style.transform =
          "translateX(-50%) translateY(15px)";

      },
      2200
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.target.matches(
        "input, textarea, [contenteditable='true']"
      )
    ) {

      return;

    }


    if (
      event.key === "ArrowRight"
    ) {

      next();

    }


    if (
      event.key === "ArrowLeft"
    ) {

      prev();

    }


    if (
      event.key === "Escape"
    ) {

      editor.classList.remove(
        "open"
      );

    }

  }
);


/* =========================================================
   PRINT EVENTS
========================================================= */

window.addEventListener(
  "beforeprint",
  () => {

    pages.forEach(
      page => {

        page.classList.remove(
          "flipped"
        );

      }
    );

  }
);


window.addEventListener(
  "afterprint",
  () => {

    restoreFlipState();

  }
);


/* =========================================================
   PREVENT DRAG IMAGE
========================================================= */

document.addEventListener(
  "dragstart",
  event => {

    if (
      event.target.tagName === "IMG"
    ) {

      event.preventDefault();

    }

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

bindEditable();

restore();

ensureTextKeys();

renderTexts();

buildAllTextEditor();

renderDots();