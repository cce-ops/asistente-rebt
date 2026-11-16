/* =========================================================================
   data.js — REBT (RD 842/2002, texto consolidado) e ITC-BT
   Fuente: BOE-A-2002-18099 (última actualización 03/09/2025) y RD 1053/2014 (ITC-BT-52)
   ========================================================================= */

/* ---------- Índice de ITC (BT-01 a BT-52) ---------- */
const ITCS = [
  ["BT-01", "Terminología", "Definiciones del reglamento."],
  ["BT-02", "Normas de referencia en el REBT", "Lista de normas UNE/EN/IEC que se consideran conformes al reglamento (art. 26)."],
  ["BT-03", "Empresas instaladoras en baja tensión", "Habilitación, categorías (básica y especialista), obligaciones y seguro."],
  ["BT-04", "Documentación y puesta en servicio de las instalaciones", "Proyecto vs memoria técnica de diseño, tramitación, certificado de instalación."],
  ["BT-05", "Verificaciones e inspecciones", "Verificaciones previas (UNE 20.460-6-61), inspección inicial y periódicas por OC, defectos."],
  ["BT-06", "Redes aéreas para distribución en baja tensión", "Materiales, cálculo mecánico, ejecución e intensidades máximas."],
  ["BT-07", "Redes subterráneas para distribución en baja tensión", "Cables, ejecución e intensidades máximas admisibles."],
  ["BT-08", "Sistemas de conexión del neutro y de las masas", "Esquemas TN, TT e IT en redes de distribución."],
  ["BT-09", "Instalaciones de alumbrado exterior", "Acometidas, dimensionado, cuadros, redes, luminarias, puesta a tierra."],
  ["BT-10", "Previsión de cargas para suministros en BT", "Grados de electrificación, simultaneidad y cargas mínimas por edificio."],
  ["BT-11", "Redes de distribución. Acometidas", "Condiciones de las acometidas."],
  ["BT-12", "Instalaciones de enlace. Esquemas", "Esquemas de enlace entre red e instalación interior."],
  ["BT-13", "Instalaciones de enlace. Cajas generales de protección", "CGP y cajas de protección y medida."],
  ["BT-14", "Instalaciones de enlace. Línea general de alimentación", "LGA: definición, instalación y cables."],
  ["BT-15", "Instalaciones de enlace. Derivaciones individuales", "DI: definición, instalación y cables."],
  ["BT-16", "Instalaciones de enlace. Contadores", "Ubicación y sistemas de instalación; concentración de contadores."],
  ["BT-17", "Dispositivos generales e individuales de mando y protección. ICP", "Cuadros, IGA, diferenciales, PIA e interruptor de control de potencia."],
  ["BT-18", "Instalaciones de puesta a tierra", "Tomas, conductores, bornes, equipotencialidad y resistencia de tierra."],
  ["BT-19", "Instalaciones interiores. Prescripciones generales", "Conductores, caídas de tensión, intensidades admisibles, subdivisión."],
  ["BT-20", "Instalaciones interiores. Sistemas de instalación", "Sistemas de instalación y paso a través de elementos constructivos."],
  ["BT-21", "Instalaciones interiores. Tubos y canales protectoras", "Tubos y canales: materiales, colocación y diámetros."],
  ["BT-22", "Instalaciones interiores. Protección contra sobreintensidades", "Protección contra sobrecargas y cortocircuitos (UNE 20.460-4-43)."],
  ["BT-23", "Instalaciones interiores. Protección contra sobretensiones", "Categorías de sobretensiones y medidas de control."],
  ["BT-24", "Instalaciones interiores. Protección contra contactos", "Contactos directos e indirectos; corte automático; diferenciales."],
  ["BT-25", "Instalaciones interiores en viviendas. Circuitos", "Número de circuitos, secciones, caídas de tensión y puntos de utilización."],
  ["BT-26", "Instalaciones interiores en viviendas. Prescripciones generales", "Tensiones, esquema de conexión, cuadro, conductores, ejecución."],
  ["BT-27", "Instalaciones interiores en viviendas. Bañera o ducha", "Volúmenes 0 a 3 y grados de protección."],
  ["BT-28", "Instalaciones en locales de pública concurrencia", "Servicios de seguridad, alumbrado de emergencia y prescripciones generales."],
  ["BT-29", "Locales con riesgo de incendio o explosión", "Clasificación de emplazamientos y equipos (clases I, II, III)."],
  ["BT-30", "Instalaciones en locales de características especiales", "Húmedos, mojados, corrosión, polvo, temperaturas, baterías, servicio eléctrico."],
  ["BT-31", "Piscinas y fuentes", "Volúmenes y equipamiento en piscinas, pediluvios y fuentes."],
  ["BT-32", "Máquinas de elevación y transporte", "Ascensores y similares: protecciones, seccionamiento, aparamenta, tierra."],
  ["BT-33", "Instalaciones provisionales y temporales de obras", "Obra: seguridad, choques eléctricos, equipos y aparamenta."],
  ["BT-34", "Ferias y stands", "Protecciones, fuego, altas temperaturas, aparamenta y montaje."],
  ["BT-35", "Establecimientos agrícolas y hortícolas", "Requisitos generales de instalación."],
  ["BT-36", "Instalaciones a muy baja tensión", "MBTS y MBTP: requisitos generales y particulares."],
  ["BT-37", "Instalaciones a tensiones especiales", "Prescripciones particulares."],
  ["BT-38", "Quirófanos y salas de intervención", "Condiciones generales y de seguridad; receptores."],
  ["BT-39", "Cercas eléctricas para ganado", "Alimentación y prescripciones particulares."],
  ["BT-40", "Instalaciones generadoras de baja tensión", "Generadores para consumo propio: conexión, cables, protecciones, tierra."],
  ["BT-41", "Caravanas y parques de caravanas", "Condiciones generales de instalación."],
  ["BT-42", "Puertos y marinas para barcos de recreo", "Características generales, protecciones y equipos."],
  ["BT-43", "Instalación de receptores. Prescripciones generales", "Generalidades para receptores."],
  ["BT-44", "Receptores para alumbrado", "Luminarias, condiciones de instalación, MBT, rótulos luminosos."],
  ["BT-45", "Aparatos de caldeo", "Usos doméstico, comercial e industrial."],
  ["BT-46", "Cables y folios radiantes en viviendas", "Limitaciones, instalación, suelo/techo y control."],
  ["BT-47", "Motores", "Instalación, conductores, protecciones, arranque, herramientas portátiles."],
  ["BT-48", "Transformadores, reactancias, rectificadores, condensadores", "Condiciones generales y protección contra sobreintensidad."],
  ["BT-49", "Instalaciones eléctricas en muebles", "Prescripciones para instalaciones en muebles."],
  ["BT-50", "Locales que contienen radiadores para sauna", "Prescripciones según UNE 20.460-7-703."],
  ["BT-51", "Automatización, gestión técnica de la energía y seguridad en viviendas y edificios", "Sistemas KNX y análogos; alimentación MBTS/MBTP (ref. BT-25)."],
  ["BT-52", "Infraestructura para la recarga del vehículo eléctrico", "Esquemas, prevención de cargas, SAVE, modos de carga 1 a 4."]
];

