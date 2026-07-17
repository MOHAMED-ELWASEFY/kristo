document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-platform]").forEach((button) => {
  button.addEventListener("click", () => {
    const platform = button.dataset.platform;

    // Optional analytics hook:
    // gtag("event", "order_click", { platform });
    // ttq.track("ClickButton", { content_name: platform });

    console.log(`Order button clicked: ${platform}`);
  });
});
