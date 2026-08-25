const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Sequential, single-message validation — mirrors the design source's
// saveUser() exactly (one error banner at a time, checked in this order),
// rather than a Zod schema that would surface every issue at once. `existingUsers`
// is the current list, used only to reject a duplicate email client-side.
export function validateUserForm(form, existingUsers) {
  const firstName = form.first_name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!firstName) return "First name is required.";
  if (!email && !phone) return "Give an email or a phone number — the users table requires one identifier.";
  if (email && !EMAIL_PATTERN.test(email)) return "That email address looks invalid.";
  if (email && existingUsers.some((u) => u.email === email)) return "A user with that email already exists.";
  if (form.password_hash && form.password_hash.length < 8) return "Password must be at least 8 characters.";
  if (!form.roles.length) return "Assign at least one role.";
  return null;
}
