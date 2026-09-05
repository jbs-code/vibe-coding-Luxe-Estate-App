# 🏢 Mejores Prácticas de Desarrollo en Next.js para Bienes Raíces (Luxe Estate)

Guía exhaustiva y estructurada de arquitectura, rendimiento, SEO, accesibilidad y funcionalidades especializadas para el desarrollo de aplicaciones web inmobiliarias de alto rendimiento con **Next.js (App Router)**.

---

## 📑 Tabla de Contenidos
1. [Arquitectura y Manejo de Rutas (App Router)](#1-arquitectura-y-manejo-de-rutas-app-router)
2. [Estrategia de Renderizado y Componentes (RSC vs Client)](#2-estrategia-de-renderizado-y-componentes-rsc-vs-client)
3. [SEO Técnico y Estructuración de Datos para Inmobiliarias](#3-seo-técnico-y-estructuración-de-datos-para-inmobiliarias)
4. [Accesibilidad Web (A11y) y UX Inclusiva](#4-accesibilidad-web-a11y-y-ux-inclusiva)
5. [Optimización de Rendimiento y Manejo de Medios Pesados](#5-optimización-de-rendimiento-y-manejo-de-medios-pesados)
6. [Búsqueda, Filtros y Sincronización de Estado en URL](#6-búsqueda-filtros-y-sincronización-de-estado-en-url)
7. [Integración de Mapas y Geolocalización](#7-integración-de-mapas-y-geolocalización)
8. [Captura de Leads, Formularios y Acciones del Servidor](#8-captura-de-leads-formularios-y-acciones-del-servidor)
9. [Ideas y Features de Alto Valor para Luxe Estate](#9-ideas-y-features-de-alto-valor-para-luxe-estate)

---

## 1. Arquitectura y Manejo de Rutas (App Router)

### 📌 Recomendaciones de Estructura de Carpetas
* **Rutas Semánticas y Amigables:**
  * `/propiedades`: Catálogo general con filtros.
  * `/propiedades/[slug]`: Ficha de detalle de propiedad (usar slugs legibles como `villa-nordic-paradise-los-angeles` en vez de solo IDs numéricos para mejorar SEO).
  * `/ubicaciones/[ciudad]/[zona]`: Landing pages dinámicas optimizadas para búsqueda local (ej: `/ubicaciones/madrid/barrio-salamanca`).
  * `/favoritos`: Colección guardada por el usuario (Client / LocalStorage o Supabase).
  * `/contacto` y `/agentes/[id]`: Perfiles de agentes y contacto directo.

* **Patrones Avanzados de Enrutamiento:**
  * **Parallel Routes (`@modal`):** Para abrir vistas previas rápidas de propiedades (Quick View) o galerías en modal sin perder la URL base y permitiendo compartir el enlace directo.
  * **Intercepting Routes (`(.)propiedades/[slug]`):** Abrir el modal de detalle al hacer clic desde la lista, pero renderizar la página completa en recarga o acceso directo por URL.
  * **Route Groups (`(marketing)`, `(dashboard)`):** Separar layouts sin alterar la jerarquía de URLs.

* **Manejo de Estados de Carga y Error:**
  * Crear siempre `loading.tsx` con *Skeleton Loaders* específicos para tarjetas inmobiliarias y mapas.
  * Implementar `error.tsx` y `not-found.tsx` personalizados con opciones para regresar al buscador principal o ver propiedades similares.

---

## 2. Estrategia de Renderizado y Componentes (RSC vs Client)

### 📌 Principio Rector: "Server Components por defecto, Client Components solo en las hojas"
* **React Server Components (RSC):**
  * Detalle de propiedad (`/propiedades/[slug]/page.tsx`): Fetch directo a Supabase o base de datos en el servidor sin exponer claves ni payloads innecesarios.
  * Listado inicial de propiedades destacadas en Home.
  * Generación de metadatos y JSON-LD.
  * Beneficio: Menor tamaño del bundle de JavaScript, LCP ultra rápido y renderizado HTML completo para bots.

* **Client Components (`"use client"`):**
  * Carruseles y galerías interactivas con gestos táctiles.
  * Barra de filtros interactiva (sliders de precio, selectores de amenidades).
  * Mapa interactivo con pines y clusters.
  * Botón de "Guardar en Favoritos" y calculadora de hipoteca en tiempo real.
  * Modales de agenda de visitas y cotizaciones.

* **Streaming con Suspense:**
  * Envolver secciones secundarias de la ficha de propiedad (ej. propiedades similares, cálculo de hipoteca, reseñas del barrio) en `<Suspense fallback={<SectionSkeleton />}>` para que el contenido principal aparezca al instante.

---

## 3. SEO Técnico y Estructuración de Datos para Inmobiliarias

### 📌 Metadata Dinámica y Social Sharing
* **Generación Dinámica con `generateMetadata`:**
  * Títulos descriptivos: `[Nombre Propiedad] - [Tipo: Casa/Villa/Depto] en [Ubicación] | Luxe Estate`.
  * Meta descripciones atractivas con precio, número de habitaciones y metros cuadrados.
  * OpenGraph y Twitter Cards dinámicas con la foto principal de la propiedad en alta resolución (1200x630px).

* **Structured Data (Schema.org / JSON-LD):**
  * Utilizar schemas específicos para Google Rich Results:
    * `RealEstateListing`: Para listados y ofertas.
    * `SingleFamilyResidence`, `Apartment` o `House`: Con atributos como `numberOfBedrooms`, `numberOfBathroomsTotal`, `floorSize`, `address`, `geo` (latitud/longitud), `offers` (`price`, `priceCurrency`).
    * `RealEstateAgent` / `LocalBusiness`: Para información de contacto de la agencia.
    * `BreadcrumbList`: Para migas de pan semánticas (`Home > Madrid > Salamanca > Villa Luxe`).

* **Sitemaps Dinámicos:**
  * Implementar `app/sitemap.ts` para indexar automáticamente todas las propiedades activas y páginas de zonas en tiempo de construcción/revalidación.
  * Archivo `app/robots.ts` para dirigir correctamente a los rastreadores.

---

## 4. Accesibilidad Web (A11y) y UX Inclusiva

### 📌 Estándares WCAG 2.1 AA para Sitios Inmobiliarios
* **Navegación por Teclado y Foco:**
  * Galerías y carruseles deben ser totalmente navegables con flechas (`ArrowLeft`, `ArrowRight`, `Escape` para cerrar pantalla completa).
  * Menús desplegables de filtros y selectores accesibles con foco visible (`focus-visible:ring-2`).
  * Enlaces de salto (*Skip to content*) al inicio de la página.

* **Contraste de Colores y Tipografía:**
  * Validar ratio de contraste mínimo 4.5:1 para texto normal y 3:1 para texto grande o elementos interactivos (ej. #19322F sobre #EEF6F6 tiene un ratio > 10:1, ideal).
  * Textos legibles sin depender exclusivamente de grosores ultra-delgados.

* **Semántica y Lectores de Pantalla (Screen Readers):**
  * Uso de etiquetas semánticas (`<main>`, `<nav>`, `<aside>`, `<article>` para cada tarjeta de propiedad).
  * Atributos `aria-label` descriptivos en botones de solo icono (ej. `aria-label="Guardar propiedad en favoritos"` o `aria-label="Compartir en WhatsApp"`).
  * Notificaciones en vivo con `aria-live="polite"` cuando los filtros se actualicen (ej. "Se encontraron 24 propiedades").
  * Textos alternativos (`alt`) enriquecidos para imágenes (ej: `"Fachada moderna con piscina infinita y vista al mar en Villa Nordic"` en vez de solo `"Foto 1"`).

---

## 5. Optimización de Rendimiento y Manejo de Medios Pesados

### 📌 Imágenes y Videos Inmobiliarios
* **Uso Riguroso de `next/image`:**
  * Configurar `sizes` responsivos adecuados para evitar descargar imágenes 4K en pantallas móviles:
    ```tsx
    <Image 
      src={property.heroImage}
      alt={property.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={isFirstCard} // Priority solo para la imagen Above-the-Fold (LCP)
      className="object-cover"
    />
    ```
  * Utilizar formatos modernos automáticos (**AVIF** y **WebP**) configurados en `next.config.ts`.
  * Efecto de carga progresivo con `placeholder="blur"` usando blurDataURL ligero generado en el servidor.

* **Galerías y Visores 360 / Virtual Tours:**
  * Cargar visores 360 (Matterport, Panorámicas Three.js) de forma diferida (*lazy loading*) mediante `next/dynamic` únicamente cuando el usuario interactúe o haga scroll a la sección.
  * Limitar la carga de miniaturas pesadas en el carrusel de detalle hasta que el usuario abra la galería completa.

---

## 6. Búsqueda, Filtros y Sincronización de Estado en URL

### 📌 URL como Única Fuente de la Verdad (Search Params)
* **Ventajas:** Enlaces compartibles, historial del navegador funcional, caché eficiente e indexabilidad de filtros comunes.
* **Implementación:**
  * Manejo con `useSearchParams` y `useRouter` con `scroll: false`.
  * **Debounce en búsqueda por texto:** 300-500ms antes de empujar cambios a la URL para evitar re-renderizados innecesarios.
  * Estructura de parámetros limpios:
    `?tipo=villa&precio_min=500000&precio_max=1500000&habitaciones=3&amenidades=piscina,jardin&orden=precio_asc`
* **Transiciones Fluidas:**
  * Usar `useTransition` de React para marcar las actualizaciones de lista como no bloqueantes, manteniendo la interfaz receptiva mientras se cargan los resultados.

---

## 7. Integración de Mapas y Geolocalización

### 📌 Mapas Interactivos (Mapbox / Leaflet / Google Maps)
* **Carga Dinámica:**
  * El componente de mapa debe cargarse con `next/dynamic({ ssr: false })` para evitar errores de hidratación y no inflar el bundle inicial.
* **Sincronización Bidireccional:**
  * Hover en una tarjeta de la lista -> Resalta el marcador correspondiente en el mapa.
  * Clic en un marcador del mapa -> Muestra un popup flotante / card preview y hace scroll suave a la tarjeta en la lista.
  * Búsqueda por polígono o "Buscar en esta área al mover el mapa" con debounce.
* **Clusterización de Marcadores:**
  * Agrupar cientos de propiedades en clusters numéricos a niveles de zoom lejanos para evitar caídas de FPS y sobrecarga en el DOM.

---

## 8. Captura de Leads, Formularios y Acciones del Servidor

### 📌 Server Actions y Validación Robusta
* **Manejo de Formularios con React 19 y Server Actions:**
  * Usar Server Actions para procesar solicitudes de visita o contacto directo sin crear endpoints de API manuales.
  * Validación de esquemas con **Zod** tanto en cliente como en servidor.
  * Manejo de estados de carga y feedback con `useActionState` y `useOptimistic`.
* **Disparadores de Conversión Rápida:**
  * Botón flotante "Contactar por WhatsApp" con mensaje pre-rellenado que incluye el título y link de la propiedad.
  * Botón "Agendar Visita" con selector de fecha/hora integrado.
  * Formulario de "Quiero que me llamen" con validación de teléfono en un solo clic.

---

## 9. Ideas y Features de Alto Valor para Luxe Estate

### 💡 Ideas de Diferenciación y Diseño Premium
1. **Calculadora Hipotecaria Interactiva:**
   * Sliders para enganche/pago inicial, plazo en años y tasa de interés con cálculo instantáneo de cuota mensual y desglose de amortización.
2. **Explorador de Puntos de Interés del Vecindario (Lifestyle Index):**
   * Pestaña en la ficha de detalle que muestre distancias a colegios, restaurantes de lujo, aeropuertos, campos de golf y playas.
3. **Modo Comparador de Propiedades:**
   * Barra flotante inferior para seleccionar hasta 3 propiedades y abrir una tabla comparativa de amenidades, m², precio por m² y ubicación.
4. **Filtros por "Estilo de Vida":**
   * Categorías seleccionables como *Frente al mar*, *Villas modernas*, *Áticos urbanos*, *Ecológico / Sustentable*, *Inversión rentable*.
5. **Generador de Ficha en PDF:**
   * Botón para descargar un dossier imprimible en PDF con el branding de Luxe Estate para clientes o inversionistas.
6. **Favoritos Offline / Sincronizados:**
   * Guardado rápido en `localStorage` con opción de sincronizar con cuenta de Supabase si el usuario inicia sesión.
