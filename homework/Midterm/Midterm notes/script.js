const EDITOR_STORAGE_KEY = "campushub-midterm-edit-content-v3";
const EDITOR_PASSWORD = "campushub2026";
const CARD_ACCENTS = [
  "accent-pink",
  "accent-purple",
  "accent-blue",
  "accent-green",
  "accent-yellow"
];

const staticEditableSelectors = [
  ".cover-copy .cover-eyebrow",
  ".cover-copy h1",
  ".cover-copy .cover-title",
  ".cover-copy .cover-summary",
  ".cover-info dt",
  ".cover-info dd",
  ".cover-info dd a",
  ".info-card-title strong",
  ".info-reminder",
  ".sidebar-note strong",
  ".sidebar-note p"
];

const reportEditableSelectors = [
  ".chapter-kicker",
  ".chapter-heading h2",
  ".chapter-card h3",
  ".chapter-card p",
  ".chapter-card li",
  ".chapter-card blockquote",
  ".chapter-card th",
  ".chapter-card td",
  ".chapter-card pre",
  ".chapter-card .note-box",
  ".chapter-card .idea-card",
  ".chapter-card .feature-card",
  ".chapter-card .timeline-item > div",
  ".chapter-card .future-grid section",
  ".chapter-card .closing-note div"
];

const progressBar = document.querySelector("#reading-progress-bar");
const backToTopButton = document.querySelector("#back-to-top");
const printButton = document.querySelector("#print-report");

const editorToolbar = document.querySelector("#editor-toolbar");
const editorStatus = document.querySelector("#editor-status");
const enterEditModeButton = document.querySelector("#enter-edit-mode");
const addCardButton = document.querySelector("#add-card");
const saveEditsButton = document.querySelector("#save-edits");
const cancelEditsButton = document.querySelector("#cancel-edits");
const resetEditsButton = document.querySelector("#reset-edits");

const editorAuth = document.querySelector("#editor-auth");
const editorAuthForm = document.querySelector("#editor-auth-form");
const editorAuthCancelButton = document.querySelector("#editor-auth-cancel");
const editorPasswordInput = document.querySelector("#editor-password-input");
const editorAuthMessage = document.querySelector("#editor-auth-message");

const coverInfo = document.querySelector(".cover-info");
const reportContent = document.querySelector("#report-content");
const chapterNav = document.querySelector(".chapter-nav");
const mobileTocLinks = document.querySelector(".mobile-toc-links");

let staticEditableElements = [];
let reportEditableElements = [];
let allEditableElements = [];
let chapterSections = [];
let navigationLinks = [];
let chapterObserver = null;
let isEditMode = false;
let savedSnapshot = null;

initializeStaticEditableElements();

const defaultSnapshot = captureSnapshot();
applySavedContent();
refreshReportState();
savedSnapshot = captureSnapshot();
updateEditingState(false);

function initializeStaticEditableElements() {
  staticEditableElements = collectEditableElements(document, staticEditableSelectors).map(
    (element, index) => {
      element.dataset.staticEditId = `static-edit-${index}`;
      element.classList.add("editable-target");
      element.spellcheck = false;
      bindEditableInputListener(element);
      return element;
    }
  );
}

function collectEditableElements(scope, selectors) {
  const candidates = new Set();

  selectors.forEach((selector) => {
    scope.querySelectorAll(selector).forEach((element) => {
      if (element.closest(".editor-toolbar, .editor-auth")) {
        return;
      }

      if (element.matches(".cover-info dd") && element.querySelector("a")) {
        return;
      }

      candidates.add(element);
    });
  });

  return [...candidates].filter((element) => {
    return ![...candidates].some((other) => {
      return other !== element && other.contains(element);
    });
  });
}

function bindEditableInputListener(element) {
  if (element.dataset.editBound === "true") {
    return;
  }

  element.addEventListener("input", () => {
    if (!isEditMode) {
      return;
    }

    refreshReportState();
    updateEditorStatus("你正在編輯中。可以直接改字，也可以按「新增卡片」加入新的內容格。");
  });

  element.dataset.editBound = "true";
}

