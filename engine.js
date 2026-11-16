/* =========================================================================
   engine.js — Motor de cálculo REBT
   ========================================================================= */

const SQRT3 = Math.sqrt(3);

function fmt(n, dec = 0) {
  if (n === null || n === undefined || n === "" || isNaN(n)) return "—";
  return Number(n).toLocaleString("es-ES", { maximumFractionDigits: dec, minimumFractionDigits: dec });
}

/* ---------- ITC-BT-10: coeficiente de simultaneidad ---------- */
function simultaneidad(n, nocturna) {
  if (nocturna) return n;
  if (n <= 21) return TABLA_SIMULT[n];
  return 15.3 + (n - 21) * 0.5;
}

/* ---------- ITC-BT-10: cargas mínimas ---------- */
function cargaLocales(m2) { return m2 > 0 ? Math.max(100 * m2, 3450) : 0; }
function cargaGaraje(m2, forzada) { return m2 > 0 ? Math.max((forzada ? 20 : 10) * m2, 3450) : 0; }
function cargaVE(plazas, potUnit, spl) {
  if (!plazas || plazas <= 0) return { bruto: 0, aplicada: 0 };
  const bruto = 3680 * (0.10 * plazas);
  const factor = spl ? 0.3 : 1.0;
  return { bruto, aplicada: bruto * factor, factor };
}

/* ---------- ITC-BT-10 + BT-17: cálculo completo ---------- */
function cargasCalc(d) {
  const out = {};
  const n = Number(d.nViv) || 0;
  if (n < 1) return { error: "Introduce al menos una vivienda." };

  const potViv = Number(d.potViv) || 0;
  const coef = simultaneidad(n, d.tarifaNoct);
  const Pv = potViv * coef;
  const Psg = Number(d.servGen) || 0;
  const Pcl = cargaLocales(Number(d.locCom) || 0);
  const Pg = cargaGaraje(Number(d.garaje) || 0, d.garTipo === "forzada");
  const ve = cargaVE(Number(d.plazasVE) || 0, Number(d.potVE) || 3680, d.conSPL);
  const total = Pv + Psg + Pcl + Pg + ve.aplicada;

  out.componentes = [
    ["Viviendas", `${fmt(Pv)} W`, `${fmt(n)} viviendas × ${fmt(potViv)} W × coef. ${fmt(coef, 1)}`],
    ["Servicios generales", `${fmt(Psg)} W`, "Sin factor de reducción (BT-10.3.2)"],
    ["Locales comerciales / oficinas", `${fmt(Pcl)} W`, "Mín. 100 W/m² y 3.450 W; simultaneidad 1"],
    ["Garaje", `${fmt(Pg)} W`, `${d.garTipo === "forzada" ? "20" : "10"} W/m²; mín. 3.450 W; simultaneidad 1`],
    ["Recarga VE", `${fmt(ve.aplicada)} W`, ve.bruto ? `3.680 W × 10 % plazas = ${fmt(ve.bruto)} W × factor ${ve.factor}` : "Sin plazas previstas"]
  ];
  out.total = total;

  const mono = d.suministro === "mono";
  const U = mono ? 230 : 400;
  const I = mono ? total / 230 : total / (SQRT3 * 400);
  out.intensidad = I;
  out.tension = U;

  const icp = ICP_GAMA.find(v => v >= I) || null;
  out.icp = icp !== null && I <= 63
    ? `${icp} A`
    : (I > 63 ? "> 63 A: sin ICP; intensidad regulable, maxímetro o integrador" : "—");

  const IGA_GAMA = [25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000];
  const iga = IGA_GAMA.find(v => v >= I) || null;
  out.iga = iga !== null ? `${iga} A (mínimo 25 A)` : "—";

  const nc = Number(d.nCircuitos) || 0;
  out.diferenciales = nc > 0 ? Math.max(1, Math.ceil(nc / 5)) : 1;
  out.notas = [
    `Intensidad de diseño I = ${fmt(I, 1)} A a ${U} V (monofásico: I = P/230; trifásico: I = P/(√3·400)).`,
    "El IGA ha de tener poder de corte suficiente, 4.500 A como mínimo (BT-17.3), y ser independiente del ICP.",
    `Diferenciales: uno de 30 mA por cada 5 circuitos (BT-25.2.3) → ${out.diferenciales} ud(s) para ${nc} circuitos; intensidad asignada ≥ IGA.`,
    "C13 con diferencial exclusivo de clase A según BT-52.",
    "Caída de tensión máxima: 3 % en viviendas; 3 % alumbrado / 5 % resto de usos; 5 % en recarga VE (BT-19.2.2.2 y BT-52)."
  ];
  if (d.electAlta) out.notas.push("Electrificación elevada: la potencia a prever por vivienda no será inferior a 9.200 W (BT-10.2.1.2).");
  if (d.esquema === "TN-C") out.notas.push("Esquema TN-C: no se usarán dispositivos de protección diferencial-residual (BT-24.4.1.1).");
  if (d.esquema === "TN-C-S") out.notas.push("TN-C-S: no se usa conductor CPN aguas abajo del diferencial; conexión a tierra del conductor de protección aguas arriba del diferencial (BT-24.4.1.1).");
  return out;
}

