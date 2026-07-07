const services = [
  {
    name: 'qiaoxi',
    port: 8501,
    exe: 'D:\\Ai RAG\\Qiaoxi\\venv312\\Scripts\\streamlit.exe',
    args: ['run', 'app.py', '--server.port', '8501', '--server.headless', 'true'],
    workDir: 'D:\\Ai RAG\\Qiaoxi',
    env: {} as Record<string, string>,
  },
  {
    name: 'qiaoyuan',
    port: 8502,
    exe: 'D:\\Ai RAG\\Qiaoyuan\\venv312\\Scripts\\streamlit.exe',
    args: ['run', 'app.py', '--server.port', '8502', '--server.headless', 'true'],
    workDir: 'D:\\Ai RAG\\Qiaoyuan',
    env: {} as Record<string, string>,
  },
  {
    name: 'cxr',
    port: 8080,
    exe: 'D:\\Ai RAG\\chengxiaorong\\venv312\\Scripts\\python.exe',
    args: ['main.py'],
    workDir: 'D:\\Ai RAG\\chengxiaorong',
    env: { PORT: '8080' } as Record<string, string>,
  },
]

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if ((globalThis as Record<string, unknown>).__servicesStarted) return
  ;(globalThis as Record<string, unknown>).__servicesStarted = true

  // Dynamic require keeps child_process out of the Edge bundler
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
      cwd: svc.workDir,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, ...svc.env },
    })
    child.unref()
    console.log(`[startup] ${svc.name} launched on port ${svc.port}`)
  }
}
