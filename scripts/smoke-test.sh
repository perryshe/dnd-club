#!/bin/bash
set -e

BASE_URL="https://d21-club.ru"
REPORT_DIR="/home/club/Club/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT="$REPORT_DIR/smoke-report-$TIMESTAMP.log"
PASSED=0
FAILED=0
TOTAL=0
TEST_USER="smoke_$TIMESTAMP"

mkdir -p "$REPORT_DIR"

log() { echo "$1"; echo "$1" >> "$REPORT"; }

req() {
    local method="$1" url="$2"; shift 2
    local tf=$(mktemp /tmp/smoke-XXXX)
    local code=$(curl -s -o "$tf" -w "%{http_code}" -m 6 -X "$method" "$@" "$url" 2>/dev/null)
    local body=$(cat "$tf" 2>/dev/null); rm -f "$tf"
    echo "$code||$body"
}

json_val() {
    echo "$1" | python3 -c "import sys,json; print(json.load(sys.stdin).get('$2',''))" 2>/dev/null || echo ""
}

check() {
    local label="$1" actual="$2" expected="$3" body="$4"
    TOTAL=$((TOTAL + 1))
    if [ "$actual" = "$expected" ]; then
        log "[PASS] $label"
        PASSED=$((PASSED + 1))
        return 0
    fi
    local snippet=$(echo "$body" | tr -d '\n' | cut -c1-160)
    log "[FAIL] $label → $actual (expected $expected): $snippet"
    FAILED=$((FAILED + 1))
    return 1
}

# ===== WAIT FOR SERVICES =====
log "=== Smoke Test $TIMESTAMP ===" >> "$REPORT"
echo "Waiting for services to be ready..."
for i in $(seq 1 30); do
    code=$(curl -s -o /dev/null -w "%{http_code}" -m 3 "$BASE_URL/" 2>/dev/null || echo "000")
    [ "$code" = "200" ] && break
    sleep 2
done
if [ "$code" != "200" ]; then
    log "[SKIP] All tests — site not ready after 60s (last code $code)"
    echo "=== Result: 0 / 0 (skipped — services not ready) ==="
    exit 1
fi
echo "Ready."

# ===== dnd-club =====
log "--- dnd-club ---"

r=$(req "GET" "$BASE_URL/")
check "GET /" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

r=$(req "POST" "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"smoke@test.tt\",\"schoolNick\":\"$TEST_USER\",\"password\":\"test1234\"}")
check "POST /api/auth/register" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ===== book-club =====
log "--- book-club ---"

r=$(req "GET" "$BASE_URL/b21")
check "GET /b21" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

r=$(req "POST" "$BASE_URL/b21/api/auth/register" \
    -F "schoolNick=$TEST_USER" -F "name=Smoke" -F "password=test1234")
check "POST /b21/api/auth/register" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ===== tic-tac =====
log "--- tic-tac ---"

r=$(req "GET" "$BASE_URL/t21/")
check "GET /t21/ (static)" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Register (200 = new user, 409 = already exists — both OK)
r=$(req "POST" "$BASE_URL/t21/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"login\":\"$TEST_USER\",\"password\":\"test1234\"}")
code=$(echo "$r" | cut -d'|' -f1); body=$(echo "$r" | cut -d'|' -f2-)
TOTAL=$((TOTAL + 1))
if [ "$code" = "200" ] || [ "$code" = "409" ]; then
    log "[PASS] POST /t21/api/auth/register → $code"
    PASSED=$((PASSED + 1))
else
    log "[FAIL] POST /t21/api/auth/register → $code: $(echo "$body" | tr -d '\n' | cut -c1-120)"
    FAILED=$((FAILED + 1))
fi

# Auto-login
r=$(req "POST" "$BASE_URL/t21/api/auth/auto-login" \
    -H "Content-Type: application/json" \
    -d "{\"login\":\"$TEST_USER\"}")
code=$(echo "$r" | cut -d'|' -f1); body=$(echo "$r" | cut -d'|' -f2-)
UID=$(json_val "$body" "id")
check "POST /t21/api/auth/auto-login" "$code" "200" "$r"

# Login via Basic Auth
r=$(req "POST" "$BASE_URL/t21/api/auth/login" -u "$TEST_USER:")
check "POST /t21/api/auth/login" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Create game (GET /api/game)
r=$(req "GET" "$BASE_URL/t21/api/game" -u "$TEST_USER:")
code=$(echo "$r" | cut -d'|' -f1); body=$(echo "$r" | cut -d'|' -f2-)
GID=$(json_val "$body" "id")
check "GET /t21/api/game (create)" "$code" "200" "$r"
if [ -z "$GID" ]; then
    log "  → could not extract game id, skipping game tests"
else
    # Get game by ID
    r=$(req "GET" "$BASE_URL/t21/api/game/$GID" -u "$TEST_USER:")
    check "GET /t21/api/game/$GID" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

    # Make a move (send full board with player's 1 at row=0,col=0)
    r=$(req "POST" "$BASE_URL/t21/api/game/$GID" -u "$TEST_USER:" \
        -H "Content-Type: application/json" \
        -d '{"board":{"board":[[1,0,0],[0,0,0],[0,0,0]],"size":3}}')
    code=$(echo "$r" | cut -d'|' -f1); body=$(echo "$r" | cut -d'|' -f2-)
    is_over=$(json_val "$body" "isOver")
    if [ "$is_over" = "true" ] || [ "$is_over" = "false" ]; then
        check "POST /t21/api/game/$GID (move)" "$code" "200" "$r"
    else
        check "POST /t21/api/game/$GID (move)" "$code" "200" "$r"
    fi
fi

# Leaderboard (public)
r=$(req "GET" "$BASE_URL/t21/api/stats/leaderboard")
check "GET /t21/api/stats/leaderboard" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Record result
r=$(req "POST" "$BASE_URL/t21/api/stats/record" -u "$TEST_USER:" \
    -H "Content-Type: application/json" -d '{"result":1}')
check "POST /t21/api/stats/record" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ===== negative =====
log "--- negative ---"

r=$(req "GET" "$BASE_URL/t21/api/game/00000000-0000-0000-0000-000000000000" -u "$TEST_USER:")
check "GET nonexistent game (404)" "$(echo "$r" | cut -d'|' -f1)" "404" "$r"

r=$(req "POST" "$BASE_URL/t21/api/game/00000000-0000-0000-0000-000000000000" \
    -H "Content-Type: application/json" -d '{}')
check "POST without auth (401)" "$(echo "$r" | cut -d'|' -f1)" "401" "$r"

# ===== summary =====
log ""
log "=== Result: $PASSED / $TOTAL ==="

[ $FAILED -gt 3 ] && log "WARNING: $FAILED failures" && exit 1
exit 0
