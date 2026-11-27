import { expect, test, type Page } from "@playwright/test";

const SILABAS = ["ma", "me", "mi", "mo", "mu"];
const TODAS_LAS_PALABRAS = [
  "mamua",
  "umea",
  "mimo",
  "ama",
  "amama",
  "momia",
  "meloi",
  "musu",
];

// Audio stubbeado: la secuencia y el constructor se miden por estado, no por sonido.
test.beforeEach(async ({ page }) => {
  await page.route("**/audio/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "audio/mpeg",
      body: Buffer.alloc(0),
    })
  );
});

async function elegirM(page: Page) {
  await page.goto("/invitado");
  await page.getByRole("button", { name: "m", exact: true }).click();
}

async function entrarEnSecuencia(page: Page) {
  await elegirM(page);
  await page.getByRole("button", { name: /Segida/ }).click();
}

async function entrarEnPalabras(page: Page, palabraObjetivo?: string) {
  if (palabraObjetivo) {
    // Marca el resto como hechas para que el constructor empiece en la palabra buscada.
    const completadas = TODAS_LAS_PALABRAS.filter((p) => p !== palabraObjetivo);
    await page.addInitScript(
      (datos) => {
        const { clave, ids } = datos as { clave: string; ids: string[] };
        localStorage.setItem(
          clave,
          JSON.stringify({ m: { secuenciaCompletada: true, palabrasCompletadas: ids } })
        );
      },
      { clave: "irakurri:invitado:v1", ids: completadas }
    );
  }
  await elegirM(page);
  await page.getByRole("button", { name: /Hitzak/ }).click();
}

async function completar(page: Page, velocidad: string): Promise<number> {
  await page.getByRole("button", { name: `Abiadura ${velocidad}` }).click();
  const inicio = Date.now();
  await page.getByRole("button", { name: /Hasi/ }).click();
  await expect(page.getByRole("button", { name: "Hurrengo ariketa" })).toBeEnabled({
    timeout: 25000,
  });
  return Date.now() - inicio;
}

test("acumula ma-me-mi-mo-mu sin mover el Stage", async ({ page }) => {
  await entrarEnSecuencia(page);
  const escenario = page.locator("main > div").first();
  const cajaInicial = await escenario.boundingBox();

  const fichas = page.locator('main button[aria-label*="silaba"]');
  await page.getByRole("button", { name: "Hasi sekuentzia" }).click();
  await expect(fichas).toHaveCount(5, { timeout: 20000 });
  await expect(fichas).toHaveText(SILABAS);

  const cajaFinal = await escenario.boundingBox();
  expect(cajaFinal).toEqual(cajaInicial);
});

test("la m aislada se puede reescuchar", async ({ page }) => {
  await entrarEnSecuencia(page);
  await expect(page.getByRole("button", { name: "Entzun fonema" })).toBeVisible();
});

