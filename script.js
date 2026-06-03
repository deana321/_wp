const CONTENT_STORAGE_KEY = "web-design-portfolio-content-v1";
const SCREENSHOT_STORAGE_KEY = "web-design-portfolio-screenshots-v1";
const EDIT_PASSWORD = "weizzz0524";

const backToTopButton = document.querySelector(".back-to-top");
const editModeButton = document.getElementById("edit-mode-button");
const editorToolbar = document.getElementById("editor-toolbar");
const saveEditButton = document.getElementById("save-edit-button");
const cancelEditButton = document.getElementById("cancel-edit-button");
const passwordDialog = document.getElementById("edit-password-dialog");
const passwordForm = document.getElementById("edit-password-form");
const passwordInput = document.getElementById("edit-password-input");
const passwordError = document.getElementById("edit-password-error");
const closeEditDialogButton = document.getElementById("close-edit-dialog");
const cancelPasswordButton = document.getElementById("cancel-password-button");
const saveToast = document.getElementById("save-toast");

let isEditMode = false;
let editSnapshot = {};
let screenshotSnapshot = {};
let screenshotData = loadStoredObject(SCREENSHOT_STORAGE_KEY);
let toastTimer;

function updateBackToTop() {
  if (window.scrollY > 420) {
    backToTopButton.classList.add("is-visible");
  } else {
    backToTopButton.classList.remove("is-visible");
  }
}

function loadStoredObject(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function markElements(selector, keyPrefix) {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.dataset.editKey = `${keyPrefix}-${index + 1}`;
  });
}

function wrapDetailValues() {
  document.querySelectorAll(".detail-copy li").forEach((listItem, listIndex) => {
    const editableTextNodes = Array.from(listItem.childNodes).filter((node) => {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
    });

    editableTextNodes.forEach((textNode, partIndex) => {
      const valueSpan = document.createElement("span");
      valueSpan.className = "detail-value";
      valueSpan.dataset.editKey = `detail-value-${listIndex + 1}-${partIndex + 1}`;
      valueSpan.textContent = textNode.textContent;
      listItem.replaceChild(valueSpan, textNode);
    });
  });
}

function prepareEditableContent() {
  wrapDetailValues();
  markElements(".hero-copy .eyebrow", "hero-eyebrow");
  markElements(".hero-copy h1", "hero-title");
  markElements(".hero-copy p", "hero-description");
  markElements(".board-note strong", "board-course");
  markElements(".info-list dd", "course-value");
  markElements(".assignment-card h3", "assignment-title");
  markElements(".assignment-card p", "assignment-summary");
  markElements(".assignment-card .chip-row span", "assignment-tech");
  markElements(".detail-card > h3", "detail-title");
  markElements(".detail-card .inline-chip", "detail-tech");
  markElements(".reflection-card h3", "reflection-title");
  markElements(".reflection-card p", "reflection-text");
  markElements(".site-footer p", "footer-text");
}

function getEditableElements() {
  return Array.from(document.querySelectorAll("[data-edit-key]"));
}

function collectEditableContent() {
  return getEditableElements().reduce((content, element) => {
    content[element.dataset.editKey] = element.innerText.replace(/\r\n/g, "\n");
    return content;
  }, {});
}

function applyEditableContent(content) {
  getEditableElements().forEach((element) => {
    const key = element.dataset.editKey;
    if (Object.prototype.hasOwnProperty.call(content, key)) {
      element.innerText = content[key];
    }
  });
}

function setEditMode(enabled) {
  isEditMode = enabled;
  document.body.classList.toggle("edit-mode", enabled);
  editorToolbar.setAttribute("aria-hidden", String(!enabled));
  editModeButton.disabled = enabled;
  editModeButton.textContent = enabled ? "編輯中" : "編輯";

  getEditableElements().forEach((element) => {
    if (enabled) {
      element.setAttribute("contenteditable", "true");
      element.setAttribute("spellcheck", "true");
    } else {
      element.removeAttribute("contenteditable");
      element.removeAttribute("spellcheck");
    }
  });
}

function openPasswordDialog() {
  passwordInput.value = "";
  passwordError.textContent = "";

  if (typeof passwordDialog.showModal === "function") {
    passwordDialog.showModal();
  } else {
    passwordDialog.setAttribute("open", "");
  }

  passwordInput.focus();
}

