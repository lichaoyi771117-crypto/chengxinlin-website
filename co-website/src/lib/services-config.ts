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
    port: 8501,
    exe: getEnv('QIAOXI_EXE', 'streamlit'),
    args: ['run', 'app.py', '--server.port', '8501', '--server.headless', 'true'],
    workDir: getEnv('QIAOXI_WORK_DIR', ''),
  },
  {
    name: 'qiaoyuan',
    port: 8502,
    exe: getEnv('QIAOYUAN_EXE', 'streamlit'),
    args: ['run', 'app.py', '--server.port', '8502', '--server.headless', 'true'],
    workDir: getEnv('QIAOYUAN_WORK_DIR', ''),
  },
  {
    name: 'cxr',
    port: 8080,
    exe: getEnv('CXR_EXE', 'python'),
    args: ['main.py'],
    workDir: getEnv('CXR_WORK_DIR', ''),
    env: { PORT: '8080' },
  },
]
