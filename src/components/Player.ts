import blessed from 'blessed';

export function Player(): blessed.Widgets.BoxElement {
  return blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    label: 'Now Playing',
    content: 'No song playing currently',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: '#f0f0f0'
      }
    }
  });
}

