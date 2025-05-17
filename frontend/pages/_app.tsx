import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import FlipDeck from '../components/FlipDeck'
import OnboardingOverlay from '../components/OnboardingOverlay'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <FlipDeck />
}