/* ---------- Art. 4 REBT: clasificación de tensiones ---------- */
const ART4_TENSIONES = [
  ["Muy baja tensión", "Un ≤ 50 V", "Un ≤ 75 V"],
  ["Tensión usual", "50 < Un ≤ 500 V", "75 < Un ≤ 750 V"],
  ["Tensión especial", "500 < Un ≤ 1.000 V", "750 < Un ≤ 1.500 V"]
];

/* ---------- Art. 10 REBT: suministros complementarios ---------- */
const ART10_SUMINISTROS = [
  ["Socorro", "Mínimo equivalente al 15 % del total contratado para el suministro normal"],
  ["Reserva", "Mínimo del 25 % de la potencia total contratada para el normal; servicio restringido"],
  ["Duplicado", "Capaz de mantener un servicio mayor del 50 % de la potencia total contratada"]
];

/* ---------- BT-10 tabla 1: coeficiente de simultaneidad ---------- */
const TABLA_SIMULT = { 1: 1, 2: 2, 3: 3, 4: 3.8, 5: 4.6, 6: 5.4, 7: 6.2, 8: 7, 9: 7.8, 10: 8.5, 11: 9.2, 12: 9.9, 13: 10.6, 14: 11.3, 15: 11.9, 16: 12.5, 17: 13.1, 18: 13.7, 19: 14.3, 20: 14.8, 21: 15.3 };

/* ---------- BT-17: gama normalizada de ICP y potencias asociadas ---------- */
const ICP_GAMA = [1.5, 3, 3.5, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 63];
const ICP_POT = ICP_GAMA.map(i => ({
  icp: i,
  mono230: Math.round(230 * i),
  tri400: Math.round(Math.sqrt(3) * 400 * i)
}));

/* ---------- BT-25: circuitos de viviendas (tabla 1) ---------- */
const BT25_CIRCUITOS = [
  ["C1 Iluminación", "200", "0,75", "0,5", "Punto de luz", "10", "30", "1,5", "16"],
  ["C2 Tomas de uso general", "3.450", "0,2", "0,25", "Base 16 A 2p+T", "16", "20", "2,5", "20"],
  ["C3 Cocina y horno", "5.400", "0,5", "0,75", "Base 25 A 2p+T", "25", "2", "6", "25"],
  ["C4 Lavadora, lavavajillas y termo eléctrico", "3.450", "0,66", "0,75", "Base 16 A 2p+T", "20", "3", "4", "20"],
  ["C5 Baño y cuarto de cocina", "3.450", "0,4", "0,5", "Base 16 A 2p+T", "16", "6", "2,5", "20"],
  ["C8 Calefacción", "Máx. 5.750 W por circuito", "–", "–", "–", "25", "–", "6", "25"],
  ["C9 Aire acondicionado", "Máx. 5.750 W por circuito", "–", "–", "–", "25", "–", "6", "25"],
  ["C10 Secadora", "3.450", "1", "0,75", "Base 16 A 2p+T", "16", "1", "2,5", "20"],
  ["C11 Automatización (BT-51)", "Máx. 2.300 W por circuito", "–", "–", "–", "10", "–", "1,5", "16"],
  ["C13 Recarga VE (BT-52)", "Según BT-52", "1", "1", "Según BT-52", "Según BT-52", "3", "2,5", "20"]
];

