import { useCallback, useEffect, useReducer } from 'react';
import { RotateCcw } from 'lucide-react';
import { Flash } from '@/components/Flash';
import { Avatar } from '@/components/kit/Avatar';
import { clockNow } from '@/lib/clock';
import { reducer } from '@/lib/reducer';
import { makeSeed } from '@/lib/seed';
import type { Screen } from '@/lib/types';
import { FOCUS_CN } from '@/lib/ui';
import { useNow } from '@/lib/useNow';
import { Find } from '@/screens/Find';
import { Home } from '@/screens/Home';
import { OpenHouseScreen } from '@/screens/OpenHouse';
import { Post } from '@/screens/Post';
import { cn } from '@/lib/cn';

const PERSONAS: { id: string; role: string }[] = [
  { id: 'maya', role: 'Listing agent' },
  { id: 'jordan', role: 'Host' },
];

const NAV: { label: string; screen: Screen }[] = [
  { label: 'Home', screen: { name: 'home' } },
  { label: 'Post an open house', screen: { name: 'post' } },
  { label: 'Find open houses', screen: { name: 'find' } },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => makeSeed(clockNow()));
  const now = useNow();
  const me = state.agents[state.personaId];
  const clearFlash = useCallback(() => dispatch({ type: 'flash', message: null }), []);
  const screen = state.screen;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, state.personaId]);

  return (
    <div className="min-h-dvh pb-24">
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
          <button type="button" onClick={() => dispatch({ type: 'go', screen: { name: 'home' } })} className={cn('flex items-baseline gap-2 rounded-kit', FOCUS_CN)}>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">Cover</span>
            <span className="hidden text-sm text-mist sm:inline">Open house coverage</span>
          </button>

          <nav aria-label="Tasks" className="order-last flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {NAV.map(item => {
              const active = screen.name === item.screen.name;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => dispatch({ type: 'go', screen: item.screen })}
                  className={cn('-mb-3 min-h-11 whitespace-nowrap border-b-2 px-1 text-sm font-medium', active ? 'border-accent text-ink' : 'border-transparent text-mist hover:text-ink', FOCUS_CN)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div role="group" aria-label="Viewing as" className="flex rounded-full border border-line bg-ground p-0.5">
              {PERSONAS.map(p => {
                const a = state.agents[p.id];
                const active = state.personaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => dispatch({ type: 'setPersona', id: p.id })}
                    className={cn('flex min-h-9 items-center gap-2 rounded-full py-0.5 pl-1 pr-3 text-left', active ? 'bg-paper text-ink' : 'text-mist hover:text-ink', FOCUS_CN)}
                  >
                    <Avatar initials={a.initials} size="sm" className={active ? 'bg-accent text-accent-ink' : undefined} />
                    <span className="leading-tight">
                      <span className="block text-xs font-bold">{a.name.split(' ')[0]}</span>
                      <span className="block text-[11px] text-mist">{p.role}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'reset', now: clockNow() })}
              title="Reset demo"
              aria-label="Reset demo"
              className={cn('flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-mist hover:text-ink', FOCUS_CN)}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        {screen.name === 'home' ? <Home state={state} now={now} dispatch={dispatch} /> : null}
        {screen.name === 'post' ? <Post key={me.id} state={state} now={now} dispatch={dispatch} /> : null}
        {screen.name === 'find' ? <Find key={me.id} state={state} now={now} dispatch={dispatch} /> : null}
        {screen.name === 'openHouse' ? <OpenHouseScreen key={`${screen.id}-${me.id}`} state={state} id={screen.id} now={now} dispatch={dispatch} /> : null}
      </main>

      <Flash message={state.flash} onClose={clearFlash} />
    </div>
  );
}
