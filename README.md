# Asistente REBT

Herramienta web estática (HTML/CSS/JS, sin dependencias ni build) para el Reglamento electrotécnico para baja tensión (REBT), aprobado por el Real Decreto 842/2002, y sus instrucciones técnicas complementarias ITC-BT-01 a ITC-BT-52.

- Texto consolidado: BOE-A-2002-18099, última actualización 03/09/2025.
- ITC-BT-52 (recarga de vehículo eléctrico): añadida por el Real Decreto 1053/2014.

## Uso

- Abre `index.html` con doble clic en el navegador. No requiere instalación ni servidor.
- O activa GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Qué incluye

- **Cargas y cuadro** (ITC-BT-10, BT-17, BT-25):
  - Previsión de carga de un edificio destinado preferentemente a viviendas: viviendas por grado de electrificación y coeficiente de simultaneidad (tabla 1 BT-10), servicios generales, locales comerciales/oficinas (100 W/m², mín. 3.450 W), garajes (10/20 W/m²), recarga VE (3.680 W × 10 % plazas, factor 0,3 con SPL).
  - Intensidad de diseño, IGA (mín. 25 A, poder de corte ≥ 4.500 A), ICP por gama normalizada, número de diferenciales de 30 mA (uno por cada 5 circuitos).
- **Protecciones y tierra** (ITC-BT-24, BT-18):
  - Comprobación del corte automático: Zs × Ia ≤ U0 (TN), RA × Ia ≤ U (TT), 2 × Zs × Ia ≤ U (IT).
  - Tiempos máximos de interrupción (0,4 / 0,2 / 0,1 s), tensión límite 50 V (24 V en local conductor).
  - Secciones mínimas de conductores de tierra y de protección, equipotencialidad, resistencia de toma.
  - Calculadora de sección de conductor por caída de tensión (BT-19.2.2.2 / BT-25) y de resistencia de toma de tierra (BT-18).
- **Documental e inspecciones** (ITC-BT-04, BT-05):
  - Proyecto o memoria técnica de diseño según grupo y potencia (tabla BT-04.3.1).
  - Inspección inicial por OC, periódicas cada 5 años (y 10 años en comunes de viviendas > 100 kW), calificación y defectos.
- **Bañera y ducha** (ITC-BT-27): volúmenes 0 a 3, grados IP, MBTS y equipotencialidad.
- **Recarga VE** (ITC-BT-52): esquemas 1a a 4b, escalones de potencia (tablas 1 y 2), SPL, caídas y secciones, clase A.
- **Explorador de tablas e ITC**: índice de las 52 ITC y tablas con búsqueda.
- **Documentación**: checklist imprimible.
- **Normativa**: enlaces al texto consolidado y normas UNE citadas.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y formularios |
| `styles.css` | Estilos responsive e impresión |
| `data.js` | Tablas de ITC, catálogo de documentación y normas |
| `engine.js` | Motor de cálculo (BT-10, BT-04, BT-24, BT-52) |
| `app.js` | Interfaz, render y eventos |

## Ejemplo

Edificio de 10 viviendas con electrificación básica (5.750 W), sin tarifa nocturna, 80 m² de locales y 300 m² de garaje natural:

- Carga de viviendas: 5.750 × 8,5 = 48.875 W (tabla 1 BT-10).
- Locales: máx(100 × 80, 3.450) = 8.000 W.
- Garaje: máx(10 × 300, 3.450) = 3.450 W.
- Total: 60.325 W → I ≈ 87,7 A en trifásico 400 V.
- IGA: 100 A; ICP: no aplicable (> 63 A); diferenciales: según nº de circuitos.

## Aviso

Herramienta de apoyo técnico y didáctico. No sustituye al proyecto o memoria firmados por técnico competente, ni a la empresa instaladora habilitada, ni a la interpretación de la Administración competente o de la empresa distribuidora. Verifica siempre el texto consolidado vigente y la normativa autonómica aplicable.