// Round badge with the customer's initials, e.g. "Rahul Sharma" -> "RS".
function getInitials(name) {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Avatar({ name }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
    >
      {getInitials(name)}
    </span>
  );
}
