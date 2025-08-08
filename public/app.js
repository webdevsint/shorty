function copyToClipboard(code) {
  navigator.clipboard
    .writeText("https://" + window.location.hostname + "/" + code)
    .then(() => {
      showToast("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function isURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    if (e instanceof TypeError) {
      return false;
    }
    throw e;
  }
}

const toastContainer = document.getElementById("toast-container");

function showToast(message, type , duration = 3000) {
  const toast = document.createElement("div");
  toast.textContent = message;

  toast.classList.add("toast");

  toastContainer.appendChild(toast);

  // Trigger show animation after a small delay to allow CSS transition
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Hide and remove the toast after the specified duration
  setTimeout(() => {
    toast.classList.remove("show");
    // Remove the toast from the DOM after the transition ends
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
      },
      { once: true }
    ); // Ensure the event listener is removed after it fires once
  }, duration);
}

function renderShorts() {
  // get shorts from local storage
  const shorts = JSON.parse(localStorage.getItem("shorts")) || [];

  document.querySelector(".url-list-items").innerHTML = "";
  document.querySelector(".heading").style.display = "block";
  document.querySelector(".clear-button").style.display = "block";
  document.querySelector(".alert").style.display = "none";

  shorts.forEach((short) => {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="copyToClipboard('${short.code}')" class="copy-btn" title="Copy URL"><i class="fa-regular fa-copy"></i></button><p>${short.title}</p><p><span>URL ID:</span> <a href="/${short.code}" target="_blank">${short.code}</a></p>`;
    document.querySelector(".url-list-items").appendChild(li);
  });

  if (shorts.length === 0) {
    document.querySelector(".heading").style.display = "none";
    document.querySelector(".clear-button").style.display = "none";
    document.querySelector(".alert").style.display = "flex";
  }
}

document.querySelector(".clear-button").onclick = () => {
  localStorage.removeItem("shorts");
  renderShorts();
  showToast("Shorts list cleared!");
};

document.addEventListener("DOMContentLoaded", () => {
  renderShorts();
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const urlInput = document.querySelector("#url-input").value.trim();
  if (!isURL(urlInput)) {
    document.querySelector("#url-input").value = "";
    showToast("Please enter a valid URL.", "error");
    return;
  } else {
    fetch("/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: document.querySelector("#title-input").value,
        url: document.querySelector("#url-input").value,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Short created:", data);

        showToast("URL shortened successfully!");

        // store in the local storage
        const storedShorts = JSON.parse(localStorage.getItem("shorts")) || [];
        storedShorts.push(data);
        localStorage.setItem("shorts", JSON.stringify(storedShorts));

        renderShorts();

        document.querySelector("#title-input").value = ""; // Clear the input field
        document.querySelector("#url-input").value = ""; // Clear the input field
        document.querySelector(".alert").style.display = "none";
      });
  }
});