test("Gelditu vacia el Stage y las velocidades cambian el ritmo", async ({ page }) => {
  await entrarEnSecuencia(page);

  const lento = await completar(page, "0,5×");
  await page.getByRole("button", { name: "Gelditu eta garbitu" }).click();
  await expect(page.locator('main button[aria-label*="silaba"]')).toHaveCount(0);

  const rapido = await completar(page, "1,5×");
  expect(rapido).toBeLessThan(lento);
  await expect(page.getByRole("button", { name: "Abiadura 1,5×" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("pausa congela la secuencia y Jarraitu la reanuda", async ({ page }) => {
  await entrarEnSecuencia(page);
  await page.getByRole("button", { name: /Hasi/ }).click();

  await expect(page.locator('main button[aria-label*="silaba"]')).toHaveCount(2, {
    timeout: 15000,
  });
  await page.getByRole("button", { name: "Pausatu sekuentzia" }).click();
  const congeladas = await page.locator('main button[aria-label*="silaba"]').count();
  await page.waitForTimeout(1500);
  await expect(page.locator('main button[aria-label*="silaba"]')).toHaveCount(congeladas);

  await page.getByRole("button", { name: "Jarraitu sekuentzia" }).click();
  await expect(page.locator('main button[aria-label*="silaba"]')).toHaveCount(5, {
    timeout: 20000,
  });
});

test("la silaba activa se distingue de las ya mostradas", async ({ page }) => {
  await entrarEnSecuencia(page);
  await page.getByRole("button", { name: /Hasi/ }).click();

  const fichas = page.locator('main button[aria-label*="silaba"]');
  await expect(fichas).toHaveCount(2, { timeout: 15000 });

  const colores = await page.evaluate(() => {
    const sonda = document.createElement("div");
    sonda.innerHTML =
      '<span class="text-neutral-500"></span><span class="bg-primary-700"></span>';
    document.body.appendChild(sonda);
    const [texto, fondo] = Array.from(sonda.children) as HTMLElement[];
    const resultado = {
      textoNeutro: getComputedStyle(texto).color,
      fondoPrimario: getComputedStyle(fondo).backgroundColor,
    };
    sonda.remove();
    return resultado;
  });

  await expect
    .poll(() => fichas.nth(1).evaluate((el) => getComputedStyle(el).backgroundColor), {
      timeout: 3000,
    })
    .toBe(colores.fondoPrimario);
  await expect
    .poll(() => fichas.nth(0).evaluate((el) => getComputedStyle(el).color), { timeout: 3000 })
    .toBe(colores.textoNeutro);
});

test("el progreso de la secuencia sobrevive a una recarga", async ({ page }) => {
  await entrarEnSecuencia(page);
  await completar(page, "1,5×");

  await page.getByRole("button", { name: "Atzera" }).click();
  await expect(page.getByText("Eginda")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Eginda")).toBeVisible();
});

test("construye mimo sin verla escrita y la revela al acertar", async ({ page }) => {
  await entrarEnPalabras(page, "mimo");

  await expect(page.getByRole("heading", { name: /hitzak/i })).toBeVisible();
  await expect(page.getByRole("paragraph").filter({ hasText: "mimo" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Entzun hitza" })).toBeVisible();

  await page.getByRole("button", { name: "Silaba mi" }).click();
  await page.getByRole("button", { name: "Silaba mo" }).click();

  await expect(page.getByText("Oso ondo!")).toBeVisible();
  await expect(page.getByRole("paragraph").filter({ hasText: "mimo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hurrengo hitza" })).toBeEnabled();
});

test("un error se limpia solo y permite reintentar", async ({ page }) => {
  await entrarEnPalabras(page, "mimo");

  await page.getByRole("button", { name: "Silaba ma" }).click();
  await page.getByRole("button", { name: "Silaba mi" }).click();

  await expect(page.getByText("Saiatu berriro")).toBeVisible();
  await expect(page.locator('main button[aria-label*="kendu"]')).toHaveCount(0, {
    timeout: 4000,
  });

  await page.getByRole("button", { name: "Silaba mi" }).click();
  await page.getByRole("button", { name: "Silaba mo" }).click();
  await expect(page.getByText("Oso ondo!")).toBeVisible();
});

test("tocar una silaba colocada la retira", async ({ page }) => {
  await entrarEnPalabras(page, "mimo");

  await page.getByRole("button", { name: "Silaba mi" }).click();
  await expect(page.getByRole("button", { name: "mi kendu" })).toBeVisible();

  await page.getByRole("button", { name: "mi kendu" }).click();
  await expect(page.locator('main button[aria-label*="kendu"]')).toHaveCount(0);
});


test("las fotos de las palabras existen y se renderizan", async ({ page }) => {
  for (const palabra of TODAS_LAS_PALABRAS) {
    const respuesta = await page.request.get(`/img/v1/palabras/${palabra}.png`);
    expect(respuesta.status(), `falta la foto de ${palabra}`).toBe(200);
  }

  await entrarEnPalabras(page, "mimo");
  const imagen = page.getByRole("img");
  await expect
    .poll(() => imagen.evaluate((el) => (el as HTMLImageElement).naturalWidth), {
      timeout: 5000,
    })
    .toBeGreaterThan(0);
});


// ---------------------------------------------------------------- leccion

async function sembrarPasos(page: Page, pasos: string[]) {
  await page.addInitScript(
    (datos) => {
      const { clave, hechos } = datos as { clave: string; hechos: string[] };
      localStorage.setItem(
        clave,
        JSON.stringify({
          m: {
            secuenciaCompletada: false,
            palabrasCompletadas: [],
            pasosCompletados: hechos,
          },
        })
      );
    },
    { clave: "irakurri:invitado:v1", hechos: pasos }
  );
}

async function entrarEnLeccion(page: Page, paso = "1. Grafema") {
  await elegirM(page);
  await page.getByRole("button", { name: paso }).click();
}

test("la leccion empieza por el grafema y sigue con la sintesis m + a = ma", async ({ page }) => {
  await entrarEnLeccion(page);
  await expect(page.getByText("1 · Grafema")).toBeVisible();

  await page.getByRole("button", { name: "Jarraitu" }).click();
  await expect(page.getByText("2 · Silabak")).toBeVisible();
  await expect(page.getByRole("button", { name: "Silaba ma" })).toBeVisible();

  const familia = await page
    .locator('main button[aria-label="Silaba ma"]')
    .evaluate((elemento) => getComputedStyle(elemento).fontFamily);
  expect(familia).toContain("Edelfontmed");

  for (let i = 0; i < 4; i += 1) {
    await page.getByRole("button", { name: "Hurrengo silaba" }).click();
  }
  await expect(page.getByRole("button", { name: "Silaba mu" })).toBeVisible();
  await page.getByRole("button", { name: "Jarraitu" }).click();

  await expect(page.getByText("3 · Errepikatu")).toBeVisible();
  await expect(page.locator('main button[aria-label^="Silaba "]').first()).toBeVisible();
});

test("la discriminacion auditiva acepta la silaba correcta", async ({ page }) => {
  await sembrarPasos(page, ["grafema", "silabak", "errepikatu", "anclas"]);
  await entrarEnLeccion(page, "5. Entzun eta aukeratu");
  await expect(page.getByText("5 · Entzun eta aukeratu")).toBeVisible();

  const opciones = page.locator('main button[aria-label^="Silaba "]');
  const total = await opciones.count();
  expect(total).toBe(5);

  for (let i = 0; i < total; i += 1) {
    await opciones.nth(i).click();
    await page.waitForTimeout(200);
    if (await page.getByText("Oso ondo!").isVisible()) break;
    await page.waitForTimeout(500);
  }
  await expect(page.getByText("Oso ondo!")).toBeVisible();
});

test("entzun pseudohitzak recorre las seis y lleva a elegir", async ({ page }) => {
  await sembrarPasos(page, ["grafema", "silabak", "errepikatu", "anclas", "entzun"]);
  await entrarEnLeccion(page, "6. Entzun pseudohitzak");

  await expect(page.getByText("6 · Entzun pseudohitzak")).toBeVisible();
  await expect(page.getByText("memi", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hasi sekuentzia" })).toBeVisible();
  await expect(page.locator('main button[aria-label^="Pseudohitza "]')).toHaveCount(0);

  await page.getByRole("button", { name: "Hasi sekuentzia" }).click();
  await expect(page.getByRole("button", { name: "Hurrengo ariketa" })).toBeEnabled({
    timeout: 20000,
  });
  await page.getByRole("button", { name: "Hurrengo ariketa" }).click();

  await expect(page.getByText("7 · Aukeratu pseudohitza")).toBeVisible();
  await expect(page.locator('main button[aria-label^="Pseudohitza "]')).toHaveCount(4);
});

test("Hitza recorre las palabras y lleva a la siguiente actividad", async ({ page }) => {
  await elegirM(page);
  await page.getByRole("button", { name: "4. Hitza" }).click();

  await expect(page.getByText("mamua", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hasi sekuentzia" })).toBeVisible();

  await page.getByRole("button", { name: "Hasi sekuentzia" }).click();
  await expect(page.getByRole("button", { name: "Hurrengo ariketa" })).toBeEnabled({
    timeout: 20000,
  });
  await page.getByRole("button", { name: "Hurrengo ariketa" }).click();

  await expect(page.getByText("5 · Entzun eta aukeratu")).toBeVisible();
});

test("elegir pseudohitza acepta la opcion correcta", async ({ page }) => {
  await sembrarPasos(page, [
    "grafema",
    "silabak",
    "errepikatu",
    "anclas",
    "entzun",
    "pseudo",
  ]);
  await entrarEnLeccion(page, "7. Aukeratu pseudohitza");
  await expect(page.getByText("7 · Aukeratu pseudohitza")).toBeVisible();

  const opciones = page.locator('main button[aria-label^="Pseudohitza "]');
  expect(await opciones.count()).toBe(4);

  for (let i = 0; i < 4; i += 1) {
    await opciones.nth(i).click();
    await page.waitForTimeout(200);
    if (await page.getByText("Oso ondo!").isVisible()) break;
    await page.waitForTimeout(500);
  }
  await expect(page.getByText("Oso ondo!")).toBeVisible();
});

test("lectura y eleccion de imagen cierran la leccion", async ({ page }) => {
  await sembrarPasos(page, [
    "grafema",
    "silabak",
    "errepikatu",
    "anclas",
    "entzun",
    "pseudo",
    "pseudoElegir",
  ]);
  await entrarEnLeccion(page, "8. Irakurri");
  await expect(page.getByText("8 · Irakurri hitzak")).toBeVisible();

  for (let i = 0; i < 12; i += 1) {
    if (await page.getByText("9 · Aukeratu irudia").isVisible()) break;
    await page.getByRole("button", { name: "Jarraitu" }).click();
    await page.waitForTimeout(60);
  }

  await expect(page.getByText("9 · Aukeratu irudia")).toBeVisible();
  for (let i = 0; i < 6; i += 1) {
    const palabra = (await page.getByTestId("palabra-objetivo").innerText()).trim();
    await page.getByRole("button", { name: `Irudia ${palabra}` }).click();
    await expect(page.getByText("Oso ondo!")).toBeVisible();
    await page.waitForTimeout(900);
  }

  await expect(page.getByLabel("3 izar")).toBeVisible();

  await page.getByRole("button", { name: "Menua" }).click();
  await expect(page.getByText("Aukeratu ariketa")).toBeVisible();
  await expect(page.getByText("9/9")).toBeVisible();
});

test("un fallo en la eleccion de imagen da dos estrellas", async ({ page }) => {
  await sembrarPasos(page, [
    "grafema",
    "silabak",
    "errepikatu",
    "anclas",
    "entzun",
    "pseudo",
    "pseudoElegir",
    "hitzak",
  ]);
  await entrarEnLeccion(page, "9. Aukeratu irudia");

  const opciones = page.locator('main button[aria-label^="Irudia "]');
  const objetivo = (await page.getByTestId("palabra-objetivo").innerText()).trim();
  const etiquetas = await opciones.evaluateAll((elementos) =>
    elementos.map((elemento) => elemento.getAttribute("aria-label") ?? "")
  );
  const incorrecta = etiquetas.find((etiqueta) => etiqueta !== `Irudia ${objetivo}`);
  expect(incorrecta).toBeDefined();
  await page.getByRole("button", { name: incorrecta as string }).click();
  await page.waitForTimeout(650);

  for (let i = 0; i < 6; i += 1) {
    const palabra = (await page.getByTestId("palabra-objetivo").innerText()).trim();
    await page.getByRole("button", { name: `Irudia ${palabra}` }).click();
    await page.waitForTimeout(900);
  }

  await expect(page.getByLabel("2 izar")).toBeVisible();
});


test("el constructor reproduce la palabra sola al entrar", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __plays: number }).__plays = 0;
    HTMLMediaElement.prototype.play = () => {
      (window as unknown as { __plays: number }).__plays += 1;
      return Promise.resolve();
    };
  });

  await entrarEnPalabras(page, "mimo");
  await page.waitForTimeout(1800);

  const reproducciones = await page.evaluate(
    () => (window as unknown as { __plays: number }).__plays
  );
  expect(reproducciones).toBeGreaterThan(0);
});


test("la fuente Edelfontmed carga en el navegador", async ({ page }) => {
  await page.goto("/invitado");

  const respuesta = await page.request.get("/fonts/edelfontmed.ttf");
  expect(respuesta.status()).toBe(200);

  const estado = await page.evaluate(async () => {
    await document.fonts.ready;
    const fuentes = Array.from(document.fonts).filter(
      (fuente) => fuente.family.replace(/["']/g, "") === "Edelfontmed"
    );
    return {
      total: fuentes.length,
      cargadas: fuentes.filter((fuente) => fuente.status === "loaded").length,
    };
  });

  expect(estado.total).toBeGreaterThan(0);
  expect(estado.cargadas).toBeGreaterThan(0);
});

test("bokalek: animazioa, pizarra eta hurrengo bokala", async ({ page }) => {
  await page.goto("/invitado");
  await page.getByRole("button", { name: "Hasi bokalekin" }).click();
  await page.getByRole("button", { name: /Letra eta trazoa/ }).click();

  await expect(page.getByRole("img", { name: "a letraren trazoa" })).toBeVisible();
  await expect(page.getByTestId("guia-circulo")).toBeVisible();
  await page.getByRole("button", { name: "Maiuskula" }).click();
  await expect(page.getByRole("img", { name: "A letraren trazoa" })).toBeVisible();

  await page.getByRole("button", { name: "Traza ezazu" }).click();

  const pizarra = page.getByLabel("A letra trazatzea");
  await expect(pizarra).toBeVisible();

  const caja = await pizarra.boundingBox();
  if (caja) {
    await page.mouse.move(caja.x + caja.width * 0.3, caja.y + caja.height * 0.3);
    await page.mouse.down();
    await page.mouse.move(caja.x + caja.width * 0.6, caja.y + caja.height * 0.6, {
      steps: 8,
    });
    await page.mouse.up();
  }
  await expect(page.getByRole("button", { name: "Garbitu" })).toBeEnabled();

  await page.getByRole("button", { name: "Hurrengo bokala" }).click();
  await expect(page.getByRole("img", { name: "E letraren trazoa" })).toBeVisible();
});

test("bokalek: selector de formato de letra", async ({ page }) => {
  await page.goto("/invitado");
  await page.getByRole("button", { name: "Hasi bokalekin" }).click();

  await expect(page.getByText("a e i o u", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Maiuskula" }).click();
  await expect(page.getByText("A E I O U", { exact: true })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Hasi bokalekin" }).click();
  await expect(page.getByText("A E I O U", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Entzun letra eta aukeratu/ }).click();
  await expect(page.getByRole("button", { name: "Bokala a" })).toHaveText("A");

  await page.getByRole("button", { name: "Atzera" }).click();
  await page.getByRole("button", { name: "Nahasia" }).click();
  await expect(page.getByText("a E i O u", { exact: true })).toBeVisible();
});

test("bokalek: entzun letra eta aukeratu", async ({ page }) => {
  await page.goto("/invitado");
  await page.getByRole("button", { name: "Hasi bokalekin" }).click();
  await page.getByRole("button", { name: /Entzun letra eta aukeratu/ }).click();

  for (const vocal of ["a", "e", "i", "o", "u"]) {
    await expect(page.getByRole("button", { name: `Bokala ${vocal}` })).toBeVisible();
  }
});


