import React from 'react';
import events from '../utils/events';
import f7 from '../utils/f7';
import Utils from '../utils/utils';
import Mixins from '../utils/mixins';
import __reactComponentDispatchEvent from '../runtime-helpers/react-component-dispatch-event.js';
import __reactComponentSlots from '../runtime-helpers/react-component-slots.js';
import __reactComponentSetProps from '../runtime-helpers/react-component-set-props.js';

class F7Tab extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.__reactRefs = {};

    this.state = (() => {
      return {
        tabContent: null
      };
    })();

    (() => {
      this.onTabShowBound = this.onTabShow.bind(this);
      this.onTabHideBound = this.onTabHide.bind(this);
    })();
  }

  show(animate) {
    if (!this.$f7) return;
    this.$f7.tab.show(this.refs.el, animate);
  }

  onTabShow(e) {
    this.dispatchEvent('tab:show tabShow', e);
  }

  onTabHide(e) {
    this.dispatchEvent('tab:hide tabHide', e);
  }

  render() {
    const self = this;
    const props = self.props;
    const {
      tabActive,
      id,
      className,
      style
    } = props;
    const tabContent = self.state.tabContent;
    const classes = Utils.classNames(className, 'tab', {
      'tab-active': tabActive
    }, Mixins.colorClasses(props));
    let TabContent;
    if (tabContent) TabContent = tabContent.component;
    {
      return React.createElement('div', {
        id: id,
        style: style,
        ref: __reactNode => {
          this.__reactRefs['el'] = __reactNode;
        },
        className: classes
      }, tabContent ? React.createElement(TabContent, Object.assign({
        key: tabContent.id
      }, tabContent.props)) : this.slots['default']);
    }
  }

  componentDidMount() {
    const self = this;
    const el = self.refs.el;

    if (el) {
      el.addEventListener('tab:show', self.onTabShowBound);
      el.addEventListener('tab:hide', self.onTabHideBound);
    }

    self.setState({
      tabContent: null
    });
    self.$f7ready(() => {
      self.routerData = {
        el,
        component: self
      };
      f7.routers.tabs.push(self.routerData);
    });
  }

  componentWillUnmount() {
    const self = this;
    const el = self.refs.el;

    if (el) {
      el.removeEventListener('tab:show', self.onTabShowBound);
      el.removeEventListener('tab:hide', self.onTabHideBound);
    }

    if (!self.routerData) return;
    f7.routers.tabs.splice(f7.routers.tabs.indexOf(self.routerData), 1);
    self.routerData = null;
    delete self.routerData;
  }

  componentDidUpdate() {
    const self = this;
    if (!self.routerData) return;
    events.emit('tabRouterDidUpdate', self.routerData);
  }

  get slots() {
    return __reactComponentSlots(this.props);
  }

  dispatchEvent(events, ...args) {
    return __reactComponentDispatchEvent(this, events, ...args);
  }

  get refs() {
    return this.__reactRefs;
  }

  set refs(refs) {}

}

__reactComponentSetProps(F7Tab, Object.assign({
  id: [String, Number],
  tabActive: Boolean
}, Mixins.colorProps));

F7Tab.displayName = 'f7-tab';
export default F7Tab;