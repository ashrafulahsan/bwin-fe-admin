// Ported 1:1 from the design system's components/data/Avatar.jsx.
export default function Avatar({ name = "", src, size = 36, style }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        width={size}
        height={size}
        alt={name}
        style={{ borderRadius: "50%", objectFit: "cover", ...style }}
      />
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--navy-100)",
        color: "var(--navy-700)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--fw-medium)",
        fontSize: size * 0.4,
        ...style,
      }}
    >
      {initials}
    </span>
  );
}
