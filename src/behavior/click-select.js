const Util = require('../util');

module.exports = {
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'node:click': 'onClick',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown'
    };
  },
  onClick(e) {
    const self = this;
    const item = e.target;
    const graph = self.graph;
    const selected = this.selected;
    if (!self.multiple && selected.length > 0) {
      return;
    }
    const autoPaint = graph.get('autoPaint');
    graph.setAutoPaint(false);
    if (!self.keydown) {
      const selected = graph.findAll('node', node => {
        return node.hasState('selected');
      });
      if (selected.length > 1) {
        Util.each(selected, node => {
          graph.setItemState(node, 'selected', false);
        });
      }
    }
    if (item.hasState('selected')) {
      e.type = 'deselect';
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', false);
      }
    } else {
      e.type = 'select';
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'selected', true);
      }
    }
    graph.setAutoPaint(autoPaint);
    graph.paint();
  },
  onKeyDown(e) {
    const code = e.keyCode || e.which;
    if (code === 16) {
      this.keydown = true;
    } else {
      this.keydown = false;
    }
  },
  onKeyUp() {
    this.keydown = false;
  }
};
