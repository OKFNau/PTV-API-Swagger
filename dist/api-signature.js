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

function setSignatureHooks() {
  $("#api_info").append(      
    '<div class="input devkeybox">' +
    'To play with the API, type your private developer key here: ' + 
    '<input placeholder="12345678-abcd-1234-fgab-1234567890ab" id="input_devkey" name="apiKey" type="text"/></div>');

  $("#input_apiKey").hide();
  $("#header").hide();
  // set all devids once you change one.
  $("input[name='devid']").change(function(ev) {
    var devid = $(this).val();
    $("input[name='devid']").each(function(i, e) {
      $(e).val(devid); 
    });
  });

  $(".sandbox").each(function(i,sandbox) {
    var sigbox = $(sandbox).find("input[name='signature']");
    var devid = $(sandbox).find("input[name='devid']").val();
    $(sandbox).find("input[type='text'][name!='signature']").each(function(i, textbox) {
      $(textbox).change (function(e) {
        var timestamp = new Date().toISOString().replace(/\.\d*Z$/,"");
        $("input[name='timestamp']").val(timestamp);


        var devkey = $("#input_devkey").val(); 
        var call = getURL(sandbox);
        console.log("Get HMAC of: " + call);
        var shaObj = new jsSHA(call, "TEXT");
        var hmac = shaObj.getHMAC(devkey, "TEXT", "SHA-1", "HEX");
        console.log("Result: " + hmac);
        $(sigbox).val(hmac.toUpperCase());

        // $($(".sandbox")[0]).parent().parent().find(".path").text().trim()
      });
    });
  });

}