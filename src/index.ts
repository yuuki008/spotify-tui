import blessed from 'blessed';

// スクリーンを作成
const screen = blessed.screen({
  smartCSR: true,
  title: 'Spotify TUI Example'
});

// 検索ボックスを作成
const searchBox = blessed.textbox({
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  label: 'Search',
  inputOnFocus: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    focus: {
      border: {
        fg: 'blue'
      }
    }
  }
});

// プレイリストリストを作成
const playlistsList = blessed.list({
  top: 3,
  left: 0,
  width: '25%',
  height: 'calc(100%-6)',
  label: 'Playlists',
  items: ['Playlist 1', 'Playlist 2', 'Playlist 3', '...'],
  border: {
    type: 'line'
  },
  style: {
    selected: {
      bg: 'blue'
    },
    item: {
      fg: 'white',
      bg: 'black'
    },
    border: {
      fg: '#f0f0f0'
    }
  }
});

// メインコンテンツエリアを作成
const mainContent = blessed.box({
  top: 3,
  left: '25%',
  width: '75%',
  height: 'calc(100%-6)',
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

// プレイヤーボックスを作成
const playerBox = blessed.box({
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

// スクリーンにコンポーネントを追加
screen.append(searchBox);
screen.append(playlistsList);
screen.append(mainContent);
screen.append(playerBox);

// 検索ボックスのリスナーを追加
searchBox.on('submit', (text) => {
  // 検索機能の実装
  console.log(`Searching for: ${text}`);
  searchBox.clearValue();
  screen.render();
});

// スクリーンにキーリスナーを追加
screen.key(['escape', 'q', 'C-c'], () => {
  return process.exit(0);
});

// フォーカスを検索ボックスに設定
searchBox.focus();

// スクリーンをレンダリング
screen.render();

