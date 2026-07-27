import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))

const pathFromRoot = (...parts) => join(root, ...parts)
const read = (...parts) => readFileSync(pathFromRoot(...parts), 'utf8')

test('existen los archivos esenciales del proyecto', () => {
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'src/main.tsx',
    'src/App.tsx',
    'src/styles.css',
  ]

  for (const file of requiredFiles) {
    assert.equal(
      existsSync(pathFromRoot(file)),
      true,
      `Falta el archivo requerido: ${file}`,
    )
  }
})

test('Vite conserva la configuración de desarrollo local', () => {
  const viteConfig = read('vite.config.ts')

  assert.match(viteConfig, /plugins:\s*\[react\(\)\]/)
  assert.doesNotMatch(viteConfig, /outDir\s*:\s*['"]docs['"]/)
  assert.equal(
    existsSync(pathFromRoot('docs')),
    false,
    'La carpeta docs no debe existir en el flujo local',
  )
})

test('el punto de entrada carga App y los estilos globales', () => {
  const main = read('src', 'main.tsx')

  assert.match(main, /import App from ['"]\.\/App['"]/)
  assert.match(main, /import ['"]\.\/styles\.css['"]/)
})

test('el paquete está marcado como privado y no licenciado', () => {
  const packageJson = JSON.parse(read('package.json'))

  assert.equal(packageJson.private, true)
  assert.equal(packageJson.license, 'UNLICENSED')
})

test('los scripts mínimos de calidad están definidos', () => {
  const packageJson = JSON.parse(read('package.json'))

  for (const script of ['dev', 'build', 'typecheck', 'test', 'verify', 'check']) {
    assert.equal(
      typeof packageJson.scripts?.[script],
      'string',
      `Falta el script npm: ${script}`,
    )
  }
})
