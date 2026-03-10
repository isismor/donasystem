import json
import urllib.request
import sys

# Read HTML
with open("/home/openclaw/.openclaw/workspace/material-agentes-isis.html", "r") as f:
    html = f.read()

api_key = "0799b430b3msh11af20db8cc1463p192e26jsn834f5de42f31"

payload = json.dumps({
    "source": {"html": html},
    "pdf": {
        "format": "A4",
        "printBackground": True,
        "margin": {"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"}
    },
    "wait": {"for": "navigation", "waitUntil": "networkidle0", "timeout": 8000}
}).encode("utf-8")

req = urllib.request.Request(
    "https://yakpdf.p.rapidapi.com/pdf",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "yakpdf.p.rapidapi.com"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        pdf_data = resp.read()
        with open("/home/openclaw/.openclaw/workspace/material-agentes-isis.pdf", "wb") as out:
            out.write(pdf_data)
        print(f"PDF saved: {len(pdf_data)} bytes")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    if hasattr(e, 'read'):
        print(e.read().decode(), file=sys.stderr)
    sys.exit(1)