/* ---------- BT-27: volúmenes de bañera/ducha ---------- */
const BT27_VOLUMENES = [
  ["Volumen 0", "IPX7", "Limitado al necesario para alimentar los aparatos fijos de este volumen", "No permitida", "Solo aparatos previstos para el volumen 0"],
  ["Volumen 1", "IPX4; IPX2 por encima del nivel más alto de difusor fijo; IPX5 en hidromasaje y baños comunes con chorros", "Limitado al necesario para alimentar los aparatos fijos de volúmenes 0 y 1", "No permitida, salvo interruptores MBTS 12 V ca / 30 V cc con fuente fuera de volúmenes 0, 1 y 2", "MBTS ≤ 12 V ca / 30 V cc; calentadores, bombas de ducha e hidromasaje con su norma y diferencial ≤ 30 mA"],
  ["Volumen 2", "IPX4; IPX2 por encima del nivel más alto de difusor fijo; IPX5 en baños comunes con chorros", "Limitado al necesario para alimentar los fijos de volúmenes 0, 1 y 2, y la parte del volumen 3 bajo la bañera o ducha", "No permitida, salvo interruptores o bases MBTS con fuente fuera de volúmenes 0, 1 y 2; bloques de afeitadora UNE-EN 60.742 / 61558-2-5", "Todos los del volumen 1; luminarias, ventiladores, calefactores con su norma y diferencial ≤ 30 mA"],
  ["Volumen 3", "IPX5 en baños comunes con chorros", "Limitado al necesario para alimentar los fijos de volúmenes 0, 1, 2 y 3", "Bases solo con transformador de aislamiento, MBTS o automático con diferencial ≤ 30 mA", "Aparatos solo con transformador de aislamiento, MBTS o diferencial ≤ 30 mA"]
];

/* ---------- BT-04: grupos que precisan proyecto ---------- */
const BT04_GRUPOS = [
  ["a", "Industrias, en general", "P > 20 kW"],
  ["b", "Locales húmedos, polvorientos o con riesgo de corrosión; bombas de extracción o elevación de agua", "P > 10 kW"],
  ["c", "Locales mojados; generadores y convertidores; conductores aislados para caldeo (excluidas viviendas)", "P > 10 kW"],
  ["d", "Temporal para maquinaria de obras en construcción; temporal en locales o emplazamientos abiertos", "P > 50 kW"],
  ["e", "Edificios destinados principalmente a viviendas, locales comerciales y oficinas, sin pública concurrencia", "P > 100 kW por caja general de protección"],
  ["f", "Viviendas unifamiliares", "P > 50 kW"],
  ["g", "Aparcamientos o estacionamientos que requieren ventilación forzada", "Cualquiera que sea su ocupación"],
  ["h", "Aparcamientos o estacionamientos con ventilación natural", "De más de 5 plazas"],
  ["i", "Locales de pública concurrencia", "Sin límite"],
  ["j", "Líneas BT con apoyos comunes con AT; máquinas de elevación y transporte; tensiones especiales; rótulos luminosos (salvo BT-44); cercas eléctricas; redes aéreas o subterráneas de distribución", "Sin límite de potencia"],
  ["k", "Alumbrado exterior", "P > 5 kW"],
  ["l", "Locales con riesgo de incendio o explosión, excepto aparcamientos", "Sin límite"],
  ["m", "Quirófanos y salas de intervención", "Sin límite"],
  ["n", "Piscinas y fuentes", "P > 5 kW"],
  ["z", "Infraestructuras para la recarga del vehículo eléctrico", "P > 50 kW; en exterior P > 10 kW; cualquier potencia si incluye modo de carga 4"]
];

/* ---------- BT-05: inspecciones ---------- */
const BT05_INICIAL = [
  "Instalaciones industriales que precisen proyecto, con potencia instalada superior a 100 kW",
  "Locales de pública concurrencia",
  "Locales con riesgo de incendio o explosión, de clase I, excepto aparcamientos de menos de 25 plazas",
  "Locales mojados con potencia instalada superior a 25 kW",
  "Piscinas con potencia instalada superior a 10 kW",
  "Quirófanos y salas de intervención",
  "Instalaciones de alumbrado exterior con potencia instalada superior a 5 kW",
  "Instalaciones de estaciones de recarga para vehículo eléctrico que requieran proyecto"
];

