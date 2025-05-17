import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'
import Chat from '../apps/chat/components/Chat'
expect.extend(toHaveNoViolations)

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

test('Chat component is accessible', async () => {
  const { container } = render(<Chat />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
