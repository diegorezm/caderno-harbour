import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// "Caderno": teal night paper, cream ink, street-lamp amber; kraft paper by day.
const { theme, problems } = makeColors({
  label: 'Caderno harbour',
  roles: { accent: '#f0aa3c', danger: '#c0543a', success: '#9cc287', warning: '#d99a2b', pro: '#9a7fc0' },
  light: {
    roles: { accent: '#9a4a2f' },
    gray: {
      anchors: {
        'surface-0': '#e4d8bd',
        'surface-1': '#efe6d2',
        'surface-2': '#f6eedb',
        'text-primary': '#2b211a',
        'text-secondary': '#4a382a',
        'text-muted': '#5e4732',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#122a2b',
        'surface-1': '#152f30',
        'surface-2': '#183334',
        'surface-3': '#1a3637',
        'text-primary': '#efe6cf',
        'text-secondary': '#d9d6bf',
        'text-muted': '#b9c2ae',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'harbour', glass: { blur: 2, tint: '#1c3a3b', opacity: 0.35 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)
    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="A hand-drawn night harbour: an axolotl on the quay under a flickering street lamp" isInteractive />
  })
}
