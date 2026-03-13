import { test, expect } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Landing Page Object Model
 * Updated for neo-brutalist single-column layout
 */
class LandingPage extends BasePage {
  readonly heroHeadline = this.page.getByRole("heading", {
    name: /Gestión Estratégica/i,
  });
  readonly mvpBadge = this.page.getByText("MVP V1.0");
  readonly ctaButton = this.page.getByRole("link", {
    name: /Ingresar al Dashboard/i,
  });
  readonly description = this.page.getByText(
    /Optimiza tus archivos Excel con Inteligencia Artificial/i
  );

  async goto(): Promise<void> {
    await super.goto("/");
  }
}

test.describe("Landing Page", () => {
  test(
    "should display hero section with headline and badge",
    { tag: ["@critical", "@e2e", "@landing", "@LANDING-E2E-001"] },
    async ({ page }) => {
      const landingPage = new LandingPage(page);

      await landingPage.goto();

      await expect(landingPage.heroHeadline).toBeVisible();
      await expect(landingPage.mvpBadge).toBeVisible();
      await expect(landingPage.description).toBeVisible();
      await expect(landingPage.ctaButton).toBeVisible();
    }
  );

  test(
    "should display description with border accent",
    { tag: ["@high", "@e2e", "@landing", "@LANDING-E2E-002"] },
    async ({ page }) => {
      const landingPage = new LandingPage(page);

      await landingPage.goto();

      // Verify the description paragraph has a left border accent
      const descriptionParagraph = page.locator("p.border-l-4");
      await expect(descriptionParagraph).toBeVisible();

      // Verify key text content
      await expect(
        page.getByText(/Limpia, estructura y audita tus datos/i)
      ).toBeVisible();
    }
  );

  test(
    "should display 'Datos Pyme' in orange accent color",
    { tag: ["@medium", "@e2e", "@landing", "@LANDING-E2E-003"] },
    async ({ page }) => {
      const landingPage = new LandingPage(page);

      await landingPage.goto();

      // Verify the orange accent span exists
      const orangeSpan = page.locator("span.text-\\[\\#FF6B00\\]");
      await expect(orangeSpan).toBeVisible();
      await expect(orangeSpan).toHaveText("Datos Pyme");
    }
  );

  test(
    "should navigate to dashboard when CTA clicked",
    { tag: ["@critical", "@e2e", "@landing", "@LANDING-E2E-004"] },
    async ({ page }) => {
      const landingPage = new LandingPage(page);

      await landingPage.goto();

      await landingPage.ctaButton.click();

      await landingPage.waitForNavigation(/\/dashboard/);
      await expect(page).toHaveURL(/\/dashboard/);
    }
  );

  test(
    "should have correct page title",
    { tag: ["@medium", "@e2e", "@landing", "@LANDING-E2E-005"] },
    async ({ page }) => {
      const landingPage = new LandingPage(page);

      await landingPage.goto();

      // Title comes from root layout metadata
      await expect(page).toHaveTitle(/Compensar/);
    }
  );
});
