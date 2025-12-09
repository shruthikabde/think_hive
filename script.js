// === NAVBAR DROPDOWN (Quick Links) ===
document.addEventListener("click", (e) => {
  const dropdown = document.querySelector(".nav-dropdown");
  if (!dropdown) return;

  const btn = dropdown.querySelector(".nav-dropdown-btn");
  const menu = dropdown.querySelector(".nav-dropdown-menu");

  if (btn.contains(e.target)) {
    // Toggle menu
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  } else if (!dropdown.contains(e.target)) {
    menu.style.display = "none";
  }
});

// === HOME PAGE: SCROLL TO COLLAB FORM (only if button exists) ===
const openCollabFormBtn = document.getElementById("openCollabFormBtn");
const collabSection = document.getElementById("collabSection");

if (openCollabFormBtn && collabSection) {
  openCollabFormBtn.addEventListener("click", () => {
    collabSection.scrollIntoView({ behavior: "smooth" });
  });
}

// === SHOW / HIDE "OTHER BUSINESS" TEXTAREA ===
function attachBusinessTypeListener(selectEl, otherRowEl) {
  if (!selectEl || !otherRowEl) return;

  selectEl.addEventListener("change", () => {
    if (selectEl.value === "Other") {
      otherRowEl.classList.remove("hidden");
    } else {
      otherRowEl.classList.add("hidden");
    }
  });
}

// For pages where the main form uses either id="businessType" or id="businessTypeContact"
const homeBusinessSelect =
  document.getElementById("businessType") ||
  document.getElementById("businessTypeContact");
const homeOtherRow = document.getElementById("otherBusinessRow");
attachBusinessTypeListener(homeBusinessSelect, homeOtherRow);

// Contact page select (if present with data-other-row)
const contactBusinessSelect = document.getElementById("businessTypeContact");
const contactOtherRow = document.querySelector("[data-other-row]");
attachBusinessTypeListener(contactBusinessSelect, contactOtherRow);

// === FORM SUBMIT → GOOGLE SHEETS (via Apps Script) ===
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyac7lzxTMN_fg_roFvoEVOw6uGikrZvThpDLyQkYGMnsz9r2UKTOIJH4AVe9Faz5Yl/exec";

function handleLeadFormSubmit(form) {
  const messageEl = form.querySelector(".form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!messageEl) return;

    // Show loading text first
    messageEl.textContent = "Submitting...";
    messageEl.style.color = "#111827";

    const formData = new FormData(form);

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors", // required for Apps Script
    })
      .then(() => {
        // We assume success if request didn't crash
        messageEl.textContent = "Form successfully submitted!";
        messageEl.style.color = "green";
        alert("Form submitted successfully!");
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        messageEl.textContent =
          "Something went wrong. Please try again later.";
        messageEl.style.color = "red";
      });
  });
}

// Attach to all forms with class "lead-form"
document.querySelectorAll(".lead-form").forEach((form) => {
  handleLeadFormSubmit(form);
});
const form = document.querySelector(".lead-form");

if (form) {   // ✅ only run this on pages that actually have the form
  form.addEventListener("submit", function (e) {
    let valid = true;

    // Remove previous errors
    document.querySelectorAll(".error-msg").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    // Validate required fields
    form.querySelectorAll("[required]").forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add("input-error");

        const msg = document.createElement("div");
        msg.className = "error-msg";
        msg.textContent = "This field is required";
        input.insertAdjacentElement("afterend", msg);
      }
    });

    if (!valid) e.preventDefault();
  });
}

// ==== MOBILE HEADER COLLAPSE ON SCROLL (ALL PAGES) ====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (!header) return; // safety: if a page doesn't have header, don't break

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
});



