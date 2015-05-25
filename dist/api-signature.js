function parameterChange(e) {

}

function setSignatureHooks() {
  $(".sandbox").each(function(i,sandbox) {
    var sigbox = $(sandbox).find("input[name='signature']");
    $(sandbox).find("input[type='text'][name!='signature']").each(function(i, textbox) {
      $(textbox).change (function(e) {
        $(sigbox).val($(textbox).val());
      });
    });
  });

}