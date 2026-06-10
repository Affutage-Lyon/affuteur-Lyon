#!/usr/bin/env python3
"""
fetch_leads.py — Surveillance des demandes Formspree pour Ken Aiguise
Usage :
  python3 fetch_leads.py                  # polling toutes les 60s
  python3 fetch_leads.py --interval 30    # polling toutes les 30s
  python3 fetch_leads.py --once           # une seule lecture et quitte
  FORMSPREE_API_KEY=xxx python3 fetch_leads.py

Variables d'environnement :
  FORMSPREE_API_KEY   — clé API Formspree (obligatoire)
  NOTIFY_SOUND        — 1 pour activer la notif sonore Termux (optionnel)
"""

import os
import sys
import json
import time
import signal
import argparse
import subprocess
from datetime import datetime, timezone

try:
    import requests
except ImportError:
    print("\033[31m[ERREUR]\033[0m Le module 'requests' est absent.")
    print("  → Installer avec :  pip install requests\n")
    sys.exit(1)

# ─── Configuration ────────────────────────────────────────────────────────────

FORM_ID = "xvzvjqve"
API_BASE = "https://formspree.io/api/0"
SEEN_FILE = os.path.join(os.path.dirname(__file__), ".seen_leads.json")

# ─── Palette ANSI ─────────────────────────────────────────────────────────────

RESET  = "\033[0m"
BOLD   = "\033[1m"
DIM    = "\033[2m"

# Couleurs texte
BLANC  = "\033[97m"
GRIS   = "\033[90m"
ROUGE  = "\033[91m"
VERT   = "\033[92m"
JAUNE  = "\033[93m"
BLEU   = "\033[94m"
VIOLET = "\033[95m"
CYAN   = "\033[96m"

# Couleurs fond
BG_VERT   = "\033[42m"
BG_ROUGE  = "\033[41m"
BG_BLEU   = "\033[44m"
BG_JAUNE  = "\033[43m"
BG_VIOLET = "\033[45m"

# ─── Helpers affichage ────────────────────────────────────────────────────────

def clear_line():
    print("\r" + " " * 60 + "\r", end="", flush=True)

def banner():
    print()
    print(f"{BOLD}{CYAN}╔══════════════════════════════════════════════════════╗{RESET}")
    print(f"{BOLD}{CYAN}║  ✂  Ken Aiguise — Surveillance des demandes          ║{RESET}")
    print(f"{BOLD}{CYAN}║     Formspree · Affûteur itinérant Lyon 4            ║{RESET}")
    print(f"{BOLD}{CYAN}╚══════════════════════════════════════════════════════╝{RESET}")
    print()

def header_status(interval: int, count: int):
    now = datetime.now().strftime("%H:%M:%S")
    print(
        f"{GRIS}[ {now} ]  "
        f"{CYAN}{count} demande(s) chargée(s){RESET}  "
        f"{GRIS}· prochain check dans {interval}s{RESET}"
    )

def fmt_client_type(raw: str) -> str:
    """Colore et raccourcit le type client."""
    r = raw.strip()
    if r.startswith("Professionnel"):
        badge = f"{BOLD}{BG_BLEU} PRO {RESET}"
        detail = r.replace("Professionnel — ", "")
        return f"{badge} {BLEU}{detail}{RESET}"
    elif r.startswith("Particulier"):
        badge = f"{BOLD}{BG_VIOLET} PART {RESET}"
        detail = r.replace("Particulier — ", "")
        return f"{badge} {VIOLET}{detail}{RESET}"
    return f"{JAUNE}{r}{RESET}"

def fmt_date(iso: str) -> str:
    """Formate une date ISO 8601 en français."""
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        local = dt.astimezone()
        return local.strftime("%d/%m/%Y à %H:%M")
    except Exception:
        return iso

def separator(char="─", width=56, color=GRIS):
    print(f"{color}{char * width}{RESET}")