function closePasswordDialog() {
  if (typeof passwordDialog.close === "function") {
    passwordDialog.close();
  } else {
    passwordDialog.removeAttribute("open");
  }
}

function enterEditMode() {
  editSnapshot = collectEditableContent();
  screenshotSnapshot = cloneData(screenshotData);
  setEditMode(true);
  showToast("已進入編輯模式");
}

function saveEdits() {
  const content = collectEditableContent();

  try {
    localStorage.setItem(SCREENSHOT_STORAGE_KEY, JSON.stringify(screenshotData));
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    showToast("儲存失敗，圖片可能太大");
    return;
  }

  editSnapshot = cloneData(content);
  screenshotSnapshot = cloneData(screenshotData);
  setEditMode(false);
  showToast("已儲存");
}

function cancelEdits() {
  applyEditableContent(editSnapshot);
  screenshotData = cloneData(screenshotSnapshot);
  renderAllScreenshots();
  setEditMode(false);
  showToast("已取消修改");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  saveToast.textContent = message;
  saveToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    saveToast.classList.remove("is-visible");
  }, 2200);
}

function renderScreenshotFrame(frame) {
  const screenshotKey = frame.dataset.screenshotKey;
  const display = frame.querySelector(".screenshot-display");
  const removeButton = frame.querySelector(".screenshot-remove");
  const storedImage = screenshotData[screenshotKey];

  display.replaceChildren();

  if (storedImage) {
    const image = document.createElement("img");
    image.src = storedImage;
    image.alt = "成果截圖";
    display.appendChild(image);
  } else {
    const label = document.createElement("span");
    const hint = document.createElement("small");
    label.textContent = "成果截圖";
    hint.textContent = "圖片之後補上";
    display.append(label, hint);
  }

  removeButton.disabled = !storedImage;
}

function renderAllScreenshots() {
  document.querySelectorAll(".screenshot-frame[data-screenshot-key]").forEach((frame) => {
    renderScreenshotFrame(frame);
  });
}

function handleScreenshotFile(frame, fileInput) {
  const file = fileInput.files[0];
  const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];

  if (!file || !isEditMode) {
    fileInput.value = "";
    return;
  }

  if (!allowedTypes.includes(file.type)) {
    showToast("請選擇 PNG、JPG、WEBP 或 GIF 圖片");
    fileInput.value = "";
    return;
  }

  if (file.size > 4 * 1024 * 1024) {
    showToast("圖片較大，可能無法儲存");
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (typeof reader.result === "string") {
      screenshotData[frame.dataset.screenshotKey] = reader.result;
      renderScreenshotFrame(frame);
    }
    fileInput.value = "";
  });
  reader.readAsDataURL(file);
}

function initScreenshotEditors() {
  document.querySelectorAll(".screenshot-frame[data-screenshot-key]").forEach((frame) => {
    const fileInput = frame.querySelector(".file-input");
    const removeButton = frame.querySelector(".screenshot-remove");

    fileInput.addEventListener("change", () => {
      handleScreenshotFile(frame, fileInput);
    });

    removeButton.addEventListener("click", () => {
      if (!isEditMode) return;
      delete screenshotData[frame.dataset.screenshotKey];
      renderScreenshotFrame(frame);
    });
  });
}

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

editModeButton.addEventListener("click", openPasswordDialog);

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === EDIT_PASSWORD) {
    closePasswordDialog();
    enterEditMode();
  } else {
    passwordError.textContent = "密碼錯誤，請再試一次";
    passwordInput.select();
  }
});

closeEditDialogButton.addEventListener("click", closePasswordDialog);
cancelPasswordButton.addEventListener("click", closePasswordDialog);
saveEditButton.addEventListener("click", saveEdits);
cancelEditButton.addEventListener("click", cancelEdits);

document.addEventListener("keydown", (event) => {
  if (isEditMode && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveEdits();
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!isEditMode) return;
  event.preventDefault();
  event.returnValue = "";
});

window.addEventListener("scroll", updateBackToTop, { passive: true });

prepareEditableContent();
applyEditableContent(loadStoredObject(CONTENT_STORAGE_KEY));
initScreenshotEditors();
renderAllScreenshots();
setEditMode(false);
updateBackToTop();