/* ---------- ITC-BT-24: comprobación del corte automático ---------- */
function proteccionCalc(d) {
  const U0 = Number(d.U0) || 0;
  const Z = Number(d.Zs) || 0;
  const Ia = Number(d.Ia) || 0;
  if (!U0 || !Z || !Ia) return { error: "Introduce U0, la impedancia y la corriente que asegura el corte." };

  let producto, limite, cumple, formula;
  if (d.esquema === "TN") {
    producto = Z * Ia; limite = U0; formula = "Zs × Ia ≤ U0";
    cumple = producto <= U0;
  } else if (d.esquema === "TT") {
    producto = Z * Ia; limite = U0; formula = "RA × Ia ≤ U (50 V; 24 V en local conductor)";
    cumple = producto <= U0;
  } else if (d.esquema === "IT") {
    if (d.neutro === "no") {
      const U = SQRT3 * U0;
      producto = 2 * Z * Ia; limite = U; formula = "2 × Zs × Ia ≤ U (tensión entre fases)";
      cumple = producto <= U;
    } else {
      producto = 2 * Z * Ia; limite = U0; formula = "2 × Zs′ × Ia ≤ U0 (neutro distribuido)";
      cumple = producto <= U0;
    }
  }

  const tiempo = U0 <= 230 ? "0,4 s" : (U0 <= 400 ? "0,2 s" : "0,1 s");
  return {
    esquema: d.esquema,
    formula,
    producto, limite, cumple, tiempo, U0,
    detalle: `${fmt(producto, 3)} ≤ ${fmt(limite, 1)} → ${cumple ? "CUMPLE" : "NO CUMPLE: reduce Zs/RA (más sección, más corto el circuito o diferencial)"}`
  };
}

/* ---------- ITC-BT-04: proyecto o memoria ---------- */
function docCalc(d) {
  const g = BT04_GRUPOS.find(x => x[0] === d.grupo);
  if (!g) return { error: "Selecciona un grupo de instalación." };
  const P = Number(d.pot) || 0;
  let limiteTxt = g[2];
  let necesita = false;
  const grupo = g[0];

  if (["g", "h", "i", "j", "l", "m"].includes(grupo)) {
    necesita = true;
  } else if (grupo === "z") {
    if (d.modo4) { necesita = true; limiteTxt = "Sin límite: incluye estaciones en modo de carga 4"; }
    else if (d.exterior && P > 10000) { necesita = true; limiteTxt = "En exterior: P > 10 kW"; }
    else { necesita = P > 50000; }
  } else {
    const lim = parseFloat(g[2].replace(/[^0-9]/g, ""));
    necesita = P > lim;
  }
  return { grupo, tipo: g[1], limite: limiteTxt, P, necesita };
}

