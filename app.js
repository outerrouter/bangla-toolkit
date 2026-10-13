// ===== ট্যাব সুইচ =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ===== ক্যালকুলেটর =====
const display = document.getElementById('calcDisplay');
let expr = '';
function appendCalc(v) { expr += v; display.textContent = expr; }
function clearCalc() { expr = ''; display.textContent = '0'; }
function backspace() { expr = expr.slice(0, -1); display.textContent = expr || '0'; }
function calculate() {
  try {
    const result = Function('"use strict"; return (' + expr + ')')();
    display.textContent = Number.isInteger(result) ? result : parseFloat(result.toFixed(8));
    expr = String(display.textContent);
  } catch { display.textContent = 'ভুল হয়েছে!'; expr = ''; }
}

// ===== কনভার্টার =====
const KM = { km: 1, mile: 0.621371, m: 1000, ft: 3280.84 };
const WT = { kg: 1, lb: 2.20462, g: 1000 };
function num(id) { return parseFloat(document.getElementById(id).value); }
function fmt(v) { return isNaN(v) ? '—' : parseFloat(v.toFixed(4)); }
function convertLength() {
  const v = num('lenValue'); if (isNaN(v)) { document.getElementById('lenResult').textContent = '—'; return; }
  const km = v / KM[document.getElementById('lenFrom').value];
  document.getElementById('lenResult').textContent =
    `${fmt(km)} কিলোমিটার\n${fmt(km * KM.mile)} মাইল\n${fmt(km * KM.m)} মিটার\n${fmt(km * KM.ft)} ফুট`;
}
function convertWeight() {
  const v = num('wtValue'); if (isNaN(v)) { document.getElementById('wtResult').textContent = '—'; return; }
  const kg = v / WT[document.getElementById('wtFrom').value];
  document.getElementById('wtResult').textContent =
    `${fmt(kg)} কিলোগ্রাম\n${fmt(kg * WT.lb)} পাউন্ড\n${fmt(kg * WT.g)} গ্রাম`;
}
function convertTemp() {
  const v = num('tempValue'); if (isNaN(v)) { document.getElementById('tempResult').textContent = '—'; return; }
  const from = document.getElementById('tempFrom').value;
  const c = from === 'c' ? v : (v - 32) * 5 / 9;
  const f = from === 'f' ? v : c * 9 / 5 + 32;
  const k = c + 273.15;
  document.getElementById('tempResult').textContent =
    `${fmt(c)} °C (সেলসিয়াস)\n${fmt(f)} °F (ফারেনহাইট)\n${fmt(k)} K (কেলভিন)`;
}

// ===== পাসওয়ার্ড জেনারেটর =====
const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  num: '0123456789',
  sym: '!@#$%^&*()-_=+[]{};:,.<>?'
};
function genPassword() {
  let chars = '';
  if (document.getElementById('optUpper').checked) chars += SETS.upper;
  if (document.getElementById('optLower').checked) chars += SETS.lower;
  if (document.getElementById('optNum').checked) chars += SETS.num;
  if (document.getElementById('optSym').checked) chars += SETS.sym;
  if (!chars) { alert('অন্তত এক ধরনের অক্ষর বেছে নিন!'); return; }
  const len = parseInt(document.getElementById('passLen').value);
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let pass = '';
  for (let i = 0; i < len; i++) pass += chars[arr[i] % chars.length];
  document.getElementById('passDisplay').textContent = pass;
  const strength = document.getElementById('strength');
  strength.className = 'strength ' + (len >= 16 && chars.length > 60 ? 'strong' : len >= 10 ? 'medium' : 'weak');
}
function copyPassword() {
  const t = document.getElementById('passDisplay').textContent;
  if (t && t !== 'ক্লিক করে তৈরি করুন') navigator.clipboard.writeText(t).then(() => alert('কপি হয়েছে! 📋'));
}
document.getElementById('passDisplay').addEventListener('click', genPassword);

// ===== টু-ডু লিস্ট =====
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
function saveTodos() { localStorage.setItem('todos', JSON.stringify(todos)); renderTodos(); }
function addTodo() {
  const input = document.getElementById('todoText');
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  input.value = '';
  saveTodos();
}
function toggleTodo(i) { todos[i].done = !todos[i].done; saveTodos(); }
function deleteTodo(i) { todos.splice(i, 1); saveTodos(); }
function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = todos.map((t, i) =>
    `<li class="${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTodo(${i})">
      <span>${t.text}</span>
      <button class="del" onclick="deleteTodo(${i})">🗑️</button>
    </li>`).join('');
}
renderTodos();
