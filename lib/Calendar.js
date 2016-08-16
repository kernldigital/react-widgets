'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _VIEW, _OPPOSITE_DIRECTION, _MULTIPLIER, _desc, _value2, _obj; /**
                                                                    * HACKED / REVERSED CALENDAR
                                                                    * This date picker has an odd workflow where if a user wants to enter a year
                                                                    * they must navigate upwards from day -> month -> year -> decade -> century
                                                                    * we wanted the opposite workflow where a user picks a date first and navigates
                                                                    * down until they have chosen a date.
                                                                    *
                                                                    * The overides in this file are documented with an @overide comment block.
                                                                    *
                                                                    * This file is forked from https://github.com/jquense/react-widgets/commit/e0dc5f3735606ded935c7bd073ee9670b9be0872
                                                                    * or the tagged release Release v4.0.0-beta.3.
                                                                    *
                                                                    */

//values, omit


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _compat = require('./util/compat');

var _compat2 = _interopRequireDefault(_compat);

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Month = require('./Month');

var _Month2 = _interopRequireDefault(_Month);

var _Year = require('./Year');

var _Year2 = _interopRequireDefault(_Year);

var _Decade = require('./Decade');

var _Decade2 = _interopRequireDefault(_Decade);

var _Century = require('./Century');

var _Century2 = _interopRequireDefault(_Century);

var _localizers = require('./util/localizers');

var _propTypes = require('./util/propTypes');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _SlideTransition = require('./SlideTransition');

var _SlideTransition2 = _interopRequireDefault(_SlideTransition);

var _dates = require('./util/dates');

var _dates2 = _interopRequireDefault(_dates);

var _constants = require('./util/constants');

var constants = _interopRequireWildcard(_constants);

var _2 = require('./util/_');

var _3 = _interopRequireDefault(_2);

var _widgetHelpers = require('./util/widgetHelpers');

var _interaction = require('./util/interaction');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var dir = constants.directions,
    values = function values(obj) {
  return Object.keys(obj).map(function (k) {
    return obj[k];
  });
},
    invert = function invert(obj) {
  return _3.default.transform(obj, function (o, val, key) {
    o[val] = key;
  }, {});
};

var views = constants.calendarViews,
    VIEW_OPTIONS = values(views),
    ALT_VIEW = invert(constants.calendarViewHierarchy),
    NEXT_VIEW = constants.calendarViewHierarchy,
    VIEW_UNIT = constants.calendarViewUnits,
    VIEW = (_VIEW = {}, _VIEW[views.MONTH] = _Month2.default, _VIEW[views.YEAR] = _Year2.default, _VIEW[views.DECADE] = _Decade2.default, _VIEW[views.CENTURY] = _Century2.default, _VIEW);

var ARROWS_TO_DIRECTION = {
  ArrowDown: dir.DOWN,
  ArrowUp: dir.UP,
  ArrowRight: dir.RIGHT,
  ArrowLeft: dir.LEFT
};

var OPPOSITE_DIRECTION = (_OPPOSITE_DIRECTION = {}, _OPPOSITE_DIRECTION[dir.LEFT] = dir.RIGHT, _OPPOSITE_DIRECTION[dir.RIGHT] = dir.LEFT, _OPPOSITE_DIRECTION);

var MULTIPLIER = (_MULTIPLIER = {}, _MULTIPLIER[views.YEAR] = 1, _MULTIPLIER[views.DECADE] = 10, _MULTIPLIER[views.CENTURY] = 100, _MULTIPLIER);

var format = function format(props, f) {
  return _localizers.date.getFormat(f, props[f + 'Format']);
};

