$(function(){

  //  form
  var $formName = $('#formName');
  const $formTag = $('#formTag');
  const $formColor = $('#formColor');
  const $formSize = $('#formSize');
  const $buttonBold = $('#formBold');
  const $buttonItalic = $('#formItalic');
  const $buttonUnderline = $('#formUnderline');
  const $formPreview = $('#formPreview');
  // editor
  const $layer = $('#editorLayer');
  const $background = $('#editorBackground');
  //
  const $textArea = $('#textArea');
  const $download = $('#buttonDownload');

  function getRGBColor(color) {
    switch (color) {
      case "white":
        return "rgb(255, 255, 255)";
      case "blue":
        return "rgb(19, 133, 247)";
      case "orange":
        return "rgb(229, 105, 22)";
      case "pink":
        return "rgb(229, 22, 184)";
      case "green":
        return "rgb(33, 196, 36)";
      case "red":
        return "rgb(196, 33, 33)";
      default:
        return "rgb(0, 0, 0)";
    };
  };

  $formTag.on("input", function(){
    var regexp = /^[^a-zA-Z$]/g;
    if(this.value.match(regexp)){
      $(this).val(this.value.replace(regexp, ''));
    }
  });

  $formName.on('keyup', function(){
    $formPreview.prop('readonly', false);
    if ($formName.val()){
      $formPreview.val($(this).val());
    } else {
      $formPreview.val("Campo da TAG: " + $formTag.val());
    };
    $formPreview.prop('readonly', true);
  });

  $formColor.on('change', function(){
    let color = $(this).val();
    $formPreview.css('color', getRGBColor(color));
  });

  $formSize.on('change', function(){
    let size = $(this).val();
    $formPreview.css('fontSize', size);
  });

  $buttonBold.on('click', function(){
    if ($formPreview.css('font-weight') == "700"){
      $formPreview.css('font-weight', "400");
    } else {
      $formPreview.css('font-weight', "700");
    };
  });

  $buttonItalic.on('click', function(){
    if ($formPreview.css('font-style') === "normal"){
      $formPreview.css('font-style', "italic");
    } else {
      $formPreview.css('font-style', "normal");
    };
  });

  $buttonUnderline.on('click', function(){
    if ($formPreview.css('text-decoration') == "none solid rgb(73, 80, 87)"){
      $formPreview.css('text-decoration', "underline");
    } else {
      $formPreview.css('text-decoration', "none solid rgb(73, 80, 87)");
    };
  });

});
