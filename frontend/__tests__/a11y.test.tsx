import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Chat from '../apps/chat/components/Chat'
expect.extend(toHaveNoViolations)

test('Chat component is accessible', async () => {
  const { container } = render(<Chat />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