var propTypes = {
  activeId: _react2.default.PropTypes.string,
  disabled: _propTypes2.default.disabled,
  readOnly: _propTypes2.default.readOnly,

  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.instanceOf(Date),

  min: _react2.default.PropTypes.instanceOf(Date),
  max: _react2.default.PropTypes.instanceOf(Date),

  currentDate: _react2.default.PropTypes.instanceOf(Date),
  onCurrentDateChange: _react2.default.PropTypes.func,

  view: _react2.default.PropTypes.oneOf(VIEW_OPTIONS),
  initialView: _react2.default.PropTypes.oneOf(VIEW_OPTIONS),

  /**
  * @override - finalView proptype check is vastly simplified.
  *
  *  finalView(props, propName, componentName) {
  *    var err = React.PropTypes.oneOf(VIEW_OPTIONS)(props, propName, componentName)
  *
  *    if (err) return err
  *    if (VIEW_OPTIONS.indexOf(props[propName]) < VIEW_OPTIONS.indexOf(props.initialView))
  *      return new Error(`The \`${propName}\` prop: \`${props[propName]}\` cannot be 'lower' than the \`initialView\`
  *        prop. This creates a range that cannot be rendered.`.replace(/\n\t/g, ''))
  *  },
  *
   */
  finalView: _react2.default.PropTypes.oneOf(VIEW_OPTIONS),

  onViewChange: _react2.default.PropTypes.func,
  onNavigate: _react2.default.PropTypes.func,
  culture: _react2.default.PropTypes.string,
  footer: _react2.default.PropTypes.bool,

  dayComponent: _propTypes2.default.elementType,
  headerFormat: _propTypes2.default.dateFormat,
  footerFormat: _propTypes2.default.dateFormat,

  dayFormat: _propTypes2.default.dateFormat,
  dateFormat: _propTypes2.default.dateFormat,
  monthFormat: _propTypes2.default.dateFormat,
  yearFormat: _propTypes2.default.dateFormat,
  decadeFormat: _propTypes2.default.dateFormat,
  centuryFormat: _propTypes2.default.dateFormat,

  messages: _react2.default.PropTypes.shape({
    moveBack: _react2.default.PropTypes.string,
    moveForward: _react2.default.PropTypes.string
  })
};

