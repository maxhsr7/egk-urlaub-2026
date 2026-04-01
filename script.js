const users = ["Max", "Luca", "Joris", "Hoffi", "Tyler", "Simon", "Luick"];
const loginSection = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const userButtons = document.getElementById("userButtons");
const tabContent = document.getElementById("tabContent");
const usernameDisplay = document.getElementById("usernameDisplay");

users.forEach(u => {
  const btn = document.createElement("button");
  btn.textContent = u;
  btn.addEventListener("click", () => login(u));
  userButtons.appendChild(btn);
});

function login(name) {
  localStorage.setItem("egkUser", name);
  usernameDisplay.textContent = `Eingeloggt als ${name}`;
  loginSection.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadTab("kosten");
}

const navButtons = document.querySelectorAll(".tab");
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadTab(btn.dataset.tab);
  });
});

function loadTab(tab) {
  switch(tab) {
    case "kosten":
      loadKosten();
      break;
    case "budget":
      loadBudget();
      break;
    case "termine":
      loadTermine();
      break;
  }
}

function loadKosten() {
  const data = JSON.parse(localStorage.getItem("egkKosten") || "[]");
  let html = `<h3>Kostenübersicht</h3>
    <ul>${data.map(x => `<li>${x.name}: €${x.amount} (${x.desc})</li>`).join("")}</ul>
    <h4>Neue Ausgabe:</h4>
    <input id="kdesc" placeholder="Beschreibung">
    <input id="kamount" type="number" placeholder="Betrag">
    <button onclick="addCost()">Hinzufügen</button>`;
  tabContent.innerHTML = html;
}

function addCost() {
  const name = localStorage.getItem("egkUser");
  const desc = document.getElementById("kdesc").value;
  const amount = parseFloat(document.getElementById("kamount").value);
  if (!desc || !amount) return;
  const data = JSON.parse(localStorage.getItem("egkKosten") || "[]");
  data.push({ name, desc, amount });
  localStorage.setItem("egkKosten", JSON.stringify(data));
  loadKosten();
}

function loadBudget() {
  const name = localStorage.getItem("egkUser");
  const budget = JSON.parse(localStorage.getItem(`egkBudget-${name}`) || '{"flug":0,"unterkunft":0}');
  tabContent.innerHTML = `
    <h3>Mein Budget</h3>
    <label>Flug (€): <input id="flugBudget" type="number" value="${budget.flug}"></label><br>
    <label>Unterkunft (€): <input id="unterkunftBudget" type="number" value="${budget.unterkunft}"></label><br>
    <button onclick="saveBudget()">Speichern</button>
  `;
}

function saveBudget() {
  const name = localStorage.getItem("egkUser");
  const budget = {
    flug: parseFloat(document.getElementById("flugBudget").value),
    unterkunft: parseFloat(document.getElementById("unterkunftBudget").value)
  };
  localStorage.setItem(`egkBudget-${name}`, JSON.stringify(budget));
  alert("Budget gespeichert!");
}

function loadTermine() {
  const name = localStorage.getItem("egkUser");
  let html = `<h3>Urlaubszeiträume angeben</h3>
    <p>Markiere deine verfügbaren Wochen im Sommer 2026.</p>
    <textarea id="termineText" rows="5" style="width:100%"></textarea>
    <button onclick="saveTermine()">Speichern</button>`;
  tabContent.innerHTML = html;
}

function saveTermine() {
  const name = localStorage.getItem("egkUser");
  const text = document.getElementById("termineText").value;
  localStorage.setItem(`egkTermine-${name}`, text);
  alert("Termine gespeichert!");
}
