# 🚤 All On Deck — Manual Completo de Operaciones y Plataforma para Propietarios

¡Bienvenido al manual oficial de administración de **All On Deck**! Este documento es la guía definitiva para operar, actualizar y mantener la plataforma web de All On Deck. Cubre todo lo que se puede gestionar tanto en la tienda pública como en el panel de control del propietario, junto con referencias técnicas de despliegue y videotutoriales.

---

## 📑 Tabla de Contenidos

1. [🌟 Descripción General de la Plataforma](#-descripción-general-de-la-plataforma)
2. [🔑 Acceso, Seguridad y Configuración Inicial](#-acceso-seguridad-y-configuración-inicial)
   - [Cómo Iniciar Sesión](#cómo-iniciar-sesión)
   - [Configuración Inicial de la Cuenta de Propietario](#configuración-inicial-de-la-cuenta-de-propietario)
   - [Transferencia de Propiedad](#transferencia-de-propiedad)
3. [🧭 Mapa Maestro de Navegación](#-mapa-maestro-de-navegación)
4. [📊 Panel Principal y Métricas de Rendimiento](#-panel-principal-y-métricas-de-rendimiento)
   - [Métricas Clave y Tarjetas de Resumen](#métricas-clave-y-tarjetas-de-resumen)
   - [Gráficos Visuales de Tendencias](#gráficos-visuales-de-tendencias)
   - [Personalización de Widgets del Panel](#personalización-de-widgets-del-panel)
5. [🛠️ Gestión de Servicios](#️-gestión-de-servicios)
   - [Añadir o Editar un Servicio](#añadir-o-editar-un-servicio)
   - [Reordenar y Activar Servicios](#reordenar-y-activar-servicios)
6. [📸 Galería de Proyectos y Embarcaciones Realizadas](#-galería-de-proyectos-y-embarcaciones-realizadas)
   - [Añadir una Embarcación Terminada](#añadir-una-embarcación-terminada)
   - [Categorización por Tipo de Servicio](#categorización-por-tipo-de-servicio)
   - [Reordenar y Eliminar Fotos de la Galería](#reordenar-y-eliminar-fotos-de-la-galería)
7. [🎨 Diseños: Colores de Espuma y Patrones de Fresado CNC](#-diseños-colores-de-espuma-y-patrones-de-fresado-cnc)
   - [Gestión de Muestras de Color de Espuma EVA](#gestión-de-muestras-de-color-de-espuma-eva)
   - [Gestión de Patrones de Fresado CNC](#gestión-de-patrones-de-fresado-cnc)
8. [🛍️ Catálogo de Productos y Tienda Online](#️-catálogo-de-productos-y-tienda-online)
   - [Exploración y Filtrado de Productos](#exploración-y-filtrado-de-productos)
   - [Añadir un Nuevo Producto (Paso a Paso)](#añadir-un-nuevo-producto-paso-a-paso)
   - [Gestión de Variantes (Tallas y Colores)](#gestión-de-variantes-tallas-y-colores)
   - [Umbrales de Inventario y Alertas de Stock Bajo](#umbrales-de-inventario-y-alertas-de-stock-bajo)
   - [Editar, Desactivar y Eliminar Productos](#editar-desactivar-y-eliminar-productos)
9. [📥 Importación Masiva de Inventario (CSV)](#-importación-masiva-de-inventario-csv)
   - [Formato del Archivo CSV](#formato-del-archivo-csv)
   - [Vista Previa y Aplicación de Cambios](#vista-previa-y-aplicación-de-cambios)
10. [🗂️ Categorías de Productos](#️-categorías-de-productos)
    - [Añadir y Editar Categorías](#añadir-y-editar-categorías)
    - [Orden de Aparición y Visibilidad](#orden-de-aparición-y-visibilidad)
11. [📦 Pedidos, Facturación y Envíos](#-pedidos-facturación-y-envíos)
    - [Seguimiento y Ciclo de Vida del Pedido](#seguimiento-y-ciclo-de-vida-del-pedido)
    - [Detalles del Pedido y Dirección de Entrega](#detalles-del-pedido-y-dirección-de-entrega)
    - [Verificación de Pagos con Stripe](#verificación-de-pagos-con-stripe)
    - [Agregar Números de Guía y Transportistas](#agregar-números-de-guía-y-transportistas)
    - [Cancelación de Pedidos y Devolución a Stock](#cancelación-de-pedidos-y-devolución-a-stock)
    - [Creación de Pedidos Manuales (Teléfono o En Persona)](#creación-de-pedidos-manuales-teléfono-o-en-persona)
    - [Importación de Pedidos desde Facturas (CSV / Excel)](#importación-de-pedidos-desde-facturas-csv--excel)
12. [👥 Clientes y Notas Privadas de CRM](#-clientes-y-notas-privadas-de-crm)
    - [Directorio de Clientes y Gasto Histórico](#directorio-de-clientes-y-gasto-histórico)
    - [Historial de Compras del Cliente](#historial-de-compras-del-cliente)
    - [Notas Privadas del Propietario por Cliente](#notas-privadas-del-propietario-por-cliente)
13. [⭐ Reseñas y Moderación de Productos](#-reseñas-y-moderación-de-productos)
    - [Filtros y Búsqueda de Reseñas](#filtros-y-búsqueda-de-reseñas)
    - [Ocultar vs. Eliminar Reseñas Inapropiadas](#ocultar-vs-eliminar-reseñas-inapropiadas)
14. [🏷️ Cupones y Descuentos Promocionales](#️-cupones-y-descuentos-promocionales)
    - [Crear un Código de Descuento](#crear-un-código-de-descuento)
    - [Configurar el Alcance del Descuento](#configurar-el-alcance-del-descuento)
    - [Fechas de Expiración y Límites de Uso](#fechas-de-expiración-y-límites-de-uso)
15. [✉️ Consultas y Solicitudes de Presupuesto](#️-consultas-y-solicitudes-de-presupuesto)
    - [Revisión de Solicitudes de Presupuesto Gratis](#revisión-de-solicitudes-de-presupuesto-gratis)
    - [Mensajes Generales de Contacto](#mensajes-generales-de-contacto)
    - [Seguimiento y Limpieza de Mensajes](#seguimiento-y-limpieza-de-mensajes)
16. [⚙️ Configuración de Tienda y del Sistema](#️-configuración-de-tienda-y-del-sistema)
    - [Texto de Entrega Estimada](#texto-de-entrega-estimada)
    - [Países Permitidos para Envíos](#países-permitidos-para-envíos)
    - [Opciones de Visualización de Tienda](#opciones-de-visualización-de-tienda)
    - [Filtros Visibles en el Catálogo](#filtros-visibles-en-el-catálogo)
    - [Herramienta de Limpieza de Archivos no Utilizados](#herramienta-de-limpieza-de-archivos-no-utilizados)
    - [Instrucciones para el Asistente Virtual IA](#instrucciones-para-el-asistente-virtual-ia)
17. [🎥 Videotutoriales y Demostraciones](#-videotutoriales-y-demostraciones)
18. [💻 Guía Rápida Técnica (Para Desarrolladores y Mantenimiento)](#-guía-rápida-técnica-para-desarrolladores-y-mantenimiento)
    - [Stack Tecnológico](#stack-tecnológico)
    - [Variables de Entorno](#variables-de-entorno)
    - [Ejecución en Entorno Local](#ejecución-en-entorno-local)
    - [Base de Datos y Migraciones](#base-de-datos-y-migraciones)
19. [📞 Contacto y Soporte Técnico](#-contacto-y-soporte-técnico)

---

<a id="-descripción-general-de-la-plataforma"></a>
## 🌟 Descripción General de la Plataforma

La plataforma web de **All On Deck** combina la presentación y cotización de pisos marinos personalizados con una tienda de comercio electrónico completamente integrada:

1. **La Web Pública y Tienda:**
   - **Presentación de Suelos Marinos:** Destaca el escaneo y diseño digital en CAD, la fabricación robotizada CNC y la instalación profesional de espuma EVA.
   - **Galería de Barcos:** Portafolio visual organizado por tipo de embarcación y servicio realizado.
   - **Muestrario de Materiales:** Catálogo interactivo de colores bicapa y patrones de corte antideslizantes.
   - **Solicitud de Presupuesto Gratis:** Formulario para captar clientes que solicita marca, modelo, eslora y detalles personalizados de la embarcación.
   - **Tienda Online:** Carrito de compras, selección de variantes (tallas/colores), cupones de descuento y pasarela de pago seguro con Stripe.
   - **Rastreador de Pedidos:** Sección de autoservicio para que los compradores verifiquen el estado de su envío con su correo y número de orden.

2. **El Panel de Control del Propietario (`/account/owner` y `/owner`):**
   - Centro de administración protegido por contraseña donde el propietario puede cambiar textos, subir fotos de barcos, actualizar colores de espuma, gestionar inventario, procesar pedidos, consultar notas de clientes, moderar reseñas y configurar la tienda sin necesidad de programar ni tocar código.

---

<a id="-acceso-seguridad-y-configuración-inicial"></a>
## 🔑 Acceso, Seguridad y Configuración Inicial

### Cómo Iniciar Sesión
1. Entra a la página web y haz clic en **Cuenta / Iniciar Sesión** (o ve directo a `/login?redirect=/account/owner`).
2. Ingresa tu **Correo Electrónico de Propietario y Contraseña**.
3. Al autenticarte, accederás directamente al **Panel de Propietario**.
4. Puedes volver a este panel en cualquier momento desde el botón en la barra superior o en `/account/owner`.

> [!NOTE]
> Las rutas de administración están protegidas a nivel de base de datos con políticas de seguridad RLS (*Row Level Security*) y protecciones de autenticación en la interfaz (`OwnerGuard`). Si un usuario no autorizado intenta entrar, será redirigido automáticamente a su cuenta pública.

### Configuración Inicial de la Cuenta de Propietario
En una instalación nueva o base de datos limpia:
1. Inicia la aplicación en local (`npm run dev`) o visita la web en `/setup`.
2. Completa tu nombre, correo electrónico y contraseña segura.
3. Haz clic en **Crear cuenta de propietario**.
4. Una vez creada la primera cuenta, la ruta `/setup` queda bloqueada permanentemente por seguridad.

### Transferencia de Propiedad
Si se requiere cambiar el correo electrónico del propietario principal:
1. El nuevo titular debe registrarse primero con su correo en la página web.
2. Desde el Editor SQL de Supabase, ejecuta el script [`002_transfer_owner.sql`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/supabase/migrations/002_transfer_owner.sql) indicando el nuevo correo.

---

<a id="-mapa-maestro-de-navegación"></a>
## 🧭 Mapa Maestro de Navegación

Todas las herramientas de administración están en el menú lateral del **Panel de Propietario** (o en la barra deslizable superior en dispositivos móviles):

```
+----------------------------------------------------------------------------------------------------+
|                                    MENÚ DEL PANEL DE CONTROL                                       |
+----------------------+-----------------------------------+-----------------------------------------+
| Enlace del Menú      | Ruta URL                          | Propósito Principal                     |
+----------------------+-----------------------------------+-----------------------------------------+
| 📊 Resumen           | /account/owner                    | Ventas, gráficas de tendencia y alertas |
| 📦 Pedidos           | /owner/orders                     | Despacho, guías de envío y facturas     |
| 🛍️ Productos         | /account/owner/products           | Artículos, variantes, precios y stock   |
| 👥 Clientes          | /account/owner/customers          | Directorio, gasto total y notas CRM     |
| ⭐ Reseñas           | /account/owner/reviews            | Moderar y ocultar opiniones de clientes |
| 🗂️ Categorías        | /account/owner/categories         | Organización de la tienda y enlaces     |
| 🏷️ Descuentos        | /account/owner/coupons            | Cupones promocionales y límites de uso  |
| ✉️ Contacto          | /account/owner/contact            | Solicitudes de presupuesto y mensajes   |
| 🎨 Diseños           | /account/owner/designs            | Muestras de color EVA y patrones CNC    |
| 🛠️ Servicios         | /account/owner/services           | Tarjetas de servicios y fotos de barcos |
| ⚙️ Ajustes Tienda    | /account/owner/settings           | Tiempos de envío, filtros y widgets     |
+----------------------+-----------------------------------+-----------------------------------------+
```

---

<a id="-panel-principal-y-métricas-de-rendimiento"></a>
## 📊 Panel Principal y Métricas de Rendimiento

**Ruta:** `/account/owner`  
**Vista Completa de Widgets:** `/account/owner/widgets`

El panel ofrece una visión instantánea del estado de tu negocio en tiempo real.

### Métricas Clave y Tarjetas de Resumen
- **Ingresos Totales:** Ganancias acumuladas de compras pagadas mediante Stripe.
- **Total de Pedidos:** Contador global de pedidos de la tienda online y manuales.
- **Catálogo de Productos:** Cantidad de artículos activos en la tienda de mercancía.
- **Alerta de Stock Bajo:** Indicador de alta prioridad que señala cuántos productos están en o por debajo de su umbral mínimo. Al hacer clic, te lleva directamente al inventario bajo.

### Gráficos Visuales de Tendencias
- **Tendencia de Ingresos (Últimos 14 días):** Evolución diaria de ventas en dólares.
- **Pedidos por Estado:** Gráfica de distribución entre pedidos *Pendientes*, *Pagados*, *En proceso*, *Enviados* y *Completados*.
- **Volumen de Pedidos (14 días):** Curva de actividad de compras.
- **Valor Promedio del Pedido (AOV):** Gasto medio por cliente en cada compra.
- **Pedidos por Día de la Semana:** Muestra cuáles son tus días de mayor demanda.
- **Productos Más Vendidos:** Lista de los productos más populares.
- **Lista de Alertas de Stock:** Listado directo de artículos que requieren reabastecimiento.

### Personalización de Widgets del Panel
Puedes elegir qué tarjetas y gráficas aparecen en tu pantalla principal:
1. Ve a **Ajustes de Tienda** (`/account/owner/settings`).
2. Baja hasta la sección **Widgets del panel de control**.
3. Activa o desactiva widgets (hasta 4 estadísticas, 4 gráficas y 2 listas).
4. Arrastra y suelta para organizar el orden según tu preferencia.
5. Haz clic en **Guardar ajustes**.

---

<a id="️-gestión-de-servicios"></a>
## 🛠️ Gestión de Servicios

**Ruta:** `/account/owner/services?tab=services`

Esta sección controla los servicios marinos destacados en la página principal y en `/services` (por ejemplo: *Custom Deck Designs*, *Floor Manufacturing*, *Cutting & Installation*).

### Añadir o Editar un Servicio
1. En el menú lateral, haz clic en **Servicios** y verifica que esté seleccionada la pestaña **Servicios**.
2. Haz clic en **Añadir Servicio** (o en el ícono del **lápiz** para editar uno existente).
3. Completa los campos:
   - **Título:** Nombre principal del servicio (ej. `Diseño Personalizado en CAD`).
   - **Título en Tarjeta:** Título breve que aparece sobre las imágenes destacadas (permite saltos de línea).
   - **Descripción:** Texto principal explicando el proceso y las ventajas.
   - **Descripción Secundaria:** Especificaciones técnicas adicionales o notas del material.
   - **Imagen Destacada:** Haz clic en **Subir imagen** para cargar una fotografía desde tu computadora.
   - **Texto del Botón:** Texto de la llamada a la acción (ej. `Ver Galería` o `Solicitar Presupuesto`).
   - **Enlace del Botón:** Destino del botón (ej. `/gallery?category=custom_deck_designs` o `/estimate`).
   - **Orden de Aparición:** Número que define su posición (1, 2, 3...).
   - **Estado Activo:** Marca la casilla para que sea visible públicamente en la web.
4. Haz clic en **Guardar Servicio**.

### Reordenar y Activar Servicios
- **Mover Arriba / Abajo:** Usa las flechas de dirección para cambiar el orden de los servicios de forma inmediata.
- **Ocultar / Mostrar:** Haz clic en el ícono del **ojo** para activar o pausar un servicio sin tener que borrarlo.
- **Eliminar:** Usa el ícono de la **papelera** para borrar un servicio definitivamente.

---

<a id="-galería-de-proyectos-y-embarcaciones-realizadas"></a>
## 📸 Galería de Proyectos y Embarcaciones Realizadas

**Ruta:** `/account/owner/services?tab=gallery` *(o `/gallery` en la web pública)*

El portafolio visual permite que los dueños de botes comprueben la calidad de tus cortes y terminaciones en diferentes esloras y modelos de embarcaciones.

### Añadir una Embarcación Terminada
1. Ve a **Servicios** y haz clic en la pestaña **Galería**.
2. Presiona **Añadir Imagen a Galería**.
3. Ingresa los datos del trabajo:
   - **Título:** ej. `Sea Ray 320 Sundancer — Teca y Negro Diamante`.
   - **Descripción:** Detalles de la instalación (ej. `Escaneo digital completo de bañera y plataforma de baño con pad de timonera personalizado`).
   - **Categoría de Servicio:** Selecciona a qué área pertenece:
     - `Custom Deck Designs` (Diseño CAD)
     - `Floor Manufacturing` (Fabricación Marina)
     - `Cutting & Installation` (Corte e Instalación)
   - **Foto del Trabajo:** Haz clic en **Subir imagen** y selecciona una foto nítida de alta resolución.
   - **Orden:** Define el número de prioridad en la lista.
4. Haz clic en **Guardar Imagen**.

### Categorización por Tipo de Servicio
Los visitantes pueden filtrar la galería pública por pestañas. Al asignar la categoría correcta, la foto se muestra automáticamente en el filtro correspondiente de `/gallery`.

### Reordenar y Eliminar Fotos de la Galería
- Usa los botones **Subir** y **Bajar** en cualquier foto para destacar tus mejores barcos al principio de la página.
- Haz clic en la **papelera** para remover una foto cuando lo desees.

---

<a id="-diseños-colores-de-espuma-y-patrones-de-fresado-cnc"></a>
## 🎨 Diseños: Colores de Espuma y Patrones de Fresado CNC

**Ruta:** `/account/owner/designs` *(o `/designs` en la web pública)*

Permite a tus clientes explorar la variedad de combinaciones bicapa de espuma EVA y las geometrías de corte antideslizante realizadas con fresadora CNC.

### Gestión de Muestras de Color de Espuma EVA
1. En el menú, haz clic en **Diseños** y elige la pestaña **Colores**.
2. Presiona **Añadir Muestra de Color** (o el ícono de editar).
3. Configura la muestra:
   - **Nombre del Color:** ej. `Camel / Negro`, `Gris Pizarra / Naranja`, `Teca / Blanco`.
   - **Código Hexadecimal (Opcional):** Código de color (ej. `#B58842`) para mostrar un círculo de referencia visual.
   - **Imagen de la Muestra:** Sube una fotografía en primer plano de la textura bicapa.
4. Presiona **Guardar Muestra**.

### Gestión de Patrones de Fresado CNC
1. Cambia a la pestaña **Patrones** en **Diseños**.
2. Presiona **Añadir Patrón** (o editar).
3. Completa los datos:
   - **Nombre del Patrón:** ej. `Tablas Clásicas Tipo Teca`, `Nido de Abeja Hexagonal`, `Puntada de Diamante`, `Escamas de Pez`.
   - **Imagen de Vista Previa:** Sube una foto o render CAD mostrando la profundidad y el patrón de las ranuras.
4. Haz clic en **Guardar Patrón**.
- Puedes borrar cualquier muestra o patrón descontinuado con el botón de **papelera**.

---

<a id="️-catálogo-de-productos-y-tienda-online"></a>
## 🛍️ Catálogo de Productos y Tienda Online

**Ruta:** `/account/owner/products`  
**Nuevo Producto:** `/account/owner/products/new`

Administra la venta de ropa oficial, gorras, kits de limpieza para cubiertas marinas y accesorios.

### Exploración y Filtrado de Productos
- **Filtrar por Categoría:** Encuentra artículos por departamento.
- **Filtrar por Destacados:** Consulta qué productos están en la portada de la tienda.
- **Filtro de Stock Bajo:** Marca la casilla **Solo stock bajo** para ver al instante lo que está a punto de agotarse.
- **Ordenar:** Organiza por *Más nuevos*, *Precio: menor a mayor*, *Precio: mayor a menor*, o *Stock: menor a mayor*.

### Añadir un Nuevo Producto (Paso a Paso)
1. Haz clic en **Añadir producto** (`/account/owner/products/new`).
2. Completa los datos principales:
   - **Nombre:** ej. `Sudadera Técnica Marina All On Deck`.
   - **Slug (URL):** Se genera automáticamente o puedes personalizarlo (ej. `sudadera-tecnica-marina`).
   - **Descripción:** Detalle completo (material resistente a UV, secado rápido, guía de lavado).
   - **Precio Base ($):** Precio regular de venta (ej. `49.99`).
   - **Precio de Comparación ($):** Precio original tachado para mostrar ofertas (ej. `65.00`).
   - **SKU:** Código de referencia único (ej. `AOD-SUD-001`).
   - **Cantidad en Stock:** Unidades disponibles para la venta.
   - **Umbral de Alerta de Stock Bajo:** Cantidad mínima antes de activar la advertencia (por defecto: `5`).
   - **Categorías:** Marca hasta 3 categorías correspondientes.
   - **Publicado:** Marca la casilla para que sea visible en la tienda. Desmárcala para guardarlo como borrador privado.
   - **Destacado:** Actívalo para fijarlo en la página de inicio.
   - **Imagen Principal:** Sube la fotografía del producto (tamaño máximo recomendado: 5 MB).

### Gestión de Variantes (Tallas y Colores)
Si el artículo tiene diferentes opciones (ej. tallas S, M, L o colores Azul y Gris):
1. En el formulario, baja a la sección **Variantes**.
2. Haz clic en **Añadir Variante**.
3. Define los atributos de cada opción:
   - **Nombre de la Variante:** ej. `Talla M - Azul Marino`.
   - **SKU de Variante:** ej. `AOD-SUD-AZ-M`.
   - **Precio y Precio Comparativo:** Puedes mantener el mismo precio base o diferenciarlo.
   - **Cantidad en Stock:** Unidades exclusivas para esa talla/color.
   - **Imagen de Variante:** Sube una foto específica del color seleccionado.
   - **Variante por Defecto:** Marca cuál es la opción que se cargará preseleccionada para el comprador.
4. Repite el proceso para cada opción.

### Umbrales de Inventario y Alertas de Stock Bajo
Cuando el stock de un producto o variante llega o baja de su **umbral de stock bajo**:
- El producto se resalta en la tabla del panel con una insignia de advertencia.
- Se refleja automáticamente en la tarjeta de **Alertas de Stock** del panel de control.

### Editar, Desactivar y Eliminar Productos
- **Editar:** Haz clic sobre el nombre del producto para actualizar precios, fotos o inventario.
- **Desactivar:** Desmarca la casilla **Publicado** y guarda. El producto desaparecerá de la web pública pero se mantendrá tu historial de ventas intacto.
- **Eliminar:** Abre el producto y haz clic en el botón rojo **Eliminar producto** (requiere confirmación).

---

<a id="-importación-masiva-de-inventario-csv"></a>
## 📥 Importación Masiva de Inventario (CSV)

**Ruta:** `/account/owner/products/import`

Ideal para cuando recibes un nuevo lote de mercancía de proveedores y deseas actualizar decenas de cantidades en segundos sin entrar producto por producto.

### Formato del Archivo CSV
Prepara un archivo en Excel guardado como formato `.csv` con dos columnas:

```csv
sku,quantity
AOD-SUD-AZ-M,25
AOD-SUD-AZ-L,30
AOD-GORRA-001,50
```

> [!TIP]
> El sistema reconoce encabezados habituales automáticamente: `sku`, `item_sku`, `name`, `product_name`, `qty`, `quantity`, `add_quantity`, `stock`.

### Vista Previa y Aplicación de Cambios
1. En la lista de productos, haz clic en **Importar stock desde CSV**.
2. Elige el archivo `.csv` desde tu dispositivo.
3. El sistema mostrará una **Vista Previa de Coincidencias**:
   - **Artículos Coincidentes:** Muestra el producto encontrado, su stock actual y la cantidad que se sumará o establecerá.
   - **Artículos No Encontrados:** Avisa si algún código SKU no existe en la base de datos.
4. Puedes modificar cualquier número directamente en la tabla antes de guardar.
5. Presiona **Aplicar actualización de stock** y el inventario se ajustará al instante.

---

<a id="️-categorías-de-productos"></a>
## 🗂️ Categorías de Productos

**Ruta:** `/account/owner/categories`  
**Nueva Categoría:** `/account/owner/categories/new`

Estructura el catálogo de tu tienda en secciones lógicas (ej. *Ropa Oficial*, *Gorras y Viseras*, *Accesorios Náuticos*, *Cuidado de Cubiertas*).

### Añadir y Editar Categorías
1. Haz clic en **Categorías** en el menú.
2. Selecciona **Añadir categoría**.
3. Rellena los datos:
   - **Nombre:** ej. `Limpieza y Cuidado Marino`.
   - **Slug:** Enlace amigable generado automáticamente (ej. `limpieza-cuidado-marino`).
   - **Descripción:** Breve resumen explicativo.
   - **Orden de Clasificación:** Número para organizar la posición en la lista (ej. `1`, `2`, `3`).
   - **Visible:** Permite mostrar u ocultar la categoría del menú público.
4. Presiona **Guardar categoría**.

---

<a id="-pedidos-facturación-y-envíos"></a>
## 📦 Pedidos, Facturación y Envíos

**Ruta:** `/owner/orders`  
**Pedido Manual:** `/owner/orders/create-manual`  
**Importar desde Factura:** `/owner/orders/from-invoice`

Gestiona todos los pedidos generados por la tienda online, llamadas telefónicas o ventas directas en el taller.

### Seguimiento y Ciclo de Vida del Pedido
Cada orden avanza de forma clara a través de diferentes etapas:

```
[ Pendiente ] ──▶ [ Pagado ] ──▶ [ En Proceso ] ──▶ [ Enviado ] ──▶ [ Completado ]
      │
      └───▶ [ Cancelado ] (Permite devolver los artículos al stock automáticamente)
      │
      └───▶ [ Reembolsado ]
```

- **Pendiente (Pending):** Pedido generado a la espera de confirmación de pago.
- **Pagado (Paid):** Pago completado con éxito mediante Stripe Checkout.
- **En Proceso (Processing):** Preparando el paquete o fabricando el pedido.
- **Enviado (Shipped):** Entregado a la empresa de transporte o correo.
- **Completado (Delivered):** Entregado satisfactoriamente al comprador.
- **Cancelado (Cancelled):** Pedido anulado.
- **Reembolsado (Refunded):** Dinero devuelto al cliente.

> [!NOTE]
> ¡Puedes cambiar el estado de cualquier orden directamente desde la tabla general usando el menú desplegable de cada fila!

### Detalles del Pedido y Dirección de Entrega
Al hacer clic en el número de orden (`#ID`), se abre la ficha completa (`/owner/orders/:id`):
- **Datos de Contacto:** Correo electrónico del cliente o invitado.
- **Dirección de Envío:** Calle, ciudad, estado, código postal, país y teléfono del destinatario.
- **Desglose de Artículos:** Tallas seleccionadas, cantidades y precio unitario.
- **Descuentos y Cupones:** Refleja el código promocional utilizado y el ahorro aplicado.
- **Liquidación Final:** Subtotal, Impuestos, Costo de Envío y Total Cobrado.

### Verificación de Pagos con Stripe
En las órdenes realizadas por la web, el sistema resalta una insignia verde: **"Pago recibido vía Stripe"** junto con el identificador oficial de la sesión de pago.

### Agregar Números de Guía y Transportistas
Cuando despaches el paquete:
1. Abre el detalle de la orden.
2. Cambia el estado a **Enviado** (*Shipped*).
3. El número de rastreo y la empresa de paquetería quedarán vinculados a la orden y visibles en la herramienta pública de consulta (`/lookup-order`).

### Cancelación de Pedidos y Devolución a Stock
Si un cliente cancela su pedido:
1. Cambia el estado a **Cancelado** y confirma el aviso.
2. Aparecerá el botón **"Devolver artículos al stock"**.
3. Al presionarlo, el sistema reincorpora automáticamente las unidades al inventario de la tienda sin necesidad de ajustes manuales.

### Creación de Pedidos Manuales (Teléfono o En Persona)
Si un cliente compra mercancía directamente en tu taller o solicita un envío por teléfono:
1. Entra a `/owner/orders/create-manual`.
2. Elige los productos del catálogo y ajusta cantidades y precios acordados.
3. Ingresa los datos del cliente y su dirección de entrega.
4. Haz clic en **Crear pedido**. El inventario se descuenta y el registro queda archivado.

### Importación de Pedidos desde Facturas (CSV / Excel)
Si utilizas un software de facturación externo o punto de venta:
1. Ve a `/owner/orders/from-invoice`.
2. Sube el archivo `.csv` o `.xlsx`.
3. El sistema detecta correos, nombres, artículos y cantidades para crear los pedidos en bloque.

---

<a id="-clientes-y-notas-privadas-de-crm"></a>
## 👥 Clientes y Notas Privadas de CRM

**Ruta:** `/account/owner/customers`  
**Perfil del Cliente:** `/account/owner/customers/:customerKey`

Un registro de clientes enfocado en fidelización y seguimiento de trabajos náuticos.

### Directorio de Clientes y Gasto Histórico
Organiza a todos los compradores registrados y recurrentes:
- Correo del cliente.
- Número total de compras realizadas.
- Dinero total invertido en All On Deck.
- Fecha del último pedido.

### Historial de Compras del Cliente
Al hacer clic en cualquier cliente se abre su historial completo con cada pedido, montos y enlaces a sus facturas.

### Notas Privadas del Propietario por Cliente
Cada ficha de cliente incluye un bloc de **Notas Privadas**:
- Anota la embarcación del cliente (ej. *Boston Whaler 280 Outrage año 2021*).
- Registra sus preferencias de color (*Gris sobre Negro con patrón Hexagonal*).
- Guarda acuerdos de llamadas o presupuestos futuros.
- Haz clic en **Guardar nota**. Estas anotaciones son estrictamente confidenciales y nunca son visibles para el cliente.

---

<a id="-reseñas-y-moderación-de-productos"></a>
## ⭐ Reseñas y Moderación de Productos

**Ruta:** `/account/owner/reviews`

Supervisa las valoraciones y comentarios de los clientes sobre los productos de la tienda.

### Filtros y Búsqueda de Reseñas
- **Por Producto:** Examina los comentarios de un artículo concreto.
- **Por Calificación:** Filtra desde 1 hasta 5 estrellas.
- **Rango de Fechas:** Últimos 7 días, 30 días, 90 días o histórico completo.
- **Búsqueda por Palabra Clave:** Encuentra opiniones por términos específicos.
- **Estado:** Alterna entre *Todas*, *Solo visibles* o *Solo ocultas*.

### Ocultar vs. Eliminar Reseñas Inapropiadas
- **Ocultar (Recomendado):** Haz clic en **Ocultar** en cualquier reseña con contenido inapropiado o spam. Desaparece de inmediato de la tienda pública pero queda archivada en tu panel por si necesitas consultarla.
- **Eliminar:** Borra la reseña permanentemente de la base de datos.

---

<a id="️-cupones-y-descuentos-promocionales"></a>
## 🏷️ Cupones y Descuentos Promocionales

**Ruta:** `/account/owner/coupons`  
**Nuevo Cupón:** `/account/owner/coupons/new`

Crea promociones para eventos náuticos, ferias (Boat Shows) o campañas en redes sociales.

### Crear un Código de Descuento
1. Ve a **Descuentos** en el menú.
2. Haz clic en **Crear cupón**.
3. Configura las condiciones:
   - **Código:** Texto que escribe el comprador (ej. `VERANO20`, `BOATSHOW50`, `BIENVENIDO10`).
   - **Tipo de Descuento:**
     - **Porcentaje (%):** Rebaja porcentual (ej. `20%`).
     - **Monto Fijo ($):** Descuento directo en dólares (ej. `$50.00`).
   - **Valor:** Número del descuento (ej. `20` o `50`).

### Configurar el Alcance del Descuento
Define en qué partes de la tienda aplica la oferta:
- **Todos los artículos:** Aplica a cualquier producto del catálogo.
- **Solo destacados:** Aplica a los artículos de portada.
- **Categorías específicas:** Aplica únicamente a los departamentos seleccionados.
- **Productos específicos:** Aplica solo a productos determinados.

### Fechas de Expiración y Límites de Uso
- **Fechas de Inicio y Término:** El cupón se activa y desactiva de manera automática en el calendario.
- **Límite de Usos:** Número máximo de veces que el cupón puede ser canjeado (ej. para los primeros 50 compradores).
- Presiona **Guardar cupón**.

---

<a id="️-consultas-y-solicitudes-de-presupuesto"></a>
## ✉️ Consultas y Solicitudes de Presupuesto

**Ruta:** `/account/owner/contact`

Bandeja unificada para la captación de nuevos proyectos de cubiertas de barcos.

### Revisión de Solicitudes de Presupuesto Gratis
Cada vez que un cliente llena el formulario en `/estimate`:
- La solicitud aparece destacada con una insignia naranja de **`ESTIMATE`**.
- Muestra:
  - Nombre completo, correo electrónico y número de teléfono del cliente.
  - Datos del barco: Marca, modelo, eslora y zonas deseadas (plataforma de baño, bañera, proa, timonera).
  - Fecha y hora exacta de recepción.

### Mensajes Generales de Contacto
Las preguntas generales provenientes de la página de contacto o del pie de página se listan con su asunto correspondiente.

### Seguimiento y Limpieza de Mensajes
- Haz clic sobre cualquier fila para desplegar el mensaje completo.
- Puedes contactar al cliente de inmediato por teléfono o correo para coordinar la toma de medidas digital en el barco.
- Una vez atendida la solicitud, haz clic en **Eliminar mensaje** para mantener la bandeja despejada.

---

<a id="️-configuración-de-tienda-y-del-sistema"></a>
## ⚙️ Configuración de Tienda y del Sistema

**Ruta:** `/account/owner/settings`

Ajustes globales para la logística de envíos, filtros visibles y mantenimiento del almacenamiento.

### Texto de Entrega Estimada
- **Tiempo de Entrega:** Define el plazo estimado que se muestra en fichas de producto y checkout (ej. `2 a 3 días hábiles` o `Despacho en 48 horas`).

### Países Permitidos para Envíos
- Selecciona qué países están habilitados en la lista desplegable durante el pago.
- Añade o remueve destinos según tu cobertura de paquetería (Estados Unidos, Canadá, Bahamas, etc.).

### Opciones de Visualización de Tienda
- **Mostrar Productos Agotados:**
  - *Activado:* Los artículos con stock en 0 siguen mostrándose con el rótulo "Agotado".
  - *Desactivado:* Los artículos sin existencias se ocultan de inmediato para mantener limpio el catálogo.
- **Días para 'Novedades':** Número de días durante los cuales un producto recién creado se considera nuevo en el filtro (por defecto: `30` días).
- **Colapso de Menús Laterales:** Define si los acordeones de filtros y categorías comienzan abiertos o cerrados en la tienda.

### Filtros Visibles en el Catálogo
Marca cuáles casillas de filtro deseas poner a disposición de los usuarios en la página `/products`:
- Rango de precio (`price`)
- En oferta (`sale`)
- Solo en stock (`in_stock`)
- Solo destacados (`featured`)
- Novedades (`new_arrivals`)
- Stock bajo (`low_stock`)
- Ofertas especiales (`deals`)

### Herramienta de Limpieza de Archivos no Utilizados
Con el paso del tiempo, cambiar fotos de productos o servicios puede dejar imágenes huérfanas en la nube:
- Presiona **Limpiar almacenamiento no utilizado** en la sección de **Mantenimiento**.
- El sistema revisa los archivos de Supabase Storage, identifica fotos que ya no están vinculadas a ningún producto activo y las elimina de forma segura para ahorrar espacio.

### Instrucciones para el Asistente Virtual IA
Espacio para definir pautas de atención o datos de la empresa para el asistente inteligente de la web.

---

<a id="-videotutoriales-y-demostraciones"></a>
## 🎥 Videotutoriales y Demostraciones

Los siguientes videos proporcionan demostraciones visuales de los flujos de administración:

| # | Tema del Tutorial | Descripción del Contenido | Enlace al Video |
|---|-------------------|---------------------------|-----------------|
| 1 | 🎬 **Visión General del Panel de Propietario** | Recorrido por el menú, métricas de venta y personalización de widgets. | _[Próximamente]_ |
| 2 | 🛠️ **Gestión de Servicios y Galería de Barcos** | Cómo modificar servicios, subir fotos de barcos y ordenarlas. | _[Próximamente]_ |
| 3 | 🎨 **Actualización de Colores de Espuma y Patrones** | Agregar nuevas muestras de color bicapa EVA y estilos de corte CNC. | _[Próximamente]_ |
| 4 | 🛍️ **Añadir Productos y Control de Inventario** | Creación de artículos, variantes (tallas/colores) e importación con CSV. | _[Próximamente]_ |
| 5 | 📦 **Despacho de Pedidos y Números de Guía** | Actualización de estados, comprobante de Stripe y números de rastreo. | _[Próximamente]_ |
| 6 | ✉️ **Revisión de Solicitudes de Presupuesto** | Cómo atender leads de cotización de cubiertas y datos del barco. | _[Próximamente]_ |
| 7 | ⚙️ **Ajustes de Tienda y Mantenimiento** | Configurar tiempos de entrega, países de envío y limpieza de fotos. | _[Próximamente]_ |
| 8 | 🚀 **Hoja de Ruta de Lanzamiento (Stripe y Envíos)** | Decisiones pendientes: activación de Stripe para depósitos y reglas de envío. | _[Próximamente]_ |

---

<a id="-guía-rápida-técnica-para-desarrolladores-y-mantenimiento"></a>
## 💻 Guía Rápida Técnica (Para Desarrolladores y Mantenimiento)

### Stack Tecnológico
- **Frontend:** React 18, TypeScript, Vite
- **Estilos e Iconos:** Tailwind CSS, Lucide Icons, Framer Motion
- **Base de Datos y Backend:** Supabase (PostgreSQL, Políticas RLS, Storage, Edge Functions)
- **Procesamiento de Pagos:** Stripe Checkout + Supabase Edge Functions (`create-checkout-session`, `stripe-webhook`)
- **Alojamiento y Despliegue:** Vercel

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Opcional (solo requerido si se utiliza Stripe Elements en el cliente):
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Ejecución en Entorno Local
1. Asegúrate de tener instalado [Node.js](https://nodejs.org) (v18 o superior).
2. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Base de Datos y Migraciones
Las migraciones de la base de datos se encuentran en [`supabase/migrations/`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/supabase/migrations):
- `001_schema.sql`: Esquema base (productos, categorías, ajustes, perfiles, carrito, pedidos, cupones, reseñas).
- `002_transfer_owner.sql`: Utilidad para transferir el rol de propietario a otro correo.
- `003_contact_requests_extra_fields.sql`: Campos de cotizaciones y teléfono.
- `004_product_variants.sql`: Variantes de talla, color y SKU.
- `005_variant_images.sql`: Asignación de imágenes a variantes.
- `006_designs_tables.sql`: Tablas de `design_colors` y `design_patterns`.
- `007_gallery_images.sql`: Portafolio de proyectos de barcos y etiquetas de servicio.
- `008_services.sql`: Servicios dinámicos, títulos para tarjetas y enlaces CTA.

Para aplicar migraciones mediante Supabase CLI:
```bash
supabase db push
```

Para consultar la configuración detallada de Stripe y Edge Functions, revisa [`PAYMENTS.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/PAYMENTS.md).  
Para los pasos de traspaso de cuentas al cliente, revisa [`TRANSITION.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/TRANSITION.md).  
Para la lista de tareas de lanzamiento y automatizaciones de correos, revisa [`PENDING_TASKS.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/PENDING_TASKS.md).  
Para los guiones de grabación de los videotutoriales, revisa [`LOOM_RECORDING_SCRIPTS.md`](file:///Users/leandro.alfonso/Documents/GitHub/allondeck-codebase/LOOM_RECORDING_SCRIPTS.md).

---

<a id="-contacto-y-soporte-técnico"></a>
## 📞 Contacto y Soporte Técnico

Para asistencia técnica, consultas de arquitectura o ampliación de funciones personalizadas, contacta con tu equipo de desarrollo:

- 📞 **Teléfono:** (561) 410-6673
- ✉️ **Correo:** [leandroalfonso14@gmail.com](mailto:leandroalfonso14@gmail.com)
- 🌐 **Repositorio del Proyecto:** [All On Deck Codebase](https://github.com/leandroalfonso/allondeck-codebase)
