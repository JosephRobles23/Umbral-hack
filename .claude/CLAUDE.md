# Umbral — Contexto del Proyecto

> Auto-generado por Umbral. No editar manualmente.

## Decisiones Activas (EDEs)

Estas decisiones son vinculantes. Respétalas en todo código que generes.

### EDE-000-persistence: SQLite único (FTS5 + sqlite-vec) como sustrato local-first

**Decisión:** S7 (text-search) y S8 (embeddings) viven en un único archivo SQLite usando FTS5 y la extensión sqlite-vec.

**Mecanismo:** Una conexión better-sqlite3 abre ~/.umbral/umbral.db. FTS5 indexa searchableText de SessionNode; sqlite-vec almacena los vectores de DocChunk. Un cambio puede actualizar ambos índices en la misma transacción.

**Rationale:** Local-first exige cero servicios externos. Un único archivo permite atomicidad entre el índice textual y el vectorial, lo que sostiene el principio de fuente única de cambios (EDE-002).

**Anti-patterns (PROHIBIDO):**
- No abrir múltiples conexiones de escritura concurrentes (SQLite serializa escrituras).
- No indexar en FTS5 y sqlite-vec en transacciones separadas para el mismo cambio.

**Contratos de capa:** L1->L2

### EDE-001-pac-dsl: DSL propio en JSON declarativo para Policy-as-Code (S4)

**Decisión:** Las políticas de S4 se expresan en un DSL declarativo en JSON, interpretado por un motor propio sin dependencia externa.

**Mecanismo:** Cada Policy tiene una regla { subject, condition, effect }. El intérprete evalúa la condición contra el EvalContext en runtime y devuelve allow/deny/require_approval con rationale.

**Rationale:** Local-first y fail-fast favorecen cero dependencias externas y validación temprana. Un DSL JSON se valida con schema al cargar (fail-fast S13), es versionable en git y no requiere un runtime como OPA.

**Anti-patterns (PROHIBIDO):**
- No permitir lógica imperativa arbitraria en reglas (solo condiciones declarativas).
- No evaluar políticas en build: S4 es runtime por contrato.

**Contratos de capa:** L2->L3

### EDE-001-turborepo: Turborepo como orquestador de monorepo

**Decisión:** El monorepo utiliza Turborepo para orquestacion de builds, tests y tareas.

**Mecanismo:** turbo.json define el pipeline de tareas con dependsOn y cache. Cada paquete declara sus scripts en package.json.

**Rationale:** Turborepo provee caching incremental y ejecucion paralela. Reduce tiempos de build significativamente en monorepos.

**Anti-patterns (PROHIBIDO):**
- No saltarse el pipeline de Turbo ejecutando scripts directamente en paquetes interdependientes.
- No ignorar los outputs de cache en turbo.json.

### EDE-002-change-source: S2 es la única fuente de verdad de cambios detectados

**Decisión:** Solo S2 detecta cambios y emite DocRegenEvent. S6, S8 y la re-verificación de contratos (S5) solo reaccionan a ese evento.

**Mecanismo:** S2 calcula el conjunto mínimo de DocNode afectados por un diff y publica un DocRegenEvent. Los suscriptores re-proyectan/re-indexan/re-verifican solo el scope del evento.

**Rationale:** Si cada subsistema detectara cambios por su cuenta, sus proyecciones divergirían. Una única fuente garantiza consistencia entre C4, índice vectorial y contratos.

**Anti-patterns (PROHIBIDO):**
- Ningún subsistema observa filesystem/código directamente; solo S2.
- No emitir DocRegenEvent con scope total: scope mínimo afectado.

**Contratos de capa:** L1->L2

### EDE-003-ede-format: EDEs como archivos .ede.json separados, referenciadas desde .md

**Decisión:** Cada EDE es un .ede.json validable por schema. La prosa (.md) referencia EDEs por id, no las embebe.

**Mecanismo:** Los .ede.json se validan contra ede-v2.json al cargar. S4, S5 y S11 los leen como datos. El .md enlaza por id.

**Rationale:** Separar datos de prosa permite que el agente consuma EDEs sin parsear markdown frágil y que el humano lea narrativa limpia. El schema da fail-fast ante EDEs malformadas.

**Anti-patterns (PROHIBIDO):**
- No duplicar contenido de la EDE en el .md (fuente única: el .ede.json).

### EDE-004-evidence-adapter: Capa de adaptadores: S9/S10 normalizan a ComprehensionSignal; F4 no los conoce

