import { expect, test, type Page } from "@playwright/test";

const SILABAS = ["ma", "me", "mi", "mo", "mu"];
const TODAS_LAS_PALABRAS = ["mamua", "umea", "mimo", "ama", "amama", "momia"];

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


test("las fotos de las seis palabras existen y se renderizan", async ({ page }) => {
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

