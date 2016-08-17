import React from 'react';

import Input from './Input';
import compat from './util/compat';
import { date as dateLocalizer } from './util/localizers';
import CustomPropTypes from './util/propTypes';
import _  from './util/_';

class DateTimePickerInput extends React.Component {

  static propTypes = {
    // @override - commented to remove console warning
    // format: CustomPropTypes.dateFormat.isRequired,
    editing: React.PropTypes.bool,
    editFormat: CustomPropTypes.dateFormat,
    parse: React.PropTypes.func.isRequired,

    value: React.PropTypes.instanceOf(Date),
    onChange: React.PropTypes.func.isRequired,
    culture: React.PropTypes.string
  };

  constructor(...args) {
    super(...args)

    let { value, editing, editFormat, format, culture } = this.props;

    this.state = {
      textValue: formatDate(
          value
        , editing && editFormat ? editFormat : format
        , culture
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    let { value, editing, editFormat, format, culture } = nextProps;

    this.setState({
      textValue: formatDate(
          value
        , editing && editFormat ? editFormat : format
        , culture
      )
    })
  }

  handleChange = ({ target: { value } }) => {
    this._needsFlush = true
    this.setState({ textValue: value });
  };

  handleBlur = (event) => {
    let { format, culture, parse, onChange, onBlur } = this.props;

    onBlur && onBlur(event)

    if (this._needsFlush) {
      let date = parse(event.target.value);

      this._needsFlush = false
      onChange(date, formatDate(date, format, culture))
    }
  };

  render() {
    let { disabled, readOnly } = this.props
    let { textValue } = this.state

    let props = _.omitOwnProps(this);

    return (
      <Input
        {...props}
        type='text'
        className="rw-widget-input"
        value={textValue}
        disabled={disabled}
        readOnly={readOnly}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    )
  }

  focus(){
    compat.findDOMNode(this).focus()
  }
}

export default DateTimePickerInput;

function isValid(d) {
  return !isNaN(d.getTime());
}

function formatDate(date, format, culture){
  var val = ''

  if ( (date instanceof Date) && isValid(date) )
    val = dateLocalizer.format(date, format, culture)

  return val;
}
