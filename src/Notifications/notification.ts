export function succesfullNotification(text: string) {
  const notification = document.getElementById("succesFull");
  if (!notification) return;

  notification.querySelector("p")!.textContent = text;

  notification.classList.add("notification--visible");

  window.setTimeout(() => {
    notification.classList.remove("notification--visible");
  }, 3000);
}
export function errorNotification(text: string) {
  const notification = document.getElementById("errorNotification");
  if (!notification) return;

  notification.querySelector("p")!.textContent = text;

  notification.classList.add("notification--visible");

  window.setTimeout(() => {
    notification.classList.remove("notification--visible");
  }, 3000);
}

export function alertNotificaction(text: string) {
  const notification = document.getElementById("allertNotification");
  if (!notification) return;

  notification.querySelector("p")!.textContent = text;

  notification.classList.add("notification--visible");

  window.setTimeout(() => {
    notification.classList.remove("notification--visible");
  }, 3000);
}
