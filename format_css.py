from pathlib import Path
import re

for rel in ["css/style.css", "css/auth.css"]:
    path = Path(rel)
    text = path.read_text(encoding="utf-8")
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    parts = []
    for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", text):
        selector = match.group(1).strip()
        body = match.group(2).strip()
        if not selector:
            continue
        if not body:
            parts.append(f"{selector} {{}}")
            continue

        decl_lines = []
        for raw in body.split(";"):
            raw = raw.strip()
            if not raw:
                continue
            if ":" not in raw:
                decl_lines.append(f"  {raw};")
            else:
                prop, value = raw.split(":", 1)
                decl_lines.append(f"  {prop.strip()}: {value.strip()};")

        parts.append(f"{selector} {{")
        parts.extend(decl_lines)
        parts.append("}")

    path.write_text("\n\n".join(parts) + "\n", encoding="utf-8")
    print(f"formatted {rel}")
