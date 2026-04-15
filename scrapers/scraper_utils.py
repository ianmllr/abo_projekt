import datetime
import json
import re
import builtins
from pathlib import Path
from typing import Any

import requests


def now_timestamp() -> str:
    return datetime.datetime.now().strftime("%d-%m-%Y-%H:%M")


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)


def _normalize_image_url(image_url: str, base_url: str | None) -> str:
    if image_url.startswith("//"):
        return f"https:{image_url}"
    if image_url.startswith("/") and base_url:
        return f"{base_url}{image_url}"
    return image_url


def log(*args: Any, sep: str = " ", end: str = "\n") -> None:
    message = sep.join(str(a) for a in args)
    leading_newlines = len(message) - len(message.lstrip("\n"))
    stripped = message.lstrip("\n")
    if not stripped.startswith("["):
        stripped = f"{stripped}"
    builtins.print(("\n" * leading_newlines) + stripped, end=end)


def warn(*args: Any, sep: str = " ", end: str = "\n") -> None:
    message = sep.join(str(a) for a in args)
    builtins.print(f"[WARN] {message.lstrip()}", end=end)


def error(*args: Any, sep: str = " ", end: str = "\n") -> None:
    message = sep.join(str(a) for a in args)
    builtins.print(f"[ERROR] {message.lstrip()}", end=end)


def offer_summary(
    product_name: str,
    *,
    sub: Any = None,
    rabat: Any = None,
    kontant: Any = None,
    min6: Any = None,
    md: Any = None,
) -> None:
    def fmt(value: Any) -> str:
        return "-" if value in (None, "") else str(value)

    log(
        f"{product_name}: "
        f"sub={fmt(sub)}, rabat={fmt(rabat)}, kontant={fmt(kontant)}, "
        f"min6={fmt(min6)}, md={fmt(md)}"
    )


def download_image_cached(
    image_url: str,
    product_name: str,
    image_dir: Path,
    public_prefix: str,
    *,
    base_url: str | None = None,
    timeout: int = 15,
) -> str:
    if not image_url or not product_name:
        return ""

    image_url = _normalize_image_url(image_url, base_url)

    filename = re.sub(r"[^a-z0-9]", "_", product_name.lower()) + ".webp"
    save_path = image_dir / filename
    image_dir.mkdir(parents=True, exist_ok=True)

    normalized_prefix = public_prefix.rstrip("/")
    cached_path = f"{normalized_prefix}/{filename}"

    if save_path.exists():
        return cached_path

    try:
        response = requests.get(image_url, timeout=timeout)
        if response.status_code == 200:
            save_path.write_bytes(response.content)
            return cached_path
    except Exception as e:
        warn(f"Could not download image for '{product_name}': {e}")

    return ""

