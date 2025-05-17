import { render, screen } from '@testing-library/react'
import ChatMessage from '../apps/chat/components/ChatMessage'
import '@testing-library/jest-dom'

test('renders user message bubble', () => {
  render(<ChatMessage role="user" text="Olá" />)
  expect(screen.getByText('Olá')).toBeInTheDocument()
})
