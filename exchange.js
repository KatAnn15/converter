const toggleSettings = () => {
  const overlay = document.getElementById("overlay");
  const settingsContent = document.getElementById("settings-content");
  if (overlay.classList.contains("active")) {
    settingsContent.classList.remove("active");
    overlay.classList.remove("active");
  } else {
    settingsContent.classList.add("active");
    overlay.classList.add("active");
  }
};

const loadContent = async () => {
  const amount = document.getElementById("amount");
  const currency_from = document.getElementById("currency_from");
  const currency_to = document.getElementById("currency_to");
  const convertBtn = document.getElementById("convert_btn");
  const result = document.getElementById("result");
  const settingsBtn = document.getElementById("settings-icon");
  const overlay = document.getElementById("overlay");
  const defaultSettingsSelection = document.getElementById(
    "default-currency-select"
  );

  const { exExtDefCur: defaultCurrency } = await chrome.storage.local.get([
    "exExtDefCur",
  ]);

  const API_KEY = "pm5xCeCGMT87WlJ0DiFWMQ==AXMogONK5hrJe3kk";
  const API_URL = "https://api.api-ninjas.com/v1/exchangerate";

  if (defaultCurrency) {
    currency_from.value = defaultCurrency;
    defaultSettingsSelection.value = defaultCurrency;
  }

  convertBtn.addEventListener("click", async () => {
    const amountTotal = +amount.value;
    const URL = `${API_URL}?pair=${currency_from.value}_${currency_to.value}`;

    fetch(URL, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    })
      .then((fetchData) => fetchData.json())
      .then((response) => {
        const rate = response.exchange_rate;
        result.innerHTML = `${amountTotal} ${currency_from.value} = ${(
          amountTotal * rate
        ).toFixed(2)} ${currency_to.value}`;
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  settingsBtn.addEventListener("click", () => {
    toggleSettings();
  });
  overlay.addEventListener("click", () => {
    toggleSettings();
  });

  defaultSettingsSelection.addEventListener(
    "change",
    ({ target: { value } }) => {
      chrome.storage.local.set({ exExtDefCur: value });
      currency_from.value = value;
    }
  );
};

document.addEventListener("DOMContentLoaded", () => {
  loadContent();
});
