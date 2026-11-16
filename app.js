/* =========================================================================
   app.js — Interfaz
   ========================================================================= */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ---------- Tabs ---------- */
$$(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    $$(".panel").forEach((p) => p.classList.remove("active"));
    $("#" + btn.dataset.tab).classList.add("active");
  });
});

/* ---------- Helpers ---------- */
function kv(pares) {
  return `<dl class="kv">${pares.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;
}
function ul(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}
function seccion(titulo, contenido) {
  return `<h3>${titulo}</h3>${contenido}`;
}
function tablaHTML(t) {
  const th = t.cab.map((c) => `<th>${c}</th>`).join("");
  const filas = t.filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<details>
    <summary>${t.titulo}</summary>
    <div class="small" style="color:var(--muted);margin:4px 0 8px">${t.norma}</div>
    <div class="tabla-wrap">
      <table class="tabla">
        <caption>${t.titulo}</caption>
        <thead><tr>${th}</tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
    ${t.notas && t.notas.length ? `<div class="notas"><strong>Notas:</strong>${ul(t.notas)}</div>` : ""}
  </details>`;
}

/* =========================================================================
   Cargas y cuadro (BT-10 / BT-17 / BT-25)
   ========================================================================= */
$("#btnResetCargas").addEventListener("click", () => {
  $("#formCargas").reset();
  $("#resCargas").innerHTML = `<p class="hint">Rellena los datos y pulsa <strong>Calcular carga y cuadro</strong>.</p>`;
});

$("#btnCalcCargas").addEventListener("click", () => {
  const d = {
    nViv: $("#nViv").value,
    potViv: $("#potViv").value,
    electAlta: $("#electAlta").checked,
    tarifaNoct: $("#tarifaNoct").checked,
    servGen: $("#servGen").value,
    locCom: $("#locCom").value,
    garaje: $("#garaje").value,
    garTipo: $("#garTipo").value,
    plazasVE: $("#plazasVE").value,
    potVE: $("#potVE").value,
    conSPL: $("#conSPL").checked,
    suministro: $("#suministro").value,
    esquema: $("#esquema").value,
    nCircuitos: $("#nCircuitos").value
  };
  const r = cargasCalc(d);
  if (r.error) { $("#resCargas").innerHTML = `<p class="aviso">${r.error}</p>`; return; }

  let html = `<span class="badge bajo">Carga total prevista: ${fmt(r.total)} W</span>`;
  html += seccion("Reparto de la carga (BT-10)", kv(r.componentes));
  html += seccion("Cuadro general (BT-17 / BT-25)", kv([
    ["Intensidad de diseño", `${fmt(r.intensidad, 1)} A a ${r.tension} V`],
    ["Interruptor general automático (IGA)", r.iga],
    ["Interruptor de control de potencia (ICP)", r.icp],
    ["Interruptores diferenciales 30 mA", `${r.diferenciales} ud(s) — uno por cada 5 circuitos, como mínimo`]
  ]));
  html += `<div class="tabla-wrap"><table class="tabla"><caption>Gama normalizada de ICP y potencia nominal asociada (UNE 20317 / condiciones de suministro)</caption>
    <thead><tr><th>ICP (A)</th><th>Monofásico 230 V (W)</th><th>Trifásico 400 V (W)</th></tr></thead>
    <tbody>${ICP_POT.map((x) => `<tr><td>${fmt(x.icp)}</td><td>${fmt(x.mono230)}</td><td>${fmt(x.tri400)}</td></tr>`).join("")}</tbody></table></div>`;
  html += seccion("Notas", ul(r.notas));
  $("#resCargas").innerHTML = html;
});

/* =========================================================================
   Protecciones y tierra (BT-24 / BT-18)
   ========================================================================= */
$("#pEsquema").addEventListener("change", () => {
  const it = $("#pEsquema").value;
  $("#pZsLabel").textContent = it === "TT" ? "Resistencia de toma de tierra más conductor de protección RA (Ω)" : "Impedancia de bucle de defecto Zs (Ω)";
  $("#pNeutro").classList.toggle("hidden", it !== "IT");
});

$("#btnResetProt").addEventListener("click", () => {
  $("#formProt").reset();
  $("#resProt").innerHTML = `<p class="hint">Introduce Zs (o RA en TT) e Ia y pulsa <strong>Comprobar corte</strong>.</p>`;
});

