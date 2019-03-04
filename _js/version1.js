/*VARIAVEIS GLOBAIS*/

var $tagsNoCracha = [];
var $tagsNaPlanilha = [];


/*-------*/


function tagsPlanilhas(texto){
  var cabecalho = texto.slice(0, texto.indexOf("\n"));
  var regex = new RegExp(/{{(.*?)}}/, "g")
  var tags = [];
  var match;
  while ((match = regex.exec(cabecalho))){
    tags.push(match[1].toLowerCase());
  };
  return tags;
};

function criarParticipantes(texto){
  var tagsNaPlanilha = getTagsNaPlanilha(texto);
  texto = texto.split("\n");
  var count = 1;
  participantes = [];
  while(linha = texto[count]){
    linha = linha.split("\t");
    if (linha.length == tags.length){
      p = {};
      var x = 0;
      while (linha[x]){
        p[tags[x]] = linha[x];
        x++;
      }
    } else { break; }
    participantes.push(p)
    count++;
  }
  return participantes;
};

$("#texto-planilha").on('keyup', function(){
  verificarTags(tagsNoCracha, getTagsNaPlanilha($("#texto-planilha").val()));
});

var tagsCount = document.getElementById("numTags");
var textArea = document.getElementById("texto-planilha");

$("#baixar").on("click", function(){
  var participantes = criarParticipantes();
  if (participantes){
    var doc = new jsPDF('p', 'mm', 'a6'),
      linhaY = 20;
      cracha = document.getElementsByClassName("fundo-cracha")[0].src;
      for (let key = 0; participantes[key]; key++){
        doc.addImage(cracha, 'JPEG', 0, 0, 105, 148);
        for (let campo = 0; $tagsNoCracha[campo]; campo++){
          /*Salvar estilo*/
          /*Tamanho*/
          var target = document.getElementById("edit-text-"+$tagsNoCracha[campo]);
          doc.setFontSize(((target.style.fontSize).slice(0, -2)));
          /*Estilo da Fonte*/
          if (target.style.fontWeight === "bold" && target.style.fontStyle === "italic"){
            doc.setFontType('bolditalic');
          } else if (target.style.fontWeight === "bold") {
            doc.setFontType('bold');
          } else if (target.style.fontStyle === "italic") {
            doc.setFontType('italic');
          } else {
            doc.setFontType('normal');
          };
          /*Cor da fonte*/
          switch (target.style.color) {
            case "white":
              doc.setTextColor(255, 255, 255);
              break;
            case "blue":
              doc.setTextColor(19, 133, 247);
              break;
            case "orange":
              doc.setTextColor(229, 105, 22);
              break;
            case "pink":
              doc.setTextColor(229, 22, 184);
              break;
            case "green":
              doc.setTextColor(33, 196, 36);
              break;
            case "red":
              doc.setTextColor(196, 33, 33);
              break;
            default:
              doc.setTextColor(0, 0, 0);
          };
          var areaPos = document.getElementById("area-edit-"+$tagsNoCracha[campo]);
          let y = (areaPos.style.top).slice(0,-2);
          var x = (areaPos.style.left).slice(0,-2);
          doc.text((participantes[key][$tagsNoCracha[campo]]), (x * 0.22), (y * 0.22));
          linhaY += 10;
        };
        doc.addPage();
      };

    var pageCount = doc.internal.getNumberOfPages();
    doc.deletePage(pageCount);
    doc.save();
  };
});

textArea.addEventListener('keyup', function(){
  verificarTags(tagsNoCracha, getTagsNaPlanilha(textArea.value));
});

/*POS REFACTOR*/

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
}

function getTagsNaPlanilha(texto){
  var cabecalho = texto.slice(0, texto.indexOf("\n"));
  var regex = new RegExp(/{{(.*?)}}/, "g");
  var match;
  $tagsNaPlanilha = [];
  while ((match = regex.exec(cabecalho))){
    $tagsNaPlanilha.push(match[1].toLowerCase());
  };
  return $tagsNaPlanilha;
};

function verificarTags(tagsNoCracha, tagsNoTexto){
  if ($tagsNoCracha.length == 0){
    tagsCount.innerText = "Não há tags em seu crachá";
    return false;
  }
  var tagsQueFaltam = [];
  for (var tag in $tagsNoCracha){
    if ($tagsNaPlanilha.indexOf($tagsNoCracha[tag]) == -1){
      tagsQueFaltam.push($tagsNoCracha[tag]);
    };
  };
  if (tagsQueFaltam.length == 0){
    tagsCount.innerText = "";
    return true;
  }
  var log = "As seguintes tags não foram encontradas:"
  for (var tag in tagsQueFaltam){
    log += ` {{${tagsQueFaltam[tag]}}},`;
  };
  tagsCount.innerText = (log.slice(0, -1) + ".");
  return false;
};

function criarParticipantes(){
  var logError = "";
  if (verificarTags()){
    var lista = $("#texto-planilha").val().split("\n"),
      count = 1,
      participantes = [],
      dados;
    while (dados = lista[count]){
      dados = dados.split("\t");
      if (dados.length === $tagsNaPlanilha.length){
        var participante = {};
        for (let x = 0; dados[x]; x++){
          participante[$tagsNaPlanilha[x]] = dados[x];
        };
        participantes.push(participante);
      } else {
        logError += `Erro na linha ${count}: verifique a quantidade de campos.\n`
      };
      count++;
    };
  } else {
      logError += "Verifique as tags da sua planilha.";
  } if (logError){
      alert(logError);
      return false;
  } else if (participantes.length === 0) {
      return false;
  };
  return participantes;
};

function converterCor(cor) {
  switch (cor) {
    case "white":
      return "(255, 255, 255)";
    case "blue":
      return "(19, 133, 247)";
    case "orange":
      return "(229, 105, 22)";
    case "pink":
      return "(229, 22, 184)";
    case "green":
      return "(33, 196, 36)";
    case "red":
      return "(196, 33, 33)";
    default:
      return "(0, 0, 0)";
  };
}