def print_lead(sub: dict, index: int, is_new: bool = False):
    """Affiche une demande formatée."""
    print()
    if is_new:
        print(f"{BOLD}{BG_VERT}  ✦ NOUVELLE DEMANDE  {RESET}")

    separator("═" if is_new else "─", color=CYAN if is_new else GRIS)

    # En-tête : numéro + date
    sub_id   = sub.get("_id", "???")[:8]
    sub_date = fmt_date(sub.get("_date", sub.get("createdAt", "")))
    print(
        f"  {BOLD}#{index}{RESET}  "
        f"{GRIS}ID {sub_id}…{RESET}  "
        f"{JAUNE}{sub_date}{RESET}"
    )
    separator()

    # Type de client
    client_type = sub.get("type_client", sub.get("Type client", "—"))
    print(f"  {BOLD}Type    {RESET}  {fmt_client_type(client_type)}")

    # Établissement / Nom
    name = sub.get("name", sub.get("Nom", "")).strip()
    if name:
        print(f"  {BOLD}Lieu    {RESET}  {BLANC}{name}{RESET}")

    # Adresse
    address = sub.get("adresse_lieu", sub.get("Adresse", "")).strip()
    if address:
        print(f"  {BOLD}Adresse {RESET}  {VERT}📍 {address}{RESET}")

    # Téléphone
    phone = sub.get("telephone", sub.get("Téléphone", "")).strip()
    if phone:
        print(f"  {BOLD}Tél     {RESET}  {CYAN}📞 {phone}{RESET}")

    # Message
    message = sub.get("message", sub.get("Message", "")).strip()
    if message:
        separator("·")
        # Découpe le message en lignes de 52 caractères max
        words = message.split()
        lines, current = [], ""
        for word in words:
            if len(current) + len(word) + 1 > 52:
                lines.append(current)
                current = word
            else:
                current = (current + " " + word).strip()
        if current:
            lines.append(current)
        for line in lines:
            print(f"  {DIM}{BLANC}{line}{RESET}")

    separator("═" if is_new else "─", color=CYAN if is_new else GRIS)

# ─── Persistance des IDs vus ──────────────────────────────────────────────────

def load_seen() -> set:
    if os.path.exists(SEEN_FILE):
        try:
            with open(SEEN_FILE, "r") as f:
                return set(json.load(f))
        except Exception:
            pass
    return set()

def save_seen(ids: set):
    try:
        with open(SEEN_FILE, "w") as f:
            json.dump(list(ids), f)
    except Exception as e:
        print(f"{ROUGE}[WARN] Impossible de sauvegarder l'état : {e}{RESET}")

# ─── Notification sonore (Termux / Nothing Phone) ─────────────────────────────

def notify_sound(text: str = "Nouvelle demande reçue"):
    """Lit le texte à voix haute via Termux TTS, sinon bip ANSI."""
    sound_enabled = os.environ.get("NOTIFY_SOUND", "0") == "1"
    if not sound_enabled:
        return
    # Tentative termux-tts-speak
    try:
        result = subprocess.run(
            ["termux-tts-speak", "-l", "fr", text],
            timeout=5,
            capture_output=True
        )
        if result.returncode == 0:
            return
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    # Fallback : bip ANSI + play sox si dispo
    print("\a", end="", flush=True)
    try:
        subprocess.run(
            ["play", "-n", "synth", "0.3", "sine", "880"],
            timeout=3,
            capture_output=True
        )
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass

# ─── Appel API Formspree ──────────────────────────────────────────────────────