$("#btnCalcProt").addEventListener("click", () => {
  const d = {
    esquema: $("#pEsquema").value,
    U0: $("#pU0").value,
    Zs: $("#pZs").value,
    Ia: $("#pIa").value,
    neutro: $("#pNeutro") ? $("#pNeutro").value : "si"
  };
  const r = proteccionCalc(d);
  if (r.error) { $("#resProt").innerHTML = `<p class="aviso">${r.error}</p>`; return; }

  const cls = r.cumple ? "bajo" : "alto";
  let html = `<span class="badge ${cls}">${r.cumple ? "CUMPLE" : "NO CUMPLE"}</span>`;
  html += kv([
    ["Esquema", r.esquema],
    ["Condición", r.formula],
    ["Tensión U0", `${fmt(r.U0)} V`],
    ["Tiempo máximo de interrupción", r.tiempo],
    ["Valor obtenido", r.detalle]
  ]);
  html += `<p class="hint">Tensión límite convencional 50 V (24 V en local conductor). Si no cumple: aumentar sección, acortar el circuito, reducir RA con puesta a tierra o usar diferencial-residual (Ia = intensidad diferencial asignada).</p>`;
  $("#resProt").innerHTML = html;
});

/* =========================================================================
   Clasificación documental (BT-04) + inspecciones (BT-05)
   ========================================================================= */
$("#btnResetDoc").addEventListener("click", () => {
  $("#formDoc").reset();
  $("#resDoc").innerHTML = `<p class="hint">Selecciona tipo de instalación y potencia, y pulsa <strong>Determinar documentación</strong>.</p>`;
});

$("#btnCalcDoc").addEventListener("click", () => {
  const d = {
    grupo: $("#docGrupo").value,
    pot: $("#docPot").value,
    modo4: $("#docModo4").checked,
    exterior: $("#docRecargExterior").checked
  };
  if (!d.grupo) { $("#resDoc").innerHTML = `<p class="aviso">Selecciona el tipo de instalación.</p>`; return; }
  const r = docCalc(d);
  if (r.error) { $("#resDoc").innerHTML = `<p class="aviso">${r.error}</p>`; return; }

  let html = r.necesita
    ? `<span class="badge alto">Proyecto</span>`
    : `<span class="badge bajo">Memoria técnica de diseño</span>`;
  html += `<h3>Grupo ${r.grupo} — ${r.tipo}</h3>`;
  html += kv([
    ["Potencia prevista P", `${fmt(r.P)} W`],
    ["Límite del grupo", r.limite],
    ["Documentación exigible", r.necesita ? "Proyecto firmado por técnico competente, con dirección de obra" : "Memoria técnica de diseño (MTD) sobre impresos de la CCAA"]
  ]);
  html += seccion("Tramitación (BT-04.5)", ul([
    "Verificaciones previas de la empresa instaladora según UNE 20.460-6-61",
    "Certificado de instalación + anexo de información al usuario",
    "Inspección inicial por Organismo de Control si la instalación está en el listado del BT-05.4.1",
    "Presentación ante el órgano competente de la CCAA para su inscripción en el registro"
  ]));
  $("#resDoc").innerHTML = html;
});

/* =========================================================================
   Bañera y ducha (BT-27)
   ========================================================================= */
$("#tbVolumenes").innerHTML = BT27_VOLUMENES.map((v) =>
  `<tr><td><strong>${v[0]}</strong></td><td>${v[1]}</td><td>${v[2]}</td><td>${v[3]}</td><td>${v[4]}</td></tr>`
).join("");

/* =========================================================================
   Recarga VE (BT-52)
   ========================================================================= */
$("#veCaso").addEventListener("change", () => {
  const uni = $("#veCaso").value === "uni";
  $("#veBloqueUni").classList.toggle("hidden", !uni);
  $("#veBloqueCole").classList.toggle("hidden", uni);
});

$("#btnResetVE").addEventListener("click", () => {
  $("#formVE").reset();
  $("#veBloqueCole").classList.add("hidden");
  $("#resVE").innerHTML = `<p class="hint">Elige caso e interruptor y pulsa <strong>Consultar escalón</strong>.</p>`;
});

