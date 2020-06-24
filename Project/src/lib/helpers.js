const moment=require('moment');
const helpers = {};

helpers.index = (index) => {
  index++;
  return index;
};

helpers.selected = (value, options) => {
  return options.fn(this).split('\n').map(function (v) {
    var t = 'value="' + value + '"'
    return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
  })
    .join('\n')
};

helpers.room_status = (value) => {
  switch (value) {
    case 1:
      return "Vacant"; break;
    case 2:
      return "Occupied"; break;
    case 3:
      return "Out of service"
  }
};

helpers.checked = (value) => {
  if(value){
    return "checked";
  }
  return "";
}

helpers.formatday=(time)=>{
  return moment(time).format('L');
}

helpers.momentnow=()=>{
  return moment().format('L');
}

module.exports = helpers;