/* ---------- BT-18: secciones ---------- */
const BT18_TIERRA = [
  ["Protegido contra la corrosión", "Según apartado 3.4", "16 mm² cobre / 16 mm² acero galvanizado"],
  ["No protegido contra la corrosión", "25 mm² cobre", "50 mm² hierro"]
];
const BT18_PROTECCION = [
  ["S ≤ 16", "Sp = S"],
  ["16 < S ≤ 35", "Sp = 16"],
  ["S > 35", "Sp = S/2"]
];

/* ---------- BT-24: tiempos de interrupción ---------- */
const BT24_TIEMPOS = [
  ["230 V", "0,4 s"],
  ["400 V", "0,2 s"],
  ["> 400 V", "0,1 s"]
];

/* ---------- BT-52: tablas de escalones ---------- */
const BT52_TABLA1 = [
  ["230 V", "10 A", "2.300 W", "1"],
  ["230 V", "16 A", "3.680 W", "1"],
  ["230 V", "20 A", "4.600 W", "1"],
  ["230 V", "32 A", "7.360 W", "1"],
  ["230 V", "40 A", "9.200 W", "1"],
  ["230/400 V", "16 A", "11.085 W", "de 1 a 3"],
  ["230/400 V", "20 A", "13.856 W", "de 1 a 4"],
  ["230/400 V", "32 A", "22.170 W", "de 1 a 6"],
  ["230/400 V", "40 A", "27.713 W", "de 1 a 8"]
];
const BT52_TABLA2 = [
  ["230/400 V", "16 A", "11.085 W", "3"],
  ["230/400 V", "32 A", "22.170 W", "6"],
  ["230/400 V", "50 A", "34.641 W", "9"],
  ["230/400 V", "63 A", "43.647 W", "12"]
];

/* ---------- BT-28: pública concurrencia ---------- */
const BT28_APLICACION = [
  "Espectáculos y actividades recreativas: cualquier ocupación (cines, teatros, auditorios, estadios, pabellones, plazas de toros, hipódromos, parques de atracciones, salas de fiesta, discotecas, salas de juego de azar).",
  "Reunión, trabajo y usos sanitarios: cualquier ocupación en templos, museos, salas de congresos, casinos, hoteles, hostales, bares, cafeterías, restaurantes, zonas comunes de agrupaciones comerciales, aeropuertos, estaciones, estacionamientos cerrados y cubiertos para más de 5 vehículos, hospitales, ambulatorios, asilos y guarderías.",
  "Ocupación prevista superior a 50 personas: bibliotecas, centros de enseñanza, consultorios, establecimientos comerciales, oficinas con presencia de público, residencias de estudiantes, gimnasios, salas de exposiciones, centros culturales, clubes sociales y deportivos.",
  "Ocupación prevista: 1 persona por cada 0,8 m² de superficie útil, excepto pasillos, repartidores, vestíbulos y servicios.",
  "También locales en condiciones BD2, BD3 y BD4 según UNE 20.460-3 y cualquier otro con más de 100 personas."
];
const BT28_ALIMENTACION = [
  ["Sin corte", "Continua durante el periodo de transición"],
  ["Con corte muy breve", "Disponible en 0,15 s como máximo"],
  ["Con corte breve", "Disponible en 0,5 s como máximo"],
  ["Con corte mediano", "Disponible en 15 s como máximo"],
  ["Con corte largo", "Disponible en más de 15 s"]
];