$("#btnCalcVE").addEventListener("click", () => {
  const uni = $("#veCaso").value === "uni";
  const d = { caso: uni ? "uni" : "cole", inUni: $("#veInUni").value, inCole: $("#veInCole").value };
  const r = veCalc(d);
  if (r.error) { $("#resVE").innerHTML = `<p class="aviso">${r.error}</p>`; return; }

  let html = `<span class="badge bajo">${r.caso}</span>`;
  html += `<div class="tabla-wrap"><table class="tabla">
    <thead><tr><th>Tensión nominal</th><th>Automático de protección</th><th>Potencia instalada</th><th>Estaciones por circuito</th></tr></thead>
    <tbody><tr>${r.fila.map((c) => `<td>${c}</td>`).join("")}</tr></tbody></table></div>`;
  html += seccion("Notas", ul(r.notas));
  $("#resVE").innerHTML = html;
});

/* =========================================================================
   Explorador: ITC + tablas
   ========================================================================= */
function renderExplorador() {
  const q = ($("#filtroTabla").value || "").toLowerCase().trim();
  const ics = ITCS.filter(([id, t, a]) => !q || (id + " " + t + " " + a).toLowerCase().includes(q));
  const tabs = TABLAS.filter((t) => !q || (t.titulo + " " + t.norma + " " + t.id + " " + JSON.stringify(t.filas)).toLowerCase().includes(q));

  $("#listaIcs").innerHTML = `<details open><summary>Índice de ITC-BT (01 a 52) — ${ics.length} de ${ITCS.length}</summary>
    <div class="tabla-wrap"><table class="tabla">
      <thead><tr><th>ITC</th><th>Título</th><th>Ámbito</th></tr></thead>
      <tbody>${ics.map(([id, t, a]) => `<tr><td class="code">${id}</td><td>${t}</td><td>${a}</td></tr>`).join("")}</tbody>
    </table></div></details>`;

  $("#listaTablas").innerHTML = tabs.length ? tabs.map(tablaHTML).join("") : `<p class="hint">Sin resultados.</p>`;
}
$("#filtroTabla").addEventListener("input", renderExplorador);
renderExplorador();

/* =========================================================================
   Checklist de documentación
   ========================================================================= */
function renderChecklist() {
  $("#checklist").innerHTML = DOC_GRUPOS.map((g) => `
    <div class="grupo">
      <h3>${g.grupo}</h3>
      ${g.items.map((it, i) => `
        <label><input type="checkbox" data-doc="${g.grupo}|${i}"><span>${it}</span></label>
      `).join("")}
    </div>
  `).join("");
}
$("#btnResetChecks").addEventListener("click", () => {
  $$("#checklist input[type=checkbox]").forEach((c) => (c.checked = false));
});
$("#btnImprimir").addEventListener("click", () => window.print());
renderChecklist();

/* =========================================================================
   Sección de conductor por caída de tensión (BT-19)
   ========================================================================= */
$("#tTerreno").addEventListener("change", () => {
  const v = $("#tTerreno").value;
  if (v) $("#tRho").value = v.replace(/\D/g, "");
});

$("#btnResetCable").addEventListener("click", () => {
  $("#cI").value = ""; $("#cP").value = ""; $("#cL").value = ""; $("#cOut").value = "";
  $("#resCable").style.display = "none";
});

$("#btnCalcCable").addEventListener("click", () => {
  const d = {
    I: $("#cI").value,
    P: $("#cP").value,
    cos: $("#cCos").value,
    sum: $("#cSum").value,
    L: $("#cL").value,
    dv: $("#cDv").value,
    mat: $("#cMat").value
  };
  const r = seccionCableCalc(d);
  if (r.error) {
    $("#cOut").value = r.error;
    $("#resCable").style.display = "block";
    $("#resCable").innerHTML = `<p class="aviso">${r.error}</p>`;
    return;
  }
  const chosen = r.elegida !== null ? `${r.elegida} mm²` : "superior a 240 mm²";
  $("#cOut").value = `S req. ${r.Sreq.toFixed(2)} mm² → ${chosen}`;
  let html = `<span class="badge bajo">Sección requerida: ${r.Sreq.toFixed(2)} mm² → normalizada ${chosen}</span>`;
  html += kv([
    ["Intensidad de funcionamiento", `${fmt(r.I, 2)} A`],
    ["Tensión nominal", `${r.U} V (${r.mono ? "monofásico" : "trifásico"})`],
    ["Longitud", `${fmt(r.L)} m`],
    ["Caída de tensión máxima", `${r.dv} %`],
    ["Material / γ", `${r.mat === "al" ? "Aluminio" : "Cobre"} / ${r.gamma} m/(Ω·mm²)`],
    ["Factor de longitud", r.mono ? "2 (ida y vuelta)" : "√3 (trifásico)"]
  ]);
  html += `<p class="hint">Comprueba la sección elegida con la intensidad admisible del conductor (UNE 20.460-5-523) para el método de instalación, temperatura y agrupamiento. Si la sección requerida supera 240 mm², revisa la longitud o la caída admitida.</p>`;
  $("#resCable").style.display = "block";
  $("#resCable").innerHTML = html;
});

