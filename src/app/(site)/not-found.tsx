import { Action } from '@/components/public/Studio'
export default function NotFound() {
  return <section className="studio-container not-found"><h1>This one’s<br />out of the frame.</h1><p>The page may have moved, or the project isn’t published yet.</p><Action href="/work">Explore our work</Action></section>
}
