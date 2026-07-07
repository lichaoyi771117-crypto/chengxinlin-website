const { servicesConfig } = require('./src/lib/services-config')

const services = servicesConfig.map((svc: { name: string; port: number; exe: string; args: string[]; workDir: string; env?: Record<string, string> }) => ({
  name: svc.name,
  port: svc.port,
  exe: svc.exe,
  args: svc.args,
  workDir: svc.workDir,
  env: svc.env ?? {},
}))

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if ((globalThis as Record<string, unknown>).__servicesStarted) return
  ;(globalThis as Record<string, unknown>).__servicesStarted = true

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { spawn } = require('child_process') as typeof import('child_process')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const net = require('net') as typeof import('net')

  function isPortListening(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket()
      socket.setTimeout(800)
      socket.once('connect', () => { socket.destroy(); resolve(true) })
      socket.once('error', () => { socket.destroy(); resolve(false) })
      socket.once('timeout', () => { socket.destroy(); resolve(false) })
      socket.connect(port, '127.0.0.1')
    })
  }

  for (const svc of services) {
    const already = await isPortListening(svc.port)
    if (already) {
      console.log(`[startup] ${svc.name} already running on port ${svc.port}`)
      continue
    }
    const child = spawn(svc.exe, svc.args, {
      cwd: svc.workDir || undefined,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, ...svc.env },
    })
    child.unref()
    console.log(`[startup] ${svc.name} launched on port ${svc.port}`)
  }
}
