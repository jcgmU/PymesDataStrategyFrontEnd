import { test, expect } from "@playwright/test";
import { BasePage } from "./base-page";

/**
 * Dashboard Page Object Model
 * Updated for neo-brutalist card-based layout with sidebar
 */
class DashboardPage extends BasePage {
  // Sidebar elements
  readonly sidebar = this.page.locator("aside");
  readonly sidebarLogo = this.page.locator("aside").getByRole("link").first();
  readonly navDashboard = this.page.getByRole("link", { name: /Dashboard/i });
  readonly navConfiguracion = this.page.getByRole("link", {
    name: /Configuración/i,
  });
  readonly logoutButton = this.page.getByRole("button", {
    name: /Cerrar Sesión/i,
  });

  // Header
  readonly panelTitle = this.page.getByRole("heading", {
    name: /Panel de Control/i,
  });
  readonly adminBadge = this.page.getByText("Administrador");

  // File dropzone
  readonly dropzoneArea = this.page.locator('[class*="border-dashed"]');
  readonly dropzoneText = this.page.getByText("Arrastra tu Excel aquí");
  readonly fileInput = this.page.locator('input[type="file"]');
  readonly selectFileButton = this.page.getByRole("button", {
    name: /Seleccionar Archivo/i,
  });

  // Dataset cards
  readonly recentFilesHeading = this.page.getByRole("heading", {
    name: /Archivos Recientes/i,
  });
  readonly emptyState = this.page.getByText("No hay archivos cargados aún.");

  async goto(): Promise<void> {
    await super.goto("/dashboard");
  }
}

test.describe("Dashboard Page", () => {
  test(
    "should display sidebar with logo, navigation and logout",
    { tag: ["@critical", "@e2e", "@dashboard", "@DASHBOARD-E2E-001"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Verify sidebar is visible
      await expect(dashboardPage.sidebar).toBeVisible();

      // Verify logo text "Data" and "Strategy"
      await expect(dashboardPage.sidebar.getByText("Data")).toBeVisible();
      await expect(dashboardPage.sidebar.getByText("Strategy")).toBeVisible();

      // Verify navigation items
      await expect(dashboardPage.navDashboard).toBeVisible();
      await expect(dashboardPage.navConfiguracion).toBeVisible();

      // Verify logout button
      await expect(dashboardPage.logoutButton).toBeVisible();
    }
  );

  test(
    "should display header with title and admin badge",
    { tag: ["@high", "@e2e", "@dashboard", "@DASHBOARD-E2E-002"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      await expect(dashboardPage.panelTitle).toBeVisible();
      await expect(dashboardPage.adminBadge).toBeVisible();
      await expect(
        page.getByText("Sube tus archivos Excel para análisis estructurado.")
      ).toBeVisible();
    }
  );

  test(
    "should display FileDropzone area",
    { tag: ["@critical", "@e2e", "@dashboard", "@DASHBOARD-E2E-003"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Verify dropzone is visible
      await expect(dashboardPage.dropzoneArea).toBeVisible();
      await expect(dashboardPage.dropzoneText).toBeVisible();

      // Verify file input exists (hidden)
      await expect(dashboardPage.fileInput).toBeAttached();

      // Verify supported formats text
      await expect(
        page.getByText("Máximo 50,000 registros (.xlsx)")
      ).toBeVisible();

      // Verify select file button
      await expect(dashboardPage.selectFileButton).toBeVisible();
    }
  );

  test(
    "should display recent files section with dataset cards",
    { tag: ["@high", "@e2e", "@dashboard", "@DASHBOARD-E2E-004"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Verify "Archivos Recientes" heading
      await expect(dashboardPage.recentFilesHeading).toBeVisible();

      // Wait for datasets to load
      await page.waitForTimeout(500);

      // Either we see dataset cards or the empty state
      const hasCards =
        (await page
          .locator('[class*="shadow-"][class*="border-2"]')
          .filter({ hasText: "filas" })
          .count()) > 0;
      const hasEmptyState = await dashboardPage.emptyState
        .isVisible()
        .catch(() => false);

      expect(hasCards || hasEmptyState).toBeTruthy();
    }
  );

  test(
    "should show 'Revisar Anomalías' button for datasets awaiting review",
    { tag: ["@critical", "@e2e", "@dashboard", "@DASHBOARD-E2E-005"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Wait for datasets to load
      await page.waitForTimeout(500);

      // Check if there are datasets with "PENDIENTE DE REVISIÓN" status
      const reviewBadges = page.getByText("PENDIENTE DE REVISIÓN");
      const count = await reviewBadges.count();

      if (count > 0) {
        // Verify "Revisar Anomalías" button is visible
        const reviewButtons = page.getByRole("button", {
          name: /Revisar Anomalías/i,
        });
        await expect(reviewButtons.first()).toBeVisible();
      }
    }
  );

  test(
    "should navigate to review page when 'Revisar Anomalías' clicked",
    { tag: ["@critical", "@e2e", "@dashboard", "@DASHBOARD-E2E-006"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Wait for datasets to load
      await page.waitForTimeout(500);

      // Find a "Revisar Anomalías" button and click it
      const reviewButtons = page.getByRole("button", {
        name: /Revisar Anomalías/i,
      });
      const count = await reviewButtons.count();

      if (count > 0) {
        await reviewButtons.first().click();

        // Verify navigation to review page
        await expect(page).toHaveURL(/\/dashboard\/review\/[a-zA-Z0-9-]+/);
      }
    }
  );

  test(
    "should navigate to landing when logout clicked",
    { tag: ["@high", "@e2e", "@dashboard", "@DASHBOARD-E2E-007"] },
    async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      await dashboardPage.logoutButton.click();

      // Should navigate back to landing page
      await expect(page).toHaveURL("/");
    }
  );
});
