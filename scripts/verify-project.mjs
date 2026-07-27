import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const resolveFromRoot = (...parts) => join(root, ...parts)

const failures = []
const warnings = []

const requiredPaths = [
  'dist',
  'dist/index.html',
  'dist/assets',
  'src/App.tsx',
  'src/styles.css',
]

for (const requiredPath of requiredPaths) {
  if (!existsSync(resolveFromRoot(requiredPath))) {
    failures.push(`Falta: ${requiredPath}`)
  }
}

if (existsSync(resolveFromRoot('docs'))) {
  failures.push('La carpeta docs no debe existir en el flujo local')
}

if (existsSync(resolveFromRoot('dist/index.html'))) {
  const html = readFileSync(resolveFromRoot('dist/index.html'), 'utf8')

  if (!html.includes('assets/')) {
    failures.push('dist/index.html no contiene referencias a assets')
  }
}

if (existsSync(resolveFromRoot('dist/assets'))) {
  const assets = readdirSync(resolveFromRoot('dist/assets'))

  if (!assets.some((file) => file.endsWith('.js'))) {
    failures.push('El build no generó un archivo JavaScript')
  }

  if (!assets.some((file) => file.endsWith('.css'))) {
    failures.push('El build no generó un archivo CSS')
  }
}

const monitoredFiles = [
  ['src/App.tsx', 200_000],
  ['src/styles.css', 250_000],
]

for (const [file, warningLimit] of monitoredFiles) {
  const absolutePath = resolveFromRoot(file)

  if (existsSync(absolutePath)) {
    const size = statSync(absolutePath).size

    if (size > warningLimit) {
      warnings.push(
        `${file} tiene ${size.toLocaleString('en-US')} bytes; requiere separación gradual`,
      )
    }
  }
}

for (const warning of warnings) {
  console.warn(`[verify:warning] ${warning}`)
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[verify:error] ${failure}`)
  }

  process.exit(1)
}

console.log('[verify] Estructura y build verificados correctamente')
