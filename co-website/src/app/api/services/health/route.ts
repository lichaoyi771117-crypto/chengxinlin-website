import { NextRequest, NextResponse } from 'next/server'
import { spawn, type ChildProcess } from 'child_process'
import net from 'net'
import { servicesConfig } from '@/lib/services-config'
import { requireAdmin } from '@/lib/session'

// Track running processes to avoid duplicates
const runningProcesses = new Map<string, ChildProcess>()

function checkPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(1000)
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('error', () => { socket.destroy(); resolve(false) })
    socket.once('timeout', () => { socket.destroy(); resolve(false) })
    socket.connect(port, '127.0.0.1')
  })
}

function startServiceAsync(config: typeof servicesConfig[0]): void {
  if (runningProcesses.has(config.name)) {
    const existing = runningProcesses.get(config.name)!
    if (existing.exitCode === null) return
    runningProcesses.delete(config.name)
  }

  const child = spawn(config.exe, config.args, {
    cwd: config.workDir || undefined,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    env: { ...process.env, ...(config.env ?? {}) },
  })

  child.unref()
  runningProcesses.set(config.name, child)

  child.on('exit', () => {
    runningProcesses.delete(config.name)
  })

  child.on('error', () => {
    runningProcesses.delete(config.name)
  })
}

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request)
  if ('error' in auth) return auth.error

  const results: Array<{ name: string; port: number; status: string }> = []

  for (const svc of servicesConfig) {
    const running = await checkPort(svc.port)
    if (running) {
      results.push({ name: svc.name, port: svc.port, status: 'running' })
    } else {
      startServiceAsync(svc)
      results.push({ name: svc.name, port: svc.port, status: 'starting' })
    }
  }

  const allOk = results.every(r => r.status === 'running')

  return NextResponse.json({
    ok: allOk,
    services: results,
    timestamp: new Date().toISOString(),
  })
}