/* ---------- Resistencia de toma de tierra (BT-18) ---------- */
$("#btnResetTierra").addEventListener("click", () => {
  $("#tTipo").value = "vertical";
  $("#tRho").value = ""; $("#tL").value = ""; $("#tP").value = ""; $("#tIa").value = ""; $("#tOut").value = "";
  $("#resTierra").style.display = "none";
});

$("#btnCalcTierra").addEventListener("click", () => {
  const d = { rho: $("#tRho").value, L: $("#tL").value, d: 0, Ia: $("#tIa").value, tipo: $("#tTipo").value, perimetro: $("#tP").value };
  const r = resistenciaTierraCalc(d);
  if (r.error) {
    $("#tOut").value = r.error;
    $("#resTierra").style.display = "block";
    $("#resTierra").innerHTML = `<p class="aviso">${r.error}</p>`;
    return;
  }
  $("#tOut").value = `R ≈ ${r.R.toFixed(2)} Ω`;
  let html = `<span class="badge ${r.cumple === null ? "bajo" : (r.cumple ? "bajo" : "alto")}">R ≈ ${r.R.toFixed(2)} Ω</span>`;
  html += kv([
    ["Tipo de electrodo", r.tipo === "vertical" ? "Pica vertical (R = ρ/L)" : r.tipo === "horizontal" ? "Conductor horizontal (R = 2ρ/L)" : r.tipo === "placa" ? "Placa enterrada (R = 0,8ρ/P)" : "Malla (R = 0,8ρ/P)"],
    ["Resistividad ρ", `${fmt(r.rho)} Ω·m`],
    ["Longitud L", r.L ? `${fmt(r.L)} m` : "—"],
    ["Perímetro P", r.perimetro ? `${fmt(r.perimetro)} m` : "—"],
    ["R máxima para TT (50 V / Ia)", r.Rmax !== null ? `${r.Rmax.toFixed(2)} Ω` : "No calculada (introduce Ia)"]
  ]);
  if (r.Rmax !== null) {
    html += r.cumple
      ? `<p class="hint">Cumple: R ≤ Rmax. Para Ia = ${fmt(r.Ia)} A, el límite de RA es 50/Ia = ${r.Rmax.toFixed(2)} Ω.</p>`
      : `<p class="aviso">No cumple: R > Rmax. Aumenta L o P (más electrodos en paralelo), mejora el terreno (sales, bentonita) o reduce Ia con diferencial de menor sensibilidad.</p>`;
  } else {
    html += `<p class="hint">Fórmulas orientativas de BT-18 tabla 5. Para TT la condición es RA × Ia ≤ 50 V (24 V en local conductor); introduce Ia para comprobar. Medir R in situ.</p>`;
  }
  $("#resTierra").style.display = "block";
  $("#resTierra").innerHTML = html;
});
  /* ---------- Sección por intensidad admisible (UNE 20.460-5-523) ---------- */
  $("#tbAdm").innerHTML = ADMISSIBLE_CU.map(([s, a]) => `<tr><td>${s}</td><td>${a}</td></tr>`).join("");

  $("#btnCalcAdm").addEventListener("click", () => {
    const r = admissibleSectionCalc({ I: $("#aI").value, mat: $("#aMat").value });
    if (r.error) { $("#aOut").value = r.error; return; }
    const cu = r.chosen[1];
    const al = (r.chosen[1] * 0.76).toFixed(1);
    $("#aOut").value = `${r.chosen[0]} mm² (admisible ${r.mat === "al" ? al : cu} A)`;
  });

  /* =========================================================================
     Normativa
     ========================================================================= */
  $("#listaNormas").innerHTML =
  NORMAS.map((n) => `<li><a href="${n.u}" target="_blank" rel="noopener">${n.t}</a></li>`).join("") +
  `<li><strong>Normas UNE citadas:</strong><ul>${NORMAS_UNE.map((u) => `<li>${u}</li>`).join("")}</ul></li>`;