function captureStaticSnapshot() {
  return staticEditableElements.reduce((snapshot, element) => {
    snapshot[element.dataset.staticEditId] = {
      html: element.innerHTML,
      href: element.tagName === "A" ? element.getAttribute("href") || "" : null
    };
    return snapshot;
  }, {});
}

function applyStaticSnapshot(snapshot) {
  staticEditableElements.forEach((element) => {
    const savedContent = snapshot[element.dataset.staticEditId];

    if (!savedContent) {
      return;
    }

    element.innerHTML = savedContent.html;

    if (element.tagName === "A" && typeof savedContent.href === "string") {
      element.setAttribute("href", savedContent.href);
    }
  });
}

function captureSnapshot() {
  return {
    staticContent: captureStaticSnapshot(),
    reportContentHtml: reportContent.innerHTML
  };
}

function applySnapshot(snapshot) {
  applyStaticSnapshot(snapshot.staticContent || {});

  if (typeof snapshot.reportContentHtml === "string") {
    reportContent.innerHTML = snapshot.reportContentHtml;
  }

  refreshReportState();
}

function applySavedContent() {
  try {
    const rawValue = window.localStorage.getItem(EDITOR_STORAGE_KEY);

    if (!rawValue) {
      return;
    }

    applySnapshot(JSON.parse(rawValue));
  } catch (error) {
    console.error("Unable to read saved editor content.", error);
  }
}

function refreshReportState() {
  normalizeChapterCards();
  renderNavigation();
  refreshReportEditableElements();
  observeChapters();
  updateReadingProgress();
}

function normalizeChapterCards() {
  chapterSections = [...reportContent.querySelectorAll("article.chapter-card[data-chapter]")];

  chapterSections.forEach((section, index) => {
    const label = section.querySelector(".chapter-label");

    if (label) {
      label.textContent = `Chapter ${String(index + 1).padStart(2, "0")}`;
    }

    if (!section.id) {
      section.id = createUniqueSectionId(`section-${index + 1}`);
    }
  });
}

function renderNavigation() {
  const items = chapterSections
    .map((section, index) => {
      const heading = section.querySelector(".chapter-heading h2");
      const title = heading?.textContent.trim();

      if (!title) {
        return "";
      }

      return {
        id: section.id,
        title,
        number: String(index + 1).padStart(2, "0")
      };
    })
    .filter(Boolean);

  chapterNav.innerHTML = items
    .map((item) => `<a href="#${item.id}"><span>${item.number}</span>${item.title}</a>`)
    .join("");

  mobileTocLinks.innerHTML = items
    .map((item) => `<a href="#${item.id}">${item.title}</a>`)
    .join("");

  navigationLinks = [
    ...document.querySelectorAll(".chapter-nav a, .mobile-toc-links a")
  ];
}

function refreshReportEditableElements() {
  reportEditableElements = collectEditableElements(reportContent, reportEditableSelectors).map(
    (element) => {
      element.classList.add("editable-target");
      element.spellcheck = false;
      bindEditableInputListener(element);
      return element;
    }
  );

  allEditableElements = [...staticEditableElements, ...reportEditableElements];
  allEditableElements.forEach((element) => {
    element.contentEditable = isEditMode ? "true" : "false";
  });
}

function observeChapters() {
  if (chapterObserver) {
    chapterObserver.disconnect();
  }

  chapterObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

      if (visibleEntries.length > 0) {
        setActiveChapter(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0.05, 0.2, 0.45]
    }
  );

  chapterSections.forEach((section) => chapterObserver.observe(section));
}

function setActiveChapter(chapterId) {
  navigationLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${chapterId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateReadingProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

  progressBar.style.width = `${Math.min(progress, 100)}%`;
  backToTopButton.classList.toggle("is-visible", window.scrollY > 520);
}

function updateEditorStatus(message) {
  editorStatus.textContent = message;
}

function updateEditingState(shouldEdit) {
  isEditMode = shouldEdit;
  document.body.classList.toggle("is-edit-mode", shouldEdit);
  editorToolbar.classList.toggle("is-editing", shouldEdit);

  allEditableElements.forEach((element) => {
    element.contentEditable = shouldEdit ? "true" : "false";
  });

  enterEditModeButton.disabled = shouldEdit;
  addCardButton.disabled = !shouldEdit;
  saveEditsButton.disabled = !shouldEdit;
  cancelEditsButton.disabled = !shouldEdit;
}

function showPasswordPrompt() {
  editorPasswordInput.value = "";
  editorAuthMessage.textContent = "";
  editorAuth.hidden = false;
  editorPasswordInput.focus();
}

function hidePasswordPrompt() {
  editorAuth.hidden = true;
  editorAuthMessage.textContent = "";
}

function verifyPassword(password) {
  return password === EDITOR_PASSWORD;
}

function saveCurrentContent() {
  const snapshot = captureSnapshot();

  window.localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(snapshot));
  savedSnapshot = snapshot;
  updateEditingState(false);
  updateEditorStatus("變更已儲存。新增的卡片和文字都會保留在這個瀏覽器。");
}

