import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
    <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowUp = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
    <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Menu = ({ open }: { open: boolean }) => (
  <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
)

const Pin = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none">
    <path d="M12 21s7-5.8 7-12A7 7 0 1 0 5 9c0 6.2 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="9" r="2.2" fill="currentColor" />
  </svg>
)

const Bike = () => (
  <svg aria-hidden="true" viewBox="0 0 48 48" width="48" height="48" fill="none">
    <circle cx="11" cy="35" r="8" stroke="currentColor" strokeWidth="3" />
    <circle cx="37" cy="35" r="8" stroke="currentColor" strokeWidth="3" />
    <path d="M17 35h9l6-15H21l-7 15M25 35l-8-17h-5M29 16h7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function DemoToast({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null
  return (
    <div className="demo-toast" role="status" aria-live="polite">
      <i>✓</i><span>{message}</span><button type="button" onClick={onClose} aria-label="Cerrar aviso">×</button>
    </div>
  )
}

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-logo ${compact ? 'is-compact' : ''}`} aria-label="Deliver Assets">
      <strong>DELIVER</strong>
      <strong>ASSETS</strong>
    </span>
  )
 }

function MotionMark() {
  return (
    <div className="motion-mark" aria-label="Deliver Assets">
      <div className="motion-mark-word word-deliver"><span>DELIVER</span><i /></div>
      <div className="motion-mark-word word-assets"><span>ASSETS</span><i /></div>
      <div className="motion-mark-route" aria-hidden="true"><b /><b /><b /></div>
      <small>MOVE / TRACK / ARRIVE</small>
    </div>
  )
}

type CategoryKey = 'comida' | 'mercado' | 'farmacia' | 'envios' 
type OrderStatus = 'idle' | 'cart' | 'confirmed' | 'assigned' | 'arriving' | 'delivered'

type Store = {
  name: string
  category: CategoryKey
  descriptor: string
  item: string
  price: number
  eta: string
  rating: string
  symbol: string
  tone: string
}

const nav = [
  ['Explorar', '#explorar'],
  ['Cómo funciona', '#como-funciona'],
  ['Negocios', '#negocios'],
  ['Repartidores', '#repartidores'],
]

const categories: Array<{
  key: CategoryKey
  index: string
  title: string
  copy: string
  tone: string
  symbol: string
}> = [
  { key: 'comida', index: '01', title: 'COMIDA', copy: 'Restaurantes, cafeterías y antojos cerca de ti.', tone: 'red', symbol: '🍔' },
  { key: 'mercado', index: '02', title: 'MERCADO', copy: 'Tu compra diaria sin cargar bolsas ni perder tiempo.', tone: 'yellow', symbol: '🛒' },
  { key: 'farmacia', index: '03', title: 'FARMACIA', copy: 'Productos esenciales entregados con trazabilidad.', tone: 'blue', symbol: '✚' },
  { key: 'envios', index: '04', title: 'ENVÍOS', copy: 'Mueve paquetes y documentos dentro de tu ciudad.', tone: 'mint', symbol: '↗' },
]

const categoryExperience: Record<CategoryKey, { kicker: string; title: string; accent: string; glyph: string }> = {
  comida: { kicker: 'RESTAURANTES CERCA', title: 'HOY NO\nCOCINAS.', accent: 'SABOR EN MOVIMIENTO', glyph: '◒' },
  mercado: { kicker: 'TU COMPRA DIARIA', title: 'LLENA LA\nDESPENSA.', accent: 'BOLSAS SIN CARGAR', glyph: '▦' },
  farmacia: { kicker: 'CUIDADO Y BIENESTAR', title: 'LO ESENCIAL\nLLEGA.', accent: 'TRAZABILIDAD CLARA', glyph: '+' },
  envios: { kicker: 'PAQUETES Y DOCUMENTOS', title: 'MUEVE LO\nIMPORTANTE.', accent: 'PUNTO A PUNTO', glyph: '↗' },
}

const stores: Store[] = [
  { name: 'BARRIO BURGER', category: 'comida', descriptor: 'Smash burgers · papas · combos', item: 'Combo Doble DA', price: 31.9, eta: '18–26 MIN', rating: '4.8', symbol: 'B', tone: 'red' },
  { name: 'CASA WOK', category: 'comida', descriptor: 'Arroz · noodles · bowls', item: 'Wok Teriyaki', price: 27.5, eta: '22–30 MIN', rating: '4.7', symbol: 'W', tone: 'yellow' },
  { name: 'PIZZA 33', category: 'comida', descriptor: 'Pizza artesanal · bebidas', item: 'Pizza Pepperoni', price: 39.9, eta: '25–35 MIN', rating: '4.9', symbol: '33', tone: 'blue' },
  { name: 'MERCADO 24', category: 'mercado', descriptor: 'Abarrotes · frutas · hogar', item: 'Canasta Esencial', price: 42.8, eta: '20–32 MIN', rating: '4.6', symbol: '24', tone: 'yellow' },
  { name: 'FRESCO', category: 'mercado', descriptor: 'Frutas · verduras · orgánico', item: 'Pack Fresco', price: 34.6, eta: '24–36 MIN', rating: '4.8', symbol: 'F', tone: 'mint' },
  { name: 'BODEGA NORTE', category: 'mercado', descriptor: 'Bebidas · snacks · básicos', item: 'Pack Reunión', price: 29.9, eta: '15–22 MIN', rating: '4.5', symbol: 'BN', tone: 'red' },
  { name: 'FARMA CENTRAL', category: 'farmacia', descriptor: 'Cuidado · higiene · bienestar', item: 'Kit Esencial', price: 24.9, eta: '16–25 MIN', rating: '4.9', symbol: '+', tone: 'blue' },
  { name: 'VITA', category: 'farmacia', descriptor: 'Dermocosmética · cuidado diario', item: 'Pack Cuidado', price: 46.2, eta: '23–31 MIN', rating: '4.7', symbol: 'V', tone: 'mint' },
  { name: 'BOTICA 7', category: 'farmacia', descriptor: 'Higiene · bebés · primeros auxilios', item: 'Botiquín Casa', price: 38.7, eta: '17–28 MIN', rating: '4.6', symbol: '7', tone: 'yellow' },
  { name: 'DA EXPRESS', category: 'envios', descriptor: 'Documentos · paquetes pequeños', item: 'Envío inmediato', price: 12.9, eta: 'RECOJO 12 MIN', rating: '4.9', symbol: '↗', tone: 'red' },
  { name: 'RUTA LOCAL', category: 'envios', descriptor: 'Paquetes · entregas programadas', item: 'Ruta punto a punto', price: 16.5, eta: 'RECOJO 18 MIN', rating: '4.8', symbol: 'R', tone: 'blue' },
  { name: 'FLASH BOX', category: 'envios', descriptor: 'Última milla · comercio local', item: 'Entrega prioritaria', price: 19.9, eta: 'RECOJO 10 MIN', rating: '4.7', symbol: 'F', tone: 'mint' },
]

const steps = [
  ['01', 'PIDE', 'Elige el comercio, arma tu pedido y confirma la dirección.'],
  ['02', 'MIRA', 'Sigue cada cambio de estado y la ruta del repartidor.'],
  ['03', 'RECIBE', 'Tu pedido llega con una experiencia clara y directa.'],
]

const statusCopy: Record<OrderStatus, { label: string; detail: string; step: number }> = {
  idle: { label: 'ELIGE UN PRODUCTO', detail: 'La simulación comienza cuando agregas algo.', step: 0 },
  cart: { label: 'PEDIDO LISTO', detail: 'Confirma para iniciar el recorrido.', step: 1 },
  confirmed: { label: 'CONFIRMANDO', detail: 'El comercio está preparando tu pedido.', step: 2 },
  assigned: { label: 'REPARTIDOR ASIGNADO', detail: 'Alex ya va hacia el comercio.', step: 3 },
  arriving: { label: 'EN CAMINO', detail: 'Tu entrega está avanzando por la ciudad.', step: 4 },
  delivered: { label: 'ENTREGADO', detail: 'Pedido completado. Flujo cerrado.', step: 5 },
}


type PrototypeRole = 'cliente' | 'negocio' | 'repartidor' | 'admin'
type AccessStep = 'roles' | 'signin' | 'verify' | 'recovery' | 'permissions'
type AuthMethod = 'password' | 'magic' | 'guest'

type DemoSession = {
  id: string
  role: PrototypeRole
  name: string
  email: string
  permissions: string[]
  authMethod: AuthMethod
  startedAt: string
}
type CustomerScreen = 'welcome' | 'login' | 'location' | 'home' | 'store' | 'cart' | 'checkout' | 'payment' | 'processing' | 'tracking' | 'delivered' | 'account' | 'orders' | 'orderdetail' | 'promotions' | 'notifications' | 'support' | 'settings'
type MerchantStage = 'new' | 'accepted' | 'preparing' | 'ready'
type RiderStage = 'offer' | 'accepted' | 'pickup' | 'route' | 'done'

type DemoProduct = {
  id: number
  name: string
  description: string
  price: number
  symbol: string
  tone: string
  section: string
}

const demoProductsByStore: Record<string, DemoProduct[]> = {
  'BARRIO BURGER': [
    { id: 101, name: 'Combo Doble DA', description: 'Doble smash, queso, papas y bebida.', price: 31.9, symbol: 'DA', tone: 'red', section: 'COMBOS' },
    { id: 102, name: 'Burger Clásica', description: 'Smash, queso, pepinillos y salsa de casa.', price: 18.9, symbol: 'B', tone: 'yellow', section: 'BURGERS' },
    { id: 103, name: 'Papas Fuego', description: 'Papas crocantes, especias y salsa picante.', price: 10.9, symbol: '🔥', tone: 'blue', section: 'ACOMPAÑAMIENTOS' },
    { id: 104, name: 'Shake Limón', description: 'Bebida cremosa, cítrica y fría.', price: 12.5, symbol: 'L', tone: 'mint', section: 'BEBIDAS' },
  ],
  'CASA WOK': [
    { id: 111, name: 'Wok Teriyaki', description: 'Pollo, verduras, arroz y salsa teriyaki.', price: 27.5, symbol: 'WT', tone: 'yellow', section: 'WOKS' },
    { id: 112, name: 'Arroz Chaufa', description: 'Arroz salteado, huevo, cebolla china y pollo.', price: 24.9, symbol: 'AC', tone: 'red', section: 'ARROCES' },
    { id: 113, name: 'Noodles Picantes', description: 'Fideos, verduras, ajonjolí y salsa picante.', price: 26.8, symbol: 'NP', tone: 'blue', section: 'NOODLES' },
    { id: 114, name: 'Té Jazmín', description: 'Té frío de jazmín con limón.', price: 8.5, symbol: 'T', tone: 'mint', section: 'BEBIDAS' },
  ],
  'PIZZA 33': [
    { id: 121, name: 'Pizza Pepperoni', description: 'Salsa de tomate, mozzarella y pepperoni.', price: 39.9, symbol: '33', tone: 'blue', section: 'PIZZAS' },
    { id: 122, name: 'Pizza Margherita', description: 'Tomate, mozzarella, albahaca y aceite de oliva.', price: 34.9, symbol: 'M', tone: 'mint', section: 'PIZZAS' },
    { id: 123, name: 'Pan al Ajo', description: 'Pan artesanal, mantequilla y ajo rostizado.', price: 12.9, symbol: 'PA', tone: 'yellow', section: 'ENTRADAS' },
    { id: 124, name: 'Soda 33', description: 'Bebida cítrica de la casa.', price: 9.5, symbol: 'S', tone: 'red', section: 'BEBIDAS' },
  ],
  'MERCADO 24': [
    { id: 201, name: 'Canasta Esencial', description: 'Arroz, leche, huevos, pan y básicos.', price: 42.8, symbol: '24', tone: 'yellow', section: 'CANASTAS' },
    { id: 202, name: 'Pack Desayuno', description: 'Café, pan, mantequilla y mermelada.', price: 29.4, symbol: '☀', tone: 'red', section: 'DESAYUNO' },
    { id: 203, name: 'Pack Limpieza', description: 'Productos esenciales para el hogar.', price: 38.2, symbol: 'L', tone: 'blue', section: 'HOGAR' },
    { id: 204, name: 'Bebidas Frías', description: 'Agua, gaseosa y jugo para compartir.', price: 24.6, symbol: 'B', tone: 'mint', section: 'BEBIDAS' },
  ],
  'FRESCO': [
    { id: 211, name: 'Pack Fresco', description: 'Frutas y verduras seleccionadas.', price: 34.6, symbol: 'F', tone: 'mint', section: 'PACKS' },
    { id: 212, name: 'Frutas de Estación', description: 'Selección de frutas listas para la semana.', price: 26.9, symbol: 'FR', tone: 'yellow', section: 'FRUTAS' },
    { id: 213, name: 'Verduras Verdes', description: 'Hojas, brócoli, pepino y zucchini.', price: 23.5, symbol: 'V', tone: 'blue', section: 'VERDURAS' },
    { id: 214, name: 'Canasta Orgánica', description: 'Selección orgánica de productores locales.', price: 49.8, symbol: 'O', tone: 'red', section: 'ORGÁNICO' },
  ],
  'BODEGA NORTE': [
    { id: 221, name: 'Pack Reunión', description: 'Bebidas, hielo, snacks y vasos.', price: 29.9, symbol: 'BN', tone: 'red', section: 'PACKS' },
    { id: 222, name: 'Snacks Mix', description: 'Papas, galletas, frutos secos y chocolates.', price: 22.4, symbol: 'S', tone: 'yellow', section: 'SNACKS' },
    { id: 223, name: 'Básicos de Cocina', description: 'Aceite, sal, azúcar, arroz y pasta.', price: 35.7, symbol: 'BC', tone: 'blue', section: 'ABARROTES' },
    { id: 224, name: 'Bebidas para Dos', description: 'Agua, jugo y gaseosa.', price: 18.9, symbol: '2', tone: 'mint', section: 'BEBIDAS' },
  ],
  'FARMA CENTRAL': [
    { id: 301, name: 'Kit Esencial', description: 'Cuidado personal e higiene diaria.', price: 24.9, symbol: '+', tone: 'blue', section: 'CUIDADO' },
    { id: 302, name: 'Primeros Auxilios', description: 'Gasas, vendas, antiséptico y curitas.', price: 32.8, symbol: 'PA', tone: 'red', section: 'BOTIQUÍN' },
    { id: 303, name: 'Pack Higiene', description: 'Jabón, pasta dental y cuidado diario.', price: 27.6, symbol: 'H', tone: 'yellow', section: 'HIGIENE' },
    { id: 304, name: 'Cuidado Solar', description: 'Protección solar y bálsamo hidratante.', price: 45.5, symbol: 'SPF', tone: 'mint', section: 'CUIDADO' },
  ],
  'VITA': [
    { id: 311, name: 'Pack Cuidado', description: 'Dermocosmética para rutina diaria.', price: 46.2, symbol: 'V', tone: 'mint', section: 'ROSTRO' },
    { id: 312, name: 'Rutina Hidratante', description: 'Limpiador, sérum y crema hidratante.', price: 68.9, symbol: 'RH', tone: 'blue', section: 'ROSTRO' },
    { id: 313, name: 'Cuidado Corporal', description: 'Gel de ducha, crema y protector.', price: 51.4, symbol: 'CC', tone: 'yellow', section: 'CUERPO' },
    { id: 314, name: 'Protección Diaria', description: 'Protector solar y bálsamo labial.', price: 39.8, symbol: 'PD', tone: 'red', section: 'SOLAR' },
  ],
  'BOTICA 7': [
    { id: 321, name: 'Botiquín Casa', description: 'Implementos básicos de primeros auxilios.', price: 38.7, symbol: '7', tone: 'yellow', section: 'BOTIQUÍN' },
    { id: 322, name: 'Pack Bebé', description: 'Higiene y cuidado para los más pequeños.', price: 52.9, symbol: 'B', tone: 'red', section: 'BEBÉ' },
    { id: 323, name: 'Higiene Familiar', description: 'Cuidado diario para toda la familia.', price: 34.5, symbol: 'HF', tone: 'blue', section: 'HIGIENE' },
    { id: 324, name: 'Viaje Seguro', description: 'Kit compacto de higiene y primeros auxilios.', price: 29.6, symbol: 'VS', tone: 'mint', section: 'VIAJE' },
  ],
  'DA EXPRESS': [
    { id: 401, name: 'Envío Inmediato', description: 'Documento o paquete pequeño punto a punto.', price: 12.9, symbol: '↗', tone: 'red', section: 'INMEDIATO' },
    { id: 402, name: 'Documento Urgente', description: 'Recojo prioritario con confirmación de entrega.', price: 16.9, symbol: 'DU', tone: 'yellow', section: 'DOCUMENTOS' },
    { id: 403, name: 'Paquete Pequeño', description: 'Hasta 5 kg dentro de la zona operativa.', price: 18.5, symbol: 'P', tone: 'blue', section: 'PAQUETES' },
    { id: 404, name: 'Entrega Programada', description: 'Selecciona una ventana de recojo.', price: 15.5, symbol: 'EP', tone: 'mint', section: 'PROGRAMADO' },
  ],
  'RUTA LOCAL': [
    { id: 411, name: 'Ruta Punto a Punto', description: 'Traslado directo entre dos direcciones.', price: 16.5, symbol: 'R', tone: 'blue', section: 'RUTAS' },
    { id: 412, name: 'Ruta con Retorno', description: 'Entrega y devolución de documento o paquete.', price: 25.9, symbol: '↔', tone: 'yellow', section: 'RUTAS' },
    { id: 413, name: 'Entrega Programada', description: 'Recojo en una franja horaria específica.', price: 18.9, symbol: 'P', tone: 'mint', section: 'PROGRAMADO' },
    { id: 414, name: 'Ruta Comercial', description: 'Servicio conceptual para negocios locales.', price: 28.5, symbol: 'RC', tone: 'red', section: 'COMERCIAL' },
  ],
  'FLASH BOX': [
    { id: 421, name: 'Entrega Prioritaria', description: 'Recojo preferente y seguimiento en vivo.', price: 19.9, symbol: 'F', tone: 'mint', section: 'PRIORITARIO' },
    { id: 422, name: 'Última Milla', description: 'Entrega final para comercio electrónico.', price: 23.5, symbol: 'UM', tone: 'blue', section: 'COMERCIAL' },
    { id: 423, name: 'Flash 60', description: 'Objetivo conceptual de entrega en 60 minutos.', price: 26.9, symbol: '60', tone: 'red', section: 'PRIORITARIO' },
    { id: 424, name: 'Lote Local', description: 'Hasta tres entregas dentro de una misma zona.', price: 39.9, symbol: '3', tone: 'yellow', section: 'LOTES' },
  ],
}

const allDemoProducts = Object.values(demoProductsByStore).flat()


type CustomerNotification = {
  id: number
  title: string
  body: string
  time: string
  read: boolean
  tone: string
}

type CustomerSettingKey = 'push' | 'email' | 'promos' | 'location' | 'biometric'
type CustomerSettings = Record<CustomerSettingKey, boolean>

type SupportMessage = {
  id: number
  author: 'user' | 'support'
  text: string
  time: string
}


const roleAccessProfiles: Record<PrototypeRole, {
  title: string
  subtitle: string
  description: string
  symbol: string
  tone: string
  email: string
  name: string
  permissions: string[]
}> = {
  cliente: {
    title: 'Cliente',
    subtitle: 'Pedidos y cuenta personal',
    description: 'Explora comercios, compra, sigue pedidos y administra tu perfil.',
    symbol: 'C',
    tone: 'yellow',
    email: 'cliente@deliverassets.demo',
    name: 'Eidon Morimil',
    permissions: ['Explorar comercios', 'Crear pedidos', 'Gestionar pagos demo', 'Consultar historial', 'Usar soporte'],
  },
  negocio: {
    title: 'Negocio',
    subtitle: 'Operación comercial',
    description: 'Administra pedidos, catálogo, inventario, horarios y métricas.',
    symbol: 'N',
    tone: 'red',
    email: 'negocio@deliverassets.demo',
    name: 'Barrio Burger',
    permissions: ['Gestionar pedidos', 'Editar catálogo', 'Controlar inventario', 'Crear promociones', 'Consultar liquidaciones'],
  },
  repartidor: {
    title: 'Repartidor',
    subtitle: 'Entregas y ganancias',
    description: 'Recibe ofertas, completa rutas y controla tus pagos.',
    symbol: 'R',
    tone: 'blue',
    email: 'rider@deliverassets.demo',
    name: 'Alex Ramírez',
    permissions: ['Recibir ofertas', 'Gestionar entregas', 'Consultar ganancias', 'Reportar incidencias', 'Editar vehículo'],
  },
  admin: {
    title: 'Administración',
    subtitle: 'Control central',
    description: 'Supervisa todo el ecosistema, finanzas, zonas, usuarios y riesgo.',
    symbol: 'A',
    tone: 'mint',
    email: 'admin@deliverassets.demo',
    name: 'Eidon M.',
    permissions: ['Control total de pedidos', 'Gestionar usuarios y roles', 'Configurar zonas', 'Supervisar finanzas', 'Resolver incidencias'],
  },
}

function AccessGateway({
  currentSession,
  initialRole,
  onAuthenticated,
  onClose,
}: {
  currentSession: DemoSession | null
  initialRole: PrototypeRole
  onAuthenticated: (session: DemoSession) => void
  onClose: () => void
}) {
  const [step, setStep] = useState<AccessStep>('roles')
  const [selectedRole, setSelectedRole] = useState<PrototypeRole>(initialRole)
  const [email, setEmail] = useState(roleAccessProfiles[initialRole].email)
  const [password, setPassword] = useState('deliver-demo')
  const [code, setCode] = useState('')
  const [method, setMethod] = useState<AuthMethod>('password')
  const [recoverySent, setRecoverySent] = useState(false)
  const [feedback, setFeedback] = useState('')
  const profile = roleAccessProfiles[selectedRole]

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  useEffect(() => {
    setSelectedRole(initialRole)
    setEmail(roleAccessProfiles[initialRole].email)
    setStep('roles')
    setCode('')
    setRecoverySent(false)
  }, [initialRole])

  const chooseRole = (role: PrototypeRole) => {
    setSelectedRole(role)
    setEmail(roleAccessProfiles[role].email)
    setMethod(role === 'cliente' ? 'guest' : 'password')
    setCode('')
    setStep('signin')
  }

  const continueSignIn = (event: FormEvent) => {
    event.preventDefault()
    if (method === 'guest') {
      setStep('permissions')
      return
    }
    setCode('4821')
    setStep('verify')
  }

  const completeAccess = () => {
    onAuthenticated({
      id: `demo-${selectedRole}-${Date.now()}`,
      role: selectedRole,
      name: profile.name,
      email,
      permissions: profile.permissions,
      authMethod: method,
      startedAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
    })
  }

  return (
    <div className="access-gateway">
      <div className="access-gateway-shell">

        <div className="access-progress">
          {[
            ['roles', '01', 'ROL'],
            ['signin', '02', 'ACCESO'],
            ['verify', '03', 'VERIFICACIÓN'],
            ['permissions', '04', 'PERMISOS'],
          ].map(([item, number, label], index) => {
            const order: AccessStep[] = ['roles', 'signin', 'verify', 'permissions']
            const normalizedStep = step === 'recovery' ? 'signin' : step
            const activeIndex = order.indexOf(normalizedStep)
            return <i key={item} className={index <= activeIndex ? 'is-active' : ''}><b>{number}</b><span>{label}</span></i>
          })}
        </div>

        {step === 'roles' && (
          <section className="access-role-screen">
            <div className="access-title">
              <span>SELECCIONA UNA IDENTIDAD</span>
              <h2>UN SISTEMA.<br /><em>CUATRO ROLES.</em></h2>
              <p>Cada perfil entra únicamente a los módulos necesarios. El cambio de rol exige una nueva sesión simulada.</p>
            </div>

            {currentSession && (
              <div className="access-current-session">
                <i>{roleAccessProfiles[currentSession.role].symbol}</i>
                <span><small>SESIÓN ACTUAL</small><strong>{currentSession.name}</strong><em>{roleAccessProfiles[currentSession.role].title} · iniciada {currentSession.startedAt}</em></span>
                <b>ACTIVA</b>
              </div>
            )}

            <div className="access-role-grid">
              {(Object.keys(roleAccessProfiles) as PrototypeRole[]).map((role) => {
                const item = roleAccessProfiles[role]
                return (
                  <button key={role} type="button" className={`tone-${item.tone} access-role-${role}`} onClick={() => chooseRole(role)}>
                    <div className="access-role-graphic" aria-hidden="true"><span /><span /><span /><b>{item.symbol}</b></div>
                    <i>{item.symbol}</i>
                    <span>{item.subtitle}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <b>ENTRAR COMO {item.title.toUpperCase()} <Arrow /></b>
                  </button>
                )
              })}
            </div>

            <div className="access-security-strip">
              <span><i>✓</i> ROLES AISLADOS</span>
              <span><i>✓</i> VERIFICACIÓN EN DOS PASOS</span>
              <span><i>✓</i> PERMISOS EXPLÍCITOS</span>
              <span><i>✓</i> SESIONES SIMULADAS</span>
            </div>
          </section>
        )}

        {step === 'signin' && (
          <section className="access-form-screen">
            <aside className={`access-role-summary tone-${profile.tone}`}>
              <i>{profile.symbol}</i>
              <span>IDENTIDAD SELECCIONADA</span>
              <h2>{profile.title.toUpperCase()}.</h2>
              <p>{profile.description}</p>
              <button type="button" onClick={() => setStep('roles')}>← CAMBIAR ROL</button>
            </aside>

            <form className="access-form-card" onSubmit={continueSignIn}>
              <span>PASO 02 / ACCESO</span>
              <h3>IDENTIFÍCATE.</h3>
              <p>Los datos están precargados para facilitar la navegación del prototipo.</p>

              {selectedRole === 'cliente' && (
                <div className="access-method-tabs">
                  <button type="button" className={method === 'guest' ? 'is-active' : ''} onClick={() => setMethod('guest')}>INVITADO</button>
                  <button type="button" className={method === 'password' ? 'is-active' : ''} onClick={() => setMethod('password')}>CUENTA</button>
                  <button type="button" className={method === 'magic' ? 'is-active' : ''} onClick={() => setMethod('magic')}>ENLACE MÁGICO</button>
                </div>
              )}

              {method === 'guest' ? (
                <div className="access-guest-card">
                  <i>C</i>
                  <span><strong>Continuar como invitado</strong><small>Acceso limitado a compra, seguimiento y soporte. No persiste datos.</small></span>
                </div>
              ) : (
                <>
                  <label><span>CORREO</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                  {method === 'password' && <label><span>CONTRASEÑA</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
                  {method === 'magic' && <div className="access-info-box"><b>ENLACE MÁGICO</b><p>En producción se enviaría un enlace de un solo uso al correo indicado.</p></div>}
                </>
              )}

              <div className="access-form-actions">
                {method === 'password' && <button type="button" onClick={() => setStep('recovery')}>OLVIDÉ MI CONTRASEÑA</button>}
                <button type="submit">{method === 'guest' ? 'CONTINUAR' : method === 'magic' ? 'ENVIAR ENLACE' : 'INICIAR SESIÓN'} <Arrow /></button>
              </div>
              <small className="access-legal-note">Al continuar aceptas el uso conceptual de esta sesión. No se transmiten credenciales reales.</small>
            </form>
          </section>
        )}

        {step === 'recovery' && (
          <section className="access-recovery-screen">
            <div className="access-recovery-art"><span>RECUPERACIÓN</span><h2>VUELVE<br />A ENTRAR.</h2><p>Diseño del flujo para recuperar una cuenta sin revelar si el correo existe.</p></div>
            <div className="access-recovery-card">
              <span>RECUPERAR ACCESO</span>
              <h3>{recoverySent ? 'REVISA TU CORREO.' : '¿OLVIDASTE LA CLAVE?'}</h3>
              {!recoverySent ? (
                <>
                  <p>Ingresa el correo asociado. La respuesta real debe ser neutra para evitar enumeración de cuentas.</p>
                  <label><span>CORREO</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                  <button type="button" onClick={() => setRecoverySent(true)}>ENVIAR INSTRUCCIONES <Arrow /></button>
                </>
              ) : (
                <>
                  <div className="access-mail-sent"><i>✓</i><span><strong>Solicitud enviada</strong><small>Usa el código demo 4821 para continuar.</small></span></div>
                  <button type="button" onClick={() => { setCode('4821'); setStep('verify') }}>INGRESAR CÓDIGO <Arrow /></button>
                </>
              )}
              <button className="access-text-action" type="button" onClick={() => setStep('signin')}>← VOLVER AL ACCESO</button>
            </div>
          </section>
        )}

        {step === 'verify' && (
          <section className="access-verify-screen">
            <div className={`access-verify-role tone-${profile.tone}`}><i>{profile.symbol}</i><span><small>VERIFICANDO</small><strong>{profile.title}</strong><em>{email}</em></span></div>
            <div className="access-verify-card">
              <span>PASO 03 / VERIFICACIÓN</span>
              <h2>CONFIRMA<br />QUE ERES TÚ.</h2>
              <p>Introduce el código demo. En producción se aplicaría TOTP, correo, SMS o autenticación biométrica según el riesgo.</p>
              <label><span>CÓDIGO DE 4 DÍGITOS</span><input inputMode="numeric" maxLength={4} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} placeholder="4821" /></label>
              <button type="button" className="access-code-hint" onClick={() => setCode('4821')}><b>CÓDIGO DEMO</b><strong>4821</strong><small>Pulsa aquí para completar el campo.</small></button>
              <button type="button" disabled={code.length !== 4} onClick={() => setStep('permissions')}>VERIFICAR IDENTIDAD <Arrow /></button>
              <button className="access-text-action" type="button" onClick={() => setFeedback('Código demo reenviado: 4821')}>REENVIAR CÓDIGO</button>
            </div>
          </section>
        )}

        {step === 'permissions' && (
          <section className="access-permission-screen">
            <div className="access-permission-title">
              <span>PASO 04 / AUTORIZACIÓN</span>
              <h2>ACCESO<br /><em>CON LÍMITES.</em></h2>
              <p>La sesión abrirá únicamente los módulos asociados al rol seleccionado.</p>
            </div>

            <div className="access-permission-layout">
              <aside className={`access-permission-role tone-${profile.tone}`}>
                <i>{profile.symbol}</i>
                <span>ROL AUTORIZADO</span>
                <h3>{profile.title}</h3>
                <p>{profile.name}<br />{email}</p>
                <b>AUTENTICACIÓN: {method === 'guest' ? 'INVITADO' : method === 'magic' ? 'ENLACE MÁGICO' : 'CONTRASEÑA + 2FA'}</b>
              </aside>

              <section className="access-permission-list">
                <header><span>PERMISOS OTORGADOS</span><b>{profile.permissions.length} ACTIVOS</b></header>
                {profile.permissions.map((permission, index) => <div key={permission}><i>✓</i><span><strong>{permission}</strong><small>Permiso de demostración · alcance limitado al rol</small></span><b>ALLOW</b></div>)}
                <div className="access-denied-row"><i>×</i><span><strong>Acceso a otros roles</strong><small>Requiere cerrar o cambiar la sesión actual.</small></span><b>DENY</b></div>
              </section>
            </div>

            <div className="access-session-policy">
              <span><b>30 MIN</b> expiración conceptual</span>
              <span><b>1 DISPOSITIVO</b> sesión demo activa</span>
              <span><b>AUDITADO</b> cambio de rol registrado</span>
              <button type="button" onClick={completeAccess}>ENTRAR AL SISTEMA <Arrow /></button>
            </div>
          </section>
        )}
        <DemoToast message={feedback} onClose={() => setFeedback('')} />
      </div>
    </div>
  )
}


const customerOrders = [
  { id: '#DA-2408', store: 'Barrio Burger', date: 'Hoy · 10:42', total: 49.70, status: 'En camino', tone: 'blue', items: '3 productos', rider: 'Alex R.' },
  { id: '#DA-2321', store: 'Mercado 24', date: '08 Jul · 18:10', total: 86.40, status: 'Entregado', tone: 'mint', items: '7 productos', rider: 'María T.' },
  { id: '#DA-2188', store: 'Farma Central', date: '03 Jul · 21:26', total: 34.90, status: 'Entregado', tone: 'yellow', items: '2 productos', rider: 'Noel P.' },
  { id: '#DA-2044', store: 'Pizza 33', date: '28 Jun · 20:05', total: 72.50, status: 'Entregado', tone: 'red', items: '4 productos', rider: 'Jorge L.' },
]

const customerPromotions = [
  { code: 'PRIMER20', title: '20% EN TU PRIMER PEDIDO', detail: 'Hasta S/ 15 de descuento. Pedido mínimo S/ 30.', tone: 'yellow', expiry: 'Válido hasta 31 Jul' },
  { code: 'ENVIO0', title: 'ENVÍO GRATIS', detail: 'En restaurantes seleccionados por pedidos desde S/ 35.', tone: 'mint', expiry: 'Disponible hoy' },
  { code: 'NOCHE10', title: 'S/ 10 DE DESCUENTO', detail: 'Para pedidos entre 8:00 p. m. y 11:59 p. m.', tone: 'blue', expiry: '3 usos restantes' },
  { code: 'MERCADO15', title: '15% EN MERCADO', detail: 'Hasta S/ 20 de descuento en tiendas participantes.', tone: 'red', expiry: 'Válido hasta 20 Jul' },
]

const initialCustomerNotifications: CustomerNotification[] = [
  { id: 1, title: 'Alex ya recogió tu pedido', body: 'Tu pedido #DA-2408 está en camino y llegará en aproximadamente 12 minutos.', time: 'Ahora', read: false, tone: 'blue' },
  { id: 2, title: 'Tu pedido fue confirmado', body: 'Barrio Burger comenzó a preparar tus productos.', time: 'Hace 8 min', read: false, tone: 'yellow' },
  { id: 3, title: 'Nueva promoción disponible', body: 'Activa ENVIO0 y obtén envío gratis en comercios seleccionados.', time: 'Hace 2 h', read: false, tone: 'mint' },
  { id: 4, title: 'Pedido entregado', body: 'Tu pedido de Mercado 24 fue entregado correctamente.', time: '08 Jul', read: true, tone: 'red' },
]

function CustomerAccountSuite({
  screen,
  onNavigate,
  address,
  onAddressChange,
  activePromo,
  onPromoToggle,
  notifications,
  onReadNotification,
  onReadAll,
  supportMessages,
  onSendSupport,
  settings,
  onToggleSetting,
  onReorder,
  onNotify,
  onSignOut,
}: {
  screen: CustomerScreen
  onNavigate: (screen: CustomerScreen) => void
  address: string
  onAddressChange: (address: string) => void
  activePromo: string
  onPromoToggle: (code: string) => void
  notifications: CustomerNotification[]
  onReadNotification: (id: number) => void
  onReadAll: () => void
  supportMessages: SupportMessage[]
  onSendSupport: (text: string) => void
  settings: CustomerSettings
  onToggleSetting: (key: CustomerSettingKey) => void
  onReorder: () => void
  onNotify: (message: string) => void
  onSignOut: () => void
}) {
  const [supportDraft, setSupportDraft] = useState('')
  const [orderFilter, setOrderFilter] = useState<'todos' | 'curso' | 'entregados' | 'cancelados'>('todos')
  const unread = notifications.filter((item) => !item.read).length

  const filteredCustomerOrders = customerOrders.filter((order) => {
    if (orderFilter === 'todos') return true
    if (orderFilter === 'curso') return order.status !== 'Entregado' && order.status !== 'Cancelado'
    if (orderFilter === 'entregados') return order.status === 'Entregado'
    return order.status === 'Cancelado'
  })

  const copyReferral = async () => {
    try { await navigator.clipboard.writeText('EIDONDA26') } catch { /* clipboard can be unavailable in local previews */ }
    onNotify('Código EIDONDA26 copiado.')
  }

  const downloadReceipt = () => {
    const receipt = ['DELIVER ASSETS · COMPROBANTE DEMO', '#DA-2321', 'Mercado 24', 'Total: S/ 86.40', 'Sin valor fiscal ni financiero.'].join('\n')
    const url = URL.createObjectURL(new Blob([receipt], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'deliver-assets-comprobante-demo.txt'
    link.click()
    URL.revokeObjectURL(url)
    onNotify('Comprobante demo descargado.')
  }

  const submitSupport = (event: FormEvent) => {
    event.preventDefault()
    const text = supportDraft.trim()
    if (!text) return
    onSendSupport(text)
    setSupportDraft('')
  }

  if (screen === 'account') {
    return (
      <div className="account-screen customer-service-screen">
        <section className="account-hero">
          <div className="account-avatar">EM</div>
          <div><span>MI CUENTA</span><h2>EIDON<br />MORIMIL.</h2><p>Cliente demo · Miembro desde julio de 2026</p></div>
          <button type="button" onClick={() => onNavigate('settings')}>EDITAR PERFIL ↗</button>
        </section>

        <section className="account-wallet">
          <div><span>BILLETERA DELIVER ASSETS</span><strong>S/ 180.00</strong><small>Saldo simulado disponible</small></div>
          <b>DA</b>
          <button type="button" onClick={() => onNotify('Recarga simulada: integración pendiente.')}>AGREGAR SALDO</button>
        </section>

        <div className="account-quick-grid">
          <button type="button" onClick={() => onNavigate('orders')}><i>▤</i><strong>MIS PEDIDOS</strong><small>4 pedidos recientes</small></button>
          <button type="button" onClick={() => onNavigate('promotions')}><i>%</i><strong>PROMOCIONES</strong><small>{activePromo ? `Cupón ${activePromo} activo` : '4 ofertas disponibles'}</small></button>
          <button type="button" onClick={() => onNavigate('notifications')}><i>!</i><strong>NOTIFICACIONES</strong><small>{unread ? `${unread} sin leer` : 'Todo revisado'}</small></button>
          <button type="button" onClick={() => onNavigate('support')}><i>?</i><strong>AYUDA Y SOPORTE</strong><small>Centro de resolución</small></button>
        </div>

        <div className="account-info-grid">
          <section className="account-address-card">
            <div className="service-heading"><div><span>DIRECCIONES</span><h3>LUGARES GUARDADOS</h3></div><button type="button" onClick={() => onNotify('Formulario de nueva dirección preparado para backend.')}>+ AGREGAR</button></div>
            <label><i>⌂</i><span><strong>Casa</strong><input value={address} onChange={(event) => onAddressChange(event.target.value)} /></span><b>PRINCIPAL</b></label>
            <label><i>▦</i><span><strong>Oficina</strong><small>Jr. de la Unión 620, Lima</small></span><button type="button" onClick={() => onNotify('Edición de oficina simulada.')}>EDITAR</button></label>
          </section>
          <section className="account-payments-card">
            <div className="service-heading"><div><span>PAGOS</span><h3>MÉTODOS GUARDADOS</h3></div><button type="button" onClick={() => onNotify('No ingreses tarjetas reales. Flujo de pago aún simulado.')}>+ AGREGAR</button></div>
            <div><i>VISA</i><span><strong>•••• 4242</strong><small>Vence 12/29</small></span><b>PREDETERMINADA</b></div>
            <div><i>DA</i><span><strong>Billetera DA</strong><small>Saldo demo S/ 180.00</small></span><button type="button" onClick={() => onNotify('Billetera demo seleccionada.')}>GESTIONAR</button></div>
          </section>
        </div>

        <section className="account-invite">
          <div><span>PROGRAMA DE REFERIDOS</span><h3>INVITA. AMBOS GANAN.</h3><p>Comparte tu código y recibe crédito demo cuando tu contacto complete su primer pedido.</p></div>
          <button type="button" onClick={copyReferral}><strong>EIDONDA26</strong><small>COPIAR CÓDIGO</small></button>
        </section>
      </div>
    )
  }

  if (screen === 'orders') {
    return (
      <div className="orders-screen customer-service-screen">
        <header className="service-title"><span>HISTORIAL</span><h2>TUS<br />PEDIDOS.</h2><p>Consulta estados, comprobantes y repite pedidos anteriores.</p></header>
        <div className="orders-filter">{([['todos','TODOS'],['curso','EN CURSO'],['entregados','ENTREGADOS'],['cancelados','CANCELADOS']] as const).map(([value,label]) => <button key={value} className={orderFilter === value ? 'is-active' : ''} type="button" onClick={() => setOrderFilter(value)}>{label}</button>)}</div>
        <section className="customer-order-list">
          {filteredCustomerOrders.map((order) => (
            <article key={order.id}>
              <i className={`tone-${order.tone}`}>{order.store.split(' ').map((word) => word[0]).join('').slice(0, 2)}</i>
              <div><small>{order.id} · {order.date}</small><strong>{order.store}</strong><span>{order.items} · Repartidor {order.rider}</span></div>
              <em className={`order-state tone-${order.tone}`}>{order.status}</em>
              <b>S/ {order.total.toFixed(2)}</b>
              <button type="button" onClick={() => onNavigate('orderdetail')}>VER DETALLE <Arrow /></button>
            </article>
          ))}
        </section>
        {filteredCustomerOrders.length === 0 && <div className="customer-empty-state"><i>○</i><strong>NO HAY PEDIDOS</strong><span>Prueba con otro filtro.</span></div>}
      </div>
    )
  }

  if (screen === 'orderdetail') {
    const order = customerOrders[1]
    return (
      <div className="order-detail-screen customer-service-screen">
        <header className="service-title"><span>{order.id} · ENTREGADO</span><h2>DETALLE<br />DEL PEDIDO.</h2></header>
        <div className="order-detail-layout">
          <section className="order-detail-main">
            <div className="order-detail-store"><i className="tone-mint">M24</i><span><strong>{order.store}</strong><small>{order.date} · {order.rider}</small></span><b>ENTREGADO ✓</b></div>
            <div className="order-items">
              <h3>PRODUCTOS</h3>
              <p><span>1 × Canasta Esencial</span><b>S/ 42.80</b></p>
              <p><span>1 × Pack Fresco</span><b>S/ 34.60</b></p>
              <p><span>1 × Bolsa reutilizable</span><b>S/ 3.20</b></p>
            </div>
            <div className="order-delivery-data">
              <div><span>DIRECCIÓN</span><strong>{address}</strong><small>Departamento 302 · Tocar timbre</small></div>
              <div><span>PAGO</span><strong>Visa •••• 4242</strong><small>Operación demo aprobada</small></div>
            </div>
            <div className="order-history-timeline">
              <i className="is-done"><b>✓</b><span>Pedido confirmado<small>18:10</small></span></i>
              <i className="is-done"><b>✓</b><span>Preparación completada<small>18:19</small></span></i>
              <i className="is-done"><b>✓</b><span>Pedido recogido<small>18:25</small></span></i>
              <i className="is-done"><b>✓</b><span>Entregado<small>18:43</small></span></i>
            </div>
          </section>
          <aside className="order-invoice">
            <span>COMPROBANTE DEMO</span>
            <h3>{order.id}</h3>
            <p><span>Productos</span><b>S/ 80.60</b></p>
            <p><span>Envío</span><b>S/ 4.90</b></p>
            <p><span>Servicio</span><b>S/ 0.90</b></p>
            <p className="invoice-total"><span>TOTAL</span><strong>S/ {order.total.toFixed(2)}</strong></p>
            <button className="prototype-primary" type="button" onClick={onReorder}>PEDIR DE NUEVO <Arrow /></button>
            <button className="prototype-secondary" type="button" onClick={downloadReceipt}>DESCARGAR COMPROBANTE</button>
          </aside>
        </div>
      </div>
    )
  }

  if (screen === 'promotions') {
    return (
      <div className="promotions-screen customer-service-screen">
        <header className="service-title"><span>BENEFICIOS</span><h2>AHORRA<br /><em>SIN FRENAR.</em></h2><p>Cupones y beneficios simulados para definir la experiencia comercial.</p></header>
        <div className="promo-wallet-strip"><span>CUPÓN ACTIVO</span><strong>{activePromo || 'NINGUNO'}</strong><small>{activePromo ? 'Se aplicará en el próximo checkout demo.' : 'Activa una promoción disponible.'}</small></div>
        <section className="customer-promo-grid">
          {customerPromotions.map((promo) => (
            <article key={promo.code} className={`tone-${promo.tone} ${activePromo === promo.code ? 'is-active' : ''}`}>
              <span>{promo.expiry}</span>
              <h3>{promo.title}</h3>
              <p>{promo.detail}</p>
              <div><code>{promo.code}</code><button type="button" onClick={() => onPromoToggle(promo.code)}>{activePromo === promo.code ? 'ACTIVADO ✓' : 'ACTIVAR'}</button></div>
            </article>
          ))}
        </section>
        <section className="promo-conditions"><span>CONDICIONES DEL PROTOTIPO</span><p>Las promociones no tienen valor monetario, no generan cobros y se reinician al recargar la página.</p></section>
      </div>
    )
  }

  if (screen === 'notifications') {
    return (
      <div className="notifications-screen customer-service-screen">
        <header className="service-title service-title-row"><div><span>CENTRO DE ACTIVIDAD</span><h2>NOTIFICACIONES.</h2><p>{unread} mensajes pendientes de lectura.</p></div><button type="button" onClick={onReadAll}>MARCAR TODO COMO LEÍDO</button></header>
        <section className="notification-list">
          {notifications.map((notification) => (
            <button key={notification.id} type="button" className={notification.read ? 'is-read' : ''} onClick={() => onReadNotification(notification.id)}>
              <i className={`tone-${notification.tone}`}>!</i>
              <span><small>{notification.time}</small><strong>{notification.title}</strong><p>{notification.body}</p></span>
              {!notification.read && <b>NUEVO</b>}
            </button>
          ))}
        </section>
        <div className="notification-settings-link"><span>Controla qué mensajes deseas recibir.</span><button type="button" onClick={() => onNavigate('settings')}>CONFIGURAR NOTIFICACIONES →</button></div>
      </div>
    )
  }

  if (screen === 'support') {
    return (
      <div className="support-screen customer-service-screen">
        <header className="service-title"><span>CENTRO DE AYUDA</span><h2>RESOLVAMOS<br />EL PROBLEMA.</h2><p>Flujo conversacional simulado para soporte previo y posterior a la entrega.</p></header>
        <div className="support-layout">
          <aside className="support-topics">
            <span>TEMAS FRECUENTES</span>
            {['Problema con un pedido', 'Pago o reembolso', 'Dirección de entrega', 'Promociones y cupones', 'Seguridad de la cuenta'].map((topic, index) => <button key={topic} type="button" onClick={() => setSupportDraft(`Necesito ayuda con: ${topic}`)}><i>{index + 1}</i><span>{topic}</span><b>→</b></button>)}
            <div><strong>¿EMERGENCIA?</strong><p>Los canales urgentes serán habilitados al implementar la operación real.</p><button type="button" onClick={() => onNotify('Protocolo urgente: función reservada para operación real.')}>VER PROTOCOLO</button></div>
          </aside>
          <section className="support-chat">
            <header><i>DA</i><span><strong>SOPORTE DELIVER ASSETS</strong><small><b /> En línea · Respuesta demo inmediata</small></span></header>
            <div className="support-messages">
              {supportMessages.map((message) => <article key={message.id} className={`from-${message.author}`}><span>{message.text}</span><small>{message.time}</small></article>)}
            </div>
            <form onSubmit={submitSupport}><button type="button" onClick={() => onNotify('Adjuntos aún no implementados.')}>＋</button><input value={supportDraft} onChange={(event) => setSupportDraft(event.target.value)} placeholder="Describe el problema..." /><button type="submit">ENVIAR</button></form>
          </section>
        </div>
      </div>
    )
  }

  if (screen === 'settings') {
    const settingLabels: Record<CustomerSettingKey, [string, string]> = {
      push: ['Notificaciones push', 'Estados de pedidos y mensajes operativos.'],
      email: ['Correos transaccionales', 'Comprobantes, cambios de cuenta y seguridad.'],
      promos: ['Promociones', 'Ofertas, cupones y campañas comerciales.'],
      location: ['Ubicación precisa', 'Mejora cobertura, comercios cercanos y estimaciones.'],
      biometric: ['Acceso biométrico', 'Ingreso rápido desde un dispositivo compatible.'],
    }
    return (
      <div className="settings-screen customer-service-screen">
        <header className="service-title"><span>CONFIGURACIÓN</span><h2>TÚ DECIDES.</h2><p>Preferencias simuladas de cuenta, privacidad y comunicación.</p></header>
        <div className="settings-layout">
          <section className="settings-panel">
            <div className="service-heading"><div><span>COMUNICACIÓN Y PRIVACIDAD</span><h3>PREFERENCIAS</h3></div></div>
            {(Object.keys(settings) as CustomerSettingKey[]).map((key) => (
              <button key={key} type="button" onClick={() => onToggleSetting(key)}>
                <span><strong>{settingLabels[key][0]}</strong><small>{settingLabels[key][1]}</small></span>
                <i className={settings[key] ? 'is-on' : ''}><b /></i>
              </button>
            ))}
          </section>
          <section className="security-panel">
            <div className="service-heading"><div><span>SEGURIDAD</span><h3>CUENTA Y ACCESO</h3></div></div>
            <button type="button" onClick={() => onNotify('Flujo de cambio de contraseña simulado.')}><span><strong>Cambiar contraseña</strong><small>Última modificación: nunca</small></span><b>→</b></button>
            <button type="button" onClick={() => onNotify('1 dispositivo demo conectado.')}><span><strong>Dispositivos conectados</strong><small>1 sesión demo activa</small></span><b>→</b></button>
            <button type="button" onClick={() => onNotify('Solicitud de datos simulada.')}><span><strong>Datos personales</strong><small>Exportar o solicitar eliminación</small></span><b>→</b></button>
            <button type="button" className="danger-setting" onClick={onSignOut}><span><strong>Cerrar sesión</strong><small>Regresa a la pantalla de acceso</small></span><b>→</b></button>
          </section>
        </div>
        <section className="settings-legal"><div><span>DOCUMENTOS</span><strong>Términos y condiciones</strong><strong>Política de privacidad</strong><strong>Tratamiento de datos</strong></div><p>Versión conceptual 0.6 · Los documentos legales reales deben redactarse antes del lanzamiento.</p></section>
      </div>
    )
  }

  return null
}



type AdminSection = 'resumen' | 'pedidos' | 'comercios' | 'repartidores' | 'usuarios' | 'zonas' | 'finanzas' | 'incidencias'
type AdminOrderStatus = 'nuevo' | 'preparando' | 'en_ruta' | 'entregado' | 'cancelado'

type AdminOrder = {
  id: string
  customer: string
  store: string
  rider: string
  zone: string
  total: number
  status: AdminOrderStatus
  time: string
}

const adminSectionLabels: Record<AdminSection, string> = {
  resumen: 'Centro de control',
  pedidos: 'Pedidos',
  comercios: 'Comercios',
  repartidores: 'Repartidores',
  usuarios: 'Usuarios',
  zonas: 'Zonas y cobertura',
  finanzas: 'Finanzas',
  incidencias: 'Incidencias',
}

const initialAdminOrders: AdminOrder[] = [
  { id: '#DA-2412', customer: 'Lucía M.', store: 'Barrio Burger', rider: 'Alex R.', zone: 'Miraflores', total: 49.70, status: 'en_ruta', time: '10:54' },
  { id: '#DA-2411', customer: 'Mateo S.', store: 'Mercado 24', rider: 'Sin asignar', zone: 'San Isidro', total: 86.40, status: 'preparando', time: '10:49' },
  { id: '#DA-2410', customer: 'Valeria C.', store: 'Farma Central', rider: 'Noel P.', zone: 'Lince', total: 34.90, status: 'nuevo', time: '10:46' },
  { id: '#DA-2409', customer: 'Diego A.', store: 'Pizza 33', rider: 'María T.', zone: 'Barranco', total: 72.50, status: 'entregado', time: '10:38' },
  { id: '#DA-2408', customer: 'Camila R.', store: 'Casa Wok', rider: 'Jorge L.', zone: 'Surquillo', total: 41.80, status: 'cancelado', time: '10:31' },
  { id: '#DA-2407', customer: 'Sebastián V.', store: 'Bodega Norte', rider: 'Andrea G.', zone: 'Miraflores', total: 28.30, status: 'entregado', time: '10:22' },
]

const initialAdminMerchants = [
  { id: 1, name: 'Barrio Burger', category: 'Restaurante', zone: 'Miraflores', sales: 2481, rating: 4.8, status: 'activo', verified: true },
  { id: 2, name: 'Mercado 24', category: 'Mercado', zone: 'San Isidro', sales: 3912, rating: 4.6, status: 'activo', verified: true },
  { id: 3, name: 'Farma Central', category: 'Farmacia', zone: 'Lince', sales: 1874, rating: 4.9, status: 'revisión', verified: false },
  { id: 4, name: 'Pizza 33', category: 'Restaurante', zone: 'Barranco', sales: 3240, rating: 4.7, status: 'activo', verified: true },
  { id: 5, name: 'Bodega Norte', category: 'Mercado', zone: 'Surquillo', sales: 1098, rating: 4.5, status: 'pausado', verified: false },
]

const initialAdminRiders = [
  { id: 1, name: 'Alex R.', zone: 'Miraflores', status: 'en ruta', rating: 4.9, deliveries: 418, acceptance: 94, earnings: 186.40, suspended: false },
  { id: 2, name: 'María T.', zone: 'Barranco', status: 'disponible', rating: 4.8, deliveries: 296, acceptance: 91, earnings: 162.20, suspended: false },
  { id: 3, name: 'Noel P.', zone: 'Lince', status: 'recogiendo', rating: 4.7, deliveries: 181, acceptance: 88, earnings: 134.90, suspended: false },
  { id: 4, name: 'Jorge L.', zone: 'San Isidro', status: 'desconectado', rating: 4.6, deliveries: 209, acceptance: 84, earnings: 98.30, suspended: false },
]

const initialAdminIncidents = [
  { id: 'INC-084', title: 'Pedido demorado', subject: '#DA-2411 · Mercado 24', severity: 'alta', age: '8 min', resolved: false },
  { id: 'INC-083', title: 'Dirección incompleta', subject: '#DA-2410 · Lucía M.', severity: 'media', age: '14 min', resolved: false },
  { id: 'INC-082', title: 'Producto no disponible', subject: '#DA-2408 · Casa Wok', severity: 'media', age: '27 min', resolved: true },
  { id: 'INC-081', title: 'Validación de comercio', subject: 'Farma Central', severity: 'baja', age: '42 min', resolved: false },
]

const initialZones = [
  { id: 1, name: 'Miraflores', riders: 42, orders: 86, eta: 24, active: true, demand: 'alta' },
  { id: 2, name: 'San Isidro', riders: 31, orders: 64, eta: 27, active: true, demand: 'media' },
  { id: 3, name: 'Barranco', riders: 22, orders: 48, eta: 29, active: true, demand: 'alta' },
  { id: 4, name: 'Lince', riders: 18, orders: 36, eta: 31, active: true, demand: 'media' },
  { id: 5, name: 'Surquillo', riders: 15, orders: 29, eta: 34, active: false, demand: 'baja' },
]


type MerchantSection = 'resumen' | 'registro' | 'pedidos' | 'catalogo' | 'inventario' | 'horarios' | 'promociones' | 'analitica' | 'configuracion'
type MerchantOrderState = 'nuevo' | 'aceptado' | 'preparando' | 'listo' | 'entregado'

type MerchantOrderV2 = {
  id: string
  customer: string
  total: number
  items: string
  state: MerchantOrderState
  time: string
  rider: string
}

type MerchantProductV2 = {
  id: number
  name: string
  category: string
  description: string
  price: number
  stock: number
  available: boolean
  modifier: string
  tone: string
  symbol: string
}

type MerchantPromoV2 = {
  id: number
  name: string
  code: string
  discount: string
  active: boolean
  uses: number
  limit: number
}

const merchantSectionLabels: Record<MerchantSection, string> = {
  resumen: 'Centro del negocio',
  registro: 'Registro y validación',
  pedidos: 'Pedidos',
  catalogo: 'Catálogo',
  inventario: 'Inventario',
  horarios: 'Horarios',
  promociones: 'Promociones',
  analitica: 'Análisis',
  configuracion: 'Configuración',
}

const initialMerchantOrdersV2: MerchantOrderV2[] = [
  { id: '#DA-2408', customer: 'Lucía M.', total: 49.70, items: 'Combo Doble DA ×1 · Papas Fuego ×1 · Shake Limón ×1', state: 'nuevo', time: '10:54', rider: 'Alex R.' },
  { id: '#DA-2406', customer: 'Diego A.', total: 38.80, items: 'Burger Clásica ×2', state: 'preparando', time: '10:47', rider: 'María T.' },
  { id: '#DA-2405', customer: 'Camila R.', total: 62.40, items: 'Combo Doble DA ×2', state: 'listo', time: '10:41', rider: 'Jorge L.' },
  { id: '#DA-2402', customer: 'Mateo S.', total: 27.90, items: 'Burger Clásica ×1 · Papas Fuego ×1', state: 'entregado', time: '10:28', rider: 'Noel P.' },
]

const initialMerchantProductsV2: MerchantProductV2[] = [
  { id: 1, name: 'Combo Doble DA', category: 'Combos', description: 'Doble smash, queso, papas y bebida.', price: 31.90, stock: 42, available: true, modifier: 'Término + bebida', tone: 'red', symbol: 'DA' },
  { id: 2, name: 'Burger Clásica', category: 'Burgers', description: 'Smash, queso, pepinillos y salsa de casa.', price: 18.90, stock: 28, available: true, modifier: 'Queso + extras', tone: 'yellow', symbol: 'B' },
  { id: 3, name: 'Papas Fuego', category: 'Acompañamientos', description: 'Papas crocantes, especias y salsa picante.', price: 10.90, stock: 7, available: true, modifier: 'Tamaño + salsa', tone: 'blue', symbol: '🔥' },
  { id: 4, name: 'Shake Limón', category: 'Bebidas', description: 'Bebida cremosa, cítrica y fría.', price: 12.50, stock: 0, available: false, modifier: 'Tamaño', tone: 'mint', symbol: 'L' },
  { id: 5, name: 'Burger BBQ', category: 'Burgers', description: 'Smash, queso, cebolla y salsa BBQ.', price: 21.90, stock: 19, available: true, modifier: 'Queso + extras', tone: 'red', symbol: 'BBQ' },
]

const initialMerchantPromosV2: MerchantPromoV2[] = [
  { id: 1, name: 'COMBO DE MEDIODÍA', code: 'DAALMUERZO', discount: '20%', active: true, uses: 86, limit: 150 },
  { id: 2, name: 'ENVÍO GRATIS', code: 'ENVIO0', discount: 'S/ 4.90', active: true, uses: 48, limit: 100 },
  { id: 3, name: 'NOCHE BURGER', code: 'NOCHE10', discount: 'S/ 10', active: false, uses: 22, limit: 80 },
]


type RiderSectionV2 = 'inicio' | 'registro' | 'ofertas' | 'entrega' | 'ganancias' | 'historial' | 'seguridad' | 'soporte' | 'perfil'
type RiderDeliveryStageV2 = 'disponible' | 'aceptada' | 'comercio' | 'recogida' | 'cliente' | 'completada'

type RiderOfferV2 = {
  id: number
  order: string
  store: string
  pickup: string
  destination: string
  distance: number
  duration: number
  earning: number
  items: string
  demand: 'alta' | 'media' | 'normal'
}

type RiderHistoryV2 = {
  id: string
  date: string
  route: string
  distance: string
  duration: string
  earning: number
  status: string
}

const riderSectionLabelsV2: Record<RiderSectionV2, string> = {
  inicio: 'Centro del repartidor',
  registro: 'Registro y documentos',
  ofertas: 'Ofertas de entrega',
  entrega: 'Entrega activa',
  ganancias: 'Ganancias y pagos',
  historial: 'Historial',
  seguridad: 'Seguridad',
  soporte: 'Ayuda y soporte',
  perfil: 'Perfil y vehículo',
}

const initialRiderOffersV2: RiderOfferV2[] = [
  { id: 1, order: '#DA-2416', store: 'Barrio Burger', pickup: 'Av. Arequipa 1480', destination: 'Calle Berlín 420', distance: 3.4, duration: 22, earning: 8.40, items: '3 productos · paquete pequeño', demand: 'alta' },
  { id: 2, order: '#DA-2417', store: 'Mercado 24', pickup: 'Av. Pardo 610', destination: 'Av. Dos de Mayo 1320', distance: 4.8, duration: 29, earning: 11.20, items: '7 productos · paquete mediano', demand: 'media' },
  { id: 3, order: '#DA-2418', store: 'Farma Central', pickup: 'Jr. Risso 380', destination: 'Av. Petit Thouars 2520', distance: 2.1, duration: 16, earning: 6.90, items: '2 productos · paquete pequeño', demand: 'normal' },
]

const riderHistoryV2: RiderHistoryV2[] = [
  { id: '#DA-2409', date: 'Hoy · 10:38', route: 'Pizza 33 → Barranco', distance: '3.8 km', duration: '24 min', earning: 9.10, status: 'Entregado' },
  { id: '#DA-2407', date: 'Hoy · 09:54', route: 'Bodega Norte → Miraflores', distance: '2.7 km', duration: '18 min', earning: 7.60, status: 'Entregado' },
  { id: '#DA-2398', date: 'Ayer · 21:22', route: 'Casa Wok → San Isidro', distance: '5.2 km', duration: '31 min', earning: 12.40, status: 'Entregado' },
  { id: '#DA-2391', date: 'Ayer · 20:14', route: 'Mercado 24 → Lince', distance: '4.1 km', duration: '27 min', earning: 10.20, status: 'Entregado' },
  { id: '#DA-2377', date: '08 Jul · 19:05', route: 'Barrio Burger → Surquillo', distance: '3.2 km', duration: '21 min', earning: 8.20, status: 'Entregado' },
]

function RiderSuite() {
  const [section, setSection] = useState<RiderSectionV2>('inicio')
  const [online, setOnline] = useState(true)
  const [offers, setOffers] = useState<RiderOfferV2[]>(initialRiderOffersV2)
  const [selectedOfferId, setSelectedOfferId] = useState(1)
  const [deliveryStage, setDeliveryStage] = useState<RiderDeliveryStageV2>('disponible')
  const [activeOffer, setActiveOffer] = useState<RiderOfferV2 | null>(null)
  const [documents, setDocuments] = useState({
    identity: true,
    license: true,
    vehicle: true,
    background: false,
    bank: false,
  })
  const [activeZone, setActiveZone] = useState('Miraflores')
  const [autoOffers, setAutoOffers] = useState(true)
  const [cashEnabled, setCashEnabled] = useState(false)
  const [navigationVoice, setNavigationVoice] = useState(true)
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    { id: 1, author: 'support', text: 'Hola Alex. Este es el centro de soporte para repartidores. ¿Qué necesitas resolver?', time: 'Ahora' },
  ])
  const [supportDraft, setSupportDraft] = useState('')
  const [incidentReported, setIncidentReported] = useState(false)
  const [payoutMethod, setPayoutMethod] = useState('Banco •••• 9042')
  const [weeklyGoal, setWeeklyGoal] = useState(420)
  const [vehicle, setVehicle] = useState('Bicicleta eléctrica')
  const [phone, setPhone] = useState('+51 999 482 210')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId) ?? offers[0]
  const completedDocuments = Object.values(documents).filter(Boolean).length
  const todayEarnings = 186.40
  const weeklyEarnings = 734.80
  const weeklyProgress = Math.min(100, weeklyEarnings / weeklyGoal * 100)

  const stageLabels: Record<RiderDeliveryStageV2, string> = {
    disponible: 'Sin entrega activa',
    aceptada: 'Ve al comercio',
    comercio: 'Confirma tu llegada',
    recogida: 'Pedido recogido',
    cliente: 'Entrega al cliente',
    completada: 'Entrega completada',
  }

  const sectionIcons: Record<RiderSectionV2, string> = {
    inicio: '◫',
    registro: '✓',
    ofertas: '↗',
    entrega: '⌖',
    ganancias: 'S/',
    historial: '▤',
    seguridad: '!',
    soporte: '?',
    perfil: '●',
  }

  const acceptOffer = (offer: RiderOfferV2) => {
    setActiveOffer(offer)
    setOffers((current) => current.filter((item) => item.id !== offer.id))
    setDeliveryStage('aceptada')
    setSection('entrega')
  }

  const rejectOffer = (id: number) => {
    setOffers((current) => current.filter((offer) => offer.id !== id))
  }

  const advanceDelivery = () => {
    const flow: RiderDeliveryStageV2[] = ['aceptada', 'comercio', 'recogida', 'cliente', 'completada']
    const index = flow.indexOf(deliveryStage)
    const next = flow[Math.min(index + 1, flow.length - 1)]
    setDeliveryStage(next)
  }

  const resetDelivery = () => {
    setActiveOffer(null)
    setDeliveryStage('disponible')
    setSection('ofertas')
  }

  const submitSupport = (event: FormEvent) => {
    event.preventDefault()
    const message = supportDraft.trim()
    if (!message) return
    const id = Date.now()
    setSupportMessages((current) => [...current, { id, author: 'user', text: message, time: 'Ahora' }])
    setSupportDraft('')
    window.setTimeout(() => {
      setSupportMessages((current) => [...current, {
        id: id + 1,
        author: 'support',
        text: 'Tu consulta quedó registrada como ticket simulado. En producción se asignaría un agente y un nivel de prioridad.',
        time: 'Ahora',
      }])
    }, 600)
  }

  return (
    <div className="rider-suite-v2">
      <aside className="rider-sidebar-v2">
        <div className="rider-brand-v2"><BrandLogo compact /><small>RIDER OS</small></div>
        <div className="rider-identity-v2">
          <i>A</i>
          <span><strong>ALEX R.</strong><small>4.9 ★ · 418 entregas</small></span>
          <b>PRO</b>
        </div>
        <button type="button" className={`rider-online-v2 ${online ? 'is-online' : ''}`} onClick={() => setOnline((current) => !current)}>
          <i /><span>{online ? 'ESTÁS EN LÍNEA' : 'ESTÁS DESCONECTADO'}</span><b>{online ? 'ON' : 'OFF'}</b>
        </button>
        <nav>
          {(Object.keys(riderSectionLabelsV2) as RiderSectionV2[]).map((item) => (
            <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}>
              <i>{sectionIcons[item]}</i><span>{riderSectionLabelsV2[item]}</span>
              {item === 'ofertas' && offers.length > 0 && <b>{offers.length}</b>}
              {item === 'registro' && completedDocuments < 5 && <b>{completedDocuments}/5</b>}
            </button>
          ))}
        </nav>
        <div className="rider-status-foot-v2">
          <span><i /> GPS DEMO ACTIVO</span>
          <small>Zona: {activeZone}<br />Última señal: ahora</small>
        </div>
      </aside>

      <main className="rider-main-v2">
        <header className="rider-header-v2">
          <div><span>DELIVER ASSETS / REPARTIDOR</span><h2>{riderSectionLabelsV2[section]}</h2></div>
          <div className="rider-header-tools-v2">
            <div className="rider-zone-chip-v2"><i>⌖</i><span><small>ZONA ACTIVA</small><strong>{activeZone}</strong></span></div>
            <button type="button" className="rider-alert-v2" onClick={() => setSection('seguridad')}>!<b>{incidentReported ? 1 : 0}</b></button>
            <div className="rider-header-profile-v2"><i>A</i><span><strong>Alex R.</strong><small>Cuenta verificada</small></span></div>
          </div>
        </header>

        {section === 'inicio' && (
          <div className="rider-section-v2">
            <section className="rider-welcome-v2">
              <div><span>JUEVES 10 JUL / 11:12</span><h3>LISTO PARA<br /><em>MOVERTE.</em></h3><p>{online ? `Estás recibiendo ofertas en ${activeZone}.` : 'Activa tu disponibilidad para comenzar a recibir entregas.'}</p></div>
              <button type="button" onClick={() => setOnline((current) => !current)}>{online ? 'PAUSAR DISPONIBILIDAD' : 'CONECTARME'} <Arrow /></button>
            </section>

            <div className="rider-kpi-v2">
              <article className="tone-yellow"><span>GANANCIAS HOY</span><strong>S/ {todayEarnings.toFixed(2)}</strong><small>14 entregas completadas</small><i>S/</i></article>
              <article className="tone-mint"><span>TIEMPO EN LÍNEA</span><strong>5H 42M</strong><small>82% con entrega activa</small><i>◷</i></article>
              <article className="tone-blue"><span>ACEPTACIÓN</span><strong>94%</strong><small>Meta recomendada: 90%</small><i>↗</i></article>
              <article className="tone-red"><span>CALIFICACIÓN</span><strong>4.9 ★</strong><small>Últimos 100 pedidos</small><i>★</i></article>
            </div>

            <div className="rider-home-grid-v2">
              <section className="rider-live-map-v2">
                <div className="rider-panel-head-v2"><div><span>OPERACIÓN EN VIVO</span><h3>{activeZone.toUpperCase()}</h3></div><b>DEMANDA ALTA</b></div>
                <div className="rider-map-canvas-v2">
                  <span className="rider-road-v2 rr1" /><span className="rider-road-v2 rr2" /><span className="rider-road-v2 rr3" /><span className="rider-road-v2 rr4" />
                  <i className="rider-you-v2"><Bike /><b>TÚ</b></i>
                  <button type="button" className="rider-hotspot-v2 rh1" onClick={() => setActiveZone('Miraflores')}><i>12</i><span>MIRAFLORES</span></button>
                  <button type="button" className="rider-hotspot-v2 rh2" onClick={() => setActiveZone('San Isidro')}><i>8</i><span>SAN ISIDRO</span></button>
                  <button type="button" className="rider-hotspot-v2 rh3" onClick={() => setActiveZone('Barranco')}><i>6</i><span>BARRANCO</span></button>
                  <div className="rider-map-note-v2"><strong>+22%</strong><span>demanda estimada<br />durante la próxima hora</span></div>
                </div>
              </section>

              <section className="rider-next-offer-v2">
                <div className="rider-panel-head-v2"><div><span>MEJOR OFERTA</span><h3>DISPONIBLE AHORA</h3></div><button type="button" onClick={() => setSection('ofertas')}>VER {offers.length} →</button></div>
                {selectedOffer ? (
                  <article>
                    <div className="rider-offer-price-v2"><span>GANANCIA ESTIMADA</span><strong>S/ {selectedOffer.earning.toFixed(2)}</strong><small>{selectedOffer.duration} min · {selectedOffer.distance} km</small></div>
                    <div className="rider-offer-route-v2"><i>B</i><span><strong>{selectedOffer.store}</strong><small>{selectedOffer.pickup}</small></span><b>↓</b><i>⌂</i><span><strong>Cliente</strong><small>{selectedOffer.destination}</small></span></div>
                    <p>{selectedOffer.items}</p>
                    <button type="button" disabled={!online} onClick={() => acceptOffer(selectedOffer)}>{online ? 'ACEPTAR ENTREGA' : 'CONÉCTATE PARA ACEPTAR'} <Arrow /></button>
                  </article>
                ) : <div className="rider-empty-v2">NO HAY OFERTAS DISPONIBLES</div>}
              </section>
            </div>

            <div className="rider-home-bottom-v2">
              <section className="rider-goal-v2">
                <div className="rider-panel-head-v2"><div><span>META SEMANAL</span><h3>S/ {weeklyGoal}</h3></div><b>{weeklyProgress.toFixed(0)}%</b></div>
                <div className="rider-goal-progress-v2"><i><b style={{ width: `${weeklyProgress}%` }} /></i><span><strong>S/ {weeklyEarnings.toFixed(2)}</strong> acumulados esta semana</span></div>
              </section>
              <section className="rider-zone-list-v2">
                <div className="rider-panel-head-v2"><div><span>ZONAS RECOMENDADAS</span><h3>DÓNDE MOVERTE</h3></div></div>
                {[['Miraflores','Alta','S/ 14.20/h'],['San Isidro','Media','S/ 12.80/h'],['Barranco','Alta','S/ 13.70/h']].map((zone) => <button key={zone[0]} type="button" onClick={() => setActiveZone(zone[0])}><i className={zone[1] === 'Alta' ? 'is-hot' : ''} /><span><strong>{zone[0]}</strong><small>Demanda {zone[1]}</small></span><b>{zone[2]}</b></button>)}
              </section>
            </div>
          </div>
        )}

        {section === 'registro' && (
          <div className="rider-section-v2">
            <section className="rider-registration-hero-v2">
              <div><span>ACTIVACIÓN DEL REPARTIDOR</span><h3>{completedDocuments}/5<br />VALIDACIONES.</h3><p>El acceso operativo real dependerá de identidad, antecedentes, vehículo y cuenta de pagos.</p></div>
              <div><strong>{completedDocuments * 20}%</strong><span>COMPLETADO</span></div>
            </section>
            <div className="rider-document-list-v2">
              {[
                ['identity','Identidad y selfie','Documento vigente y prueba biométrica simulada.'],
                ['license','Licencia o permiso','Requerido según el tipo de vehículo y regulación local.'],
                ['vehicle','Vehículo y equipamiento','Registro del vehículo, mochila y elementos de seguridad.'],
                ['background','Antecedentes y validación','Proceso de revisión previo a la activación.'],
                ['bank','Cuenta para pagos','Cuenta bancaria o billetera para liquidaciones.'],
              ].map(([key,title,detail], index) => {
                const typedKey = key as keyof typeof documents
                return <article key={key} className={documents[typedKey] ? 'is-complete' : ''}><i>{documents[typedKey] ? '✓' : String(index + 1).padStart(2,'0')}</i><span><small>PASO {index + 1}</small><strong>{title}</strong><p>{detail}</p></span><button type="button" onClick={() => setDocuments((current) => ({ ...current, [typedKey]: !current[typedKey] }))}>{documents[typedKey] ? 'VALIDADO' : 'COMPLETAR →'}</button></article>
              })}
            </div>
            <section className="rider-registration-warning-v2"><strong>CONTROL NECESARIO</strong><p>Una operación real debe integrar revisión documental, prevención de fraude, seguridad vial, privacidad y reglas laborales aplicables.</p></section>
          </div>
        )}

        {section === 'ofertas' && (
          <div className="rider-section-v2">
            <div className="rider-section-title-v2"><div><span>ENTREGAS DISPONIBLES</span><h3>{offers.length} OFERTAS CERCA</h3></div><button type="button" className={online ? 'is-online' : ''} onClick={() => setOnline((current) => !current)}>{online ? 'RECIBIENDO OFERTAS' : 'DESCONECTADO'}</button></div>
            <div className="rider-offer-grid-v2">
              {offers.map((offer) => (
                <article key={offer.id} className={`demand-${offer.demand} ${selectedOfferId === offer.id ? 'is-selected' : ''}`} onClick={() => setSelectedOfferId(offer.id)}>
                  <header><span>{offer.order}</span><b>DEMANDA {offer.demand.toUpperCase()}</b></header>
                  <div className="rider-offer-value-v2"><span>GANANCIA</span><strong>S/ {offer.earning.toFixed(2)}</strong><small>S/ {(offer.earning / offer.distance).toFixed(2)} por km</small></div>
                  <div className="rider-offer-path-v2"><i>B</i><span><strong>{offer.store}</strong><small>{offer.pickup}</small></span><em>{offer.distance} km</em><i>⌂</i><span><strong>Entrega</strong><small>{offer.destination}</small></span><em>{offer.duration} min</em></div>
                  <p>{offer.items}</p>
                  <div className="rider-offer-actions-v2"><button type="button" onClick={(event) => { event.stopPropagation(); rejectOffer(offer.id) }}>RECHAZAR</button><button type="button" disabled={!online} onClick={(event) => { event.stopPropagation(); acceptOffer(offer) }}>ACEPTAR <Arrow /></button></div>
                </article>
              ))}
              {offers.length === 0 && <div className="rider-no-offers-v2"><span>OFERTAS</span><h3>TODO DESPEJADO.</h3><p>Puedes volver a cargar las solicitudes de demostración.</p><button type="button" onClick={() => setOffers(initialRiderOffersV2)}>RECARGAR OFERTAS</button></div>}
            </div>
            <section className="rider-offer-preferences-v2"><div><span>PREFERENCIAS</span><strong>Ofertas automáticas</strong><small>Prioriza solicitudes compatibles con tu zona y vehículo.</small></div><button type="button" className={autoOffers ? 'is-on' : ''} onClick={() => setAutoOffers((current) => !current)}><i><b /></i></button><div><span>EFECTIVO</span><strong>Aceptar pedidos en efectivo</strong><small>Requiere reglas de saldo y conciliación.</small></div><button type="button" className={cashEnabled ? 'is-on' : ''} onClick={() => setCashEnabled((current) => !current)}><i><b /></i></button></section>
          </div>
        )}

        {section === 'entrega' && (
          <div className="rider-section-v2">
            {activeOffer ? (
              <>
                <div className="rider-section-title-v2"><div><span>{activeOffer.order} · ENTREGA ACTIVA</span><h3>{stageLabels[deliveryStage]}</h3></div><b className={`rider-stage-badge-v2 stage-${deliveryStage}`}>{deliveryStage.toUpperCase()}</b></div>
                <div className="rider-delivery-layout-v2">
                  <section className="rider-navigation-v2">
                    <div className="rider-navigation-map-v2">
                      <span className="rider-road-v2 nr1" /><span className="rider-road-v2 nr2" /><span className="rider-road-v2 nr3" /><span className="rider-road-v2 nr4" />
                      <i className="rider-current-position-v2"><Bike /></i>
                      <b className="rider-pickup-pin-v2">B</b>
                      <b className="rider-dropoff-pin-v2">⌂</b>
                      <div className="rider-turn-v2"><i>↱</i><span><strong>Gira a la derecha</strong><small>en 180 metros</small></span></div>
                    </div>
                    <div className="rider-navigation-stats-v2"><span><b>{activeOffer.distance} km</b>distancia restante</span><span><b>{activeOffer.duration} min</b>tiempo estimado</span><span><b>S/ {activeOffer.earning.toFixed(2)}</b>ganancia</span></div>
                  </section>
                  <aside className="rider-delivery-card-v2">
                    <span>RUTA OPERATIVA</span>
                    <h3>{activeOffer.order}</h3>
                    <div className="rider-delivery-stop-v2"><i>B</i><span><small>RECOJO</small><strong>{activeOffer.store}</strong><p>{activeOffer.pickup}</p></span></div>
                    <div className="rider-delivery-line-v2" />
                    <div className="rider-delivery-stop-v2"><i>⌂</i><span><small>ENTREGA</small><strong>Lucía M.</strong><p>{activeOffer.destination}</p></span></div>
                    <div className="rider-order-package-v2"><span>PAQUETE</span><strong>{activeOffer.items}</strong><small>Código de recojo demo: 3814</small></div>
                    <button type="button" onClick={advanceDelivery} disabled={deliveryStage === 'completada'}>{deliveryStage === 'aceptada' ? 'INICIAR NAVEGACIÓN' : deliveryStage === 'comercio' ? 'CONFIRMAR LLEGADA' : deliveryStage === 'recogida' ? 'CONFIRMAR RECOJO' : deliveryStage === 'cliente' ? 'CONFIRMAR ENTREGA' : 'ENTREGA COMPLETADA'} <Arrow /></button>
                    {deliveryStage === 'completada' && <button type="button" className="rider-secondary-action-v2" onClick={resetDelivery}>BUSCAR OTRA ENTREGA</button>}
                    <button type="button" className="rider-help-action-v2" onClick={() => setSection('soporte')}>REPORTAR UN PROBLEMA</button>
                  </aside>
                </div>
                <section className="rider-delivery-timeline-v2">
                  {[
                    ['aceptada','Oferta aceptada'],
                    ['comercio','Llegada al comercio'],
                    ['recogida','Pedido recogido'],
                    ['cliente','Ruta al cliente'],
                    ['completada','Entrega confirmada'],
                  ].map(([stage,label], index, all) => {
                    const activeIndex = all.findIndex(([item]) => item === deliveryStage)
                    return <i key={stage} className={index <= activeIndex ? 'is-done' : ''}><b>{index <= activeIndex ? '✓' : index + 1}</b><span>{label}</span></i>
                  })}
                </section>
              </>
            ) : (
              <section className="rider-no-active-v2"><Bike /><span>ENTREGA ACTIVA</span><h3>NO HAY UNA<br />RUTA EN CURSO.</h3><p>Acepta una oferta para iniciar el flujo completo de entrega.</p><button type="button" onClick={() => setSection('ofertas')}>VER OFERTAS <Arrow /></button></section>
            )}
          </div>
        )}

        {section === 'ganancias' && (
          <div className="rider-section-v2">
            <div className="rider-section-title-v2"><div><span>RESULTADOS DEL REPARTIDOR</span><h3>GANANCIAS</h3></div><button type="button" onClick={() => setFeedback('Periodo actual: última semana.')}>ÚLTIMA SEMANA ▾</button></div>
            <div className="rider-earnings-kpi-v2">
              <article className="tone-yellow"><span>DISPONIBLE</span><strong>S/ 284.60</strong><small>Saldo demo retirable</small></article>
              <article className="tone-mint"><span>ESTA SEMANA</span><strong>S/ {weeklyEarnings.toFixed(2)}</strong><small>52 entregas completadas</small></article>
              <article className="tone-blue"><span>PROMEDIO / HORA</span><strong>S/ 13.40</strong><small>Antes de costos personales</small></article>
              <article className="tone-red"><span>INCENTIVOS</span><strong>S/ 84.00</strong><small>Bonificaciones simuladas</small></article>
            </div>
            <div className="rider-earnings-layout-v2">
              <section className="rider-week-chart-v2">
                <div className="rider-panel-head-v2"><div><span>GANANCIAS DIARIAS</span><h3>SEMANA ACTUAL</h3></div><b>S/ {weeklyEarnings.toFixed(2)}</b></div>
                <div className="rider-week-bars-v2">{[['LUN',72],['MAR',48],['MIÉ',64],['JUE',86],['VIE',92],['SÁB',76],['DOM',38]].map(([day,height]) => <i key={day} style={{ height: `${height}%` }}><b>S/ {Math.round(Number(height) * 1.55)}</b><span>{day}</span></i>)}</div>
              </section>
              <aside className="rider-payout-v2">
                <span>LIQUIDACIÓN</span>
                <h3>S/ 284.60</h3>
                <p>El saldo y los movimientos son completamente simulados.</p>
                <label><span>MÉTODO DE PAGO</span><select value={payoutMethod} onChange={(event) => setPayoutMethod(event.target.value)}><option>Banco •••• 9042</option><option>Billetera DA</option><option>Cuenta alternativa •••• 1180</option></select></label>
                <button type="button" onClick={() => setFeedback('Retiro demo solicitado. No se mueve dinero real.')}>SOLICITAR RETIRO DEMO <Arrow /></button>
                <small>Próxima liquidación automática: viernes</small>
              </aside>
            </div>
            <div className="rider-transactions-v2">
              <div className="rider-panel-head-v2"><div><span>MOVIMIENTOS</span><h3>ÚLTIMAS OPERACIONES</h3></div><button type="button" onClick={() => setFeedback('Reporte de movimientos preparado.')}>EXPORTAR →</button></div>
              {[['Entrega #DA-2409','Hoy · 10:38','+ S/ 9.10'],['Bono de alta demanda','Hoy · 10:00','+ S/ 4.00'],['Entrega #DA-2407','Hoy · 09:54','+ S/ 7.60'],['Liquidación semanal','05 Jul','− S/ 612.40']].map((row) => <div key={row[0]}><i>{row[2].startsWith('+') ? '↗' : '↓'}</i><span><strong>{row[0]}</strong><small>{row[1]}</small></span><b className={row[2].startsWith('+') ? 'is-positive' : ''}>{row[2]}</b></div>)}
            </div>
          </div>
        )}

        {section === 'historial' && (
          <div className="rider-section-v2">
            <div className="rider-section-title-v2"><div><span>ACTIVIDAD COMPLETADA</span><h3>HISTORIAL</h3></div><button type="button" onClick={() => setFeedback('Filtro de historial: todas las entregas.')}>FILTRAR ▾</button></div>
            <section className="rider-history-list-v2">
              <div className="rider-history-head-v2"><span>PEDIDO</span><span>RUTA</span><span>DISTANCIA</span><span>TIEMPO</span><span>GANANCIA</span><span>ESTADO</span></div>
              {riderHistoryV2.map((item) => <article key={item.id}><strong>{item.id}</strong><span><b>{item.route}</b><small>{item.date}</small></span><span>{item.distance}</span><span>{item.duration}</span><em>S/ {item.earning.toFixed(2)}</em><i>{item.status}</i></article>)}
            </section>
            <section className="rider-history-summary-v2"><div><span>ENTREGAS TOTALES</span><strong>418</strong></div><div><span>DISTANCIA ACUMULADA</span><strong>1,284 km</strong></div><div><span>TIEMPO EN RUTA</span><strong>186 h</strong></div><div><span>ENTREGAS EXITOSAS</span><strong>98.6%</strong></div></section>
          </div>
        )}

        {section === 'seguridad' && (
          <div className="rider-section-v2">
            <section className="rider-safety-hero-v2">
              <div><span>CENTRO DE SEGURIDAD</span><h3>PRIMERO,<br /><em>TÚ.</em></h3><p>Herramientas conceptuales para prevención, reporte y asistencia durante la operación.</p></div>
              <button type="button" className={incidentReported ? 'is-reported' : ''} onClick={() => setIncidentReported((current) => !current)}><i>!</i><strong>{incidentReported ? 'INCIDENCIA REGISTRADA' : 'REPORTAR INCIDENCIA'}</strong><small>{incidentReported ? 'Caso demo SEG-041 creado' : 'Uso exclusivo para una situación real'}</small></button>
            </section>
            <div className="rider-safety-grid-v2">
              <article><i>⌖</i><span><strong>Compartir ruta</strong><p>Envía un enlace temporal de seguimiento a un contacto de confianza.</p></span><button type="button" onClick={() => setFeedback('Enlace de ruta demo copiado.')}>COMPARTIR</button></article>
              <article><i>☏</i><span><strong>Contacto de emergencia</strong><p>María R. · +51 999 000 112</p></span><button type="button" onClick={() => setFeedback('Contacto de emergencia listo para edición.')}>EDITAR</button></article>
              <article><i>✓</i><span><strong>Chequeo de seguridad</strong><p>Casco, luces, frenos y batería registrados como revisados.</p></span><button type="button" onClick={() => setFeedback('Chequeo de seguridad completado.')}>REVISAR</button></article>
              <article><i>▤</i><span><strong>Protocolos</strong><p>Accidentes, producto dañado, cliente ausente y zonas restringidas.</p></span><button type="button" onClick={() => setFeedback('Protocolos de seguridad abiertos en modo demo.')}>ABRIR</button></article>
            </div>
            <section className="rider-safety-status-v2"><div><span>IDENTIDAD</span><strong>VERIFICADA ✓</strong></div><div><span>DISPOSITIVO</span><strong>CONFIABLE ✓</strong></div><div><span>SEÑAL GPS</span><strong>ESTABLE ✓</strong></div><div><span>ÚLTIMO CHEQUEO</span><strong>HOY 08:12</strong></div></section>
          </div>
        )}

        {section === 'soporte' && (
          <div className="rider-section-v2">
            <div className="rider-section-title-v2"><div><span>CENTRO DE RESOLUCIÓN</span><h3>AYUDA Y SOPORTE</h3></div><b className="rider-support-live-v2"><i /> EN LÍNEA</b></div>
            <div className="rider-support-layout-v2">
              <aside className="rider-support-topics-v2">
                <span>ACCESOS RÁPIDOS</span>
                {['Problema con una entrega','Comercio no responde','Cliente ausente','Producto dañado','Ganancias o liquidación','Cuenta o documentos'].map((topic,index) => <button key={topic} type="button" onClick={() => setSupportDraft(`Necesito ayuda con: ${topic}`)}><i>{index + 1}</i><span>{topic}</span><b>→</b></button>)}
                <div><strong>ENTREGA ACTIVA</strong><p>{activeOffer ? `${activeOffer.order} · ${activeOffer.store}` : 'No hay entrega en curso.'}</p><button type="button" onClick={() => setSection('entrega')}>VER ENTREGA</button></div>
              </aside>
              <section className="rider-support-chat-v2">
                <header><i>DA</i><span><strong>SOPORTE PARA RIDERS</strong><small><b /> Respuesta demo inmediata</small></span></header>
                <div>{supportMessages.map((message) => <article key={message.id} className={`from-${message.author}`}><span>{message.text}</span><small>{message.time}</small></article>)}</div>
                <form onSubmit={submitSupport}><button type="button" onClick={() => setFeedback('Adjuntos aún no implementados.')}>＋</button><input value={supportDraft} onChange={(event) => setSupportDraft(event.target.value)} placeholder="Describe el problema..." /><button type="submit">ENVIAR</button></form>
              </section>
            </div>
          </div>
        )}

        {section === 'perfil' && (
          <div className="rider-section-v2">
            <section className="rider-profile-hero-v2">
              <div className="rider-profile-avatar-v2">A</div>
              <div><span>PERFIL DEL REPARTIDOR</span><h3>ALEX<br />RAMÍREZ.</h3><p>Cuenta demo verificada · Nivel PRO · 418 entregas</p></div>
              <button type="button" onClick={() => setFeedback('Carga de foto pendiente de almacenamiento.')}>EDITAR FOTO</button>
            </section>
            <div className="rider-profile-layout-v2">
              <section className="rider-profile-form-v2">
                <div className="rider-panel-head-v2"><div><span>DATOS OPERATIVOS</span><h3>PERFIL Y VEHÍCULO</h3></div></div>
                <label><span>NÚMERO DE TELÉFONO</span><input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                <label><span>TIPO DE VEHÍCULO</span><select value={vehicle} onChange={(event) => setVehicle(event.target.value)}><option>Bicicleta eléctrica</option><option>Bicicleta</option><option>Motocicleta</option><option>Automóvil</option></select></label>
                <label><span>ZONA PREFERIDA</span><select value={activeZone} onChange={(event) => setActiveZone(event.target.value)}><option>Miraflores</option><option>San Isidro</option><option>Barranco</option><option>Lince</option><option>Surquillo</option></select></label>
                <button type="button" onClick={() => setNavigationVoice((current) => !current)}><span><strong>Indicaciones por voz</strong><small>Reproduce instrucciones durante la ruta.</small></span><i className={navigationVoice ? 'is-on' : ''}><b /></i></button>
                <button type="button" onClick={() => setAutoOffers((current) => !current)}><span><strong>Ofertas automáticas</strong><small>Prioriza solicitudes cercanas compatibles.</small></span><i className={autoOffers ? 'is-on' : ''}><b /></i></button>
                <button className="rider-save-v2" type="button" onClick={() => setFeedback('Perfil del repartidor guardado en memoria.')}>GUARDAR CAMBIOS <Arrow /></button>
              </section>
              <aside className="rider-level-card-v2">
                <span>NIVEL ACTUAL</span><h3>PRO.</h3><p>Tu nivel conceptual combina calificación, aceptación y entregas completadas.</p>
                <div><span>CALIFICACIÓN</span><strong>4.9 ★</strong></div>
                <div><span>ACEPTACIÓN</span><strong>94%</strong></div>
                <div><span>ENTREGAS</span><strong>418</strong></div>
                <i><b style={{ width: '82%' }} /></i>
                <small>82% hacia el siguiente nivel</small>
              </aside>
            </div>
            <section className="rider-profile-danger-v2"><div><span>CUENTA</span><strong>PAUSAR O CERRAR LA CUENTA</strong><p>Estas acciones reales requerirían validación de identidad y cierre financiero.</p></div><button type="button" onClick={() => setOnline(false)}>PAUSAR CUENTA</button></section>
          </div>
        )}

        <nav className="rider-mobile-nav-v2">
          {(['inicio','ofertas','entrega','ganancias','perfil'] as RiderSectionV2[]).map((item) => <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}><i>{sectionIcons[item]}</i><span>{item.toUpperCase()}</span></button>)}
        </nav>
        <DemoToast message={feedback} onClose={() => setFeedback('')} />
      </main>
    </div>
  )
}


function MerchantSuite() {
  const [section, setSection] = useState<MerchantSection>('resumen')
  const [storeOpen, setStoreOpen] = useState(true)
  const [orders, setOrders] = useState<MerchantOrderV2[]>(initialMerchantOrdersV2)
  const [products, setProducts] = useState<MerchantProductV2[]>(initialMerchantProductsV2)
  const [selectedProductId, setSelectedProductId] = useState(1)
  const [promotions, setPromotions] = useState<MerchantPromoV2[]>(initialMerchantPromosV2)
  const [search, setSearch] = useState('')
  const [onboarding, setOnboarding] = useState({
    identity: true,
    tax: true,
    bank: false,
    menu: true,
    contract: false,
  })
  const [schedule, setSchedule] = useState([
    { day: 'Lunes', active: true, open: '11:00', close: '23:00' },
    { day: 'Martes', active: true, open: '11:00', close: '23:00' },
    { day: 'Miércoles', active: true, open: '11:00', close: '23:00' },
    { day: 'Jueves', active: true, open: '11:00', close: '23:00' },
    { day: 'Viernes', active: true, open: '11:00', close: '00:00' },
    { day: 'Sábado', active: true, open: '12:00', close: '00:00' },
    { day: 'Domingo', active: false, open: '12:00', close: '22:00' },
  ])
  const [prepTime, setPrepTime] = useState(14)
  const [autoAccept, setAutoAccept] = useState(false)
  const [deliveryRadius, setDeliveryRadius] = useState(5)
  const [newPromoName, setNewPromoName] = useState('')
  const [catalogFilter, setCatalogFilter] = useState('TODOS')
  const [feedback, setFeedback] = useState('')

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]
  const activeOrders = orders.filter((order) => order.state !== 'entregado').length
  const completedOnboarding = Object.values(onboarding).filter(Boolean).length
  const visibleProducts = products.filter((product) => {
    const normalized = search.trim().toLowerCase()
    const matchesSearch = !normalized || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized)
    const matchesCategory = catalogFilter === 'TODOS' || product.category.toUpperCase() === catalogFilter
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const orderStateLabel: Record<MerchantOrderState, string> = {
    nuevo: 'Nuevo',
    aceptado: 'Aceptado',
    preparando: 'Preparando',
    listo: 'Listo para recoger',
    entregado: 'Entregado',
  }

  const advanceOrder = (id: string) => {
    const flow: MerchantOrderState[] = ['nuevo', 'aceptado', 'preparando', 'listo', 'entregado']
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order
      const index = flow.indexOf(order.state)
      return { ...order, state: flow[Math.min(index + 1, flow.length - 1)] }
    }))
  }

  const updateSelectedProduct = (patch: Partial<MerchantProductV2>) => {
    setProducts((current) => current.map((product) => product.id === selectedProduct.id ? { ...product, ...patch } : product))
  }

  const addProduct = () => {
    const nextId = Math.max(...products.map((product) => product.id)) + 1
    const product: MerchantProductV2 = {
      id: nextId,
      name: 'Nuevo producto',
      category: 'Burgers',
      description: 'Describe aquí el producto.',
      price: 19.90,
      stock: 10,
      available: false,
      modifier: 'Sin modificadores',
      tone: 'yellow',
      symbol: 'N',
    }
    setProducts((current) => [...current, product])
    setSelectedProductId(nextId)
  }

  const createPromotion = () => {
    const name = newPromoName.trim() || 'NUEVA PROMOCIÓN'
    setPromotions((current) => [...current, {
      id: Date.now(),
      name: name.toUpperCase(),
      code: `DA${current.length + 1}OFF`,
      discount: '10%',
      active: false,
      uses: 0,
      limit: 100,
    }])
    setNewPromoName('')
  }

  const sectionIcon: Record<MerchantSection, string> = {
    resumen: '◫',
    registro: '✓',
    pedidos: '▤',
    catalogo: '▦',
    inventario: '#',
    horarios: '◷',
    promociones: '%',
    analitica: '↗',
    configuracion: '⚙',
  }

  return (
    <div className="merchant-suite">
      <aside className="merchant-sidebar-v2">
        <div className="merchant-brand-v2"><BrandLogo compact /><small>MERCHANT OS</small></div>
        <div className="merchant-location-v2">
          <i>BB</i>
          <span><strong>BARRIO BURGER</strong><small>Sede Miraflores</small></span>
        </div>
        <button type="button" className={`merchant-open-toggle ${storeOpen ? 'is-open' : ''}`} onClick={() => setStoreOpen((current) => !current)}>
          <i /><span>{storeOpen ? 'TIENDA ABIERTA' : 'TIENDA PAUSADA'}</span><b>{storeOpen ? 'ON' : 'OFF'}</b>
        </button>
        <nav>
          {(Object.keys(merchantSectionLabels) as MerchantSection[]).map((item) => (
            <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}>
              <i>{sectionIcon[item]}</i><span>{merchantSectionLabels[item]}</span>
              {item === 'pedidos' && activeOrders > 0 && <b>{activeOrders}</b>}
              {item === 'registro' && completedOnboarding < 5 && <b>{completedOnboarding}/5</b>}
            </button>
          ))}
        </nav>
        <div className="merchant-help-v2"><span>¿NECESITAS AYUDA?</span><button type="button" onClick={() => setFeedback('Solicitud de soporte comercial simulada.')}>CONTACTAR SOPORTE →</button></div>
      </aside>

      <main className="merchant-main-v2">
        <header className="merchant-header-v2">
          <div><span>DELIVER ASSETS / NEGOCIO</span><h2>{merchantSectionLabels[section]}</h2></div>
          <div className="merchant-header-tools-v2">
            <label><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos..." /></label>
            <button type="button" className="merchant-notice-v2" onClick={() => setSection('pedidos')}>!<b>3</b></button>
            <div><i>BB</i><span><strong>Barrio Burger</strong><small>Administrador</small></span></div>
          </div>
        </header>

        {section === 'resumen' && (
          <div className="merchant-section-v2">
            <section className="merchant-welcome-v2">
              <div><span>JUEVES 10 JUL / 10:58</span><h3>BUEN DÍA,<br /><em>BARRIO BURGER.</em></h3><p>La operación está activa. Hay {activeOrders} pedidos abiertos y un producto sin stock.</p></div>
              <button type="button" onClick={() => setSection('pedidos')}>VER OPERACIÓN <Arrow /></button>
            </section>

            <div className="merchant-kpi-v2">
              <article className="tone-yellow"><span>VENTAS HOY</span><strong>S/ 2,481</strong><small>+18% frente a ayer</small><i>S/</i></article>
              <article className="tone-mint"><span>PEDIDOS</span><strong>64</strong><small>Ticket medio S/ 38.70</small><i>▤</i></article>
              <article className="tone-blue"><span>PREPARACIÓN</span><strong>11:24</strong><small>Objetivo menor a 15 min</small><i>◷</i></article>
              <article className="tone-red"><span>CALIFICACIÓN</span><strong>4.8 ★</strong><small>1,284 reseñas</small><i>★</i></article>
            </div>

            <div className="merchant-dashboard-grid-v2">
              <section className="merchant-live-orders-v2">
                <div className="merchant-panel-head-v2"><div><span>OPERACIÓN EN VIVO</span><h3>PEDIDOS ACTIVOS</h3></div><button type="button" onClick={() => setSection('pedidos')}>VER TODOS →</button></div>
                {orders.filter((order) => order.state !== 'entregado').map((order) => (
                  <article key={order.id}>
                    <i className={`merchant-order-state-v2 state-${order.state}`}>{order.id.slice(-2)}</i>
                    <span><small>{order.id} · {order.time}</small><strong>{order.customer}</strong><em>{order.items}</em></span>
                    <b className={`merchant-order-pill-v2 state-${order.state}`}>{orderStateLabel[order.state]}</b>
                    <strong>S/ {order.total.toFixed(2)}</strong>
                    <button type="button" onClick={() => advanceOrder(order.id)} disabled={order.state === 'entregado'}>AVANZAR →</button>
                  </article>
                ))}
              </section>

              <section className="merchant-stock-alerts-v2">
                <div className="merchant-panel-head-v2"><div><span>ATENCIÓN</span><h3>INVENTARIO</h3></div><button type="button" onClick={() => setSection('inventario')}>GESTIONAR →</button></div>
                {products.filter((product) => product.stock <= 10).map((product) => (
                  <button key={product.id} type="button" onClick={() => { setSelectedProductId(product.id); setSection('inventario') }}>
                    <i className={`tone-${product.tone}`}>{product.symbol}</i>
                    <span><strong>{product.name}</strong><small>{product.stock === 0 ? 'Sin stock' : `Solo ${product.stock} unidades`}</small></span>
                    <b>{product.stock === 0 ? 'CRÍTICO' : 'BAJO'}</b>
                  </button>
                ))}
                <div className="merchant-score-v2"><span>DISPONIBILIDAD DEL MENÚ</span><strong>{Math.round(products.filter((product) => product.available).length / products.length * 100)}%</strong><i><b style={{ width: `${products.filter((product) => product.available).length / products.length * 100}%` }} /></i></div>
              </section>
            </div>

            <div className="merchant-summary-bottom-v2">
              <section className="merchant-sales-chart-v2">
                <div className="merchant-panel-head-v2"><div><span>VENTAS POR HORA</span><h3>HOY</h3></div><b>+18%</b></div>
                <div className="merchant-bars-v2">{[22,31,28,42,55,76,91,70,82,63,48,34].map((height, index) => <i key={index} style={{ height: `${height}%` }} className={index === 6 ? 'is-peak' : ''}><span>{index + 11}:00</span></i>)}</div>
              </section>
              <section className="merchant-best-v2">
                <div className="merchant-panel-head-v2"><div><span>DESEMPEÑO</span><h3>MÁS VENDIDOS</h3></div></div>
                {products.slice(0, 4).map((product, index) => <div key={product.id}><b>0{index + 1}</b><span><strong>{product.name}</strong><small>{48 - index * 9} unidades</small></span><em>S/ {(product.price * (48 - index * 9)).toFixed(0)}</em></div>)}
              </section>
            </div>
          </div>
        )}

        {section === 'registro' && (
          <div className="merchant-section-v2">
            <section className="merchant-onboarding-hero-v2">
              <div><span>ACTIVACIÓN DEL COMERCIO</span><h3>{completedOnboarding}/5<br />PASOS LISTOS.</h3><p>Este flujo prepara identidad, pagos, menú y contrato antes de habilitar ventas reales.</p></div>
              <div className="merchant-progress-ring-v2"><strong>{completedOnboarding * 20}%</strong><span>COMPLETADO</span></div>
            </section>
            <div className="merchant-onboarding-list-v2">
              {[
                ['identity', 'Identidad del representante', 'Documento, fotografía y validación biométrica simulada.'],
                ['tax', 'Datos fiscales del negocio', 'RUC, razón social, dirección fiscal y régimen.'],
                ['bank', 'Cuenta bancaria', 'Cuenta destinada a liquidaciones y conciliación.'],
                ['menu', 'Catálogo inicial', 'Categorías, productos, precios y disponibilidad.'],
                ['contract', 'Contrato comercial', 'Aceptación de comisiones, operación y políticas.'],
              ].map(([key, title, detail], index) => {
                const typedKey = key as keyof typeof onboarding
                return (
                  <article key={key} className={onboarding[typedKey] ? 'is-complete' : ''}>
                    <i>{onboarding[typedKey] ? '✓' : String(index + 1).padStart(2, '0')}</i>
                    <span><small>PASO {index + 1}</small><strong>{title}</strong><p>{detail}</p></span>
                    <button type="button" onClick={() => setOnboarding((current) => ({ ...current, [typedKey]: !current[typedKey] }))}>{onboarding[typedKey] ? 'VALIDADO' : 'COMPLETAR →'}</button>
                  </article>
                )
              })}
            </div>
            <section className="merchant-validation-note-v2"><strong>NOTA OPERATIVA</strong><p>En producción, cada paso requiere validaciones legales, antifraude, tributarias y bancarias. Esta interfaz solo define el flujo.</p></section>
          </div>
        )}

        {section === 'pedidos' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>GESTIÓN OPERATIVA</span><h3>{activeOrders} PEDIDOS ABIERTOS</h3></div><button type="button" onClick={() => setSection('analitica')}>HISTORIAL COMPLETO ↗</button></div>
            <section className="merchant-orders-board-v2">
              {(['nuevo', 'aceptado', 'preparando', 'listo'] as MerchantOrderState[]).map((state) => (
                <div key={state} className={`merchant-order-column-v2 state-${state}`}>
                  <header><span>{orderStateLabel[state]}</span><b>{orders.filter((order) => order.state === state).length}</b></header>
                  {orders.filter((order) => order.state === state).map((order) => (
                    <article key={order.id}>
                      <div><small>{order.id} · {order.time}</small><strong>{order.customer}</strong><p>{order.items}</p></div>
                      <dl><div><dt>TOTAL</dt><dd>S/ {order.total.toFixed(2)}</dd></div><div><dt>RIDER</dt><dd>{order.rider}</dd></div></dl>
                      <button type="button" onClick={() => advanceOrder(order.id)}>{state === 'nuevo' ? 'ACEPTAR PEDIDO' : state === 'aceptado' ? 'INICIAR PREPARACIÓN' : state === 'preparando' ? 'MARCAR COMO LISTO' : 'CONFIRMAR RECOJO'} <Arrow /></button>
                    </article>
                  ))}
                  {!orders.some((order) => order.state === state) && <div className="merchant-empty-column-v2">SIN PEDIDOS</div>}
                </div>
              ))}
            </section>
          </div>
        )}

        {section === 'catalogo' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>MENÚ DIGITAL</span><h3>{products.length} PRODUCTOS</h3></div><button className="merchant-primary-v2" type="button" onClick={addProduct}>+ NUEVO PRODUCTO</button></div>
            <div className="merchant-catalog-layout-v2">
              <section className="merchant-product-list-v2">
                <div className="merchant-category-tabs-v2">{['TODOS','BURGERS','COMBOS','BEBIDAS'].map((filter) => <button key={filter} className={catalogFilter === filter ? 'is-active' : ''} type="button" onClick={() => setCatalogFilter(filter)}>{filter}</button>)}</div>
                {visibleProducts.map((product) => (
                  <button key={product.id} type="button" className={selectedProduct.id === product.id ? 'is-selected' : ''} onClick={() => setSelectedProductId(product.id)}>
                    <i className={`tone-${product.tone}`}>{product.symbol}</i>
                    <span><strong>{product.name}</strong><small>{product.category} · {product.modifier}</small></span>
                    <em>S/ {product.price.toFixed(2)}</em>
                    <b className={product.available ? 'is-available' : ''}>{product.available ? 'ACTIVO' : 'OCULTO'}</b>
                  </button>
                ))}
              </section>

              <aside className="merchant-product-editor-v2">
                <span>EDITOR DE PRODUCTO</span>
                <div className={`merchant-product-art-v2 tone-${selectedProduct.tone}`}>{selectedProduct.symbol}</div>
                <label><span>NOMBRE</span><input value={selectedProduct.name} onChange={(event) => updateSelectedProduct({ name: event.target.value })} /></label>
                <label><span>DESCRIPCIÓN</span><textarea value={selectedProduct.description} onChange={(event) => updateSelectedProduct({ description: event.target.value })} /></label>
                <div className="merchant-editor-row-v2">
                  <label><span>PRECIO</span><input type="number" step=".10" value={selectedProduct.price} onChange={(event) => updateSelectedProduct({ price: Number(event.target.value) })} /></label>
                  <label><span>CATEGORÍA</span><select value={selectedProduct.category} onChange={(event) => updateSelectedProduct({ category: event.target.value })}><option>Burgers</option><option>Combos</option><option>Bebidas</option><option>Acompañamientos</option></select></label>
                </div>
                <label><span>GRUPO DE MODIFICADORES</span><select value={selectedProduct.modifier} onChange={(event) => updateSelectedProduct({ modifier: event.target.value })}><option>Sin modificadores</option><option>Término + bebida</option><option>Queso + extras</option><option>Tamaño + salsa</option><option>Tamaño</option></select></label>
                <button type="button" className={`merchant-availability-v2 ${selectedProduct.available ? 'is-on' : ''}`} onClick={() => updateSelectedProduct({ available: !selectedProduct.available })}><span><strong>VISIBLE EN LA APP</strong><small>El cliente puede agregarlo al carrito.</small></span><i><b /></i></button>
                <button className="merchant-primary-v2" type="button" onClick={() => setFeedback('Producto guardado en memoria.')}>GUARDAR CAMBIOS <Arrow /></button>
              </aside>
            </div>
          </div>
        )}

        {section === 'inventario' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>CONTROL DE DISPONIBILIDAD</span><h3>INVENTARIO</h3></div><button type="button" onClick={() => setFeedback('Importación CSV pendiente de backend.')}>IMPORTAR CSV ↗</button></div>
            <section className="merchant-inventory-table-v2">
              <div className="merchant-inventory-head-v2"><span>PRODUCTO</span><span>CATEGORÍA</span><span>STOCK</span><span>ESTADO</span><span>ACCIÓN</span></div>
              {products.map((product) => (
                <article key={product.id}>
                  <div><i className={`tone-${product.tone}`}>{product.symbol}</i><span><strong>{product.name}</strong><small>S/ {product.price.toFixed(2)}</small></span></div>
                  <span>{product.category}</span>
                  <div className="merchant-stock-control-v2"><button type="button" onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock: Math.max(0, item.stock - 1), available: item.stock - 1 > 0 } : item))}>−</button><b>{product.stock}</b><button type="button" onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock: item.stock + 1, available: true } : item))}>+</button></div>
                  <i className={`merchant-stock-state-v2 ${product.stock === 0 ? 'is-out' : product.stock <= 10 ? 'is-low' : 'is-good'}`}>{product.stock === 0 ? 'SIN STOCK' : product.stock <= 10 ? 'STOCK BAJO' : 'DISPONIBLE'}</i>
                  <button type="button" onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, available: !item.available } : item))}>{product.available ? 'PAUSAR' : 'ACTIVAR'}</button>
                </article>
              ))}
            </section>
            <section className="merchant-inventory-summary-v2">
              <div><span>PRODUCTOS ACTIVOS</span><strong>{products.filter((product) => product.available).length}</strong></div>
              <div><span>STOCK BAJO</span><strong>{products.filter((product) => product.stock > 0 && product.stock <= 10).length}</strong></div>
              <div><span>SIN STOCK</span><strong>{products.filter((product) => product.stock === 0).length}</strong></div>
              <div><span>UNIDADES TOTALES</span><strong>{products.reduce((sum, product) => sum + product.stock, 0)}</strong></div>
            </section>
          </div>
        )}

        {section === 'horarios' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>DISPONIBILIDAD SEMANAL</span><h3>HORARIOS</h3></div><button type="button" onClick={() => setFeedback('Horario especial agregado como simulación.')}>+ HORARIO ESPECIAL</button></div>
            <div className="merchant-schedule-layout-v2">
              <section className="merchant-schedule-list-v2">
                {schedule.map((item, index) => (
                  <article key={item.day} className={item.active ? 'is-active' : ''}>
                    <button type="button" onClick={() => setSchedule((current) => current.map((day, dayIndex) => dayIndex === index ? { ...day, active: !day.active } : day))}><i><b /></i></button>
                    <strong>{item.day}</strong>
                    <label><span>ABRE</span><input type="time" value={item.open} disabled={!item.active} onChange={(event) => setSchedule((current) => current.map((day, dayIndex) => dayIndex === index ? { ...day, open: event.target.value } : day))} /></label>
                    <span>—</span>
                    <label><span>CIERRA</span><input type="time" value={item.close} disabled={!item.active} onChange={(event) => setSchedule((current) => current.map((day, dayIndex) => dayIndex === index ? { ...day, close: event.target.value } : day))} /></label>
                    <b>{item.active ? 'ABIERTO' : 'CERRADO'}</b>
                  </article>
                ))}
              </section>
              <aside className="merchant-schedule-preview-v2">
                <span>VISTA DEL CLIENTE</span>
                <div><i>BB</i><strong>BARRIO BURGER</strong><small>{storeOpen ? 'ABIERTO AHORA' : 'TEMPORALMENTE PAUSADO'}</small></div>
                <h3>{storeOpen ? '11:00 — 23:00' : 'NO RECIBE PEDIDOS'}</h3>
                <p>El horario real debe considerar feriados, cierres excepcionales y capacidad operativa.</p>
                <button type="button" onClick={() => setStoreOpen((current) => !current)}>{storeOpen ? 'PAUSAR TEMPORALMENTE' : 'REABRIR TIENDA'}</button>
              </aside>
            </div>
          </div>
        )}

        {section === 'promociones' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>CRECIMIENTO COMERCIAL</span><h3>PROMOCIONES</h3></div></div>
            <section className="merchant-promo-builder-v2">
              <div><span>NUEVA CAMPAÑA</span><h3>ACTIVA UNA<br />OFERTA.</h3><p>Crea una promoción conceptual y decide cuándo publicarla.</p></div>
              <label><span>NOMBRE DE LA CAMPAÑA</span><input value={newPromoName} onChange={(event) => setNewPromoName(event.target.value)} placeholder="Ej. Fin de semana burger" /></label>
              <button type="button" onClick={createPromotion}>CREAR PROMOCIÓN <Arrow /></button>
            </section>
            <div className="merchant-promo-grid-v2">
              {promotions.map((promo, index) => (
                <article key={promo.id} className={promo.active ? 'is-active' : ''}>
                  <span>CAMPAÑA 0{index + 1}</span>
                  <h3>{promo.name}</h3>
                  <p>Código <strong>{promo.code}</strong> · Beneficio {promo.discount}</p>
                  <div><span><b>{promo.uses}</b> usos</span><span><b>{promo.limit}</b> límite</span><span><b>{Math.round(promo.uses / promo.limit * 100)}%</b> progreso</span></div>
                  <i><b style={{ width: `${Math.min(100, promo.uses / promo.limit * 100)}%` }} /></i>
                  <button type="button" onClick={() => setPromotions((current) => current.map((item) => item.id === promo.id ? { ...item, active: !item.active } : item))}>{promo.active ? 'PAUSAR CAMPAÑA' : 'ACTIVAR CAMPAÑA'}</button>
                </article>
              ))}
            </div>
          </div>
        )}

        {section === 'analitica' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>INFORMACIÓN DEL NEGOCIO</span><h3>ANÁLISIS</h3></div><button type="button" onClick={() => setFeedback('Periodo actual: últimos 30 días.')}>ÚLTIMOS 30 DÍAS ▾</button></div>
            <div className="merchant-analytics-kpi-v2">
              <article><span>VENTAS BRUTAS</span><strong>S/ 68,420</strong><small>+12.4% frente al periodo anterior</small></article>
              <article><span>PEDIDOS</span><strong>1,768</strong><small>58.9 pedidos por día</small></article>
              <article><span>TICKET MEDIO</span><strong>S/ 38.70</strong><small>+S/ 2.10 en 30 días</small></article>
              <article><span>CANCELACIONES</span><strong>2.8%</strong><small>Objetivo menor a 3%</small></article>
            </div>
            <div className="merchant-analytics-layout-v2">
              <section className="merchant-revenue-chart-v2">
                <div className="merchant-panel-head-v2"><div><span>VENTAS DIARIAS</span><h3>RENDIMIENTO</h3></div><b>S/ 68.4K</b></div>
                <div className="merchant-line-chart-v2">
                  <svg viewBox="0 0 700 250" preserveAspectRatio="none" aria-hidden="true">
                    <polyline points="0,205 60,175 115,188 180,132 240,145 300,92 365,115 425,62 490,84 555,40 620,70 700,24" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
                    <polyline points="0,230 60,205 115,218 180,170 240,184 300,145 365,158 425,112 490,131 555,94 620,105 700,72" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 10" opacity=".35" />
                  </svg>
                  <div><span>SEM 1</span><span>SEM 2</span><span>SEM 3</span><span>SEM 4</span></div>
                </div>
              </section>
              <section className="merchant-insights-v2">
                <div className="merchant-panel-head-v2"><div><span>INSIGHTS</span><h3>DECISIONES</h3></div></div>
                <article className="tone-yellow"><b>01</b><span><strong>Mayor demanda</strong><p>Viernes entre 20:00 y 22:00 concentra el pico semanal.</p></span></article>
                <article className="tone-mint"><b>02</b><span><strong>Producto tractor</strong><p>Combo Doble DA genera 36% de la facturación del menú.</p></span></article>
                <article className="tone-blue"><b>03</b><span><strong>Oportunidad</strong><p>Reducir preparación 2 minutos puede mejorar la conversión estimada.</p></span></article>
              </section>
            </div>
          </div>
        )}

        {section === 'configuracion' && (
          <div className="merchant-section-v2">
            <div className="merchant-section-title-v2"><div><span>OPERACIÓN Y CUENTA</span><h3>CONFIGURACIÓN</h3></div><button className="merchant-primary-v2" type="button" onClick={() => setFeedback('Configuración guardada en memoria.')}>GUARDAR TODO</button></div>
            <div className="merchant-settings-layout-v2">
              <section className="merchant-settings-panel-v2">
                <div className="merchant-panel-head-v2"><div><span>OPERACIÓN</span><h3>REGLAS DEL LOCAL</h3></div></div>
                <label><span><strong>Tiempo de preparación</strong><small>Estimación mostrada al cliente y al rider.</small></span><b>{prepTime} min</b><input type="range" min="5" max="35" value={prepTime} onChange={(event) => setPrepTime(Number(event.target.value))} /></label>
                <label><span><strong>Radio de cobertura</strong><small>Distancia máxima conceptual del comercio.</small></span><b>{deliveryRadius} km</b><input type="range" min="1" max="12" value={deliveryRadius} onChange={(event) => setDeliveryRadius(Number(event.target.value))} /></label>
                <button type="button" onClick={() => setAutoAccept((current) => !current)}><span><strong>Aceptación automática</strong><small>Acepta pedidos nuevos cuando la capacidad lo permite.</small></span><i className={autoAccept ? 'is-on' : ''}><b /></i></button>
              </section>
              <section className="merchant-commercial-panel-v2">
                <div className="merchant-panel-head-v2"><div><span>ACUERDO COMERCIAL</span><h3>COMISIONES</h3></div></div>
                <div><span>COMISIÓN DE PLATAFORMA</span><strong>18%</strong><small>Valor simulado sujeto a contrato.</small></div>
                <div><span>LIQUIDACIÓN</span><strong>SEMANAL</strong><small>Viernes, cuenta terminada en 9042.</small></div>
                <div><span>PRÓXIMO PAGO</span><strong>S/ 8,420</strong><small>Estimado demo, sin valor financiero.</small></div>
                <button type="button" onClick={() => setFeedback('Contrato conceptual: revisión legal pendiente.')}>VER CONTRATO COMERCIAL →</button>
              </section>
            </div>
            <section className="merchant-danger-zone-v2"><div><span>ZONA DE RIESGO</span><strong>PAUSAR O DESACTIVAR EL NEGOCIO</strong><p>En producción, estas acciones requieren confirmación, permisos y registro de auditoría.</p></div><button type="button" onClick={() => setStoreOpen(false)}>PAUSAR OPERACIÓN</button></section>
          </div>
        )}

        <nav className="merchant-mobile-nav-v2">
          {(['resumen', 'pedidos', 'catalogo', 'inventario', 'configuracion'] as MerchantSection[]).map((item) => <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}><i>{sectionIcon[item]}</i><span>{item === 'configuracion' ? 'AJUSTES' : item.toUpperCase()}</span></button>)}
        </nav>
        <DemoToast message={feedback} onClose={() => setFeedback('')} />
      </main>
    </div>
  )
}


function AdminPrototype() {
  const [section, setSection] = useState<AdminSection>('resumen')
  const [orders, setOrders] = useState(initialAdminOrders)
  const [orderFilter, setOrderFilter] = useState<'todos' | AdminOrderStatus>('todos')
  const [selectedOrderId, setSelectedOrderId] = useState('#DA-2412')
  const [merchants, setMerchants] = useState(initialAdminMerchants)
  const [riders, setRiders] = useState(initialAdminRiders)
  const [incidents, setIncidents] = useState(initialAdminIncidents)
  const [zones, setZones] = useState(initialZones)
  const [commission, setCommission] = useState(18)
  const [deliveryBase, setDeliveryBase] = useState(4.9)
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState('')

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderFilter === 'todos' || order.status === orderFilter
    const normalized = search.trim().toLowerCase()
    const matchesSearch = !normalized || `${order.id} ${order.customer} ${order.store} ${order.rider} ${order.zone}`.toLowerCase().includes(normalized)
    return matchesStatus && matchesSearch
  })

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0]
  const activeOrders = orders.filter((order) => !['entregado', 'cancelado'].includes(order.status)).length
  const unresolvedIncidents = incidents.filter((incident) => !incident.resolved).length
  const activeRiders = riders.filter((rider) => rider.status !== 'desconectado' && !rider.suspended).length
  const activeZones = zones.filter((zone) => zone.active).length
  const gmv = orders.reduce((sum, order) => sum + order.total, 0) * 37.2
  const platformRevenue = gmv * (commission / 100)

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const downloadAdminCsv = () => {
    const rows = [['pedido','cliente','comercio','estado','total'], ...orders.map((order) => [order.id, order.customer, order.store, order.status, order.total.toFixed(2)])]
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'deliver-assets-pedidos-demo.csv'
    link.click()
    URL.revokeObjectURL(url)
    setFeedback('CSV demo exportado.')
  }

  const cycleOrderStatus = (orderId: string) => {
    const flow: AdminOrderStatus[] = ['nuevo', 'preparando', 'en_ruta', 'entregado']
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId || order.status === 'cancelado') return order
      const index = flow.indexOf(order.status)
      return { ...order, status: flow[Math.min(index + 1, flow.length - 1)] }
    }))
  }

  const sectionIcon: Record<AdminSection, string> = {
    resumen: '◫',
    pedidos: '▤',
    comercios: '▰',
    repartidores: '↗',
    usuarios: '●',
    zonas: '⌖',
    finanzas: 'S/',
    incidencias: '!',
  }

  const orderStatusLabel: Record<AdminOrderStatus, string> = {
    nuevo: 'Nuevo',
    preparando: 'Preparando',
    en_ruta: 'En ruta',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  }

  return (
    <div className="admin-prototype">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand"><BrandLogo compact /><small>OPERATIONS OS</small></div>
        <nav>
          {(Object.keys(adminSectionLabels) as AdminSection[]).map((item) => (
            <button key={item} type="button" className={section === item ? 'is-active' : ''} onClick={() => setSection(item)}>
              <i>{sectionIcon[item]}</i><span>{adminSectionLabels[item]}</span>
              {item === 'incidencias' && unresolvedIncidents > 0 && <b>{unresolvedIncidents}</b>}
            </button>
          ))}
        </nav>
        <div className="admin-system-status">
          <span><i /> SISTEMA OPERATIVO</span>
          <small>Última actualización<br />hace 12 segundos</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>DELIVER ASSETS / ADMINISTRACIÓN</span>
            <h2>{adminSectionLabels[section]}</h2>
          </div>
          <div className="admin-header-tools">
            <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en operaciones" /></label>
            <button className="admin-alert" type="button" onClick={() => setSection('incidencias')}>!<b>{unresolvedIncidents}</b></button>
            <div className="admin-profile"><i>EM</i><span><strong>Eidon M.</strong><small>Superadministrador</small></span></div>
          </div>
        </header>

        {section === 'resumen' && (
          <div className="admin-section">
            <div className="admin-kpi-grid">
              <article className="tone-yellow"><span>PEDIDOS ACTIVOS</span><strong>{activeOrders}</strong><small>+14% durante la última hora</small><i>▤</i></article>
              <article className="tone-mint"><span>RIDERS EN LÍNEA</span><strong>{activeRiders}</strong><small>94% de cobertura operativa</small><i>↗</i></article>
              <article className="tone-blue"><span>GMV DEL DÍA</span><strong>S/ {gmv.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</strong><small>Meta diaria al 68%</small><i>S/</i></article>
              <article className="tone-red"><span>INCIDENCIAS ABIERTAS</span><strong>{unresolvedIncidents}</strong><small>1 requiere acción inmediata</small><i>!</i></article>
            </div>

            <div className="admin-control-grid">
              <section className="admin-live-map">
                <div className="admin-panel-heading"><div><span>OPERACIÓN EN VIVO</span><h3>LIMA CENTRAL</h3></div><b>{activeZones} ZONAS ACTIVAS</b></div>
                <div className="admin-map-canvas">
                  <span className="admin-road ar1" /><span className="admin-road ar2" /><span className="admin-road ar3" /><span className="admin-road ar4" />
                  {zones.map((zone, index) => <button key={zone.id} type="button" className={`admin-zone-dot z${index + 1} ${zone.active ? 'is-active' : ''}`} onClick={() => setSection('zonas')}><i>{zone.orders}</i><span>{zone.name}</span></button>)}
                  <div className="admin-map-rider r1"><Bike /></div><div className="admin-map-rider r2"><Bike /></div><div className="admin-map-rider r3"><Bike /></div>
                  <div className="admin-map-legend"><span><i className="high" /> demanda alta</span><span><i className="medium" /> demanda media</span><span><i className="rider" /> repartidor</span></div>
                </div>
              </section>

              <section className="admin-activity-panel">
                <div className="admin-panel-heading"><div><span>ACTIVIDAD</span><h3>AHORA</h3></div><button type="button" onClick={() => setSection('pedidos')}>VER TODOS →</button></div>
                <div className="admin-feed">
                  {orders.slice(0, 5).map((order) => <button key={order.id} type="button" onClick={() => { setSelectedOrderId(order.id); setSection('pedidos') }}><i className={`status-${order.status}`}>{order.id.slice(-2)}</i><span><strong>{order.store}</strong><small>{order.customer} · {order.zone}</small></span><b className={`status-pill status-${order.status}`}>{orderStatusLabel[order.status]}</b><em>S/ {order.total.toFixed(2)}</em></button>)}
                </div>
              </section>
            </div>

            <div className="admin-summary-bottom">
              <section className="admin-demand-chart">
                <div className="admin-panel-heading"><div><span>DEMANDA POR HORA</span><h3>PEDIDOS</h3></div><b>+22% VS. AYER</b></div>
                <div className="admin-chart-bars">{[22,35,31,48,42,63,74,88,67,92,81,58].map((height, index) => <i key={index} style={{ height: `${height}%` }} className={index === 9 ? 'is-peak' : ''}><span>{String(index + 8).padStart(2,'0')}:00</span></i>)}</div>
              </section>
              <section className="admin-priority-list">
                <div className="admin-panel-heading"><div><span>ATENCIÓN REQUERIDA</span><h3>PRIORIDADES</h3></div></div>
                {incidents.filter((incident) => !incident.resolved).map((incident) => <button key={incident.id} type="button" onClick={() => setSection('incidencias')}><i className={`severity-${incident.severity}`}>!</i><span><strong>{incident.title}</strong><small>{incident.subject}</small></span><em>{incident.age}</em></button>)}
              </section>
            </div>
          </div>
        )}

        {section === 'pedidos' && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <div className="admin-filter-row">
                {(['todos','nuevo','preparando','en_ruta','entregado','cancelado'] as const).map((filter) => <button key={filter} type="button" className={orderFilter === filter ? 'is-active' : ''} onClick={() => setOrderFilter(filter)}>{filter === 'todos' ? 'TODOS' : orderStatusLabel[filter]} <b>{filter === 'todos' ? orders.length : orders.filter((order) => order.status === filter).length}</b></button>)}
              </div>
              <button className="admin-export" type="button" onClick={downloadAdminCsv}>EXPORTAR CSV ↗</button>
            </div>
            <div className="admin-orders-layout">
              <section className="admin-table-card">
                <div className="admin-table admin-orders-table">
                  <div className="admin-table-head"><span>PEDIDO</span><span>CLIENTE / COMERCIO</span><span>REPARTIDOR</span><span>ESTADO</span><span>TOTAL</span><span>HORA</span></div>
                  {filteredOrders.map((order) => <button key={order.id} type="button" className={selectedOrder.id === order.id ? 'is-selected' : ''} onClick={() => setSelectedOrderId(order.id)}><strong>{order.id}</strong><span><b>{order.customer}</b><small>{order.store} · {order.zone}</small></span><span>{order.rider}</span><i className={`status-pill status-${order.status}`}>{orderStatusLabel[order.status]}</i><em>S/ {order.total.toFixed(2)}</em><small>{order.time}</small></button>)}
                </div>
              </section>
              <aside className="admin-order-drawer">
                <span>DETALLE OPERATIVO</span><h3>{selectedOrder.id}</h3>
                <div className={`admin-order-status-block status-${selectedOrder.status}`}><b>{orderStatusLabel[selectedOrder.status]}</b><small>Actualizado hace 2 min</small></div>
                <dl><div><dt>Cliente</dt><dd>{selectedOrder.customer}</dd></div><div><dt>Comercio</dt><dd>{selectedOrder.store}</dd></div><div><dt>Repartidor</dt><dd>{selectedOrder.rider}</dd></div><div><dt>Zona</dt><dd>{selectedOrder.zone}</dd></div><div><dt>Total</dt><dd>S/ {selectedOrder.total.toFixed(2)}</dd></div></dl>
                <div className="admin-mini-timeline"><i className="is-done"><b>✓</b><span>Pedido creado</span></i><i className={['preparando','en_ruta','entregado'].includes(selectedOrder.status) ? 'is-done' : ''}><b>2</b><span>Preparación</span></i><i className={['en_ruta','entregado'].includes(selectedOrder.status) ? 'is-done' : ''}><b>3</b><span>En ruta</span></i><i className={selectedOrder.status === 'entregado' ? 'is-done' : ''}><b>4</b><span>Entregado</span></i></div>
                <button className="admin-primary-action" type="button" disabled={['entregado','cancelado'].includes(selectedOrder.status)} onClick={() => cycleOrderStatus(selectedOrder.id)}>AVANZAR ESTADO <Arrow /></button>
                <button className="admin-danger-action" type="button" disabled={['entregado','cancelado'].includes(selectedOrder.status)} onClick={() => setOrders((current) => current.map((order) => order.id === selectedOrder.id ? { ...order, status: 'cancelado' } : order))}>CANCELAR PEDIDO</button>
              </aside>
            </div>
          </div>
        )}

        {section === 'comercios' && (
          <div className="admin-section">
            <div className="admin-section-intro"><div><span>RED COMERCIAL</span><h3>{merchants.length} COMERCIOS</h3></div><button className="admin-primary-action" type="button" onClick={() => { setMerchants((current) => [...current, { id: Date.now(), name: 'Nuevo comercio', category: 'Restaurante', zone: 'Miraflores', sales: 0, rating: 5, status: 'revisión', verified: false }]); setFeedback('Comercio demo registrado.') }}>+ REGISTRAR COMERCIO</button></div>
            <div className="admin-merchant-grid">
              {merchants.filter((merchant) => !search || `${merchant.name} ${merchant.category} ${merchant.zone}`.toLowerCase().includes(search.toLowerCase())).map((merchant) => <article key={merchant.id}>
                <div className="merchant-card-head"><i>{merchant.name.split(' ').map((word) => word[0]).join('').slice(0,2)}</i><span><strong>{merchant.name}</strong><small>{merchant.category} · {merchant.zone}</small></span><b className={`merchant-state state-${merchant.status}`}>{merchant.status}</b></div>
                <div className="merchant-card-metrics"><span><b>S/ {merchant.sales.toLocaleString('es-PE')}</b>ventas hoy</span><span><b>{merchant.rating} ★</b>calificación</span><span><b>{commission}%</b>comisión</span></div>
                <div className="merchant-card-actions"><button type="button" className={merchant.verified ? 'is-verified' : ''} onClick={() => setMerchants((current) => current.map((item) => item.id === merchant.id ? { ...item, verified: !item.verified } : item))}>{merchant.verified ? '✓ VERIFICADO' : 'VERIFICAR DOCUMENTOS'}</button><button type="button" onClick={() => setMerchants((current) => current.map((item) => item.id === merchant.id ? { ...item, status: item.status === 'pausado' ? 'activo' : 'pausado' } : item))}>{merchant.status === 'pausado' ? 'ACTIVAR' : 'PAUSAR'}</button></div>
              </article>)}
            </div>
          </div>
        )}

        {section === 'repartidores' && (
          <div className="admin-section">
            <div className="admin-section-intro"><div><span>FLOTA OPERATIVA</span><h3>{riders.length} REPARTIDORES DEMO</h3></div><div className="admin-live-chip"><i /> {activeRiders} EN OPERACIÓN</div></div>
            <div className="admin-rider-grid">
              {riders.map((rider) => <article key={rider.id} className={rider.suspended ? 'is-suspended' : ''}>
                <div className="admin-rider-profile"><i>{rider.name[0]}</i><span><strong>{rider.name}</strong><small>{rider.zone}</small></span><b>{rider.rating} ★</b></div>
                <div className={`rider-operational-state state-${rider.status.replace(' ','-')}`}><i />{rider.suspended ? 'suspendido' : rider.status}</div>
                <div className="rider-stat-grid"><span><b>{rider.deliveries}</b>entregas</span><span><b>{rider.acceptance}%</b>aceptación</span><span><b>S/ {rider.earnings.toFixed(2)}</b>hoy</span></div>
                <button type="button" onClick={() => setRiders((current) => current.map((item) => item.id === rider.id ? { ...item, suspended: !item.suspended } : item))}>{rider.suspended ? 'REACTIVAR CUENTA' : 'SUSPENDER CUENTA'}</button>
              </article>)}
            </div>
          </div>
        )}

        {section === 'usuarios' && (
          <div className="admin-section">
            <div className="admin-user-overview">
              <article><span>USUARIOS TOTALES</span><strong>28,492</strong><small>+1,248 este mes</small></article>
              <article><span>ACTIVOS 30 DÍAS</span><strong>16,804</strong><small>58.9% de la base</small></article>
              <article><span>NUEVOS HOY</span><strong>214</strong><small>CAC simulado S/ 8.70</small></article>
              <article><span>FRECUENCIA</span><strong>3.8×</strong><small>pedidos por mes</small></article>
            </div>
            <div className="admin-users-layout">
              <section className="admin-segment-card"><div className="admin-panel-heading"><div><span>SEGMENTACIÓN</span><h3>BASE DE CLIENTES</h3></div></div><div className="segment-bars"><p><span>Frecuentes</span><i><b style={{width:'72%'}} /></i><em>8,402</em></p><p><span>Nuevos</span><i><b style={{width:'48%'}} /></i><em>5,608</em></p><p><span>En riesgo</span><i><b style={{width:'25%'}} /></i><em>2,914</em></p><p><span>Inactivos</span><i><b style={{width:'36%'}} /></i><em>4,188</em></p></div></section>
              <section className="admin-recent-users"><div className="admin-panel-heading"><div><span>ALTAS RECIENTES</span><h3>ÚLTIMOS USUARIOS</h3></div></div>{['Lucía M. · Miraflores','Mateo S. · San Isidro','Valeria C. · Lince','Diego A. · Barranco','Camila R. · Surquillo'].map((user, index) => <div key={user}><i>{user[0]}</i><span><strong>{user.split(' · ')[0]}</strong><small>{user.split(' · ')[1]} · hace {index * 4 + 2} min</small></span><b>{index % 2 ? '1 pedido' : 'Nuevo'}</b></div>)}</section>
            </div>
          </div>
        )}

        {section === 'zonas' && (
          <div className="admin-section">
            <div className="admin-zones-layout">
              <section className="admin-zone-management">
                <div className="admin-section-intro"><div><span>COBERTURA</span><h3>ZONAS DE OPERACIÓN</h3></div><button className="admin-primary-action" type="button" onClick={() => { setZones((current) => [...current, { id: Date.now(), name: `Zona ${current.length + 1}`, riders: 0, orders: 0, eta: 35, active: false, demand: 'baja' }]); setFeedback('Zona demo creada.') }}>+ CREAR ZONA</button></div>
                <div className="admin-zone-list">{zones.map((zone) => <article key={zone.id} className={zone.active ? 'is-active' : ''}><i>{zone.name.slice(0,2).toUpperCase()}</i><span><strong>{zone.name}</strong><small>{zone.riders} riders · {zone.orders} pedidos</small></span><em><b>{zone.eta} min</b>ETA medio</em><button type="button" onClick={() => setZones((current) => current.map((item) => item.id === zone.id ? { ...item, active: !item.active } : item))}>{zone.active ? 'ACTIVA' : 'PAUSADA'}</button></article>)}</div>
              </section>
              <section className="admin-coverage-map"><span className="city-road cr1" /><span className="city-road cr2" /><span className="city-road cr3" /><span className="city-road cr4" />{zones.map((zone, index) => <i key={zone.id} className={`coverage-shape coverage-${index + 1} ${zone.active ? 'is-active' : ''}`}><b>{zone.name}</b><small>{zone.demand}</small></i>)}<div className="coverage-caption"><span>ÁREA SIMULADA</span><strong>LIMA<br />CENTRAL</strong></div></section>
            </div>
          </div>
        )}

        {section === 'finanzas' && (
          <div className="admin-section">
            <div className="admin-finance-kpis"><article><span>GMV HOY</span><strong>S/ {gmv.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</strong><small>Volumen bruto procesado</small></article><article><span>INGRESO PLATAFORMA</span><strong>S/ {platformRevenue.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</strong><small>Comisiones simuladas</small></article><article><span>PAGOS A RIDERS</span><strong>S/ 8,482</strong><small>Liquidación pendiente</small></article></div>
            <div className="admin-finance-layout">
              <section className="admin-pricing-panel"><span>CONFIGURACIÓN COMERCIAL</span><h3>ECONOMÍA<br />UNITARIA.</h3><label><span>COMISIÓN A COMERCIOS</span><strong>{commission}%</strong><input type="range" min="8" max="30" value={commission} onChange={(event) => setCommission(Number(event.target.value))} /></label><label><span>TARIFA BASE DE ENVÍO</span><strong>S/ {deliveryBase.toFixed(2)}</strong><input type="range" min="2.9" max="9.9" step=".5" value={deliveryBase} onChange={(event) => setDeliveryBase(Number(event.target.value))} /></label><div className="admin-unit-result"><span>INGRESO ESTIMADO POR PEDIDO</span><strong>S/ {(38.7 * commission / 100 + deliveryBase * .22).toFixed(2)}</strong><small>Modelo simulado, no representa resultados reales.</small></div></section>
              <section className="admin-settlements"><div className="admin-panel-heading"><div><span>LIQUIDACIONES</span><h3>PRÓXIMOS PAGOS</h3></div></div>{[['Barrio Burger','S/ 8,420','Viernes'],['Mercado 24','S/ 11,806','Viernes'],['Farma Central','S/ 5,192','Lunes'],['Pizza 33','S/ 7,814','Lunes']].map((row) => <div key={row[0]}><i>{row[0][0]}</i><span><strong>{row[0]}</strong><small>Cuenta validada</small></span><b>{row[1]}</b><em>{row[2]}</em></div>)}<button type="button" onClick={() => setFeedback('Conciliación financiera simulada.')}>VER CONCILIACIÓN COMPLETA →</button></section>
            </div>
          </div>
        )}

        {section === 'incidencias' && (
          <div className="admin-section">
            <div className="admin-section-intro"><div><span>CENTRO DE SOPORTE</span><h3>{unresolvedIncidents} CASOS ABIERTOS</h3></div><div className="admin-live-chip"><i /> SLA MEDIO 6:42 MIN</div></div>
            <div className="admin-incidents-list">
              {incidents.map((incident) => <article key={incident.id} className={incident.resolved ? 'is-resolved' : ''}><i className={`severity-${incident.severity}`}>!</i><span><small>{incident.id} · PRIORIDAD {incident.severity.toUpperCase()}</small><strong>{incident.title}</strong><em>{incident.subject}</em></span><b>{incident.age}</b><button type="button" onClick={() => setIncidents((current) => current.map((item) => item.id === incident.id ? { ...item, resolved: !item.resolved } : item))}>{incident.resolved ? 'REABRIR' : 'RESOLVER CASO'}</button></article>)}
            </div>
            <section className="admin-support-stats"><div><span>TIEMPO DE PRIMERA RESPUESTA</span><strong>2:18</strong><small>minutos promedio</small></div><div><span>RESOLUCIÓN EN PRIMER CONTACTO</span><strong>78%</strong><small>objetivo interno 82%</small></div><div><span>SATISFACCIÓN SOPORTE</span><strong>4.6 ★</strong><small>últimos 30 días</small></div></section>
          </div>
        )}
        <DemoToast message={feedback} onClose={() => setFeedback('')} />
      </main>
    </div>
  )
}


function PrototypeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [role, setRole] = useState<PrototypeRole>('cliente')
  const [session, setSession] = useState<DemoSession | null>(null)
  const [accessOpen, setAccessOpen] = useState(true)
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('welcome')
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('comida')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [address, setAddress] = useState('Av. Arequipa 1480, Lima')
  const [payment, setPayment] = useState('visa')
  const [merchantStage, setMerchantStage] = useState<MerchantStage>('new')
  const [riderStage, setRiderStage] = useState<RiderStage>('offer')
  const [riderOnline, setRiderOnline] = useState(true)
  const [rating, setRating] = useState(0)
  const [prototypeStore, setPrototypeStore] = useState<Store>(stores[0])
  const [activePromo, setActivePromo] = useState('')
  const [checkoutPromoInput, setCheckoutPromoInput] = useState('')
  const [appliedCheckoutPromo, setAppliedCheckoutPromo] = useState('')
  const [storeFilter, setStoreFilter] = useState('TODOS')
  const [feedback, setFeedback] = useState('')
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotification[]>(initialCustomerNotifications)
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    { id: 1, author: 'support', text: 'Hola, soy el asistente de soporte de DELIVER ASSETS. ¿En qué podemos ayudarte?', time: '10:58' },
  ])
  const customerScreenRef = useRef<HTMLElement>(null)
  const [customerSettings, setCustomerSettings] = useState<CustomerSettings>({
    push: true,
    email: true,
    promos: false,
    location: true,
    biometric: false,
  })

  const cartCount = Object.values(cart).reduce((sum, amount) => sum + amount, 0)
  const currentProducts = demoProductsByStore[prototypeStore.name] ?? []
  const subtotal = allDemoProducts.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0)
  const deliveryFee = cartCount ? 4.9 : 0
  const serviceFee = cartCount ? 1.9 : 0
  const effectivePromo = appliedCheckoutPromo || activePromo
  const promoDiscount = !cartCount ? 0 : effectivePromo === 'PRIMER20' ? Math.min(subtotal * .2, 15) : effectivePromo === 'ENVIO0' ? deliveryFee : effectivePromo === 'NOCHE10' ? Math.min(10, subtotal) : effectivePromo === 'MERCADO15' ? Math.min(subtotal * .15, 20) : 0
  const total = Math.max(0, subtotal + deliveryFee + serviceFee - promoDiscount)
  const storeFilters = ['TODOS', ...Array.from(new Set(currentProducts.map((product) => product.section)))]
  const visibleStoreProducts = currentProducts.filter((product) => storeFilter === 'TODOS' || product.section === storeFilter)

  const customerServiceScreens: CustomerScreen[] = ['account', 'orders', 'orderdetail', 'promotions', 'notifications', 'support', 'settings']
  const isCustomerService = customerServiceScreens.includes(customerScreen)
  const unreadNotifications = customerNotifications.filter((item) => !item.read).length

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const notify = (message: string) => setFeedback(message)

  const openStore = (store: Store) => {
    if (cartCount > 0 && prototypeStore.name !== store.name) {
      setCart({})
      setAppliedCheckoutPromo('')
      notify('Carrito reiniciado al cambiar de comercio.')
    }
    setPrototypeStore(store)
    setSelectedCategory(store.category)
    setStoreFilter('TODOS')
    setCustomerScreen('store')
  }

  const applyCheckoutPromo = () => {
    const code = checkoutPromoInput.trim().toUpperCase()
    if (!customerPromotions.some((promo) => promo.code === code)) {
      notify('Cupón no válido para esta demostración.')
      return
    }
    setAppliedCheckoutPromo(code)
    setActivePromo(code)
    notify(`Cupón ${code} aplicado.`)
  }

  const sendSupportMessage = (text: string) => {
    const nextId = Date.now()
    setSupportMessages((current) => [...current, { id: nextId, author: 'user', text, time: 'Ahora' }])
    window.setTimeout(() => {
      setSupportMessages((current) => [...current, {
        id: nextId + 1,
        author: 'support',
        text: 'Recibimos tu mensaje. En una implementación real, aquí se asignaría un agente y se crearía un ticket.',
        time: 'Ahora',
      }])
    }, 650)
  }

  const reorderDemo = () => {
    setPrototypeStore(stores.find((store) => store.category === 'mercado') ?? stores[0])
    setSelectedCategory('mercado')
    setCart({ 201: 1, 202: 1 })
    setCustomerScreen('cart')
  }

  useEffect(() => {
    customerScreenRef.current?.scrollTo(0, 0)
  }, [customerScreen])

  useEffect(() => {
    if (customerScreen !== 'processing') return
    const timer = window.setTimeout(() => setCustomerScreen('tracking'), 1700)
    return () => window.clearTimeout(timer)
  }, [customerScreen])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  const selectRole = (nextRole: PrototypeRole) => {
    setRole(nextRole)
    setAccessOpen(true)
  }

  const authenticateSession = (nextSession: DemoSession) => {
    setSession(nextSession)
    setRole(nextSession.role)
    setAccessOpen(false)
    if (nextSession.role === 'cliente') setCustomerScreen('home')
  }

  const closeSession = () => {
    setSession(null)
    setAccessOpen(true)
    setRole('cliente')
    setCustomerScreen('welcome')
  }

  const addProduct = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  const subtractProduct = (id: number) => setCart((current) => {
    const next = { ...current }
    const amount = (next[id] ?? 0) - 1
    if (amount <= 0) delete next[id]
    else next[id] = amount
    return next
  })

  const resetCustomer = () => {
    setCustomerScreen('home')
    setCart({})
    setRating(0)
    setAppliedCheckoutPromo('')
    setCheckoutPromoInput('')
    setStoreFilter('TODOS')
  }

  if (!open) return null

  const customerBack = () => {
    const backMap: Partial<Record<CustomerScreen, CustomerScreen>> = {
      login: 'welcome', location: 'login', home: 'location', store: 'home', cart: 'store', checkout: 'cart', payment: 'checkout', tracking: 'home', delivered: 'tracking', account: 'home', orders: 'account', orderdetail: 'orders', promotions: 'account', notifications: 'home', support: 'account', settings: 'account',
    }
    const previous = backMap[customerScreen]
    if (previous) setCustomerScreen(previous)
  }

  return (
    <div className="prototype-overlay" role="dialog" aria-modal="true" aria-label="Prototipo completo de Deliver Assets">
      <div className="prototype-shell">
        <header className="prototype-topbar">
          <button className="prototype-brand" type="button" onClick={() => setAccessOpen(true)}><BrandLogo compact /></button>
          {session ? (
            <button className="prototype-session-control" type="button" onClick={() => setAccessOpen(true)}>
              <i>{roleAccessProfiles[session.role].symbol}</i>
              <span><small>SESIÓN ACTIVA</small><strong>{session.name}</strong><em>{roleAccessProfiles[session.role].title} · cambiar acceso</em></span>
              <b>⌄</b>
            </button>
          ) : (
            <div className="prototype-access-status"><small>DELIVER ID</small><strong>SELECCIONA UN ROL</strong></div>
          )}
          <div className="prototype-demo-label">PROTOTIPO · SIN PAGOS REALES</div>
          {session && <button className="prototype-logout" type="button" onClick={closeSession}>CERRAR SESIÓN</button>}
          <button className="prototype-close" type="button" onClick={onClose} aria-label="Cerrar prototipo">×</button>
        </header>

        {(!session || accessOpen) && (
          <AccessGateway
            currentSession={session}
            initialRole={role}
            onAuthenticated={authenticateSession}
            onClose={() => session && setAccessOpen(false)}
          />
        )}

        {session && !accessOpen && role === 'cliente' && (
          <div className={`customer-prototype ${isCustomerService ? 'has-service-rail' : 'is-flow-mode'}`}>
            <div className="role-session-strip customer-session-strip">
              <span><i>C</i><strong>CLIENTE</strong><small>{session?.email}</small></span>
              <nav className="customer-desktop-nav" aria-label="Navegación del cliente">
                <button type="button" className={customerScreen === 'home' || customerScreen === 'store' ? 'is-active' : ''} onClick={() => setCustomerScreen('home')}>INICIO</button>
                <button type="button" className={customerScreen === 'orders' || customerScreen === 'orderdetail' || customerScreen === 'tracking' ? 'is-active' : ''} onClick={() => setCustomerScreen('orders')}>PEDIDOS</button>
                <button type="button" className={customerScreen === 'promotions' ? 'is-active' : ''} onClick={() => setCustomerScreen('promotions')}>PROMOS</button>
                <button type="button" className={customerScreen === 'support' ? 'is-active' : ''} onClick={() => setCustomerScreen('support')}>AYUDA</button>
                <button type="button" className={customerScreen === 'account' || customerScreen === 'settings' ? 'is-active' : ''} onClick={() => setCustomerScreen('account')}>CUENTA</button>
              </nav>
              <button type="button" onClick={() => setAccessOpen(true)}>ACCESO →</button>
            </div>
            <aside className={`prototype-rail ${isCustomerService ? 'is-service-rail' : ''}`}>
              {isCustomerService ? (
                <>
                  <span>MI DELIVER</span>
                  {[
                    ['account', 'PERFIL', 'EM'],
                    ['orders', 'PEDIDOS', '▤'],
                    ['promotions', 'PROMOS', '%'],
                    ['notifications', 'AVISOS', '!'],
                    ['support', 'SOPORTE', '?'],
                    ['settings', 'AJUSTES', '⚙'],
                  ].map(([target, label, symbol]) => (
                    <button key={target} type="button" className={customerScreen === target || (target === 'orders' && customerScreen === 'orderdetail') ? 'is-active' : ''} onClick={() => setCustomerScreen(target as CustomerScreen)}>
                      <b>{symbol}</b><span>{label}</span>{target === 'notifications' && unreadNotifications > 0 && <i>{unreadNotifications}</i>}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <span>FLUJO CLIENTE</span>
                  {['Inicio', 'Tienda', 'Carrito', 'Checkout', 'Pago', 'Seguimiento'].map((label, index) => {
                    const order: CustomerScreen[] = ['home', 'store', 'cart', 'checkout', 'payment', 'tracking']
                    const normalizedScreen = customerScreen === 'processing' || customerScreen === 'delivered' ? 'tracking' : customerScreen
                    const activeIndex = Math.max(0, order.indexOf(normalizedScreen))
                    const stateClass = index === activeIndex ? 'is-current' : index < activeIndex ? 'is-complete' : ''
                    return <i key={label} className={stateClass}><b>{index < activeIndex ? '✓' : String(index + 1).padStart(2, '0')}</b>{label}</i>
                  })}
                </>
              )}
            </aside>

            <section ref={customerScreenRef} className={`customer-screen screen-${customerScreen}`}>
              {!['welcome', 'processing', 'home'].includes(customerScreen) && <button className="screen-back" type="button" onClick={customerBack}>← VOLVER</button>}

              {customerScreen === 'welcome' && (
                <div className="welcome-screen">
                  <div className="welcome-copy">
                    <span>APP CLIENTE / DEMO COMPLETA</span>
                    <h2>TODO LO QUE<br />NECESITAS.<br /><em>EN CAMINO.</em></h2>
                    <p>Recorre el producto completo desde el acceso hasta la entrega. Todo es una simulación visual.</p>
                    <button className="prototype-primary" type="button" onClick={() => setCustomerScreen('login')}>COMENZAR DEMO <Arrow /></button>
                  </div>
                  <div className="welcome-poster" aria-hidden="true">
                    <strong>PIDE</strong><strong>SIGUE</strong><strong>RECIBE</strong>
                    <div className="welcome-orbit"><Bike /></div>
                  </div>
                </div>
              )}

              {customerScreen === 'login' && (
                <div className="form-screen">
                  <div><span>01 / TU CUENTA</span><h2>ENTRA<br />RÁPIDO.</h2><p>Acceso simulado. No se envían ni almacenan datos.</p></div>
                  <form onSubmit={(event) => { event.preventDefault(); setCustomerScreen('location') }}>
                    <label><span>CORREO</span><input type="email" defaultValue="demo@deliverassets.pe" required /></label>
                    <label><span>CONTRASEÑA</span><input type="password" defaultValue="12345678" required /></label>
                    <button className="prototype-primary" type="submit">CONTINUAR <Arrow /></button>
                    <button className="prototype-secondary" type="button" onClick={() => setCustomerScreen('location')}>CONTINUAR COMO INVITADO</button>
                  </form>
                </div>
              )}

              {customerScreen === 'location' && (
                <div className="location-screen">
                  <div className="location-map" aria-hidden="true">
                    <span className="city-road cr1" /><span className="city-road cr2" /><span className="city-road cr3" /><span className="city-road cr4" />
                    <div className="location-pin"><Pin /></div>
                    <b>LIMA</b>
                  </div>
                  <div className="location-panel">
                    <span>02 / UBICACIÓN</span><h2>¿DÓNDE<br />LO LLEVAMOS?</h2>
                    <label><span>DIRECCIÓN</span><input value={address} onChange={(event) => setAddress(event.target.value)} /></label>
                    <div className="address-options"><button type="button" onClick={() => setAddress('Av. Arequipa 1480, Lima')}>CASA</button><button type="button" onClick={() => setAddress('Jr. de la Unión 620, Lima')}>OFICINA</button></div>
                    <button className="prototype-primary" type="button" onClick={() => setCustomerScreen('home')}>USAR ESTA DIRECCIÓN <Arrow /></button>
                  </div>
                </div>
              )}

              {customerScreen === 'home' && (
                <div className={`app-home-screen app-home-${selectedCategory}`}>
                  <div className="app-home-head">
                    <div><small>ENTREGAR EN</small><strong>{address}</strong></div>
                    <div className="app-home-actions">
                      <button type="button" onClick={() => setCustomerScreen('location')} aria-label="Cambiar ubicación"><Pin /></button>
                      <button type="button" className="home-notification-button" onClick={() => setCustomerScreen('notifications')} aria-label="Abrir notificaciones">!{unreadNotifications > 0 && <b>{unreadNotifications}</b>}</button>
                      <button type="button" className="home-profile-button" onClick={() => setCustomerScreen('account')} aria-label="Abrir cuenta">EM</button>
                    </div>
                  </div>
                  <div className="app-search">⌕ <span>Buscar comida, tiendas o productos</span><kbd>⌘ K</kbd></div>
                  <div className={`home-hero-card home-hero-${selectedCategory}`}>
                    <div><span>{categoryExperience[selectedCategory].kicker}</span><h2>{categoryExperience[selectedCategory].title.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h2><small>{categoryExperience[selectedCategory].accent}</small><button type="button" onClick={() => openStore(stores.find((store) => store.category === selectedCategory) ?? stores[0])}>EXPLORAR {selectedCategory.toUpperCase()} <Arrow /></button></div>
                    <b>{categoryExperience[selectedCategory].glyph}</b>
                    <div className="home-hero-motion" aria-hidden="true"><i /><i /><i /></div>
                  </div>
                  <div className="app-section-title"><h3>¿QUÉ NECESITAS?</h3><span>VER TODO</span></div>
                  <div className="app-category-grid">{categories.map((category) => <button key={category.key} type="button" className={`app-category tone-${category.tone} ${selectedCategory === category.key ? 'is-active' : ''}`} onClick={() => setSelectedCategory(category.key)}><b>{category.symbol}</b><span>{category.title}</span></button>)}</div>
                  <div className="app-section-title"><h3>CERCA DE TI</h3><span>15–35 MIN</span></div>
                  <div className="home-store-grid">{stores.filter((store) => store.category === selectedCategory).map((store) => <button type="button" key={store.name} onClick={() => openStore(store)}><i className={`tone-${store.tone}`}>{store.symbol}</i><span><strong>{store.name}</strong><small>{store.descriptor}</small><em>★ {store.rating} · {store.eta}</em></span></button>)}</div>
                </div>
              )}

              {customerScreen === 'store' && (
                <div className="store-screen">
                  <div className={`store-cover tone-${prototypeStore.tone} store-cover-${prototypeStore.category}`} data-store={prototypeStore.name}><span>{prototypeStore.category.toUpperCase()} / LOCAL / RÁPIDO</span><strong>{prototypeStore.name}</strong><i>{prototypeStore.rating} ★</i><div className="store-cover-motion" aria-hidden="true"><b /><b /><b /></div></div>
                  <div className="store-content">
                    <div className="store-summary"><div><h2>{prototypeStore.name}</h2><p>{prototypeStore.descriptor}. Pedido mínimo simulado S/ 15.00.</p></div><span>{prototypeStore.eta}<br /><small>S/ 4.90 envío</small></span></div>
                    <div className="store-filter">{storeFilters.map((filter) => <button key={filter} className={storeFilter === filter ? 'is-active' : ''} type="button" onClick={() => setStoreFilter(filter)}>{filter === 'TODOS' ? 'DESTACADOS' : filter}</button>)}</div>
                    <div className="product-grid">{visibleStoreProducts.map((product) => <article key={product.id}><div className={`product-art tone-${product.tone}`}>{product.symbol}</div><div><h3>{product.name}</h3><p>{product.description}</p><strong>S/ {product.price.toFixed(2)}</strong></div><button type="button" onClick={() => addProduct(product.id)}>+</button></article>)}</div>
                  </div>
                  {cartCount > 0 && <button className="floating-cart" type="button" onClick={() => setCustomerScreen('cart')}><span>{cartCount} PRODUCTOS</span><strong>VER CARRITO · S/ {subtotal.toFixed(2)}</strong></button>}
                </div>
              )}

              {customerScreen === 'cart' && (
                <div className="checkout-layout">
                  <div className="checkout-main"><span>04 / CARRITO</span><h2>REVISA<br />TU PEDIDO.</h2><div className="cart-list">{allDemoProducts.filter((product) => cart[product.id]).map((product) => <article key={product.id}><i className={`tone-${product.tone}`}>{product.symbol}</i><div><strong>{product.name}</strong><small>S/ {product.price.toFixed(2)} c/u</small></div><div className="quantity-control"><button type="button" onClick={() => subtractProduct(product.id)}>−</button><b>{cart[product.id]}</b><button type="button" onClick={() => addProduct(product.id)}>+</button></div><span>S/ {(product.price * cart[product.id]).toFixed(2)}</span></article>)}</div><button className="add-more" type="button" onClick={() => setCustomerScreen('store')}>+ AGREGAR MÁS PRODUCTOS</button></div>
                  <OrderReceipt subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} discount={promoDiscount} promo={effectivePromo} total={total} action="CONTINUAR AL CHECKOUT" onAction={() => setCustomerScreen('checkout')} disabled={!cartCount} />
                </div>
              )}

              {customerScreen === 'checkout' && (
                <div className="checkout-layout">
                  <div className="checkout-main"><span>05 / CHECKOUT</span><h2>CONFIRMA<br />LOS DATOS.</h2><button className="checkout-option" type="button" onClick={() => setCustomerScreen('location')}><Pin /><span><small>DIRECCIÓN DE ENTREGA</small><strong>{address}</strong><em>Departamento 302 · Tocar timbre</em></span><b>EDITAR</b></button><button className="checkout-option" type="button" onClick={() => setCustomerScreen('payment')}><span className="payment-icon">▣</span><span><small>MÉTODO DE PAGO</small><strong>{payment === 'visa' ? 'Visa terminada en 4242' : payment === 'cash' ? 'Efectivo' : 'Billetera DA'}</strong><em>Pago completamente simulado</em></span><b>CAMBIAR</b></button><label className="checkout-note"><span>NOTA PARA EL REPARTIDOR</span><textarea placeholder="Ej. Dejar en recepción" /></label><label className="checkout-promo"><span>CUPÓN</span><input value={checkoutPromoInput} onChange={(event) => setCheckoutPromoInput(event.target.value)} placeholder="Código promocional" /><button type="button" onClick={applyCheckoutPromo}>APLICAR</button></label></div>
                  <OrderReceipt subtotal={subtotal} deliveryFee={deliveryFee} serviceFee={serviceFee} discount={promoDiscount} promo={effectivePromo} total={total} action="REVISAR PAGO" onAction={() => setCustomerScreen('payment')} />
                </div>
              )}

              {customerScreen === 'payment' && (
                <div className="payment-screen"><div><span>06 / PAGO SIMULADO</span><h2>ELIGE<br />CÓMO PAGAR.</h2><p>No se realiza ningún cobro. Esta pantalla define la futura experiencia de pago.</p></div><div className="payment-panel"><button type="button" className={payment === 'visa' ? 'is-active' : ''} onClick={() => setPayment('visa')}><i>VISA</i><span><strong>Tarjeta terminada en 4242</strong><small>Expira 12/29</small></span><b>●</b></button><button type="button" className={payment === 'wallet' ? 'is-active' : ''} onClick={() => setPayment('wallet')}><i>DA</i><span><strong>Billetera Deliver Assets</strong><small>Saldo demo S/ 180.00</small></span><b>●</b></button><button type="button" className={payment === 'cash' ? 'is-active' : ''} onClick={() => setPayment('cash')}><i>S/</i><span><strong>Pago en efectivo</strong><small>Indicar monto al repartidor</small></span><b>●</b></button><div className="payment-total"><span>TOTAL DEL PEDIDO</span><strong>S/ {total.toFixed(2)}</strong></div><button className="prototype-primary" type="button" onClick={() => setCustomerScreen('processing')}>CONFIRMAR PEDIDO DEMO <Arrow /></button><small className="simulation-warning">SIMULACIÓN: NO SE PROCESARÁ DINERO.</small></div></div>
              )}

              {customerScreen === 'processing' && <div className="processing-screen"><div className="processing-mark"><span /><span /><span /></div><p>CREANDO PEDIDO DEMO</p><h2>TODO<br />EN ORDEN.</h2><small>Validando comercio, repartidor y ruta simulada.</small></div>}

              {isCustomerService && (
                <CustomerAccountSuite
                  screen={customerScreen}
                  onNavigate={setCustomerScreen}
                  address={address}
                  onAddressChange={setAddress}
                  activePromo={activePromo}
                  onPromoToggle={(code) => setActivePromo((current) => current === code ? '' : code)}
                  notifications={customerNotifications}
                  onReadNotification={(id) => setCustomerNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item))}
                  onReadAll={() => setCustomerNotifications((current) => current.map((item) => ({ ...item, read: true })))}
                  supportMessages={supportMessages}
                  onSendSupport={sendSupportMessage}
                  settings={customerSettings}
                  onToggleSetting={(key) => setCustomerSettings((current) => ({ ...current, [key]: !current[key] }))}
                  onReorder={reorderDemo}
                  onNotify={notify}
                  onSignOut={closeSession}
                />
              )}

              {customerScreen === 'tracking' && (
                <div className="tracking-screen"><div className="tracking-map"><span className="city-road cr1" /><span className="city-road cr2" /><span className="city-road cr3" /><span className="city-road cr4" /><i className="tracking-store">B</i><i className="tracking-rider"><Bike /></i><i className="tracking-home">⌂</i><div className="tracking-route" /></div><div className="tracking-panel"><span>PEDIDO #DA-2408</span><h2>EN CAMINO.</h2><p>Alex recogió tu pedido y llegará aproximadamente en 12 minutos.</p><div className="rider-card"><i>A</i><span><strong>Alex R.</strong><small>Repartidor · 4.9 ★</small></span><button type="button" onClick={() => notify('Chat con el repartidor abierto en modo demo.')}>MENSAJE</button></div><div className="tracking-timeline"><i className="is-done"><b>✓</b><span>Pedido confirmado<small>10:42</small></span></i><i className="is-done"><b>✓</b><span>Comercio preparando<small>10:46</small></span></i><i className="is-active"><b>3</b><span>En camino<small>12 min</small></span></i><i><b>4</b><span>Entrega<small>Próximamente</small></span></i></div><button className="prototype-primary" type="button" onClick={() => setCustomerScreen('delivered')}>SIMULAR ENTREGA <Arrow /></button></div></div>
              )}

              {customerScreen === 'delivered' && (
                <div className="delivered-screen"><div className="delivered-badge">✓</div><span>PEDIDO ENTREGADO</span><h2>LLEGÓ.<br /><em>ASÍ DE SIMPLE.</em></h2><p>Califica la entrega para completar el flujo.</p><div className="rating-row">{[1,2,3,4,5].map((star) => <button key={star} type="button" className={rating >= star ? 'is-active' : ''} onClick={() => setRating(star)}>★</button>)}</div><button className="prototype-primary" type="button" onClick={resetCustomer}>VOLVER AL INICIO <Arrow /></button></div>
              )}

              {!['welcome', 'login', 'location', 'processing'].includes(customerScreen) && (
                <nav className="customer-bottom-nav" aria-label="Navegación del cliente">
                  <button type="button" className={customerScreen === 'home' || customerScreen === 'store' ? 'is-active' : ''} onClick={() => setCustomerScreen('home')}><i>⌂</i><span>INICIO</span></button>
                  <button type="button" className={customerScreen === 'orders' || customerScreen === 'orderdetail' || customerScreen === 'tracking' ? 'is-active' : ''} onClick={() => setCustomerScreen('orders')}><i>▤</i><span>PEDIDOS</span></button>
                  <button type="button" className={customerScreen === 'promotions' ? 'is-active' : ''} onClick={() => setCustomerScreen('promotions')}><i>%</i><span>PROMOS</span></button>
                  <button type="button" className={customerScreen === 'support' ? 'is-active' : ''} onClick={() => setCustomerScreen('support')}><i>?</i><span>AYUDA</span></button>
                  <button type="button" className={customerScreen === 'account' || customerScreen === 'settings' ? 'is-active' : ''} onClick={() => setCustomerScreen('account')}><i>EM</i><span>CUENTA</span></button>
                </nav>
              )}
            </section>
          </div>
        )}

        {session && !accessOpen && role === 'negocio' && (
          <div className="role-system-wrapper role-business">
            <div className="role-session-strip role-strip-dark">
              <span><i>N</i><strong>NEGOCIO</strong><small>{session.email}</small></span>
              <b>5 PERMISOS ACTIVOS</b>
              <button type="button" onClick={() => setAccessOpen(true)}>GESTIONAR ACCESO →</button>
            </div>
            <MerchantSuite />
          </div>
        )}

        {session && !accessOpen && role === 'repartidor' && (
          <div className="role-system-wrapper role-rider">
            <div className="role-session-strip role-strip-dark">
              <span><i>R</i><strong>REPARTIDOR</strong><small>{session.email}</small></span>
              <b>5 PERMISOS ACTIVOS</b>
              <button type="button" onClick={() => setAccessOpen(true)}>GESTIONAR ACCESO →</button>
            </div>
            <RiderSuite />
          </div>
        )}

        {session && !accessOpen && role === 'admin' && (
          <div className="role-system-wrapper role-admin">
            <div className="role-session-strip role-strip-admin">
              <span><i>A</i><strong>ADMINISTRACIÓN</strong><small>{session.email}</small></span>
              <b>5 PERMISOS CRÍTICOS</b>
              <button type="button" onClick={() => setAccessOpen(true)}>GESTIONAR ACCESO →</button>
            </div>
            <AdminPrototype />
          </div>
        )}
        <DemoToast message={feedback} onClose={() => setFeedback('')} />
      </div>
    </div>
  )
}

function OrderReceipt({ subtotal, deliveryFee, serviceFee, discount = 0, promo = '', total, action, onAction, disabled = false }: { subtotal: number; deliveryFee: number; serviceFee: number; discount?: number; promo?: string; total: number; action: string; onAction: () => void; disabled?: boolean }) {
  return <aside className="order-receipt"><span>RESUMEN DEL PEDIDO</span><div><p><span>Subtotal</span><b>S/ {subtotal.toFixed(2)}</b></p><p><span>Envío</span><b>S/ {deliveryFee.toFixed(2)}</b></p><p><span>Servicio</span><b>S/ {serviceFee.toFixed(2)}</b></p>{discount > 0 && <p className="checkout-discount"><span>Descuento {promo}</span><b>− S/ {discount.toFixed(2)}</b></p>}</div><p className="receipt-total"><span>TOTAL</span><strong>S/ {total.toFixed(2)}</strong></p><button className="prototype-primary" type="button" onClick={onAction} disabled={disabled}>{action} <Arrow /></button><small>Impuestos incluidos · Operación simulada</small></aside>
}


type PublicPage = 'coverage' | 'security' | 'faq' | 'contact' | 'terms' | 'privacy' | 'status' | 'notfound'
type SystemDemoState = 'empty' | 'offline' | 'error' | 'maintenance'

const publicPageTitles: Record<PublicPage, string> = {
  coverage: 'Cobertura',
  security: 'Seguridad',
  faq: 'Preguntas frecuentes',
  contact: 'Contacto',
  terms: 'Términos',
  privacy: 'Privacidad',
  status: 'Estado del sistema',
  notfound: 'Página no encontrada',
}

const faqItems = [
  ['PEDIDOS', '¿Cómo funciona un pedido?', 'Seleccionas una categoría, eliges un comercio, agregas productos, confirmas la dirección y completas un pago simulado. En producción, el pedido se enviaría al negocio y luego a un repartidor.'],
  ['PEDIDOS', '¿Puedo cancelar un pedido?', 'El prototipo contempla cancelación antes de determinados estados. La política real deberá definir ventanas, reembolsos, responsabilidad del comercio y compensación del repartidor.'],
  ['PAGOS', '¿Los pagos ya funcionan?', 'No. Todos los métodos y saldos son simulados. No se procesan tarjetas, transferencias ni dinero real.'],
  ['COMERCIOS', '¿Cómo se registra un negocio?', 'El panel incluye un flujo conceptual de identidad, datos fiscales, cuenta bancaria, catálogo y contrato comercial.'],
  ['REPARTIDORES', '¿Cómo se calculan las ganancias?', 'La interfaz muestra estimaciones por distancia, tiempo, demanda e incentivos. El modelo económico real deberá validarse antes del lanzamiento.'],
  ['SEGURIDAD', '¿Se guarda mi ubicación?', 'No en este prototipo. Una implementación real deberá solicitar consentimiento, limitar la retención y proteger los datos de ubicación.'],
  ['CUENTA', '¿Puedo cambiar de rol?', 'Sí. DELIVER ID exige abrir una sesión separada y muestra los permisos correspondientes antes de ingresar.'],
  ['COBERTURA', '¿En qué zonas opera?', 'La cobertura mostrada es conceptual y se concentra en distritos de Lima Central. No representa disponibilidad comercial real.'],
]

function PublicPortal({
  page,
  onClose,
  onOpenPage,
  onOpenDemo,
}: {
  page: PublicPage
  onClose: () => void
  onOpenPage: (page: PublicPage) => void
  onOpenDemo: () => void
}) {
  const [address, setAddress] = useState('')
  const [coverageChecked, setCoverageChecked] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [faqFilter, setFaqFilter] = useState('TODAS')
  const [contactSent, setContactSent] = useState(false)
  const [systemState, setSystemState] = useState<SystemDemoState>('empty')
  const [feedback, setFeedback] = useState('')
  const portalRef = useRef<HTMLDivElement>(null)
  const faqCategories = ['TODAS', 'PEDIDOS', 'PAGOS', 'COMERCIOS', 'REPARTIDORES', 'SEGURIDAD', 'CUENTA', 'COBERTURA']

  useEffect(() => {
    portalRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [page])

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2600)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const submitCoverage = (event: FormEvent) => {
    event.preventDefault()
    setCoverageChecked(true)
  }

  const submitContact = (event: FormEvent) => {
    event.preventDefault()
    setContactSent(true)
  }

  const renderLegalSections = (privacy = false) => {
    const items = privacy ? [
      ['1. Alcance', 'Esta página define una estructura conceptual para informar cómo DELIVER ASSETS podría tratar datos personales. Debe ser revisada y reemplazada por asesoría legal antes de operar.'],
      ['2. Datos considerados', 'Identidad, contacto, ubicación, pedidos, dispositivo, actividad de cuenta, pagos tokenizados, soporte y datos operativos asociados al rol.'],
      ['3. Finalidades', 'Crear cuentas, ejecutar pedidos, prevenir fraude, prestar soporte, liquidar operaciones, mejorar el servicio y cumplir obligaciones legales aplicables.'],
      ['4. Ubicación', 'La ubicación debe utilizarse con consentimiento, durante el tiempo estrictamente necesario y con controles diferenciados para clientes y repartidores.'],
      ['5. Conservación', 'Los plazos reales deben definirse por categoría de dato, finalidad, riesgo y obligación regulatoria.'],
      ['6. Derechos', 'La experiencia deberá permitir acceso, corrección, oposición, portabilidad y eliminación cuando corresponda.'],
      ['7. Seguridad', 'Se requieren cifrado, control de acceso, auditoría, gestión de incidentes y proveedores evaluados.'],
      ['8. Contacto', 'El canal de privacidad mostrado es conceptual: privacidad@deliverassets.demo.'],
    ] : [
      ['1. Naturaleza del servicio', 'DELIVER ASSETS se diseña como una plataforma tecnológica que conecta clientes, comercios y repartidores. Las responsabilidades contractuales deben definirse antes de operar.'],
      ['2. Cuentas y acceso', 'Cada usuario es responsable de proteger su cuenta. Los roles empresariales y administrativos requieren permisos y controles reforzados.'],
      ['3. Pedidos', 'Precios, disponibilidad, preparación, entrega, cancelación y reembolso deben mostrarse antes de confirmar una operación.'],
      ['4. Pagos', 'El prototipo no procesa dinero. Una versión real deberá usar proveedores autorizados, tokenización y conciliación.'],
      ['5. Comercios', 'Los comercios deberán mantener información, precios, inventario, permisos y condiciones sanitarias vigentes.'],
      ['6. Repartidores', 'Las reglas de seguridad, disponibilidad, ganancias y relación jurídica deben ajustarse a la legislación aplicable.'],
      ['7. Conducta', 'Se prohibirán fraude, abuso, discriminación, suplantación, manipulación de pedidos y uso indebido de la plataforma.'],
      ['8. Limitaciones', 'La versión actual es una demostración visual sin disponibilidad comercial, garantías operativas ni obligaciones de entrega.'],
    ]
    return items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)
  }

  return (
    <div className="public-portal" ref={portalRef}>
      <header className="public-header">
        <button type="button" className="public-brand" onClick={onClose}><BrandLogo compact /></button>
        <nav aria-label="Páginas públicas">
          <button type="button" className={page === 'coverage' ? 'is-active' : ''} onClick={() => onOpenPage('coverage')}>COBERTURA</button>
          <button type="button" className={page === 'security' ? 'is-active' : ''} onClick={() => onOpenPage('security')}>SEGURIDAD</button>
          <button type="button" className={page === 'faq' ? 'is-active' : ''} onClick={() => onOpenPage('faq')}>AYUDA</button>
          <button type="button" className={page === 'status' ? 'is-active' : ''} onClick={() => onOpenPage('status')}>ESTADO</button>
        </nav>
        <div className="public-header-actions">
          <button type="button" onClick={onOpenDemo}>ABRIR DEMO <ArrowUp /></button>
          <button type="button" onClick={onClose} aria-label="Cerrar página">×</button>
        </div>
      </header>

      <div className="public-page-label"><span>DELIVER ASSETS / PÁGINA PÚBLICA</span><strong>{publicPageTitles[page]}</strong></div>

      {page === 'coverage' && (
        <main className="coverage-page public-page">
          <section className="public-hero coverage-hero">
            <div><span>COBERTURA CONCEPTUAL</span><h1>LA CIUDAD,<br /><em>POR ZONAS.</em></h1><p>Diseñamos una operación gradual: primero densidad, luego expansión. Las áreas mostradas todavía no representan servicio disponible.</p></div>
            <form onSubmit={submitCoverage}>
              <label><span>REVISA UNA DIRECCIÓN</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Ej. Av. Arequipa 1480, Lima" required /></label>
              <button type="submit">COMPROBAR COBERTURA <Arrow /></button>
              {coverageChecked && <div className="coverage-result"><i>✓</i><span><strong>ZONA CONCEPTUAL IDENTIFICADA</strong><small>{address} · Miraflores / fase piloto simulada</small></span></div>}
            </form>
          </section>

          <section className="coverage-map-section">
            <div className="coverage-public-map">
              <span className="public-map-road pmr1" /><span className="public-map-road pmr2" /><span className="public-map-road pmr3" /><span className="public-map-road pmr4" />
              <i className="public-zone pz1"><b>MIRAFLORES</b><small>FASE 01</small></i>
              <i className="public-zone pz2"><b>SAN ISIDRO</b><small>FASE 01</small></i>
              <i className="public-zone pz3"><b>BARRANCO</b><small>FASE 02</small></i>
              <i className="public-zone pz4"><b>LINCE</b><small>FASE 02</small></i>
              <i className="public-zone pz5"><b>SURQUILLO</b><small>FASE 03</small></i>
              <div className="public-map-caption"><span>ÁREA DE ESTUDIO</span><strong>LIMA<br />CENTRAL.</strong></div>
            </div>
            <div className="coverage-zone-list">
              {[
                ['01','Miraflores','Piloto','Alta densidad comercial y rutas cortas.'],
                ['02','San Isidro','Piloto','Demanda corporativa y residencial.'],
                ['03','Barranco','Expansión','Operación nocturna y gastronómica.'],
                ['04','Lince','Expansión','Conectividad central y farmacia.'],
                ['05','Surquillo','Evaluación','Mercados, restaurantes y última milla.'],
              ].map(([number, zone, phase, detail]) => <article key={zone}><b>{number}</b><span><small>{phase}</small><strong>{zone}</strong><p>{detail}</p></span><i>↗</i></article>)}
            </div>
          </section>

          <section className="coverage-principles">
            <article><span>01</span><h3>DENSIDAD ANTES QUE TAMAÑO</h3><p>Una zona compacta permite mejores tiempos, disponibilidad de repartidores y costos controlados.</p></article>
            <article><span>02</span><h3>CAPACIDAD MEDIBLE</h3><p>La expansión debe depender de demanda, comercios, flota, soporte y seguridad.</p></article>
            <article><span>03</span><h3>APERTURA GRADUAL</h3><p>Las zonas pueden habilitarse por horarios, categorías o capacidad operativa.</p></article>
          </section>
        </main>
      )}

      {page === 'security' && (
        <main className="security-page public-page">
          <section className="public-hero security-hero">
            <div><span>SEGURIDAD POR DISEÑO</span><h1>CONFIANZA<br /><em>EN CADA PASO.</em></h1><p>La seguridad no será una pantalla aislada. Debe cubrir identidad, pedidos, pagos, ubicación, soporte y operación física.</p></div>
            <div className="security-seal"><i>DA</i><strong>TRUST<br />SYSTEM</strong><small>MODELO CONCEPTUAL V1.0</small></div>
          </section>

          <section className="security-pillars">
            {[
              ['ID','IDENTIDAD','Verificación diferenciada para clientes, negocios, repartidores y administradores.','yellow'],
              ['2FA','ACCESO','Sesiones, autenticación reforzada, dispositivos y permisos mínimos.','mint'],
              ['PAY','PAGOS','Tokenización, prevención de fraude y conciliación mediante proveedores autorizados.','blue'],
              ['GPS','UBICACIÓN','Consentimiento, uso limitado, controles de visibilidad y retención.','red'],
              ['OPS','OPERACIÓN','Protocolos de entrega, incidencias, soporte y evidencias auditables.','yellow'],
              ['DATA','DATOS','Cifrado, registros, proveedores evaluados y respuesta a incidentes.','mint'],
            ].map(([symbol,title,copy,tone]) => <article className={`tone-${tone}`} key={title}><i>{symbol}</i><h3>{title}</h3><p>{copy}</p><b>CONTROL REQUERIDO ↗</b></article>)}
          </section>

          <section className="security-flow">
            <div><span>MODELO DE RIESGO</span><h2>DETECTAR.<br />DECIDIR.<br /><em>RESPONDER.</em></h2></div>
            <ol>
              <li><b>01</b><span><strong>Señal</strong><p>Cuenta, dispositivo, ubicación, pago, conducta o incidencia.</p></span></li>
              <li><b>02</b><span><strong>Evaluación</strong><p>Reglas, riesgo acumulado y revisión humana cuando corresponda.</p></span></li>
              <li><b>03</b><span><strong>Acción</strong><p>Verificación adicional, límite, pausa, soporte o bloqueo controlado.</p></span></li>
              <li><b>04</b><span><strong>Auditoría</strong><p>Registro, revisión, apelación y mejora de controles.</p></span></li>
            </ol>
          </section>

          <section className="security-disclosure">
            <div><span>REPORTE RESPONSABLE</span><h3>¿ENCONTRASTE UN PROBLEMA?</h3><p>El canal real deberá definir alcance, cifrado, tiempos de respuesta y reglas de divulgación. Por ahora: security@deliverassets.demo.</p></div>
            <button type="button" onClick={() => onOpenPage('contact')}>CONTACTAR SEGURIDAD <Arrow /></button>
          </section>
        </main>
      )}

      {page === 'faq' && (
        <main className="faq-page public-page">
          <section className="public-hero faq-hero">
            <div><span>CENTRO DE AYUDA</span><h1>PREGUNTA.<br /><em>RESUELVE.</em></h1><p>Respuestas sobre el prototipo, los roles y lo que todavía falta implementar.</p></div>
            <button type="button" onClick={() => onOpenPage('contact')}>NO ENCUENTRO MI RESPUESTA <Arrow /></button>
          </section>

          <div className="faq-filter">
            {faqCategories.map((category) => <button key={category} type="button" className={faqFilter === category ? 'is-active' : ''} onClick={() => setFaqFilter(category)}>{category}</button>)}
          </div>

          <section className="faq-list">
            {faqItems.filter(([category]) => faqFilter === 'TODAS' || category === faqFilter).map(([category, question, answer], index) => {
              const originalIndex = faqItems.findIndex((item) => item[1] === question)
              return <article key={question} className={openFaq === originalIndex ? 'is-open' : ''}><button type="button" onClick={() => setOpenFaq(openFaq === originalIndex ? null : originalIndex)}><span><small>{category}</small><strong>{question}</strong></span><i>{openFaq === originalIndex ? '−' : '+'}</i></button><div><p>{answer}</p></div></article>
            })}
          </section>

          <section className="faq-contact-strip"><span>¿AÚN TIENES DUDAS?</span><strong>Habla con el equipo conceptual.</strong><button type="button" onClick={() => onOpenPage('contact')}>ABRIR CONTACTO →</button></section>
        </main>
      )}

      {page === 'contact' && (
        <main className="contact-page public-page">
          <section className="public-hero contact-hero">
            <div><span>CONTACTO</span><h1>HABLEMOS<br /><em>CLARO.</em></h1><p>Selecciona el tipo de consulta. El formulario es visual y no envía información a un servidor.</p></div>
            <div className="contact-direct"><span>CANALES CONCEPTUALES</span><strong>hola@deliverassets.demo</strong><strong>security@deliverassets.demo</strong><strong>privacidad@deliverassets.demo</strong></div>
          </section>

          <div className="contact-layout">
            <section className="contact-routing">
              <span>ELIGE UN CANAL</span>
              {[
                ['C','CLIENTES','Pedidos, pagos, cuenta y soporte.','yellow'],
                ['N','NEGOCIOS','Registro, catálogo y operación.','red'],
                ['R','REPARTIDORES','Documentos, entregas y ganancias.','blue'],
                ['A','EMPRESAS','Alianzas, integraciones y cobertura.','mint'],
              ].map(([symbol,title,copy,tone]) => <button key={title} type="button" className={`tone-${tone}`} onClick={() => setFeedback(`Canal seleccionado: ${title}`)}><i>{symbol}</i><span><strong>{title}</strong><small>{copy}</small></span><b>→</b></button>)}
            </section>

            <form className="contact-form" onSubmit={submitContact}>
              {contactSent ? (
                <div className="contact-success"><i>✓</i><span>MENSAJE SIMULADO</span><h2>RECIBIDO.</h2><p>La interfaz funciona. La integración con correo, CRM o sistema de tickets se implementará después.</p><button type="button" onClick={() => setContactSent(false)}>ENVIAR OTRO</button></div>
              ) : (
                <>
                  <span>FORMULARIO GENERAL</span>
                  <h2>CUÉNTANOS.</h2>
                  <div className="contact-form-row"><label><span>NOMBRE</span><input required placeholder="Tu nombre" /></label><label><span>CORREO</span><input type="email" required placeholder="tu@correo.com" /></label></div>
                  <label><span>TIPO DE CONSULTA</span><select defaultValue="producto"><option value="producto">Producto y demostración</option><option value="cliente">Soporte al cliente</option><option value="negocio">Registro de negocio</option><option value="rider">Repartidores</option><option value="seguridad">Seguridad o privacidad</option></select></label>
                  <label><span>MENSAJE</span><textarea required placeholder="Describe tu consulta..." /></label>
                  <label className="contact-consent"><input type="checkbox" required /><span>Entiendo que este formulario es conceptual y no debo ingresar datos sensibles.</span></label>
                  <button type="submit">ENVIAR MENSAJE <Arrow /></button>
                </>
              )}
            </form>
          </div>
        </main>
      )}

      {(page === 'terms' || page === 'privacy') && (
        <main className="legal-page public-page">
          <section className={`public-hero legal-hero ${page === 'privacy' ? 'privacy-hero' : ''}`}>
            <div><span>DOCUMENTO CONCEPTUAL · V1.0</span><h1>{page === 'privacy' ? <>PRIVACIDAD<br /><em>SIN LETRA PEQUEÑA.</em></> : <>REGLAS<br /><em>CLARAS.</em></>}</h1><p>Este contenido organiza los temas que deberán convertirse en documentos jurídicos reales antes del lanzamiento.</p></div>
            <div className="legal-meta"><span>ACTUALIZACIÓN</span><strong>10 JUL 2026</strong><small>NO ES ASESORÍA LEGAL</small></div>
          </section>
          <section className="legal-layout">
            <aside>
              <span>ÍNDICE</span>
              {Array.from({ length: 8 }, (_, index) => <a key={index} href={`#legal-${index + 1}`}>{String(index + 1).padStart(2, '0')}</a>)}
              <button type="button" onClick={() => onOpenPage(page === 'privacy' ? 'terms' : 'privacy')}>VER {page === 'privacy' ? 'TÉRMINOS' : 'PRIVACIDAD'} →</button>
            </aside>
            <div>{renderLegalSections(page === 'privacy').map((section, index) => <div id={`legal-${index + 1}`} key={index}>{section}</div>)}</div>
          </section>
          <section className="legal-warning"><strong>REVISIÓN OBLIGATORIA</strong><p>Antes de publicar, este material debe ser validado según jurisdicción, estructura empresarial, modelo laboral, pagos, protección al consumidor y tratamiento de datos.</p></section>
        </main>
      )}

      {page === 'status' && (
        <main className="status-page public-page">
          <section className="public-hero status-hero">
            <div><span>ESTADO DEL PROTOTIPO</span><h1>TODO<br /><em>EN CONTROL.</em></h1><p>Panel conceptual para comunicar disponibilidad, mantenimiento e incidentes de la futura plataforma.</p></div>
            <div className="status-global"><i /><span><strong>TODOS LOS SISTEMAS DEMO</strong><small>Operación visual disponible</small></span></div>
          </section>

          <section className="status-services">
            {[
              ['Aplicación cliente','Operativo','99.99%','mint'],
              ['Panel de negocios','Operativo','99.96%','mint'],
              ['Sistema de repartidores','Operativo','99.94%','mint'],
              ['Administración','Operativo','99.98%','mint'],
              ['Pagos','No implementado','0%','yellow'],
              ['Mapas y GPS','Simulado','0%','blue'],
            ].map(([service,state,uptime,tone]) => <article key={service}><i className={`tone-${tone}`} /><span><strong>{service}</strong><small>{state}</small></span><b>{uptime}</b></article>)}
          </section>

          <section className="system-state-lab">
            <div className="system-state-controls">
              <span>LABORATORIO DE ESTADOS</span>
              <h2>VACÍO.<br />ERROR.<br /><em>RECUPERACIÓN.</em></h2>
              <p>Estos estados evitan pantallas rotas cuando no hay datos, falla la conexión o existe mantenimiento.</p>
              <div>
                {(['empty','offline','error','maintenance'] as SystemDemoState[]).map((state) => <button key={state} type="button" className={systemState === state ? 'is-active' : ''} onClick={() => setSystemState(state)}>{state.toUpperCase()}</button>)}
              </div>
            </div>
            <div className={`system-state-preview state-${systemState}`}>
              {systemState === 'empty' && <><i>○</i><span>SIN RESULTADOS</span><h3>TODO DESPEJADO.</h3><p>No encontramos elementos para mostrar. Cambia los filtros o vuelve más tarde.</p><button type="button" onClick={() => setFeedback('Filtros limpiados.')}>LIMPIAR FILTROS</button></>}
              {systemState === 'offline' && <><i>⌁</i><span>SIN CONEXIÓN</span><h3>TE PERDIMOS<br />UN MOMENTO.</h3><p>Conservaremos el progreso local y volveremos a intentar la conexión.</p><button type="button" onClick={() => setFeedback('Conexión demo restablecida.')}>REINTENTAR</button></>}
              {systemState === 'error' && <><i>!</i><span>ERROR CONTROLADO</span><h3>ALGO NO<br />RESPONDIÓ.</h3><p>El incidente quedó identificado. No repitas pagos ni acciones sensibles.</p><button type="button" onClick={() => setFeedback('Regreso seguro simulado.')}>VOLVER A UN PUNTO SEGURO</button></>}
              {systemState === 'maintenance' && <><i>⌛</i><span>MANTENIMIENTO</span><h3>ESTAMOS<br />AJUSTANDO.</h3><p>La ventana de mantenimiento debe comunicar inicio, progreso y hora estimada.</p><button type="button" onClick={() => setFeedback('Sin actualizaciones reales: entorno local.')}>VER ACTUALIZACIONES</button></>}
            </div>
          </section>

          <section className="incident-history">
            <div><span>HISTORIAL DE INCIDENTES</span><h2>ÚLTIMOS 30 DÍAS</h2></div>
            <article><i className="tone-mint">✓</i><span><strong>Sin incidentes reales registrados</strong><small>La plataforma todavía no está desplegada públicamente.</small></span><b>OPERATIVO</b></article>
            <article><i className="tone-yellow">i</i><span><strong>Entorno de demostración</strong><small>Los estados y métricas de disponibilidad son únicamente visuales.</small></span><b>INFORMATIVO</b></article>
          </section>
        </main>
      )}

      {page === 'notfound' && (
        <main className="notfound-page public-page">
          <div className="notfound-code">404</div>
          <div className="notfound-copy"><span>RUTA NO ENCONTRADA</span><h1>ESTA ENTREGA<br /><em>NO LLEGÓ.</em></h1><p>La página solicitada no existe o cambió de dirección.</p><div><button type="button" onClick={onClose}>VOLVER AL INICIO <Arrow /></button><button type="button" onClick={() => onOpenPage('faq')}>ABRIR AYUDA</button></div></div>
          <div className="notfound-route"><i>A</i><span /><span /><span /><b>?</b></div>
        </main>
      )}

      <DemoToast message={feedback} onClose={() => setFeedback('')} />
      <footer className="public-footer">
        <BrandLogo />
        <div><button type="button" onClick={() => onOpenPage('coverage')}>COBERTURA</button><button type="button" onClick={() => onOpenPage('security')}>SEGURIDAD</button><button type="button" onClick={() => onOpenPage('faq')}>AYUDA</button><button type="button" onClick={() => onOpenPage('contact')}>CONTACTO</button></div>
        <div><button type="button" onClick={() => onOpenPage('terms')}>TÉRMINOS</button><button type="button" onClick={() => onOpenPage('privacy')}>PRIVACIDAD</button><button type="button" onClick={() => onOpenPage('status')}>ESTADO</button></div>
        <span>© {new Date().getFullYear()} · WEB V1.0</span>
      </footer>
    </div>
  )
}


