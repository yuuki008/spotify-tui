import blessed from 'blessed';

export function Main(content: string = 'ようこそ！Spotify TUIへ。'): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 3,
    left: '25%',
    width: '75%',
    height: '100%-6',
    label: 'Welcome!',
    content: content,
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