/* ---------- Catálogo para el explorador de tablas ---------- */
const TABLAS = [
  { id: "art4", norma: "REBT · Art. 4", titulo: "Clasificación de tensiones",
    cab: ["Clase", "Corriente alterna (valor eficaz)", "Corriente continua (valor medio aritmético)"],
    filas: ART4_TENSIONES, notas: ["Frecuencia de red: 50 Hz. Tensiones usuales en CA: 230 V entre fases (trifásica de 3 conductores); 230 V fase-neutro y 400 V entre fases (trifásica de 4 conductores)."] },
  { id: "art10", norma: "REBT · Art. 10", titulo: "Suministros complementarios o de seguridad",
    cab: ["Tipo", "Potencia mínima"], filas: ART10_SUMINISTROS,
    notas: ["El suministro complementario complementa al normal a efectos de seguridad y continuidad: socorro, reserva o duplicado."] },
  { id: "bt10-simult", norma: "ITC-BT-10 · Tabla 1", titulo: "Coeficiente de simultaneidad según número de viviendas",
    cab: ["N.º viviendas (n)", "Coeficiente"],
    filas: Object.entries(TABLA_SIMULT).map(([n, c]) => [n, String(c)]).concat([["n > 21", "15,3 + (n − 21) · 0,5"]]),
    notas: ["Carga total de viviendas = potencia media prevista por vivienda × coeficiente de simultaneidad.",
      "Con tarifa nocturna, la simultaneidad es 1 (coeficiente = n.º de viviendas)."] },
  { id: "bt10-cargas", norma: "ITC-BT-10", titulo: "Cargas mínimas de previsión",
    cab: ["Concepto", "Valor mínimo"],
    filas: [
      ["Vivienda — electrificación básica", "5.750 W a 230 V"],
      ["Vivienda — electrificación elevada", "9.200 W a 230 V"],
      ["Locales comerciales u oficinas", "100 W/m² y planta; mínimo 3.450 W a 230 V; simultaneidad 1"],
      ["Edificios de concentración de industrias", "125 W/m² y planta; mínimo 10.350 W a 230 V; simultaneidad 1"],
      ["Garaje ventilación natural", "10 W/m² y planta; mínimo 3.450 W a 230 V; simultaneidad 1"],
      ["Garaje ventilación forzada", "20 W/m² y planta; mínimo 3.450 W a 230 V; simultaneidad 1"],
      ["Servicios generales del edificio", "Suma de potencias previstas, sin factor de reducción (simultaneidad = 1)"],
      ["Recarga VE en edificios (BT-52)", "3.680 W × 10 % de las plazas construidas; luego × factor de simultaneidad"]
    ],
    notas: ["Electrificación elevada: previsión superior a la básica, calefacción o A.A. previstas, superficie útil > 160 m², recarga VE en unifamiliar, o combinación.",
      "Suministros monofásicos: la distribuidora debe permitir cualquier receptor monofásico ≤ 5.750 W hasta 14.490 W a 230 V."] },
  { id: "bt17-cuadro", norma: "ITC-BT-17", titulo: "Cuadros y dispositivos generales e individuales",
    cab: ["Prescripción", "Valor"],
    filas: [
      ["Envolvente del cuadro", "UNE 20.451 y UNE-EN 60.439-3; IP30 (UNE 20.324) e IK07 (UNE-EN 50.102)"],
      ["Caja del ICP", "Inmediatamente antes de los demás dispositivos; compartimento independiente y precintable; modelo oficialmente aprobado"],
      ["Composición mínima del cuadro", "IGA de corte omnipolar (independiente del ICP) + interruptor diferencial general + PIA por circuito + protección contra sobretensiones si procede (BT-23)"],
      ["Poder de corte del IGA", "Suficiente para la intensidad de cortocircuito del punto; 4.500 A como mínimo"],
      ["Altura de colocación", "Viviendas: entre 1,4 y 2 m del suelo. Locales comerciales: mínimo 1 m"],
      ["Ubicación en viviendas", "Junto a la puerta de entrada; nunca en dormitorios, baños o aseos"],
      ["Selectividad de diferenciales en serie", "Aguas arriba: tipo S y ≥ 3 veces la intensidad del de aguas abajo; tiempo de no actuación mayor que el tiempo total de operación del de aguas abajo"]
    ],
    notas: ["Gama normalizada de ICP (UNE 20317 / condiciones de suministro): 1,5 · 3 · 3,5 · 5 · 7,5 · 10 · 15 · 20 · 25 · 30 · 35 · 40 · 45 · 50 · 63 A. Para suministros > 63 A: interruptores de intensidad regulable, maxímetros o integradores."] },
  { id: "bt19-caidas", norma: "ITC-BT-19 · 2.2.2", titulo: "Caídas de tensión admisibles",
    cab: ["Instalación", "Caída de tensión máxima"],
    filas: [
      ["Circuito interior de viviendas", "3 % de la tensión nominal"],
      ["Otras instalaciones interiores — alumbrado", "3 %"],
      ["Otras instalaciones interiores — resto de usos", "5 %"],
      ["Industrial alimentada directamente en AT (origen en salida del transformador)", "4,5 % alumbrado; 6,5 % resto de usos"],
      ["Circuito de recarga VE (BT-52)", "5 % desde el origen hasta el punto de recarga"]
    ],
    notas: ["Se calcula con todos los aparatos susceptibles de funcionar simultáneamente.",
      "La caída puede compensarse entre instalación interior y derivación individual, siendo la total inferior a la suma de los límites.",
      "Con armónicos o desequilibrios, la sección del neutro será como mínimo la de las fases, salvo justificación por cálculo."] },
  { id: "bt22-sobreint", norma: "ITC-BT-22", titulo: "Protección contra sobreintensidades",
    cab: ["Concepto", "Prescripción"],
    filas: [
      ["Protección contra sobrecargas", "La intensidad admisible del conductor ha de quedar garantizada por el dispositivo de protección (automático de corte omnipolar con curva térmica, o fusibles calibrados)"],
      ["Protección contra cortocircuitos", "Dispositivo en el origen de todo circuito, con capacidad de corte acorde a la intensidad de cortocircuito del punto; en circuitos derivados, un solo dispositivo general puede asegurar el cortocircuito de todos"],
      ["Norma de referencia", "UNE 20.460-4-43 (apartados 432 a 436)"]
    ],
    notas: ["Sobreintensidades motivadas por: sobrecargas, cortocircuitos y descargas atmosféricas."] },
  { id: "bt24-corte", norma: "ITC-BT-24 · 4.1", titulo: "Corte automático por contactos indirectos",
    cab: ["Esquema", "Condición", "Tiempo máximo (tabla 1, por U0)"],
    filas: [
      ["TN", "Zs × Ia ≤ U0", "230 V → 0,4 s · 400 V → 0,2 s · > 400 V → 0,1 s"],
      ["TT", "RA × Ia ≤ U (50 V; 24 V en local conductor)", "Idéntica tabla; dispositivos: diferencial-residual, o máxima corriente si RA muy baja"],
      ["IT", "2 × Zs × Ia ≤ U (neutro no distribuido) ó 2 × Zs′ × Ia ≤ U0 (neutro distribuido)", "Segunda defecto: igual tabla; hasta 5 s en casos especiales (UNE 20.460-4-41)"]
    ],
    notas: ["U0 = tensión nominal fase-tierra. Zs = impedancia de bucle de defecto. Ia = corriente que asegura el corte (o la diferencial-residual asignada).",
      "Tensión límite convencional: 50 V (24 V en alumbrado público, BT-09).",
      "En TN-C no se usarán diferenciales; en TN-C-S, no se usa CPN aguas abajo del diferencial (conexión a tierra aguas arriba).",
      "Protección complementaria contra contactos directos: diferencial-residual ≤ 30 mA. Clase A si hay corrientes diferenciales no senoidales."] },
  { id: "bt18-tierra", norma: "ITC-BT-18", titulo: "Puesta a tierra: secciones y resistencia",
    cab: ["Elemento", "Prescripción"],
    filas: [
      ["Conductores de tierra enterrados (tabla 1)", "Protegidos contra corrosión: según 3.4 / 16 mm² cobre o 16 mm² acero galvanizado. Sin proteger: 25 mm² cobre / 50 mm² hierro"],
      ["Conductor de protección (tabla 2)", "S ≤ 16 → Sp = S · 16 < S ≤ 35 → Sp = 16 · S > 35 → Sp = S/2 (mismo material; si no, conductividad equivalente)"],
      ["Mínimos de conductor de protección", "Cobre ≥ 2,5 mm² con protección mecánica; ≥ 4 mm² sin ella"],
      ["Equipotencialidad principal", "≥ mitad de la sección del conductor de protección mayor, mínimo 6 mm² (2,5 mm² si es cobre)"],
      ["Enterramiento", "Profundidad nunca inferior a 0,50 m"],
      ["Resistencia de la toma", "Que ninguna masa supere 24 V (local conductor) o 50 V (resto) de tensión de contacto; si no, corte rápido por dispositivos adecuados"],
      ["CPN (PEN)", "Combinación protección+neutro solo en TN con sección ≥ 10 mm² cobre/aluminio y sin diferencial en la parte común; CPN concéntrico mínimo 4 mm² cobre con conexiones duplicadas"]
    ],
    notas: ["Ningún aparato se intercalará en el conductor de protección. Las canalizaciones metálicas de otros servicios no se usarán como tomas de tierra."] },
  { id: "bt25-circuitos", norma: "ITC-BT-25 · Tabla 1", titulo: "Características eléctricas de los circuitos de viviendas",
    cab: ["Circuito", "Potencia prevista por toma (W)", "Fs", "Fu", "Tipo de toma", "Automático (A)", "Máx. puntos por circuito", "Sección mínima (mm²)", "Tubo (mm)"],
    filas: BT25_CIRCUITOS,
    notas: ["Tensión de referencia 230 V fase-neutro. Sección mínima según instalación de dos conductores y tierra con aislamiento PVC bajo tubo empotrado (BT-19 tabla 1); otras condiciones pueden exigir más sección.",
      "C4: cada toma individual puede salirse de 2,5 mm² desde caja de derivación del circuito de 4 mm².",
      "C8/C9: potencia máxima permisible por circuito 5.750 W. C11: máximo 2.300 W. C13: según ITC-BT-52.",
      "Intensidad prevista por circuito: I = n × Ia × Fs × Fu.",
      "Diferencial: como mínimo uno de 30 mA por cada cinco circuitos instalados; C13 con diferencial exclusivo según BT-52.",
      "Automáticos y fusibles no necesarios en C4 si cada aparato tiene circuito independiente con automático de 16 A (no pasa a electrificación elevada ni exige diferencial adicional)."] },
  { id: "bt27-volumenes", norma: "ITC-BT-27 · Tabla 1", titulo: "Grados de protección por volumen (bañera y ducha)",
    cab: ["Volumen", "Cableado", "Mecanismos", "Bases de toma", "Otros aparatos fijos"],
    filas: BT27_VOLUMENES,
    notas: ["Volumen 0: interior de bañera/ducha. Volumen 1: desde el nivel más alto del volumen 0 hasta 2,25 m. Volumen 2: 0,60 m alrededor del volumen 1. Volumen 3: entre el plano superior del volumen 2 y 2,25 m (hasta 3 m si el techo es más bajo).",
      "MBTS según UNE 20.460-4-41 y BT-36 admite como protección contra contactos directos e indirectos a la vez."] },
  { id: "bt28-pc", norma: "ITC-BT-28", titulo: "Locales de pública concurrencia: aplicación y alimentación",
    cab: ["Aspecto", "Prescripción"],
    filas: [
      ["Ocupación de referencia", "1 persona por cada 0,8 m² de superficie útil, excepto pasillos, repartidores, vestíbulos y servicios"],
      ["Alimentación de servicios de seguridad", "Según reglamentación específica; automática o no automática"],
      ["Categorías de alimentación automática", "Sin corte · Corte muy breve ≤ 0,15 s · Corte breve ≤ 0,5 s · Corte mediano ≤ 15 s · Corte largo > 15 s"],
      ["Fuentes admisibles", "Baterías de acumuladores (las de arranque de vehículos no satisfacen en general), generadores independientes, derivaciones separadas efectivamente independientes"],
      ["Protección contra incendio", "Equipos y materiales con resistencia al fuego adecuada; preferentemente protecciones sin corte al primer defecto; en IT, controlador permanente de aislamiento"]
    ],
    notas: ["También se aplica a locales BD2, BD3 y BD4 (UNE 20.460-3) y a cualquier local con más de 100 personas de ocupación prevista."] },
  { id: "bt04-proyecto", norma: "ITC-BT-04 · 3.1", titulo: "Instalaciones que precisan proyecto",
    cab: ["Grupo", "Tipo de instalación", "Límite"],
    filas: BT04_GRUPOS,
    notas: ["P = potencia prevista según ITC-BT-10. Si la instalación está en más de un grupo, se aplica el más exigente.",
      "Ampliaciones y modificaciones: proyecto si superan los límites, si son de importancia, o si en la ampliación se supera el 50 % de la potencia prevista en proyecto anterior.",
      "Todas las demás instalaciones nuevas, ampliaciones o modificaciones: memoria técnica de diseño (BT-04.4)."] },
  { id: "bt05-inspeccion", norma: "ITC-BT-05", titulo: "Inspecciones iniciales y periódicas",
    cab: ["Tipo", "Sujetas", "Periodo / plazo"],
    filas: [
      ["Inicial (antes de la puesta en servicio, por OC)", BT05_INICIAL.join("; "), "Una vez"],
      ["Periódica", "Instalaciones que precisaron inspección inicial", "Cada 5 años"],
      ["Periódica", "Comunes de edificios de viviendas con potencia total instalada > 100 kW", "Cada 10 años"]
    ],
    notas: ["Verificaciones previas a la puesta en servicio por la empresa instaladora, según UNE 20.460-6-61.",
      "Calificación: favorable / condicionada (corrección ≤ 6 meses) / negativa (defecto muy grave). Defectos: muy graves, graves y leves."] },
  { id: "bt52-t1", norma: "ITC-BT-52 · Tabla 1", titulo: "Escalones normalizados — vivienda unifamiliar (circuito C13)",
    cab: ["Tensión nominal", "Automático en origen", "Potencia instalada", "Estaciones por circuito"],
    filas: BT52_TABLA1,
    notas: ["C13 monofásico: potencia instalada no superior a 9.200 W (evitar desequilibrios).",
      "En circuito trifásico con estaciones monofásicas: reparto equilibrado entre fases; número máximo calculado para estaciones de 3.680 W unitarias."] },
  { id: "bt52-t2", norma: "ITC-BT-52 · Tabla 2", titulo: "Escalones normalizados — circuitos de recarga colectivos trifásicos",
    cab: ["Tensión nominal", "Automático en origen", "Potencia instalada", "N.º máximo estaciones"],
    filas: BT52_TABLA2,
    notas: ["Número máximo calculado para estaciones monofásicas de 3.680 W unitarias; el proyectista puede ampliarlo o reducirlo justificando otra potencia unitaria."] },
  { id: "bt52-esquemas", norma: "ITC-BT-52 · 3", titulo: "Esquemas de instalación para recarga de VE",
    cab: ["Esquema", "Descripción", "Simultaneidad con el resto"],
    filas: [
      ["1a / 1b / 1c", "Colectivo o troncal con un contador principal en el origen", "0,3 con SPL · 1,0 sin SPL"],
      ["2", "Individual con un contador común para la vivienda y la estación", "1,0"],
      ["3a / 3b", "Individual con un contador por cada estación de recarga", "1,0"],
      ["4a / 4b", "Circuito o circuitos adicionales para la recarga", "1,0"]
    ],
    notas: ["Prioridad 1a/1b/1c: módulos de reserva de la centralización existente, luego ampliación, luego centralización nueva.",
      "Esquema 2: justificar que el fusible de la centralización protege en cortocircuito a la DI y al circuito de recarga; el control de potencia lo hace el contador principal (sin ICP externo).",
      "Preinstalación: conducciones por vías principales y centralización con módulos de reserva para al menos el 20 % de plazas no asociadas a vivienda y, en todo caso, un módulo mínimo."] }
];