def fetch_submissions(api_key: str, page_size: int = 50) -> list[dict]:
    """Récupère les soumissions depuis l'API Formspree."""
    url = f"{API_BASE}/forms/{FORM_ID}/submissions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
    }
    params = {"page_size": page_size}
    try:
        resp = requests.get(url, headers=headers, params=params, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        # L'API retourne {"submissions": [...]} ou directement une liste
        if isinstance(data, list):
            return data
        return data.get("submissions", data.get("data", []))
    except requests.exceptions.HTTPError as e:
        code = e.response.status_code if e.response else "?"
        if code == 401:
            print(f"\n{ROUGE}[ERREUR 401]{RESET} Clé API invalide ou expirée.")
            print(f"  → Générez une clé sur {CYAN}https://formspree.io/account/apikeys{RESET}\n")
        elif code == 403:
            print(f"\n{ROUGE}[ERREUR 403]{RESET} Accès refusé — vérifiez les droits de la clé.")
        else:
            print(f"\n{ROUGE}[ERREUR HTTP {code}]{RESET} {e}\n")
        return []
    except requests.exceptions.ConnectionError:
        print(f"\n{JAUNE}[RÉSEAU]{RESET} Pas de connexion — nouvelle tentative…\n")
        return []
    except requests.exceptions.Timeout:
        print(f"\n{JAUNE}[TIMEOUT]{RESET} Formspree met trop de temps à répondre.\n")
        return []
    except Exception as e:
        print(f"\n{ROUGE}[ERREUR]{RESET} {e}\n")
        return []

# ─── Logique principale ───────────────────────────────────────────────────────

def run(api_key: str, interval: int, once: bool):
    seen_ids = load_seen()
    first_run = True

    def graceful_exit(sig, frame):
        print(f"\n\n{GRIS}Arrêt propre — au revoir !{RESET}\n")
        sys.exit(0)

    signal.signal(signal.SIGINT, graceful_exit)
    signal.signal(signal.SIGTERM, graceful_exit)

    banner()
    print(f"  {GRIS}Form ID :{RESET} {BOLD}{FORM_ID}{RESET}")
    print(f"  {GRIS}Mode    :{RESET} {'lecture unique' if once else f'polling toutes les {interval}s'}")
    print(f"  {GRIS}Son     :{RESET} {'activé (Termux)' if os.environ.get('NOTIFY_SOUND') == '1' else 'désactivé  (export NOTIFY_SOUND=1 pour activer)'}")
    print()

    while True:
        submissions = fetch_submissions(api_key)

        if not submissions and first_run:
            print(f"  {JAUNE}Aucune soumission trouvée pour le moment.{RESET}")
        else:
            new_subs = [s for s in submissions if s.get("_id") not in seen_ids]

            if first_run:
                # Affiche toutes les demandes existantes au démarrage
                print(f"  {BOLD}{len(submissions)} demande(s) existante(s){RESET}\n")
                for i, sub in enumerate(reversed(submissions), 1):
                    print_lead(sub, i, is_new=False)
                seen_ids.update(s.get("_id") for s in submissions)
                save_seen(seen_ids)

            elif new_subs:
                for sub in reversed(new_subs):
                    print_lead(sub, len(seen_ids) + 1, is_new=True)
                    seen_ids.add(sub.get("_id"))
                    notify_sound(f"Nouvelle demande de {sub.get('name', 'client')}")
                save_seen(seen_ids)

            else:
                if not once:
                    header_status(interval, len(submissions))

        first_run = False

        if once:
            break

        time.sleep(interval)

# ─── Point d'entrée ───────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Surveillance des demandes Formspree — Ken Aiguise"
    )
    parser.add_argument(
        "--interval", type=int, default=60,
        help="Intervalle de polling en secondes (défaut : 60)"
    )
    parser.add_argument(
        "--once", action="store_true",
        help="Lire une seule fois et quitter"
    )
    args = parser.parse_args()

    api_key = os.environ.get("FORMSPREE_API_KEY", "").strip()
    if not api_key:
        print()
        print(f"{ROUGE}╔═══════════════════════════════════════════════════╗{RESET}")
        print(f"{ROUGE}║  Variable FORMSPREE_API_KEY manquante             ║{RESET}")
        print(f"{ROUGE}╚═══════════════════════════════════════════════════╝{RESET}")
        print()
        print("  1. Connectez-vous sur  https://formspree.io")
        print("  2. Menu  Account → API Keys → Create API Key")
        print("  3. Lancez le script ainsi :\n")
        print(f"     {CYAN}export FORMSPREE_API_KEY=\"votre_clé\"{RESET}")
        print(f"     {CYAN}python3 fetch_leads.py{RESET}")
        print()
        print(f"  {GRIS}Ou en une ligne :{RESET}")
        print(f"     {CYAN}FORMSPREE_API_KEY=\"votre_clé\" python3 fetch_leads.py{RESET}")
        print()
        sys.exit(1)

    run(api_key, args.interval, args.once)

if __name__ == "__main__":
    main()