var Calendar = _react2.default.createClass((_obj = {

  displayName: 'Calendar',

  mixins: [require('./mixins/TimeoutMixin'), require('./mixins/AutoFocusMixin'), require('./mixins/PureRenderMixin'), require('./mixins/RtlParentContextMixin'), require('./mixins/FocusMixin')({
    willHandle: function willHandle() {
      if (+this.props.tabIndex === -1) return false;
    }
  })],

  propTypes: propTypes,

  getInitialState: function getInitialState() {
    return {
      selectedIndex: 0,
      /**
       * @override - initialView set to century
       *    view: this.props.initialView || 'month'
       */
      view: this.props.initialView || 'century'
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {

      value: null,
      min: new Date(1900, 0, 1),
      max: new Date(2099, 11, 31),

      /**
       * @override - default props for final and initial views overridden
       *   initialView:  'month',
       *   finalView:    'century',
       */
      initialView: 'century',
      finalView: 'month',

      tabIndex: '0',
      footer: true,

      messages: msgs({})
    };
  },
  componentWillMount: function componentWillMount() {
    this.viewId = (0, _widgetHelpers.instanceId)(this, '_calendar');
    this.labelId = (0, _widgetHelpers.instanceId)(this, '_calendar_label');
    this.activeId = this.props.activeId || (0, _widgetHelpers.instanceId)(this, '_calendar_active_cell');
  },
  componentWillReceiveProps: function componentWillReceiveProps(_ref) {
    var initialView = _ref.initialView;
    var finalView = _ref.finalView;
    var value = _ref.value;
    var currentDate = _ref.currentDate;

    /**
     * @override - bottom & top concepts reversed
     *  let bottom  = VIEW_OPTIONS.indexOf(initialView)
     *  , top     = VIEW_OPTIONS.indexOf(finalView)
     */

    var bottom = VIEW_OPTIONS.indexOf(finalView),
        top = VIEW_OPTIONS.indexOf(initialView),
        current = VIEW_OPTIONS.indexOf(this.state.view),
        view = this.state.view,
        val = this.inRangeValue(value);

    if (current < bottom) this.setState({ view: view = initialView });else if (current > top) this.setState({ view: view = finalView });

    //if the value changes reset views to the new one
    if (!_dates2.default.eq(val, dateOrNull(this.props.value), VIEW_UNIT[view])) {
      this.setCurrentDate(val, currentDate);
    }
  },
  getCurrentDate: function getCurrentDate() {
    return this.props.currentDate || this.props.value || new Date();
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var className = _props.className;
    var value = _props.value;
    var footerFormat = _props.footerFormat;
    var disabled = _props.disabled;
    var readOnly = _props.readOnly;
    var initialView = _props.initialView;
    var footer = _props.footer;
    var messages = _props.messages;
    var min = _props.min;
    var max = _props.max;
    var culture = _props.culture;
    var duration = _props.duration;
    var tabIndex = _props.tabIndex;
    var _state = this.state;
    var view = _state.view;
    var slideDirection = _state.slideDirection;
    var focused = _state.focused;

    var currentDate = this.getCurrentDate();

    var View = VIEW[view],
        unit = VIEW_UNIT[view],
        todaysDate = new Date(),
        todayNotInRange = !_dates2.default.inRange(todaysDate, min, max, view);

    unit = unit === 'day' ? 'date' : unit;

    var key = view + '_' + _dates2.default[view](currentDate);

    var elementProps = _3.default.omitOwnProps(this),
        viewProps = _3.default.pickProps(this.props, View);

    var isDisabled = disabled || readOnly;

    messages = msgs(this.props.messages);

    return _react2.default.createElement(
      _Widget2.default,
      _extends({}, elementProps, {
        role: 'group',
        focused: focused,
        disabled: disabled,
        readOnly: readOnly,
        tabIndex: tabIndex || 0,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        onKeyDown: this.handleKeyDown,
        className: (0, _classnames2.default)(className, 'rw-calendar rw-widget-container'),
        'aria-activedescendant': this.activeId
      }),
      _react2.default.createElement(_Header2.default, {
        label: this._label(),
        labelId: this.labelId,
        messages: messages
        /**
         * @override - swap finalView for initialView
         *   upDisabled={  isDisabled || view === finalView}
         */
        , upDisabled: isDisabled || view === initialView,
        prevDisabled: isDisabled || !_dates2.default.inRange(this.nextDate(dir.LEFT), min, max, view),
        nextDisabled: isDisabled || !_dates2.default.inRange(this.nextDate(dir.RIGHT), min, max, view),
        onViewChange: this.navigate.bind(null, dir.UP, null),
        onMoveLeft: this.navigate.bind(null, dir.LEFT, null),
        onMoveRight: this.navigate.bind(null, dir.RIGHT, null)
      }),
      _react2.default.createElement(
        _SlideTransition2.default,
        {
          ref: 'animation',
          duration: duration,
          direction: slideDirection,
          onAnimate: function onAnimate() {
            return focused && _this.focus();
          }
        },
        _react2.default.createElement(View, _extends({}, viewProps, {
          key: key,
          id: this.viewId,
          activeId: this.activeId,
          value: value,
          today: todaysDate,
          disabled: disabled,
          focused: currentDate,
          onChange: this.change,
          onKeyDown: this.handleKeyDown,
          'aria-labelledby': this.labelId
        }))
      ),
      footer && _react2.default.createElement(_Footer2.default, {
        value: todaysDate,
        format: footerFormat,
        culture: culture,
        disabled: disabled || todayNotInRange,
        readOnly: readOnly,
        onClick: this.select
      })
    );
  },
  navigate: function navigate(direction, date) {
    var view = this.state.view,
        slideDir = direction === dir.LEFT || direction === dir.UP ? 'right' : 'left';

    if (!date) date = [dir.LEFT, dir.RIGHT].indexOf(direction) !== -1 ? this.nextDate(direction) : this.getCurrentDate();

    if (direction === dir.DOWN) view = ALT_VIEW[view] || view;

    if (direction === dir.UP) view = NEXT_VIEW[view] || view;

    if (this.isValidView(view) && _dates2.default.inRange(date, this.props.min, this.props.max, view)) {
      (0, _widgetHelpers.notify)(this.props.onNavigate, [date, slideDir, view]);
      this.focus(true);

      this.setCurrentDate(date);

      this.setState({
        slideDirection: slideDir,
        view: view
      });
    }
  },
  focus: function focus() {
    if (+this.props.tabIndex > -1) _compat2.default.findDOMNode(this).focus();
  },
  change: function change(date) {
    /**
     * @override - swap logic for isAtBottomView
     *   let isAtBottomView = this.state.view === this.props.initialView;
     */
    var isAtBottomView = this.state.view === this.props.finalView;

    if (isAtBottomView) {
      this.setCurrentDate(date);

      (0, _widgetHelpers.notify)(this.props.onChange, date);

      this.focus();
      return;
    }

    this.navigate(dir.DOWN, date);
  },
  setCurrentDate: function setCurrentDate(date) {
    var currentDate = arguments.length <= 1 || arguments[1] === undefined ? this.getCurrentDate() : arguments[1];

    var inRangeDate = this.inRangeValue(date ? new Date(date) : currentDate);

    if (_dates2.default.eq(inRangeDate, dateOrNull(currentDate), VIEW_UNIT[this.state.view])) return;
    (0, _widgetHelpers.notify)(this.props.onCurrentDateChange, inRangeDate);
  },
  select: function select(date) {
    var _props2 = this.props;
    var initialView = _props2.initialView;
    var min = _props2.min;
    var max = _props2.max;
    var currentView = this.state.view;


    var currentDate = this.getCurrentDate();

    var slideDir = initialView !== currentView || _dates2.default.gt(date, currentDate) ? 'left' // move down to a the view
    : 'right';

    (0, _widgetHelpers.notify)(this.props.onChange, date);

    if (this.isValidView(initialView) && _dates2.default.inRange(date, min, max, initialView)) {
      this.focus();

      this.setCurrentDate(date);

      this.setState({
        slideDirection: slideDir,
        view: initialView
      });
    }
  },
  nextDate: function nextDate(direction) {
    var method = direction === dir.LEFT ? 'subtract' : 'add',
        view = this.state.view,
        unit = view === views.MONTH ? view : views.YEAR,
        multi = MULTIPLIER[view] || 1;

    return _dates2.default[method](this.getCurrentDate(), 1 * multi, unit);
  },
  handleKeyDown: function handleKeyDown(e) {
    var ctrl = e.ctrlKey || e.metaKey,
        key = e.key,
        direction = ARROWS_TO_DIRECTION[key],
        currentDate = this.getCurrentDate(),
        view = this.state.view,
        unit = VIEW_UNIT[view];

    if (key === 'Enter') {
      e.preventDefault();
      return this.change(currentDate);
    }

    if (direction) {
      if (ctrl) {
        e.preventDefault();
        this.navigate(direction);
      } else {
        if (this.isRtl() && OPPOSITE_DIRECTION[direction]) direction = OPPOSITE_DIRECTION[direction];

        var nextDate = _dates2.default.move(currentDate, this.props.min, this.props.max, view, direction);

        if (!_dates2.default.eq(currentDate, nextDate, unit)) {
          e.preventDefault();

          if (_dates2.default.gt(nextDate, currentDate, view)) this.navigate(dir.RIGHT, nextDate);else if (_dates2.default.lt(nextDate, currentDate, view)) this.navigate(dir.LEFT, nextDate);else this.setCurrentDate(nextDate);
        }
      }
    }

    (0, _widgetHelpers.notify)(this.props.onKeyDown, [e]);
  },
  _label: function _label() {
    var _props3 = this.props;
    var culture = _props3.culture;
    var props = _objectWithoutProperties(_props3, ['culture']);
    var view = this.state.view;
    var currentDate = this.getCurrentDate();

    switch (view) {
      case views.MONTH:
        return _localizers.date.format(currentDate, format(props, 'header'), culture);

      case views.YEAR:
        return _localizers.date.format(currentDate, format(props, 'year'), culture);

      case views.DECADE:
        return _localizers.date.format(_dates2.default.startOf(currentDate, 'decade'), format(props, 'decade'), culture);
      case views.CENTURY:
        return _localizers.date.format(_dates2.default.startOf(currentDate, 'century'), format(props, 'century'), culture);
    }
  },
  inRangeValue: function inRangeValue(_value) {
    var value = dateOrNull(_value);

    if (value === null) return value;

    return _dates2.default.max(_dates2.default.min(value, this.props.max), this.props.min);
  },


  /**
   * @override - reverse isValidView logic
   *   isValidView(next) {
   *     var bottom  = VIEW_OPTIONS.indexOf(this.props.initialView),
   *         top     = VIEW_OPTIONS.indexOf(this.props.finalView),
   *         current = VIEW_OPTIONS.indexOf(next);
   *
   *      return current <= bottom && current >= top
   *   }
   */

  isValidView: function isValidView(next) {
    var bottom = VIEW_OPTIONS.indexOf(this.props.finalView),
        top = VIEW_OPTIONS.indexOf(this.props.initialView),
        current = VIEW_OPTIONS.indexOf(next);

    return current >= bottom && current <= top;
  }
}, (_applyDecoratedDescriptor(_obj, 'navigate', [_interaction.widgetEditable], Object.getOwnPropertyDescriptor(_obj, 'navigate'), _obj), _applyDecoratedDescriptor(_obj, 'change', [_interaction.widgetEditable], Object.getOwnPropertyDescriptor(_obj, 'change'), _obj), _applyDecoratedDescriptor(_obj, 'select', [_interaction.widgetEditable], Object.getOwnPropertyDescriptor(_obj, 'select'), _obj), _applyDecoratedDescriptor(_obj, 'handleKeyDown', [_interaction.widgetEditable], Object.getOwnPropertyDescriptor(_obj, 'handleKeyDown'), _obj)), _obj));

function dateOrNull(dt) {
  if (dt && !isNaN(dt.getTime())) return dt;
  return null;
}

function msgs(msgs) {
  return _extends({
    moveBack: 'navigate back',
    moveForward: 'navigate forward'
  }, msgs);
}

exports.default = (0, _uncontrollable2.default)(Calendar, {
  value: 'onChange',
  currentDate: 'onCurrentDateChange',
  view: 'onViewChange'
}, ['focus']);
module.exports = exports['default'];