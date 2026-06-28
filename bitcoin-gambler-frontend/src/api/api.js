const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return handleResponse(res);
}

export async function getUserById(id) {
  const res = await fetch(`${API_BASE}/users/${id}`);
  return handleResponse(res);
}

export async function createUser(username, balance) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, balance }),
  });
  return handleResponse(res);
}

export async function registerUser(username, password, balance) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, balance }),
  });
  return handleResponse(res);
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function updateUser(id, username, balance) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, balance }),
  });
  return handleResponse(res);
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

export async function getBets() {
  const res = await fetch(`${API_BASE}/bets`);
  return handleResponse(res);
}

export async function getBetById(id) {
  const res = await fetch(`${API_BASE}/bets/${id}`);
  return handleResponse(res);
}

export async function getBetsByUserId(userId) {
  const res = await fetch(`${API_BASE}/bets/user/${userId}`);
  return handleResponse(res);
}

export async function placeBet(userId, amount, prediction, timeframe) {
  const res = await fetch(`${API_BASE}/bets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount, prediction, timeframe }),
  });
  return handleResponse(res);
}

export async function getBitcoinPrice() {
  const res = await fetch(`${API_BASE}/bitcoin/price`);
  return handleResponse(res);
}

export async function getBitcoinHistory() {
  const res = await fetch(`${API_BASE}/bitcoin/history`);
  return handleResponse(res);
}

export async function getTransactionsByUserId(userId) {
  const res = await fetch(`${API_BASE}/transactions/user/${userId}`);
  return handleResponse(res);
}

export async function deposit(userId, amount) {
  const res = await fetch(`${API_BASE}/transactions/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount }),
  });
  return handleResponse(res);
}