/* ---------- Documentación mínima ---------- */
const DOC_GRUPOS = [
  {
    grupo: "A. Documentación técnica (ITC-BT-04)",
    items: [
      "Proyecto o memoria técnica de diseño, según grupo y potencia (BT-04.3 y 4)",
      "Datos de la MTD: propietario, firmante y competencia, emplazamiento, uso, receptores y potencia, cálculos de LGA/DI/líneas secundarias, esquema unifilar, croquis de trazado",
      "Dirección de obra por técnico titulado competente si la instalación precisó proyecto",
      "En recarga VE: documentación técnica con el esquema de conexión elegido (1a/1b/1c, 2, 3a/3b, 4a/4b)"
    ]
  },
  {
    grupo: "B. Ejecución y puesta en servicio (BT-04.5)",
    items: [
      "Ejecución por empresa instaladora en baja tensión habilitada (ITC-BT-03)",
      "Verificaciones previas a la puesta en servicio según UNE 20.460-6-61",
      "Certificado de instalación suscrito por instalador en baja tensión, con anexo de información al usuario",
      "Certificado de dirección de obra firmado por técnico titulado competente (si hubo proyecto)",
      "Certificado de inspección inicial del Organismo de Control, si procede (BT-05)",
      "Presentación ante el órgano competente de la CCAA para su inscripción en el registro (quintuplicado; copia electrónica si es telemática)",
      "Copia diligenciada para la propiedad y entrega de otra a la compañía eléctrica (requisito para el suministro)"
    ]
  },
  {
    grupo: "C. Inspecciones y mantenimiento (BT-05 y art. 20)",
    items: [
      "Inspección inicial por OC cuando la instalación esté en el listado del BT-05.4.1",
      "Inspecciones periódicas cada 5 años (instalaciones con inspección inicial) y cada 10 años (comunes de viviendas > 100 kW)",
      "Corrección de defectos graves en el plazo máximo de 6 meses",
      "Mantenimiento de la instalación por el titular (art. 20 REBT)",
      "Revisión de las tomas de tierra (BT-18.12)"
    ]
  },
  {
    grupo: "D. Protecciones y verificaciones de obra",
    items: [
      "Comprobación de Zs × Ia ≤ U0 (TN/IT) o RA × Ia ≤ U (TT) en cada circuito",
      "Diferenciales de 30 mA en tomas de corriente y circuitos de alumbrado que corresponda; clase A donde haya electrónica de potencia o recarga VE",
      "Verificación de caídas de tensión: 3 % viviendas; 3 % alumbrado / 5 % resto; 5 % recarga VE",
      "Ensayo de aislamiento y rigidez dieléctrica (BT-19.2.9) y verificación de continuidad de conductores de protección",
      "Cartel en zona de recarga: prohibida la recarga de baterías con desprendimiento de gases (BT-52)"
    ]
  }
];

