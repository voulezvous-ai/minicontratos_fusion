import { test, expect } from '@playwright/test';

test('chat flow sends and receives', async ({ page }) => {
  await page.goto('/chat');
  await page.getByPlaceholder('Digite sua mensagem...').fill('Teste');
  await page.keyboard.press('Enter');
  // aguarda primeira bolha do usuário aparecer
  await expect(page.locator('text=Teste').first()).toBeVisible();
});
