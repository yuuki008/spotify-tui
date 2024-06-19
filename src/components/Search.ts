import blessed from 'blessed';

export function Search(): blessed.Widgets.TextboxElement {
  return blessed.textbox({
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
}

