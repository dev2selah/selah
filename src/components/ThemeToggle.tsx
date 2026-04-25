import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);

    document.documentElement.classList.toggle("light", saved === "light");
  }, []);

  const toggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <button onClick={toggle}>
      {theme === "dark" ? "🔆" : "🌙"}
    </button>
  );
}