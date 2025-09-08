/* ====== CONFIG ======
   Replace with your actual invoke URL (including stage + route)
*/
const API_URL = "";

/* ====== UI refs ====== */
const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const imgHolder = document.getElementById('imgHolder');
const output = document.getElementById('output');
const statusBadge = document.getElementById('statusBadge');

let currentDataUrl = null;
const canvas = document.createElement('canvas');

/* small helper to set UI status */
function setStatus(text, busy=false){
  statusBadge.innerHTML = busy ? `<span class="spinner" style="margin-right:8px"></span>${text}` : text;
}

/* Start camera */
async function startCamera(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"user" }, audio:false });
    video.srcObject = stream;
    setStatus("Camera ready");
  }catch(err){
    setStatus("Camera error");
    output.textContent = "Webcam access failed: " + (err && err.message ? err.message : err);
  }
}
startCamera();

/* Capture frame */
captureBtn.addEventListener('click', () => {
  if(!video.videoWidth || !video.videoHeight){
    output.textContent = "Video not ready yet. Please allow webcam and wait a moment.";
    return;
  }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  currentDataUrl = canvas.toDataURL('image/jpeg', 0.85); // data:image/jpeg;base64,...
  imgHolder.innerHTML = `<img src="${currentDataUrl}" alt="capture">`;
  sendBtn.disabled = false;
  output.textContent = "Captured. Click Send to upload.";
});

/* Strip data URL prefix to send only base64 */
function getBase64FromDataUrl(dataUrl){
  if(!dataUrl) return null;
  const idx = dataUrl.indexOf(';base64,');
  if(idx === -1) return dataUrl;
  return dataUrl.substring(idx + ';base64,'.length);
}

/* Send to API */
sendBtn.addEventListener('click', async () => {
  if(!currentDataUrl){
    output.textContent = "No image captured.";
    return;
  }
  // UI lock
  sendBtn.disabled = true;
  captureBtn.disabled = true;
  setStatus("Sending...", true);
  output.textContent = "Sending image to API...";

  const rawBase64 = getBase64FromDataUrl(currentDataUrl);

  const payload = {
    // key name depends on your Lambda; original code used imageBase64
    imageBase64: rawBase64,
    // optionally include extras:
    filename: "capture.jpg"
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors', // ensure CORS is used (default). if CORS not configured you will get a browser error
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: false,
    });

    // If CORS preflight failed, the browser will block before we get here.
    // If response is opaque (no CORS), res.ok will be false and res.status may be 0.
    if (!res.ok) {
      // try to read text body for debugging
      let text = '';
      try { text = await res.text(); } catch(e) { text = 'No body / could not parse'; }
      output.textContent = `HTTP ${res.status} ${res.statusText}\n\n${text}`;
      setStatus("Request failed");
    } else {
      // parse JSON if possible
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        output.textContent = JSON.stringify(data, null, 2);
      } else {
        const text = await res.text();
        output.textContent = text || 'Success (no body)';
      }
      setStatus("Done");
    }
  } catch (err) {
    // Common: CORS preflight blocked (TypeError: Failed to fetch)
    console.error(err);
    output.textContent = `❌ Fetch error: ${err && err.message ? err.message : err}\n\nLikely causes:\n - CORS not configured on API Gateway or Lambda not returning Access-Control-Allow-Origin\n - You served page via file:// (use http server)\n\nCheck Console Network tab for OPTIONS (preflight) request and response headers.`;
    setStatus("Error");
  } finally {
    captureBtn.disabled = false;
    sendBtn.disabled = false;
  }
});

/* Reset */
clearBtn.addEventListener('click', () => {
  currentDataUrl = null;
  imgHolder.innerHTML = "No capture yet";
  output.textContent = "Reset done.";
  sendBtn.disabled = true;
  setStatus("Ready");
});