**Decisión:** S9 (Langfuse) y S10 (DevTools) son adaptadores que normalizan su salida cruda a un único ComprehensionSignal. F4 (Comprehension Gate) solo lee ComprehensionSignal[].

**Mecanismo:** Cada adaptador implementa EvidenceAdapter.produce(): ComprehensionSignal. F4 itera sobre los adaptadores registrados sin conocer su origen. Síncrono (no bus de eventos).

**Rationale:** El contrato L2->L3 ya exige que toda salida de especialista cumpla un schema versionado antes de propagar. Encaja exacto: F4 nunca conoce 'Langfuse' ni 'DevTools', solo el schema. Añadir un tercer evaluador mañana no toca F4. Síncrono respeta fail-fast: un evento perdido en un bus sería fallo silencioso.

**Anti-patterns (PROHIBIDO):**
- F4 no debe importar ni referenciar a S9/S10 por nombre.
- Un adaptador no debe exponer detalles de su fuente en ComprehensionSignal.

**Contratos de capa:** L2->L3

### EDE-005-grill-blocking: Grill Me bloquea F2+ con override explícito que registra deuda

**Decisión:** Sin alignmentScore mínimo, F2+ queda bloqueada. Existe un override explícito que desbloquea pero registra la diferencia como deuda cognitiva medible.

**Mecanismo:** GrillSession.status debe ser 'aligned' para abrir F2. Un override marca status 'overridden' y crea un registro de deuda con el gap (umbral - score alcanzado), visible en el medidor CDR del frontend.

**Rationale:** Reconcilia dos principios de v2: Grill Me debe forzar engagement (bloquea de verdad), pero la verificación 'no es punitiva' (R7: bloqueos duros producen frustración, no aprendizaje). El override consciente es análogo a tomar deuda financiera a sabiendas: mejor saber que debes.

**Anti-patterns (PROHIBIDO):**
- El override no debe ser silencioso: siempre crea un registro de deuda visible.
- No permitir override sin un alignmentScore mínimo de seguridad (un piso por debajo del cual ni el override aplica).

**Contratos de capa:** L3->L4

### EDE-006-vertical-slices: Construcción por slices verticales end-to-end

**Decisión:** El desarrollo avanza por slices verticales que tocan L1->L5, no por capas horizontales completas.

**Mecanismo:** El Slice 1 implementa el mínimo de cada capa para un flujo end-to-end (EDE viva). Cada slice posterior añade un subsistema dejando la app corriendo y verificable.

**Rationale:** Un slice vertical valida los contratos entre capas desde el primer día y minimiza reescritura: si una frontera está mal definida, se descubre en el Slice 1 y no tras construir toda L1 a ciegas.

**Anti-patterns (PROHIBIDO):**
- No empezar un slice nuevo si el anterior dejó la app en estado roto.

### EDE-007-self-governance: Bootstrap manual hasta S12/S5; luego Umbral se autoaplica (dogfooding)

**Decisión:** Los slices 0-4 se construyen manualmente (Umbral aún no puede gobernarse). Desde el Slice 5 (que instala S5 contratos + S12 gatekeepers), cada slice nuevo debe pasar por los propios gatekeepers de Umbral.

**Mecanismo:** El Slice 5 conecta los gatekeepers a las tareas de turbo (gate:plan, gate:commit). A partir de ahí, abrir un slice exige una EDE aprobada (CodeGuard) con tests unitarios (PlanGuard) y commits que pasen el pipeline graduado (CommitGuard).

**Rationale:** v2 sostiene que 'el sistema debe construirse comprendiéndose a sí mismo'. Pero no puede autoaplicarse antes de que existan los mecanismos de auto-aplicación. El bootstrap manual es el huevo antes de la gallina, registrado conscientemente como deuda temporal que el Slice 5 salda.

**Anti-patterns (PROHIBIDO):**
- No saltarse el Slice 5: sin él, el dogfooding nunca llega y el bootstrap manual se vuelve permanente.

**Contratos de capa:** L3->L4

## Reglas Generales

- Fail-fast (S13): todo error de validación debe lanzar inmediatamente, nunca degradar en silencio.
- Fuente única (S2): solo S2 detecta cambios. Otros subsistemas reaccionan al DocRegenEvent.
- Local-first: la base de datos vive en ~/.umbral/umbral.db (SQLite con FTS5 + sqlite-vec).
- No agregar dependencias externas sin justificación en una EDE.
