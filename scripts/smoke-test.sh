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

check() {
    local label="$1" actual="$2" expected="$3" body="$4"
    TOTAL=$((TOTAL + 1))
    if [ "$actual" = "$expected" ]; then
        log "[PASS] $label"
        PASSED=$((PASSED + 1))
    else
        local snippet=$(echo "$body" | tr -d '\n' | cut -c1-120)
        log "[FAIL] $label → $actual (expected $expected): $snippet"
        FAILED=$((FAILED + 1))
    fi
}

req() {
    local method="$1" url="$2" extra="$3"
    local resp_file=$(mktemp)
    local code=$(curl -s -o "$resp_file" -w "%{http_code}" -m 6 -X "$method" $extra "$url" 2>/dev/null)
    local body=$(cat "$resp_file")
    rm -f "$resp_file"
    echo "$code||$body"
}

json_val() {
    echo "$1" | python3 -c "import sys,json; print(json.load(sys.stdin).get('$2',''))" 2>/dev/null || echo ""
}

log "=== Smoke Test $TIMESTAMP ==="
echo "" >> "$REPORT"

# ========== dnd-club ==========
log "--- dnd-club ---"

r=$(req "GET" "$BASE_URL/")
check "GET /" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

r=$(req "POST" "$BASE_URL/api/auth/register" \
    "-H 'Content-Type: application/json' -d '{\"email\":\"smoke@test.tt\",\"schoolNick\":\"$TEST_USER\",\"password\":\"test1234\"}'")
check "POST /api/auth/register" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ========== book-club ==========
log "--- book-club ---"

r=$(req "GET" "$BASE_URL/b21")
check "GET /b21" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

r=$(req "POST" "$BASE_URL/b21/api/auth/register" \
    "-F 'schoolNick=$TEST_USER' -F 'name=Smoke' -F 'password=test1234'")
check "POST /b21/api/auth/register" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ========== tic-tac ==========
log "--- tic-tac ---"

# Static page
r=$(req "GET" "$BASE_URL/t21/")
check "GET /t21/ (static)" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Register — 200 or 409 both OK
r=$(req "POST" "$BASE_URL/t21/api/auth/register" \
    "-H 'Content-Type: application/json' -d '{\"login\":\"$TEST_USER\",\"password\":\"test1234\"}'")
code=$(echo "$r" | cut -d'|' -f1)
check "POST /t21/api/auth/register" "$code" "200" "$r"
# If 409, that's also acceptable
if [ "$code" = "409" ]; then
    TOTAL=$((TOTAL - 1)); PASSED=$((PASSED - 1))
    log "[PASS] POST /t21/api/auth/register → 409 (already exists)"
    PASSED=$((PASSED + 1)); TOTAL=$((TOTAL + 1))
fi

# Auto-login (find or create user, returns {id, login})
r=$(req "POST" "$BASE_URL/t21/api/auth/auto-login" \
    "-H 'Content-Type: application/json' -d '{\"login\":\"$TEST_USER\"}'")
code=$(echo "$r" | cut -d'|' -f1)
body=$(echo "$r" | cut -d'|' -f2-)
USER_ID=$(json_val "$body" "id")
if [ -n "$USER_ID" ]; then
    check "POST /t21/api/auth/auto-login (id=$USER_ID)" "$code" "200" "$r"
else
    check "POST /t21/api/auth/auto-login" "$code" "200" "$r"
fi

AUTH="-u '$TEST_USER:'"

# Login via Basic Auth
r=$(req "POST" "$BASE_URL/t21/api/auth/login" "-u '$TEST_USER:'")
check "POST /t21/api/auth/login" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Create game (v1: GET /api/game)
r=$(req "GET" "$BASE_URL/t21/api/game" "-u '$TEST_USER:'")
code=$(echo "$r" | cut -d'|' -f1)
body=$(echo "$r" | cut -d'|' -f2-)
GAME_ID=$(json_val "$body" "id")
if [ -n "$GAME_ID" ]; then
    check "GET /t21/api/game (id=$GAME_ID)" "$code" "200" "$r"
else
    check "GET /t21/api/game" "$code" "200" "$r"
fi

# Get game by ID
r=$(req "GET" "$BASE_URL/t21/api/game/$GAME_ID" "-u '$TEST_USER:'")
check "GET /t21/api/game/$GAME_ID" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Make a move (send board with player's 1 at (0,0))
r=$(req "POST" "$BASE_URL/t21/api/game/$GAME_ID" \
    "-u '$TEST_USER:' -H 'Content-Type: application/json' -d '{\"board\":{\"board\":[[1,0,0],[0,0,0],[0,0,0]],\"size\":3}}'")
body=$(echo "$r" | cut -d'|' -f2-)
isover=$(json_val "$body" "isOver")
winner=$(json_val "$body" "winner")
if [ "$isover" = "true" ] || [ "$isover" = "false" ]; then
    check "POST /t21/api/game/$GAME_ID (move)" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"
else
    check "POST /t21/api/game/$GAME_ID (move)" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"
fi

# Leaderboard (public)
r=$(req "GET" "$BASE_URL/t21/api/stats/leaderboard")
check "GET /t21/api/stats/leaderboard" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# Record result
r=$(req "POST" "$BASE_URL/t21/api/stats/record" \
    "-u '$TEST_USER:' -H 'Content-Type: application/json' -d '{\"result\":1}'")
check "POST /t21/api/stats/record" "$(echo "$r" | cut -d'|' -f1)" "200" "$r"

# ========== negative tests ==========
log "--- negative ---"

r=$(req "GET" "$BASE_URL/t21/api/game/00000000-0000-0000-0000-000000000000" "-u '$TEST_USER:'")
check "GET game 0000... (404 expected)" "$(echo "$r" | cut -d'|' -f1)" "404" "$r"

r=$(req "POST" "$BASE_URL/t21/api/game/00000000-0000-0000-0000-000000000000" \
    "-H 'Content-Type: application/json' -d '{}'")
check "POST game 0000... no auth (401 expected)" "$(echo "$r" | cut -d'|' -f1)" "401" "$r"

# ========== summary ==========
log ""
log "=== Result: $PASSED / $TOTAL ==="

if [ $FAILED -gt 3 ]; then
    log "WARNING: $FAILED failures — deployment may be broken"
    exit 1
fi
exit 0
