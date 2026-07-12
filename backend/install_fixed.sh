#!/usr/bin/env bash
# ============================================================
#  TransitOps — Full Dependency Installation Script (Fixed)
#  Supports Python 3.13 — uses wheels that have 3.13 builds
#  Run: bash install_fixed.sh
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── 1. Python version guard ───────────────────────────────────
info "Checking Python version..."
PYTHON=$(command -v python3 || command -v python || error "Python not found.")
PY_VERSION=$($PYTHON -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
info "Python $PY_VERSION detected."

# ── 2. Virtual environment ────────────────────────────────────
info "Creating virtual environment (.venv)..."
$PYTHON -m venv .venv

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || "$OSTYPE" == "cygwin" ]]; then
    source .venv/Scripts/activate
else
    source .venv/bin/activate
fi
info "Virtual environment activated."

# ── 3. Upgrade pip first ──────────────────────────────────────
info "Upgrading pip / setuptools / wheel..."
pip install --upgrade pip setuptools wheel --quiet

# ── 4. Install all dependencies ───────────────────────────────
# Key fixes for Python 3.13:
#   pandas  2.2.2 → 2.2.3  (first release with Py3.13 wheels)
#   numpy   1.26.4 → 2.1.0  (1.x has no Py3.13 wheels at all)
info "Installing all TransitOps dependencies..."

pip install \
    "fastapi==0.111.0" \
    "uvicorn[standard]==0.29.0" \
    "sqlalchemy==2.0.30" \
    "alembic==1.13.1" \
    "pydantic==2.7.1" \
    "pydantic-settings==2.2.1" \
    "python-jose[cryptography]==3.3.0" \
    "passlib[bcrypt]==1.7.4" \
    "python-multipart==0.0.9" \
    "python-dotenv==1.0.1" \
    "email-validator==2.1.1" \
    "aiosqlite==0.20.0" \
    "numpy==2.1.0" \
    "pandas==2.2.3" \
    "openpyxl==3.1.2" \
    "reportlab==4.1.0" \
    "plotly==5.22.0" \
    "matplotlib==3.9.0" \
    "fastapi-mail==1.4.1" \
    "jinja2==3.1.4" \
    "aiofiles==23.2.1" \
    "httpx==0.27.0" \
    "requests==2.32.3" \
    "pytest==8.2.1" \
    "pytest-asyncio==0.23.7" \
    "faker==25.2.0" \
    "python-dateutil==2.9.0.post0" \
    "rich==13.7.1" \
    "loguru==0.7.2"

info "All packages installed successfully."

# ── 5. Project folder scaffold ────────────────────────────────
info "Scaffolding project structure..."
mkdir -p \
    app/models \
    app/schemas \
    app/crud \
    app/services \
    app/routers \
    app/auth \
    app/templates/partials \
    app/static/css \
    app/static/js \
    tests \
    alembic

# ── 6. .env file ──────────────────────────────────────────────
if [ ! -f ".env" ]; then
    info "Creating .env with defaults..."
    cat > .env <<'ENV'
APP_NAME=TransitOps
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./transitops.db
SECRET_KEY=change-me-to-a-long-random-secret-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_password
MAIL_FROM=your_email@example.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_TLS=true
ENV
    warn ".env created. Update SECRET_KEY before production use."
else
    info ".env already exists — skipping."
fi

# ── 7. Alembic init ───────────────────────────────────────────
if [ ! -f "alembic.ini" ]; then
    info "Initialising Alembic..."
    alembic init alembic
    sed -i.bak 's|sqlalchemy.url = .*|sqlalchemy.url = sqlite+aiosqlite:///./transitops.db|' alembic.ini
    info "Alembic initialised."
else
    info "Alembic already initialised — skipping."
fi

# ── 8. Stub main.py ───────────────────────────────────────────
if [ ! -f "app/main.py" ]; then
    info "Creating stub app/main.py..."
    cat > app/main.py <<'MAIN'
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from loguru import logger

app = FastAPI(title="TransitOps", version="1.0.0")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

logger.info("TransitOps starting up...")

@app.get("/health")
async def health():
    return {"status": "ok", "app": "TransitOps"}
MAIN
fi

# ── 9. Verify critical imports ────────────────────────────────
info "Verifying imports..."
python3 -c "
import fastapi, uvicorn, sqlalchemy, alembic, pydantic
import jose, passlib, aiosqlite, pandas, numpy, openpyxl
import reportlab, plotly, matplotlib, jinja2
import faker, pytest, rich, loguru
print('  pandas  version:', pandas.__version__)
print('  numpy   version:', numpy.__version__)
print('  fastapi version:', fastapi.__version__)
print('All imports OK')
"

# ── 10. Done ──────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     TransitOps setup complete!                       ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Activate env :  source .venv/bin/activate           ║${NC}"
echo -e "${GREEN}║  Run server   :  uvicorn app.main:app --reload       ║${NC}"
echo -e "${GREEN}║  Run tests    :  pytest tests/                       ║${NC}"
echo -e "${GREEN}║  Seed DB      :  python app/seed.py                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