/* ---------- Normativa y normas ---------- */
const NORMAS = [
  { t: "Real Decreto 842/2002 — REBT (texto consolidado BOE)", u: "https://boe.es/buscar/act.php?id=BOE-A-2002-18099" },
  { t: "REBT e ITC — texto consolidado en PDF (código BOE)", u: "https://boe.es/biblioteca_juridica/codigos/pdf/326_Reglamento_electrotecnico_para_baja_tension_e_ITC.pdf" },
  { t: "Real Decreto 1053/2014 — añade ITC-BT-52 (recarga VE)", u: "https://www.boe.es/buscar/act.php?id=BOE-A-2014-13681" },
  { t: "Real Decreto 298/2021 — modificación del ámbito (art. 2)", u: "https://boe.es/buscar/act.php?id=BOE-A-2021-6879" },
  { t: "Real Decreto 244/2019 — autoconsumo (ref. BT-40)", u: "https://www.boe.es/buscar/act.php?id=BOE-A-2019-5089" },
  { t: "Real Decreto 2200/1995 — Infraestructura para la Calidad y la Seguridad Industrial (OC)", u: "https://boe.es/buscar/act.php?id=BOE-A-1995-27103" }
];

const NORMAS_UNE = [
  "UNE 20.460-6-61 — Verificaciones de instalaciones eléctricas de baja tensión",
  "UNE 20.460-4-41 — Protección contra choques eléctricos",
  "UNE 20.460-4-43 — Protección contra sobreintensidades",
  "UNE 20.460-5-523 — Intensidades admisibles de cables",
  "UNE 20.460-5-54 — Puestas a tierra y conductores de protección",
  "UNE 20.324 — Grados de protección IP / IK",
  "UNE 20.451 y UNE-EN 60.439-3 — Envolventes de cuadros",
  "UNE 20.481 — Tensiones de very low tension (MBT)",
  "UNE 20.572-1 — Tensiones límite convencionales",
  "UNE 21.022 — Conductores de cobre para puesta a tierra",
  "UNE-EN 60.335-2-60 — Aparatos para bañeras de hidromasaje",
  "UNE-EN 61558-2-5 y UNE-EN 60.742 — Bloques de alimentación de afeitadoras",
  "UNE-EN 61008 / 61009 / 62423 — Interruptores diferenciales (tipos A, B, F)"
];