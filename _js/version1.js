$(function() {
  /*VARIAVEIS GLOBAIS*/

  var $tagsNoCracha = [];
  var $tagsNaPlanilha = [];
  var $logoInserida = false;
  var tagsCount = document.getElementById("numTags");

  /*-------*/

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
    getTagsNaPlanilha($(this).val());
    verificarTags();
  });

  $("#baixar").on("click", function(){
    var participantes = criarParticipantes();
    if (participantes){
      gerarPDF(participantes);
    };
  });

  function gerarPDF(participantes){
    var doc = new jsPDF('p', 'mm', 'a6'),
      cracha = document.getElementsByClassName("fundo-cracha")[0].src,
      fatorEscala = 2.851351351351351, /*Valor que converte o tamanho em 'px' para 'mm' no crachá*/
      margemDoTopo = 172.5, /*Posição Y absoluta do inicio do crachá*/
      margemDaEsquerda = 72, /*Posição X absoluta*/
      escalaFonte = 4, /*Aumenta a escala da fonte para o arquivo PDF*/
      adicionalEixoY = 5.6; /*Margem Y do jsPDF para arquivos em A6*/
      if ($logoInserida){
        var elementoLogo = document.getElementById("logo-img-edit"),
          logo = document.getElementById("logo-img-edit").src,
          areaLogo = document.getElementById("logo-edit"),
          logoHeight = areaLogo.offsetHeight,
          logoWidth = areaLogo.offsetWidth;
      };
      for (let key = 0; participantes[key]; key++){
        doc.addImage(cracha, 'JPEG', 0, 0, 105, 148);
        for (let campo = 0; $tagsNoCracha[campo]; campo++){
          var texto = document.getElementById("edit-text-"+$tagsNoCracha[campo]);
          setPropriedadesForTextPDF(doc, texto, escalaFonte);
          var area = document.getElementById("area-edit-"+$tagsNoCracha[campo]);
          let position = setAreaPositionEscalar(area, margemDoTopo, margemDaEsquerda, fatorEscala, adicionalEixoY);
          doc.text((participantes[key][$tagsNoCracha[campo]]), position[0], position[1]);
        };
        if ($logoInserida){
          let area = document.getElementById("logo-edit");
          let position = setAreaPositionEscalar(area, margemDoTopo, margemDaEsquerda,
             fatorEscala, 0);
          doc.addImage(logo, 'PNG', position[0], position[1],
          (logoWidth/fatorEscala), (logoHeight/fatorEscala));
        };
        doc.addPage();
      };
    var pageCount = doc.internal.getNumberOfPages();
    doc.deletePage(pageCount);
    doc.save();
  };

  function setPropriedadesForTextPDF(docpdf, textElement, addFonteSize){
    /*Tamanho*/
    let tamanhoFonte = parseFloat((textElement.style.fontSize).slice(0, -2)) + addFonteSize;
    docpdf.setFontSize(tamanhoFonte);
    /*Estilo*/
    if (textElement.style.fontWeight === "bold" && textElement.style.fontStyle === "italic"){
      docpdf.setFontType('bolditalic');
    } else if (textElement.style.fontWeight === "bold") {
      docpdf.setFontType('bold');
    } else if (textElement.style.fontStyle === "italic") {
      docpdf.setFontType('italic');
    } else {
      docpdf.setFontType('normal');
    };
    /*Cor*/
    let rgb = textElement.style.color;
    rgb = rgb.slice(4, rgb.length-1).split(", ");
    docpdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  };

  function setAreaPositionEscalar(areaElement, margemTopo, margemEsquerda, fatorEscala, adicionalEixoY){
    let x = (parseFloat((areaElement.style.left).slice(0,-2)))-margemEsquerda;
    let y = (parseFloat((areaElement.style.top).slice(0,-2)))-margemTopo;
    if (isNaN(x) && isNaN(y)){
      return [0, adicionalEixoY];
    } else if (isNaN(x)) {
      return [0, (y / fatorEscala)+adicionalEixoY];
    } else if (isNaN(y)) {
      return [(x / fatorEscala), 0];
    };
    return [(x / fatorEscala), (y / fatorEscala)+adicionalEixoY];
  };

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

  function verificarTags(){
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
          for (let x = 0; x < dados.length; x++){
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
  };
});
