import blessed from 'blessed';

export function Main(): blessed.Widgets.BoxElement {
  return blessed.box({
    top: 3,
    left: '25%',
    width: '75%',
    height: '100%-6',
    label: 'Welcome!',
    content: `ようこそ！Spotify TUIへ。

このアプリケーションでは、以下の機能を提供します：
- プレイリストの表示
- 曲の検索
- 再生コントロール

お楽しみください！`,
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

