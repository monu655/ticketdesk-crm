// 1 -> "TKT-001", 42 -> "TKT-042", 1250 -> "TKT-1250"
export function formatTicketId(number) {
  return `TKT-${String(number).padStart(3, '0')}`;
}

export function isValidTicketId(value) {
  return /^TKT-\d{3,}$/.test(value);
}
