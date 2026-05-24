// Ontario Business Database landing page logic.
// 1) Replace LEAD_ENDPOINT with your deployed Google Apps Script Web App URL.
// 2) Replace GA4 ID in index.html from G-XXXXXXXXXX to your real GA4 Measurement ID.

const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbwpuh7IwXeQcN_XwuD8IFy_qbHGxBeYYqKK6MnUUxqCBtyMpAAd9hRqNaIJ9nlZshdY/exec";

const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");
const successPanel = document.getElementById("successPanel");
const year = document.getElementById("year");

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
  submitButton.textContent = isSubmitting ? "Saving..." : "Join early access list";
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
    message: "Thanks — your early access request has been received."
  };
}

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    track(element.dataset.track, {
      link_text: element.textContent.trim()
    });
  });
});

document.querySelectorAll('a[href="#reserve"]').forEach((element) => {
  element.addEventListener("click", () => {
    const emailInput = document.getElementById("email");

    setTimeout(() => {
      emailInput?.focus({ preventScroll: true });
    }, 500);
  });
});

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);

    const payload = {
      timestamp: new Date().toISOString(),
      email: String(formData.get("email") || "").trim(),
      useCase: String(formData.get("useCase") || "").trim(),
      region: String(formData.get("region") || "").trim(),
      payIntent: String(formData.get("payIntent") || "").trim(),
      requiredFields: String(formData.get("requiredFields") || "").trim(),
      consent: Boolean(formData.get("consent")),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      traffic: getTrafficSource()
    };

    if (!payload.email || !payload.useCase || !payload.region || !payload.payIntent || !payload.consent) {
      showStatus("Please complete the required fields before submitting.", "warning");
      return;
    }

    setSubmitting(true);
    track("form_submit_attempt", {
      region: payload.region,
      use_case: payload.useCase,
      pay_intent: payload.payIntent
    });

    try {
      const result = await submitLead(payload);

      track("form_submit", {
        region: payload.region,
        use_case: payload.useCase,
        pay_intent: payload.payIntent,
        saved_to_sheet: result.saved ? "yes" : "no"
      });

      if (payload.payIntent === "Yes") {
        track("price_interest_yes", {
          region: payload.region,
          use_case: payload.useCase
        });
      }

      leadForm.reset();
      leadForm.hidden = true;
      successPanel.hidden = false;
      showStatus(result.message, result.saved ? "success" : "warning");
      window.location.hash = "request-received";
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
