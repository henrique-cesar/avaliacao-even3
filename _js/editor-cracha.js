var preview_text = document.getElementById("input-texto-preview");
var text_editor = $("#example-text");
var campo_tag = $("#input-tag");
var tagsNoCracha = [];
var count = 1;

$('#input-texto-exemplo').on('keyup', function(){
  $('#input-texto-preview').prop('readonly',false);
  $('#input-texto-preview').val($(this).val());
  $('#input-texto-preview').prop('readonly',true);

});

$("#inserir-fundo").change(function(){
  readURL(this);
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

$('#area-edit-text').draggable({
  containment: 'parent',
  cursor: 'move'
});


function makeDraggableAndResizable(elemento){
  $(elemento).draggable({
    containment: 'parent',
    cursor: 'move'
  });
};

function criarTextoEditavel(id, text){
  var div = document.createElement('div');
  div.id = ('area-edit-'+id);
  div.style = 'position: absolute; float: left; height: auto; border: 1px dashed #000000;'
  var texto = document.createElement('h4');
  texto.innerHTML = text.value;
  texto.id = ('edit-text-'+id);
  /*Copia o estilo*/
  texto.style.fontStyle = text.style.fontStyle;
  texto.style.fontWeight = text.style.fontWeight;
  texto.style.fontSize = $("#select-tamanho").val();
  texto.style.color = `rgb${converterCor($("#select-cor").val())}`;
  /**/
  div.appendChild(texto);
  document.getElementById('container-cracha-view').appendChild(div);
  makeDraggableAndResizable($("#"+div.id));
  count++;
}

$("#btn-italic").on("click", function(){
  if (preview_text.style.fontStyle == "italic"){
    preview_text.style.fontStyle = "normal";
  } else {
    preview_text.style.fontStyle = "italic";
  };
});

$('#btn-bold').on('click', function(){
  if (preview_text.style.fontWeight == "bold"){
    preview_text.style.fontWeight = "normal";
  } else {
    preview_text.style.fontWeight = "bold";
  };
});

$('#btn-gerar-tag').on('click', function(){
  if (document.getElementById('inserir-fundo').files.length === 0){
    alert("Adicione o fundo do seu crachá primeiro.")
  } else if (addTagNoCracha(campo_tag.val())){
    criarTextoEditavel(campo_tag.val().toLowerCase(), preview_text);
  } else if (campo_tag.val() === ""){
    alert("Primeiro adicione o ID da Tag.");
  } else {
    alert("Essa tag já foi adicionada.");
  }
});

$("#select-cor").on('change', function(){
  preview_text.style.color = `rgb${converterCor($(this).val())}`;
})

$("#select-tamanho").on('change', function(){
  preview_text.style.fontSize = $(this).val();
})

$("#input-tag").on("input", function(){
  var regexp = /^[^a-zA-Z$]/g;
  if(this.value.match(regexp)){
    $(this).val(this.value.replace(regexp,''));
  }
});