function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('comida')
  const [selectedStore, setSelectedStore] = useState(0)
  const [cartItems, setCartItems] = useState(0)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle')
  const [prototypeOpen, setPrototypeOpen] = useState(false)
  const [publicPage, setPublicPage] = useState<PublicPage | null>(null)

  const visibleStores = useMemo(() => stores.filter((store) => store.category === activeCategory), [activeCategory])
  const currentStore = visibleStores[selectedStore] ?? visibleStores[0]
  const total = currentStore ? currentStore.price * cartItems : 0

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    )
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || prototypeOpen || publicPage ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, prototypeOpen, publicPage])

  useEffect(() => {
    if (orderStatus === 'confirmed') {
      const timer = window.setTimeout(() => setOrderStatus('assigned'), 1400)
      return () => window.clearTimeout(timer)
    }
    if (orderStatus === 'assigned') {
      const timer = window.setTimeout(() => setOrderStatus('arriving'), 1800)
      return () => window.clearTimeout(timer)
    }
    if (orderStatus === 'arriving') {
      const timer = window.setTimeout(() => setOrderStatus('delivered'), 2400)
      return () => window.clearTimeout(timer)
    }
  }, [orderStatus])

  const chooseCategory = (category: CategoryKey, scroll = false) => {
    setActiveCategory(category)
    setSelectedStore(0)
    setCartItems(0)
    setOrderStatus('idle')
    if (scroll) window.setTimeout(() => document.querySelector('#explorar')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const chooseStore = (index: number) => {
    setSelectedStore(index)
    setCartItems(0)
    setOrderStatus('idle')
  }

  const addItem = () => {
    if (orderStatus !== 'idle' && orderStatus !== 'cart') return
    setCartItems((amount) => amount + 1)
    setOrderStatus('cart')
  }

  const resetOrder = () => {
    setCartItems(0)
    setOrderStatus('idle')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="site">
      <header className="header">
        <a href="#inicio" className="header-brand"><BrandLogo compact /></a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <button type="button" onClick={() => setPublicPage('coverage')}>Cobertura</button>
          <button type="button" onClick={() => setPublicPage('security')}>Seguridad</button>
        </nav>
        <button type="button" className="header-action header-demo-button" onClick={() => setPrototypeOpen(true)}>ABRIR DEMO <span className="header-cart">LIVE</span> <ArrowUp /></button>
        <button className="menu-button" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(!menuOpen)}><Menu open={menuOpen} /></button>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}>
        {nav.map(([label, href], index) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
        ))}
        <a href="#registro" onClick={() => setMenuOpen(false)}><span>05</span>Únete al lanzamiento</a>
        <button type="button" onClick={() => { setMenuOpen(false); setPublicPage('coverage') }}><span>06</span>Cobertura</button>
        <button type="button" onClick={() => { setMenuOpen(false); setPublicPage('security') }}><span>07</span>Seguridad</button>
        <button type="button" onClick={() => { setMenuOpen(false); setPublicPage('faq') }}><span>08</span>Ayuda</button>
      </div>

      <main>
        <section className="hero hero-v13" id="inicio">
          <div className="hero-poster">
            <div className="hero-rule"><span /></div>
            <div className="hero-sequence-label"><b>00:01</b><span>DELIVERY / COMERCIO / CIUDAD</span></div>
            <div className="hero-logo-wrap"><MotionMark /></div>
            <div className="hero-copyline"><span>PIDE LO QUE QUIERAS.</span><span>MUÉVELO SIN VUELTAS.</span></div>
            <div className="hero-meta">
              <p>Una identidad en movimiento para conectar personas, comercios y repartidores en tiempo real.</p>
              <button className="poster-button" type="button" onClick={() => setPrototypeOpen(true)}>ENTRAR AL ECOSISTEMA <Arrow /></button>
            </div>
            <div className="hero-cut cut-a" aria-hidden="true" /><div className="hero-cut cut-b" aria-hidden="true" /><div className="hero-cut cut-c" aria-hidden="true" />
            <div className="hero-frame-word" aria-hidden="true"><span>PIDE</span><span>SIGUE</span><span>RECIBE</span></div>
          </div>

          <div className="hero-scene" aria-label="Concepto visual de una entrega en movimiento">
            <div className="scene-mask scene-mask-a" aria-hidden="true" /><div className="scene-mask scene-mask-b" aria-hidden="true" />
            <div className="scene-word word-fast">RÁPIDO</div><div className="scene-word word-live">EN VIVO</div>
            <div className="scene-copy-chips" aria-hidden="true"><span>01 PEDIDO</span><span>02 RUTA</span><span>03 ENTREGA</span></div>
            <div className="scene-route" aria-hidden="true"><span /><span /><span /></div>
            <div className="rider-figure" aria-hidden="true"><div className="rider-head" /><div className="rider-body"><span>DA</span></div><div className="rider-bike"><Bike /></div></div>
            <div className="phone-mini"><div className="phone-bar"><span>9:41</span><i /></div><p>Tu pedido</p><strong>EN CAMINO</strong><div className="mini-map"><span className="map-road r1" /><span className="map-road r2" /><b><Pin /></b></div><div className="eta"><span>12 min</span><small>tiempo estimado</small></div></div>
            <div className="scene-orbit" aria-hidden="true"><i /><i /><i /></div>
            <div className="scene-stamp">LIMA<br />2026</div>
          </div>
        </section>

        <div className="kinetic-strip" aria-hidden="true">
          <div><span>PIDE</span><i>●</i><span>SIGUE</span><i>●</i><span>RECIBE</span><i>●</i><span>REPITE</span><i>●</i><span>PIDE</span><i>●</i><span>SIGUE</span><i>●</i><span>RECIBE</span><i>●</i><span>REPITE</span></div>
        </div>

        <section className="manifesto reveal">
          <div className="manifesto-index">01 / QUÉ HACEMOS</div>
          <h1>NO ES SOLO<br />ENTREGAR.<br /><em>ES MOVER</em><br />LA CIUDAD.</h1>
          <p>Deliver Assets reúne pedidos, comercios y distribución de última milla bajo una experiencia visual directa, rápida y trazable.</p>
          <div className="manifesto-symbol" aria-hidden="true"><span /><span /><span /></div>
        </section>

        <section className="categories" aria-labelledby="categories-title">
          <div className="section-title reveal">
            <p>02 / CATEGORÍAS</p>
            <h2 id="categories-title">TODO CABE<br />EN EL MISMO<br /><span>RECORRIDO.</span></h2>
          </div>
          <div className="poster-grid">
            {categories.map((category) => (
              <button
                className={`service-poster service-${category.key} tone-${category.tone} reveal`}
                key={category.title}
                type="button"
                onClick={() => chooseCategory(category.key, true)}
                aria-label={`Explorar ${category.title.toLowerCase()}`}
              >
                <div className="service-top"><span>{category.index}</span><ArrowUp /></div>
                <div className="service-symbol" aria-hidden="true">{category.symbol}</div>
                <div className="service-motion" aria-hidden="true"><i /><i /><i /></div>
                <h3>{category.title}</h3>
                <p>{category.copy}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="product-lab" id="explorar" aria-labelledby="lab-title">
          <div className="lab-intro reveal">
            <p>03 / EXPERIENCIA INTERACTIVA</p>
            <h2 id="lab-title">ARMA UN<br /><span>PEDIDO.</span></h2>
            <p className="lab-copy">Prueba el flujo rápido aquí o abre el prototipo completo con cliente, negocio y repartidor.</p>
            <button className="lab-launch" type="button" onClick={() => setPrototypeOpen(true)}>ABRIR PROTOTIPO COMPLETO <ArrowUp /></button>
          </div>

          <div className="lab-shell reveal">
            <div className="lab-catalog">
              <div className="category-tabs" role="tablist" aria-label="Categorías de pedido">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category.key}
                    className={activeCategory === category.key ? 'is-active' : ''}
                    onClick={() => chooseCategory(category.key)}
                  >
                    <span>{category.symbol}</span>{category.title}
                  </button>
                ))}
              </div>

              <div className="store-list">
                {visibleStores.map((store, index) => (
                  <button
                    type="button"
                    className={`store-card store-${store.tone} ${selectedStore === index ? 'is-selected' : ''}`}
                    key={store.name}
                    onClick={() => chooseStore(index)}
                  >
                    <span className="store-mark">{store.symbol}</span>
                    <span className="store-info">
                      <strong>{store.name}</strong>
                      <small>{store.descriptor}</small>
                    </span>
                    <span className="store-meta"><b>★ {store.rating}</b><small>{store.eta}</small></span>
                  </button>
                ))}
              </div>

              <div className="selected-product">
                <div>
                  <span>PRODUCTO DESTACADO</span>
                  <h3>{currentStore.item}</h3>
                  <p>{currentStore.name} · entrega estimada {currentStore.eta.toLowerCase()}</p>
                </div>
                <div className="product-action">
                  <strong>S/ {currentStore.price.toFixed(2)}</strong>
                  <button type="button" onClick={addItem} disabled={!['idle', 'cart'].includes(orderStatus)}>AGREGAR +</button>
                </div>
              </div>
            </div>

            <div className="order-console">
              <div className="console-head">
                <span>DEMO / PEDIDO 0064</span>
                <span className={`live-dot ${orderStatus !== 'idle' ? 'is-live' : ''}`}>● {orderStatus === 'idle' ? 'LISTO' : 'EN VIVO'}</span>
              </div>

              <div className="demo-phone">
                <div className="demo-notch" />
                <div className="demo-screen-head"><span>9:41</span><b>DELIVER ASSETS</b><i>{cartItems}</i></div>
                <div className="demo-address"><Pin /><span><small>ENTREGAR EN</small><strong>Av. Arequipa 1480, Lima</strong></span></div>
                <div className={`demo-map status-${orderStatus}`}>
                  <span className="demo-road road-a" />
                  <span className="demo-road road-b" />
                  <span className="demo-road road-c" />
                  <i className="origin-dot">A</i>
                  <i className="rider-dot"><Bike /></i>
                  <i className="destination-dot">B</i>
                </div>
                <div className="tracking-copy">
                  <span>ESTADO ACTUAL</span>
                  <h3>{statusCopy[orderStatus].label}</h3>
                  <p>{statusCopy[orderStatus].detail}</p>
                </div>
                <div className="progress-track" aria-label={`Progreso ${statusCopy[orderStatus].step} de 5`}>
                  {[1, 2, 3, 4, 5].map((step) => <i key={step} className={statusCopy[orderStatus].step >= step ? 'is-done' : ''} />)}
                </div>
              </div>

              <div className="order-summary">
                <div><span>{currentStore.item}</span><b>× {cartItems}</b></div>
                <div><span>Envío</span><b>{cartItems ? 'S/ 4.90' : '—'}</b></div>
                <div className="order-total"><span>TOTAL</span><strong>{cartItems ? `S/ ${(total + 4.9).toFixed(2)}` : 'S/ 0.00'}</strong></div>
              </div>

              {orderStatus === 'cart' && <button className="confirm-order" type="button" onClick={() => setOrderStatus('confirmed')}>CONFIRMAR PEDIDO <Arrow /></button>}
              {orderStatus === 'idle' && <p className="console-hint">Agrega un producto para iniciar la simulación.</p>}
              {['confirmed', 'assigned', 'arriving'].includes(orderStatus) && <p className="console-hint pulse-copy">El estado cambia automáticamente.</p>}
              {orderStatus === 'delivered' && <button className="reset-order" type="button" onClick={resetOrder}>NUEVO PEDIDO ↻</button>}
            </div>
          </div>
        </section>

        <section className="process" id="como-funciona" aria-labelledby="process-title">
          <div className="process-head reveal">
            <p>04 / CÓMO FUNCIONA</p>
            <h2 id="process-title">TRES PASOS.<br />CERO RUIDO.</h2>
          </div>
          <div className="process-cards">
            {steps.map(([number, title, text], index) => (
              <article className={`process-card card-${index + 1} reveal`} key={number}>
                <span className="process-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="process-graphic" aria-hidden="true"><span /><span /><span /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="ecosystem" id="negocios">
          <div className="ecosystem-panel businesses reveal">
            <p>05 / NEGOCIOS</p>
            <h2>VENDE MÁS.<br />OPERA MEJOR.</h2>
            <p className="panel-copy">Recibe pedidos, administra disponibilidad y amplía cobertura sin construir una flota desde cero.</p>
            <a href="#registro">REGISTRAR NEGOCIO <Arrow /></a>
            <div className="bars" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          </div>
          <div className="ecosystem-panel riders" id="repartidores">
            <p>06 / REPARTIDORES</p>
            <h2>MUÉVETE.<br />ENTREGA.<br />AVANZA.</h2>
            <p className="panel-copy">Rutas claras, información previa y control sobre cada entrega aceptada.</p>
            <a href="#registro">QUIERO REPARTIR <Arrow /></a>
            <div className="route-poster" aria-hidden="true"><span className="route-dot d1" /><span className="route-dot d2" /><span className="route-dot d3" /><i className="route-segment s1" /><i className="route-segment s2" /></div>
          </div>
        </section>

        <section className="public-hub">
          <div className="public-hub-title reveal">
            <p>07 / CONFIANZA Y OPERACIÓN</p>
            <h2>MÁS QUE<br />UNA APP.<br /><span>UN SISTEMA.</span></h2>
            <p>La experiencia pública también debe explicar dónde opera, cómo protege a las personas y qué ocurre cuando algo falla.</p>
          </div>
          <div className="public-hub-grid">
            <button className="public-hub-card tone-yellow reveal" type="button" onClick={() => setPublicPage('coverage')}><span>01</span><i>⌖</i><h3>COBERTURA</h3><p>Zonas, fases y principios de expansión.</p><b>ABRIR MAPA →</b></button>
            <button className="public-hub-card tone-blue reveal" type="button" onClick={() => setPublicPage('security')}><span>02</span><i>✓</i><h3>SEGURIDAD</h3><p>Identidad, pagos, datos y operación física.</p><b>VER CONTROLES →</b></button>
            <button className="public-hub-card tone-mint reveal" type="button" onClick={() => setPublicPage('faq')}><span>03</span><i>?</i><h3>AYUDA</h3><p>Respuestas claras sobre el producto y sus límites.</p><b>CONSULTAR FAQ →</b></button>
            <button className="public-hub-card tone-red reveal" type="button" onClick={() => setPublicPage('status')}><span>04</span><i>●</i><h3>ESTADO</h3><p>Disponibilidad, errores y mantenimiento.</p><b>VER SISTEMAS →</b></button>
          </div>
        </section>

        <section className="signup" id="registro">
          <div className="signup-title reveal">
            <p>08 / PRIMERA ETAPA</p>
            <h2>ENTRA<br />ANTES<br />QUE TODOS.</h2>
          </div>
          <form className="signup-form reveal" onSubmit={submit}>
            {submitted ? (
              <div className="form-success">
                <span>✓</span>
                <h3>REGISTRO RECIBIDO.</h3>
                <p>La interfaz está lista. La conexión real con base de datos se implementará en la siguiente fase.</p>
                <button type="button" onClick={() => setSubmitted(false)}>VOLVER</button>
              </div>
            ) : (
              <>
                <label><span>CORREO</span><input type="email" required placeholder="tu@correo.com" /></label>
                <label><span>PERFIL</span><select defaultValue="usuario"><option value="usuario">Usuario</option><option value="negocio">Negocio</option><option value="repartidor">Repartidor</option></select></label>
                <button className="submit-button" type="submit">SOLICITAR ACCESO <ArrowUp /></button>
                <small>Formulario conceptual. Aún no guarda información.</small>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className="footer footer-v1">
        <BrandLogo />
        <div className="footer-copy"><p>Delivery y comercio local en movimiento.</p><span>ECOSISTEMA WEB · V1.1 QA</span></div>
        <div className="footer-links footer-public-links">
          <button type="button" onClick={() => setPublicPage('coverage')}>COBERTURA</button>
          <button type="button" onClick={() => setPublicPage('security')}>SEGURIDAD</button>
          <button type="button" onClick={() => setPublicPage('faq')}>AYUDA</button>
          <button type="button" onClick={() => setPublicPage('contact')}>CONTACTO</button>
        </div>
        <div className="footer-links footer-legal-links">
          <button type="button" onClick={() => setPublicPage('terms')}>TÉRMINOS</button>
          <button type="button" onClick={() => setPublicPage('privacy')}>PRIVACIDAD</button>
          <button type="button" onClick={() => setPublicPage('status')}>ESTADO</button>
          <button type="button" onClick={() => setPublicPage('notfound')}>404 DEMO</button>
        </div>
        <div className="footer-year">© {new Date().getFullYear()}</div>
      </footer>

      {publicPage && (
        <PublicPortal
          page={publicPage}
          onClose={() => setPublicPage(null)}
          onOpenPage={setPublicPage}
          onOpenDemo={() => { setPublicPage(null); setPrototypeOpen(true) }}
        />
      )}
      {prototypeOpen && <PrototypeModal open onClose={() => setPrototypeOpen(false)} />}
    </div>
  )
}

export default App
