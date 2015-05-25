function parameterChange(e) {

}

function getURL(sandbox) {
  var path = $(sandbox).parent().parent().find(".path").text().trim();
  var moreargs="?"
  if (path.match(/healthcheck/)) {
    path += "?timestamp={timestamp}";
    moreargs="&";
  }
  if (path.match(/stopping-pattern/)) {
    path += "?for_utc={for_utc}";
    moreargs="&";
  }
  path += moreargs + "devid={devid}" 
  var params=path.match(/{([^{}])*}/g);
  for (i=0; i < params.length; i++) {
    var param=params[i].replace(/[{}]/g,"");
    var pval = $(sandbox).find("input[name='" + param + "']").val();
    path = path.replace(params[i], encodeURIComponent(pval));
  }
  console.log(path);
  return path;

  // elements = $($(".sandbox")[0]).find("input[name='timestamp']")
}

function doCookies() {
  var m = document.cookie.match("ptv_devid=([^; ]+)");
  if (m) {
    $("#input_devid").val(m[1]);
    $("input[name='devid']").each(function(i, e) {
      $(e).val(m[1]); 
    });
  }
  m = document.cookie.match("ptv_devkey=([^; ]+)");
  if (m) {
    $("#input_devkey").val(m[1]);
  }
}

function devIdChange(ev) {
  var devid = $(this).val();
  $("input[name='devid']").each(function(i, e) {
    $(e).val(devid); 
  });

  setCookie("ptv_devid", devid, 7);
}

function devKeyChange(ev) {
  var devkey = $(this).val();

  setCookie("ptv_devkey", devkey, 7);
}
function setCookie(cname, cvalue, exdays) {
  // from http://www.w3schools.com/js/js_cookies.asp dear god
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

var paramBoxChange = function(sandbox, sigbox) {
  return function(e) {
    var devkey = $("#input_devkey").val(); 
    var call = getURL(sandbox);
    console.log("Get HMAC of: " + call);
    var shaObj = new jsSHA(call, "TEXT");
    var hmac = shaObj.getHMAC(devkey, "TEXT", "SHA-1", "HEX");
    console.log("Result: " + hmac);
    $(sigbox).val(hmac.toUpperCase());
  }
}


function setSignatureHooks() {
  $("#api_info").append(      
    '<div class="input devkeybox">' +
    '<p><span class="label">Your developer ID: </span>' +     
    '<input placeholder="100001" id="input_devid" name="global-devid" type="text"/>' + 
    '</p><p><span class="label"> Developer key: </span>' + 
    '<input placeholder="12345678-abcd-1234-fgab-1234567890ab" id="input_devkey" name="apiKey" type="text"/>' + 
    "</p><span class='explain'>Don't have a key? <a href='mailto:APIKeyRequest@ptv.vic.gov.au'>Email PTV</a>.</span>" +
    '</div>'

    );

  $(".sandbox").each(function(i,sandbox) {
    var sigbox = $(sandbox).find("input[name='signature']");
    var devid = $(sandbox).find("input[name='devid']").val();
    $(sandbox).find("input[type='text'][name!='signature']").each(function(i, textbox) {
      $(textbox).change (paramBoxChange(sandbox, sigbox));
    });
  });

  doCookies();

  var timestamp = new Date().toISOString().replace(/\.\d*Z$/,"");
  $("input[name='timestamp']").val(timestamp);

  $("#input_apiKey").hide();
  $("#header").hide();
  // set all devids once you change one.
  $("input[name='devid'],#input_devid").change(devIdChange);
  $("#input_devkey").change(devKeyChange);
  $("input[name='timestamp']").trigger("change");


}