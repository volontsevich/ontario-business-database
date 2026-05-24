// Ontario Business Intelligence Database landing page logic.
// 1) Replace LEAD_ENDPOINT with your deployed Google Apps Script Web App URL.
// 2) Replace GA4 ID in index.html from G-XXXXXXXXXX to your real GA4 Measurement ID.

const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbwpuh7IwXeQcN_XwuD8IFy_qbHGxBeYYqKK6MnUUxqCBtyMpAAd9hRqNaIJ9nlZshdY/exec";

const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");
const interestModal = document.getElementById("interestModal");
const interestModalDialog = interestModal?.querySelector(".modal-dialog") || null;
const interestModalClose = document.getElementById("interestModalClose");
const interestModalAction = document.getElementById("interestModalAction");
const year = document.getElementById("year");
let lastFocusedElement = null;

if (year) {
  year.textContent = new Date().getFullYear();
}

function track(eventName, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

function getTrafficSource() {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    referrer: document.referrer || ""
  };
}

function showStatus(message, type = "success") {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = `form-status is-visible is-${type}`;
}

function setSubmitting(isSubmitting) {
  const submitButton = leadForm?.querySelector("button[type='submit']");

  if (!submitButton) return;

  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Submitting..." : "Continue purchase";
}

function openInterestModal() {
  if (!interestModal || !interestModalDialog) return;

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  interestModal.hidden = false;
  document.body.classList.add("modal-open");
  interestModalDialog.focus({ preventScroll: true });
}

function closeInterestModal() {
  if (!interestModal) return;

  interestModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus({ preventScroll: true });
  }
}

async function submitLead(payload) {
  const endpointIsConfigured =
    LEAD_ENDPOINT &&
    !LEAD_ENDPOINT.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE");

  if (!endpointIsConfigured) {
    const localLeads = JSON.parse(localStorage.getItem("ontarioBusinessDbLeads") || "[]");
    localLeads.push(payload);
    localStorage.setItem("ontarioBusinessDbLeads", JSON.stringify(localLeads));

    return {
      saved: false,
      message:
        "Demo mode: the lead was saved only in this browser. Add your Google Apps Script URL in script.js to save leads to Google Sheets."
    };
  }

  await fetch(LEAD_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  return {
    saved: true,
    message: "Your purchase request has been recorded."
  };
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    track(element.dataset.track, {
      link_text: element.textContent.trim()
    });
  });
});

document.querySelectorAll('a[href="#purchase"]').forEach((element) => {
  element.addEventListener("click", () => {
    const emailInput = document.getElementById("email");

    setTimeout(() => {
      emailInput?.focus({ preventScroll: true });
    }, 500);
  });
});

if (interestModal) {
  interestModal.addEventListener("click", (event) => {
    if (event.target === interestModal) {
      closeInterestModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !interestModal.hidden) {
      closeInterestModal();
    }
  });
}

interestModalClose?.addEventListener("click", closeInterestModal);
interestModalAction?.addEventListener("click", closeInterestModal);

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);

    const payload = {
      timestamp: new Date().toISOString(),
      email: String(formData.get("email") || "").trim(),
      useCase: "",
      region: "",
      payIntent: "Yes",
      requiredFields: "",
      consent: true,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      traffic: getTrafficSource()
    };

    if (!payload.email) {
      showStatus("Please enter your email address before submitting.", "warning");
      return;
    }

    setSubmitting(true);
    track("form_submit_attempt", {
      flow: "email_only_purchase_interest",
      pay_intent: payload.payIntent
    });

    try {
      const result = await submitLead(payload);

      track("form_submit", {
        flow: "email_only_purchase_interest",
        pay_intent: payload.payIntent,
        saved_to_sheet: result.saved ? "yes" : "no"
      });

      track("price_interest_yes", {
        flow: "email_only_purchase_interest"
      });

      leadForm.reset();
      showStatus(result.message, result.saved ? "success" : "warning");

      if (result.saved) {
        openInterestModal();
      }
    } catch (error) {
      console.error(error);
      track("form_submit_error", {
        error_message: error.message
      });

      showStatus(
        "Something went wrong while saving your request. Please try again in a moment.",
        "warning"
      );
    } finally {
      setSubmitting(false);
    }
  });
}
