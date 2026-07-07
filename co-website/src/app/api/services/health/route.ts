import { NextResponse } from 'next/server'
import { spawn, type ChildProcess } from 'child_process'
import net from 'net'

interface ServiceConfig {
  name: string
  port: number
  exe: string
  args: string[]
  workDir: string
  env?: Record<string, string>
}

const services: ServiceConfig[] = [
  {
    name: 'qiaoxi',
    port: 8501,
    exe: 'D:\\Ai RAG\\Qiaoxi\\venv312\\Scripts\\streamlit.exe',
    args: ['run', 'app.py', '--server.port', '8501', '--server.headless', 'true'],
    workDir: 'D:\\Ai RAG\\Qiaoxi',
  },
  {
    name: 'qiaoyuan',
    port: 8502,
    exe: 'D:\\Ai RAG\\Qiaoyuan\\venv312\\Scripts\\streamlit.exe',
    args: ['run', 'app.py', '--server.port', '8502', '--server.headless', 'true'],
    workDir: 'D:\\Ai RAG\\Qiaoyuan',
  },
  {
    name: 'cxr',
    port: 8080,
    exe: 'D:\\Ai RAG\\chengxiaorong\\venv312\\Scripts\\python.exe',
    args: ['main.py'],
    workDir: 'D:\\Ai RAG\\chengxiaorong',
    env: { PORT: '8080' },
  },
]

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

function startServiceAsync(config: ServiceConfig): void {
  // Skip if already starting
  if (runningProcesses.has(config.name)) {
    const existing = runningProcesses.get(config.name)!
    if (existing.exitCode === null) return // still running
    runningProcesses.delete(config.name)
  }

  const child = spawn(config.exe, config.args, {
    cwd: config.workDir,
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

export async function GET() {
  const results: Array<{ name: string; port: number; status: string }> = []

  for (const svc of services) {
    const running = await checkPort(svc.port)
    if (running) {
      results.push({ name: svc.name, port: svc.port, status: 'running' })
    } else {
      // Fire-and-forget: start in background, don't wait
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
