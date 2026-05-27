import { expect, test } from '@playwright/test'

const twelveHourTimePattern = /^\d{2}:\d{2}:\d{2} (AM|PM)$/
const twentyFourHourTimePattern = /^\d{2}:\d{2}:\d{2}$/

test('toggles the clock format and persists it after reload', async ({
  page,
}) => {
  await page.goto('/')

  const clock = page.getByLabel('Current time')
  const toggle = page.getByRole('switch', { name: 'Use 24-hour time' })

  await expect(clock).toBeVisible()
  await expect(clock).toHaveText(twentyFourHourTimePattern)
  await expect(toggle).toHaveAttribute('aria-checked', 'true')

  await toggle.click()

  await expect(clock).toHaveText(twelveHourTimePattern)
  await expect(toggle).toHaveAttribute('aria-checked', 'false')

  await page.reload()

  await expect(page.getByLabel('Current time')).toHaveText(
    twelveHourTimePattern,
  )
  await expect(
    page.getByRole('switch', { name: 'Use 24-hour time' }),
  ).toHaveAttribute('aria-checked', 'false')
})
