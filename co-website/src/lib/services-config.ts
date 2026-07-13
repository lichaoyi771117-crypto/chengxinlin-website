interface ServiceConfig {
  name: string
  port: number
  exe: string
  args: string[]
  workDir: string
  env?: Record<string, string>
}

function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback
}

export const servicesConfig: ServiceConfig[] = [
  {
    name: 'qiaoxi',
    port: 8511,
    exe: getEnv('QIAOXI_EXE', 'streamlit'),
    args: ['run', 'app.py', '--server.port', '8511', '--server.headless', 'true'],
    workDir: getEnv('QIAOXI_WORK_DIR', ''),
  },
  {
    name: 'qiaoyuan',
    port: 8512,
    exe: getEnv('QIAOYUAN_EXE', 'streamlit'),
    args: ['run', 'app.py', '--server.port', '8512', '--server.headless', 'true'],
    workDir: getEnv('QIAOYUAN_WORK_DIR', ''),
  },
  {
    name: 'chenxi',
    port: 8513,
    exe: getEnv('CHENXI_EXE', 'C:\\Python314\\python.exe'),
    args: ['-m', 'streamlit', 'run', 'app.py', '--server.port', '8513', '--server.headless', 'true'],
    workDir: getEnv('CHENXI_WORK_DIR', ''),
  },
  {
    name: 'cxr',
    port: 8090,
    exe: getEnv('CXR_EXE', 'python'),
    args: ['main.py'],
    workDir: getEnv('CXR_WORK_DIR', ''),
    env: { PORT: '8090' },
  },
]
