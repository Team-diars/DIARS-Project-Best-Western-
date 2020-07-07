const moment = require('moment');
const numeral = require('numeral');
const bcrypt = require('bcryptjs');
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

helpers.book_status = (value) => {
  switch (value) {
    case 0:
      return "Cancelled"; break;    
    case 1:
      return "Success"; break;
    case 2:
      return "Finished"; break;
  }
};

helpers.checked = (value) => {
  if (value) {
    return "checked";
  }
  return "";
}

helpers.formatday = (time) => {
  return moment(time).format('MM/DD/YYYY');
}
helpers.momentnow = () => {
  return moment().format("MM/DD/YYYY");
}

helpers.momenttomorrow = () => {
  return moment().add(1, 'day').format("MM/DD/YYYY");
}

helpers.formatdb = (time) => {
  return moment(time).format('YYYY-MM-DD');
}

helpers.floor = (n) => {
  var number = numeral(n);
  return number.format('0o');
}

helpers.money = (n) => {
  var number = numeral(n);
  return number.format('0,0.00 $');
}

helpers.encryptpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.decryptpassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.decodeBase64(password)
  /* const hash =await bcrypt.hash(password,salt); */
  return hash;
};

helpers.matchpassword = async (password, savedpassword) => {
  try {
    return await bcrypt.compare(password, savedpassword);
  } catch (error) {
    return false;
  }
};

helpers.fixed = (n) => {
  var number = numeral(n);
  return number.format('0.00');
}

module.exports = helpers;