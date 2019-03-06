var preview_text = document.getElementById("input-texto-preview");

$("#inserir-fundo").change(function(){
  readURL(this);
});

$("#input-tag").on("input", function(){
  var regexp = /^[^a-zA-Z$]/g;
  if(this.value.match(regexp)){
    $(this).val(this.value.replace(regexp,''));
  }
});

$("#input-texto-exemplo").on('keyup', function(){
  $("#input-texto-preview").prop('readonly',false);
  if ($(this).val()){
    $("#input-texto-preview").val($(this).val());
  } else {
    $("#input-texto-preview").val(`Campo da tag {{${$("#input-tag").val()}}}`);
  };
  $("#input-texto-preview").prop('readonly',true);
});

$("#select-cor").on('change', function(){
  preview_text.style.color = `rgb${converterCor($(this).val())}`;
});

$("#select-tamanho").on('change', function(){
  preview_text.style.fontSize = $(this).val();
});

$("#btn-italic").on('click', function(){
  if (preview_text.style.fontStyle == "italic"){
    preview_text.style.fontStyle = "normal";
  } else {
    preview_text.style.fontStyle = "italic";
  };
});

$("#btn-bold").on('click', function(){
  if (preview_text.style.fontWeight == "bold"){
    preview_text.style.fontWeight = "normal";
  } else {
    preview_text.style.fontWeight = "bold";
  };
});

$("#btn-underline").on('click', function(){
  if (preview_text.style.textDecoration === "underline"){
    preview_text.style.textDecoration = "";
  } else {
    preview_text.style.textDecoration = "underline";
  };
});

$("#btn-gerar-tag").on('click', function(){
  if (document.getElementById('inserir-fundo').files.length === 0){
    alert("Adicione o fundo do seu crachá primeiro.")
  } else if (addTagNoCracha($("#input-tag").val())){
	if (!($("#input-texto-preview").val())){
		$("#input-texto-preview").val(`Campo da tag {{${$("#input-tag").val()}}}`);
	};
	criarTextoEditavel($("#input-tag").val().toLowerCase(), preview_text); 
  } else if ($("#input-tag").val() === ""){
    alert("Primeiro adicione o ID da Tag.");
  } else {
    alert("Essa tag já foi adicionada.");
  };
});

$("#btn-add-logo").change(function(){
  if (document.getElementById('inserir-fundo').files.length === 0){
    alert("Adicione o fundo do seu crachá primeiro.");
  } else {
    var result = readURLForLogo(this);
  };
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('.fundo-cracha').attr('src', e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  };
};

function readURLForLogo(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#img-logo').attr('src', e.target.result);
      inserirLogoEditavel(e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  };
};

function criarTextoEditavel(id, text){
  var div = document.createElement('div');
  div.id = ('area-edit-'+id);
  div.style = 'position: absolute; float: left; height: auto; border: 1px dashed #000000;'
  var texto = document.createElement('h4');
  texto.innerHTML = text.value;
  texto.id = ('edit-text-'+id);
  texto.className = 'textos-editaveis';
  texto.style.fontStyle = text.style.fontStyle;
  texto.style.fontWeight = text.style.fontWeight;
  texto.style.textDecoration = text.style.textDecoration;
  texto.style.fontSize = $("#select-tamanho").val();
  texto.style.color = `rgb${converterCor($("#select-cor").val())}`;
  div.appendChild(texto);
  document.getElementById('container-cracha-view').appendChild(div);
  makeDraggable($("#"+div.id));
};

function inserirLogoEditavel(source){
  var antigaLogo = document.getElementById("logo-edit");
  if (antigaLogo){
    antigaLogo.parentNode.removeChild(antigaLogo);
  }
  var img = document.createElement('img');
  img.src = source;
  img.style = 'width: 200px; height: auto; max-width:100%; max-height:100%;';
  img.id = "img-logo";
};

$("#img-logo").on('load', function(){
  var div = document.createElement('div');
  div.id = ('logo-edit');
  div.style = 'position: absolute; float: left; border: 1px dashed #000000; max-width: 200px;';
  div.style.maxWidth = ($(this).width()+"px");
  div.style.maxHeight = ($(this).height()+"px");
  var clone = $(this).clone();
  clone.attr('id', 'logo-img-edit');
  div.appendChild(clone[0]);
  document.getElementById('container-cracha-view').appendChild(div);
  makeDraggableAndResizable($("#logo-edit"));
  $logoInserida = true;
});

function makeDraggable(elemento){
  $(elemento).draggable({
    containment: 'parent',
    cursor: 'move'
  });
  makeDeletable(elemento);
};

function makeDraggableAndResizable(elemento){
  $(elemento).resizable({
	handles: "ne, se, sw, nw",
    containment: 'parent',
    cursor: 'move',
    aspectRatio: true
  });
  makeDraggable(elemento);
};

function makeDeletable(elemento){
  $(elemento).on("dblclick", function(){
    var idNoCracha = $(this).children().prop('id').slice(10);
    $tagsNoCracha.pop(idNoCracha);
    if ($(this).prop('id') === "logo-edit"){
      $logoInserida = false;
    };
    $(this).remove();
  });
};

function addTagNoCracha(tag){
  if (tag){
    tag = tag.toLowerCase();
    if ($tagsNoCracha.indexOf(tag) === -1){
      $tagsNoCracha.push(tag);
      return true;
    };
  };
  return false;
};

function removeTagDoCracha(tag){
  if ($tagsNoCracha.indexOf(tag) != -1){
    $tagsNoCracha.pop(tag);
    return true;
  };
  return false;
};
