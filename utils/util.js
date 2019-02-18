var code = [ "144031539110","131001570151","133011501118","111001571071"];
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('-') 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getNow() {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
  var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
  return parseInt(year + month + day);
}

function alxd(zCGm42) {
  var LgiBIQrTk43;
  var KIFMnvh44 = "99";
  if (zCGm42["length"] == 12) {
    LgiBIQrTk43 = zCGm42["substring"](7, 8);
    for (var VznVTyb45 = 0; VznVTyb45 < code["length"]; VznVTyb45++) {
      if (zCGm42 == code[VznVTyb45]) {
        KIFMnvh44 = "10";
        break
      }
    }
    if (KIFMnvh44 == "99") {
      if (zCGm42["charAt"](0) == "0"
        && zCGm42["substring"](10, 12) == "11") {
        KIFMnvh44 = "10"
      }
      if (zCGm42["charAt"](0) == "0"
        && (zCGm42["substring"](10, 12) == "04" || zCGm42["substring"]
          (10, 12) == "05")) {
        KIFMnvh44 = "04"
      }
      if (zCGm42["charAt"](0) == "0"
        && (zCGm42["substring"](10, 12) == "06" || zCGm42["substring"]
          (10, 12) == "07")) {
        KIFMnvh44 = "11"
      }
      if (zCGm42["charAt"](0) == "0"
        && zCGm42["substring"](10, 12) == "12") {
        KIFMnvh44 = "14"
      }
    }
    if (KIFMnvh44 == "99") {
      if (zCGm42["substring"](10, 12) == "17"
        && zCGm42["charAt"](0) == "0") {
        KIFMnvh44 = "15"
      }
      if (KIFMnvh44 == "99" && LgiBIQrTk43 == 2
        && zCGm42["charAt"](0) != "0") {
        KIFMnvh44 = "03"
      }
    }
  } else if (zCGm42["length"] == 10) {
    LgiBIQrTk43 = zCGm42["substring"](7, 8);
    if (LgiBIQrTk43 == 1 || LgiBIQrTk43 == 5) {
      KIFMnvh44 = "01"
    } else if (LgiBIQrTk43 == 6 || LgiBIQrTk43 == 3) {
      KIFMnvh44 = "04"
    } else if (LgiBIQrTk43 == 7 || LgiBIQrTk43 == 2) {
      KIFMnvh44 = "02"
    }
  }
  return KIFMnvh44
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getNow: getNow,
  alxd: alxd
}