/* ---------- ITC-BT-52: escalones ---------- */
function veCalc(d) {
  const uni = d.caso === "uni";
  const tabla = uni ? BT52_TABLA1 : BT52_TABLA2;
  const key = d[uni ? "inUni" : "inCole"];
  const fila = tabla.find(r => r[1].startsWith(key + " "));
  if (!fila) return { error: "Escalón no encontrado." };
  return {
    caso: uni ? "Vivienda unifamiliar (tabla 1)" : "Colectivo trifásico (tabla 2)",
    fila,
    notas: uni
      ? ["Circuito C13 según BT-25; monofásico ≤ 9.200 W para evitar desequilibrios.",
         "Potencia prevista por toma, tipo de base e interruptor: según BT-52; el proyectista puede justificar otra potencia."]
      : ["Estaciones monofásicas repartidas equilibradamente entre las tres fases.",
         "Número máximo calculado para estaciones de 3.680 W unitarias; justificable otro número con distinta potencia unitaria."]
  };
}

/* ---------- ITC-BT-19: sección de conductor por caída de tensión ---------- */
const SECCIONES_NORMALIZADAS = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

function seccionCableCalc(d) {
  const Iin = d.I !== "" && d.I !== null && d.I !== undefined ? Number(d.I) : null;
  const P = d.P !== "" && d.P !== null && d.P !== undefined ? Number(d.P) : null;
  if (Iin === null && P === null) return { error: "Introduce la intensidad I o la potencia P." };
  const L = Number(d.L) || 0;
  if (L <= 0) return { error: "Introduce la longitud del circuito (m)." };
  const dv = Number(d.dv) || 0;
  if (dv <= 0) return { error: "Introduce la caída de tensión máxima (%)." };
  const mono = d.sum === "mono";
  const U = mono ? 230 : 400;
  const cos = Number(d.cos) || 1;
  let I = Iin;
  if (I === null) {
    I = mono ? P / (U * cos) : P / (SQRT3 * U * cos);
  }
  const gamma = d.mat === "al" ? 34 : 56;
  const factor = mono ? 2 : SQRT3;
  const Sreq = (factor * I * L) / (gamma * U * (dv / 100));
  const elegida = SECCIONES_NORMALIZADAS.find((s) => s >= Sreq) || null;
  return { I, Sreq, elegida, dv, U, mono, gamma, L, cos };
}

/* ---------- UNE 20.460-5-523: sección por intensidad admisible ---------- */
function admissibleSectionCalc(d) {
  const I = Number(d.I) || 0;
  if (I <= 0) return { error: "Introduce la intensidad de diseño I (A)." };
  const mat = d.mat === "al" ? "al" : "cu";
  const factor = mat === "al" ? 0.76 : 1;
  const tabla = ADMISSIBLE_CU.map(([s, a]) => [s, a * factor]);
  const chosen = tabla.find(([, a]) => a >= I);
  if (!chosen) return { error: "Intensidad superior a la tabla (240 mm²). Revisa la instalación." };
  return { I, mat, chosen };
}

/* ---------- ITC-BT-18: resistencia de toma de tierra ---------- */
function resistenciaTierraCalc(d) {
  const rho = Number(d.rho) || 0;
  const L = Number(d.L) || 0;
  const P = Number(d.perimetro) || 0;
  if (rho <= 0) return { error: "Introduce la resistividad del terreno ρ (Ω·m)." };
  const tipo = d.tipo || "vertical";
  let R;
  if (tipo === "vertical") {
    if (L <= 0) return { error: "Introduce la longitud del electrodo L (m)." };
    R = rho / L;
  } else if (tipo === "horizontal") {
    if (L <= 0) return { error: "Introduce la longitud del conductor L (m)." };
    R = (2 * rho) / L;
  } else {
    if (P <= 0) return { error: "Introduce el perímetro P (m) de la placa o malla." };
    R = (0.8 * rho) / P;
  }
  const Ia = d.Ia !== "" && d.Ia !== null && d.Ia !== undefined ? Number(d.Ia) : null;
  const Rmax = Ia ? 50 / Ia : null;
  return { rho, L, perimetro: P, R, Ia, Rmax, cumple: Rmax !== null ? R <= Rmax : null, tipo };
}