function cancelEditing() {
  applySnapshot(savedSnapshot);
  updateEditingState(false);
  updateEditorStatus("已離開編輯模式，未儲存的修改已取消。");
}

function resetToDefaultContent() {
  const shouldReset = window.confirm("確定要還原成原本的報告內容嗎？新增卡片和已儲存修改都會被清除。");

  if (!shouldReset) {
    return;
  }

  window.localStorage.removeItem(EDITOR_STORAGE_KEY);
  applySnapshot(defaultSnapshot);
  savedSnapshot = captureSnapshot();
  updateEditingState(false);
  updateEditorStatus("已還原成預設內容。");
}

function createUniqueSectionId(base) {
  const sanitized = (base || "new-section")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "new-section";

  let uniqueId = sanitized;
  let counter = 2;

  while (document.getElementById(uniqueId)) {
    uniqueId = `${sanitized}-${counter}`;
    counter += 1;
  }

  return uniqueId;
}

function addNewCard() {
  const newCard = document.createElement("article");
  const accentClass = CARD_ACCENTS[chapterSections.length % CARD_ACCENTS.length];

  newCard.className = `chapter-card ${accentClass}`;
  newCard.dataset.chapter = "";
  newCard.id = createUniqueSectionId("new-section");
  newCard.innerHTML = `
    <header class="chapter-heading">
      <span class="chapter-label">Chapter 00</span>
      <div>
        <p class="chapter-kicker">New Note</p>
        <h2>新章節</h2>
      </div>
    </header>
    <p>請在這裡輸入新的內容。</p>
    <div class="note-box">
      <strong>重點：</strong>
      在這裡補上這張卡片的重點整理。
    </div>
  `;

  const reportFooter = reportContent.querySelector(".report-footer");

  if (reportFooter) {
    reportContent.insertBefore(newCard, reportFooter);
  } else {
    reportContent.append(newCard);
  }

  refreshReportState();
  updateEditingState(true);
  updateEditorStatus("已新增一張卡片。你可以直接修改標題和內容，完成後記得儲存。");

  const heading = newCard.querySelector(".chapter-heading h2");

  if (heading) {
    heading.focus();
  }
}

document.addEventListener("click", (event) => {
  if (!isEditMode) {
    return;
  }

  const editableLink = event.target.closest("a.editable-target");

  if (editableLink) {
    event.preventDefault();
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

printButton.addEventListener("click", () => {
  window.print();
});

enterEditModeButton.addEventListener("click", () => {
  showPasswordPrompt();
});

addCardButton.addEventListener("click", () => {
  addNewCard();
});

saveEditsButton.addEventListener("click", () => {
  saveCurrentContent();
});

cancelEditsButton.addEventListener("click", () => {
  cancelEditing();
});

resetEditsButton.addEventListener("click", () => {
  resetToDefaultContent();
});

editorAuthCancelButton.addEventListener("click", () => {
  hidePasswordPrompt();
});

editorAuthForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = editorPasswordInput.value.trim();

  if (!verifyPassword(password)) {
    editorAuthMessage.textContent = "密碼不正確，請再試一次。";
    editorPasswordInput.select();
    return;
  }

  hidePasswordPrompt();
  savedSnapshot = captureSnapshot();
  updateEditingState(true);
  updateEditorStatus("已進入編輯模式。現在可以改字，也可以按「新增卡片」增加新的格子。");
});

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);

setActiveChapter(chapterSections[0]?.id ?? "");
updateReadingProgress();
