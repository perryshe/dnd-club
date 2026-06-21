import { auth } from "@/lib/auth"
import { NextRequest } from "next/server"

const DENIED = `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>// ACCESS DENIED</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;color:#ff003c;font-family:'Courier New',monospace;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.terminal{max-width:680px;border:1px solid #ff003c33;padding:36px;position:relative}
.terminal::before{content:"// NETWATCH v.4.2 //";position:absolute;top:-10px;left:24px;background:#0a0a0a;padding:0 10px;font-size:11px;color:#ff003c55}
h1{font-size:22px;color:#ff003c;margin-bottom:16px;animation:glitch 3s infinite}
@keyframes glitch{0%,90%,100%{opacity:1;transform:none}92%{opacity:.8;transform:translate(-2px,1px)}94%{opacity:.6;transform:translate(2px,-1px)}96%{opacity:.9;transform:translate(-1px,2px)}}
.line{margin:6px 0}.sys{color:#ff6600}.dat{color:#00ff8844;font-size:12px}.lock{margin-top:24px}
.blink{animation:blink 1s step-end infinite}@keyframes blink{50%{opacity:0}}
.scan{position:fixed;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent,#ff003c33,transparent);animation:sc 3s linear infinite;pointer-events:none}
@keyframes sc{0%{top:0}100%{top:100%}}.ascii{color:#ff003c22;font-size:10px;line-height:1.2;margin-bottom:16px}
.cursor{display:inline-block;width:10px;height:14px;background:#ff003c;vertical-align:middle}
</style></head><body>
<div class="scan"></div>
<div class="terminal">
<div class="ascii">
  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .<br>
  _____ _____  ______ _____  _   _ _____   ____   ___  ____<br>
 / ____|  __ \\|  ____|  __ \\| \\ | |  __ \\ / __ \\ / _ \\|  _ \\<br>
| (___ | |__) | |__  | |__) |  \\| | |__) | |  | | | | | |_) |<br>
 \\___ \\|  ___/|  __| |  _  /| . \` |  _  /| |  | | | | |  _ <<br>
 ____) | |    | |____| | \\ \\| |\\  | | \\ \\| |__| | |_| | |_) |<br>
|_____/|_|    |______|_|  \\_\\_| \\_|_|  \\_\\\\____/ \\___/|____/<br>
  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
</div>
<h1>// ACCESS DENIED</h1>
<p class="line sys">[!] YOUR ICON IS NOT RECOGNIZED BY THE NET</p>
<p class="line dat">SESSION VERIFICATION: FAILED</p>
<p class="line dat">CLEARANCE LEVEL: INSUFFICIENT</p>
<p style="color:#ff660066;margin-top:16px">This node is restricted to authorized operatives only.<br>NetWatch has logged your access attempt.</p>
<p style="color:#ff660044;font-size:12px">Admin credentials required. Log in with the correct account.</p>
<div class="lock">&gt; SYSTEM LOCKED <span class="cursor blink"></span></div>
</div></body></html>`

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const session = await auth()
  if (session?.user?.name !== "Admin") {
    return new Response(DENIED, {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    })
  }

  const path = params.path.join("/")
  const qs = req.nextUrl.search
  const url = new URL(`http://english:80/${path}${qs}`)
  const headers = new Headers()
  req.headers.forEach((v, k) => {
    if (!["host", "connection", "content-length"].includes(k.toLowerCase())) {
      headers.set(k, v)
    }
  })

  const resp = await fetch(url, { headers })
  const body = resp.body ? new Uint8Array(await resp.arrayBuffer()) : null
  const respHeaders = new Headers(resp.headers)
  respHeaders.delete("transfer-encoding")
  respHeaders.delete("content-encoding")

  return new Response(body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: respHeaders,
  })
}

export const dynamic = "force-dynamic"
