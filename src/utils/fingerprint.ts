/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Client Device Fingerprint Collector for Orion Web App
 */

function hashString(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return ('0000000' + (hash >>> 0).toString(16)).substr(-8);
}

export function getCanvasFingerprint(): string {
  try {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no_canvas';

    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 60, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Orion,CF-Risk#2026', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Orion,CF-Risk#2026', 4, 17);
    return hashString(canvas.toDataURL());
  } catch (e) {
    return 'canvas_error';
  }
}

export function getWebGLFingerprint(): { vendor: string; renderer: string } {
  try {
    if (typeof document === 'undefined') return { vendor: '', renderer: '' };
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { vendor: 'no_webgl', renderer: 'no_webgl' };

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return { vendor: 'generic', renderer: 'generic' };

    return {
      vendor: (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '',
      renderer: (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
    };
  } catch (e) {
    return { vendor: 'error', renderer: 'error' };
  }
}

export async function collectDeviceFingerprint(): Promise<{
  deviceId: string;
  deviceHash: string;
  screenResolution: string;
  timezone: string;
  canvasHash: string;
  webglVendor: string;
}> {
  if (typeof window === 'undefined') {
    return {
      deviceId: 'server_env',
      deviceHash: 'server_env_hash',
      screenResolution: '',
      timezone: '',
      canvasHash: '',
      webglVendor: ''
    };
  }

  let deviceId = localStorage.getItem('_orion_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('_orion_device_id', deviceId);
  }

  const canvasHash = getCanvasFingerprint();
  const webgl = getWebGLFingerprint();
  const screenResolution = `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio || 1}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const userAgent = navigator.userAgent || '';
  const language = navigator.language || '';

  const rawComposite = [
    deviceId,
    userAgent,
    screenResolution,
    timezone,
    canvasHash,
    webgl.vendor,
    webgl.renderer,
    language
  ].join('|||');

  let deviceHash = '';
  try {
    const msgUint8 = new TextEncoder().encode(rawComposite);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    deviceHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    deviceHash = hashString(rawComposite);
  }

  return {
    deviceId,
    deviceHash,
    screenResolution,
    timezone,
    canvasHash,
    webglVendor: `${webgl.vendor} ~ ${webgl.renderer}`
  };
}
