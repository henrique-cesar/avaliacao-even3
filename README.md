# avaliacao-even3

## Descrição

Este projeto foi construído para seletiva de estagiários da [Even3](https://even3.com.br).

Foi solicitado construir uma página onde:

1. O usuário pudesse montar o layout de um crachá.
2. Inserir tags no crachá para que fossem posteriormente impressas.
3. Copiar o conteúdo de uma planilha do excel e colar em uma caixa de texto.
4. Fazer o download dos crachás.

## Como funciona

* O usuário precisará fazer o download de todos os arquivos e executar o index.html.
* Ao inserir a tabela no campo de texto o usuário deverá inserir o cabeçalho contendo as tags na primeira linha e adicionar "{{ }}" em todas elas, independente de terem sido inseridas no crachá.

Obs: É recomendável inserir um fundo com a resolução 1240 x 1748 (A6) ou proporcional.

## Informações sobre o projeto

### Ferramentas utilizadas

* JavaScript
* jQuery v3.3.1
* Bootstrap v4.1.3
* JsPDF

### Requisitos

- [x] Colocar [este link](https://blog.even3.com.br/crachas-para-eventos-academicos/) da Even3 como dica de templates.
- [x] Permitir alteração do estilo, cor e tamanho dos textos.
- [x] Receber o conteúdo da planilha em uma caixa de texto.
- [x] Permitir tags no texto.
- [x] Validar tags no texto.
- [x] Gerar arquivo PDF com os crachás dos participantes.

### Add-on

- [x] O usuário pode inserir a logo do evento.
- [x] Permite redimensionamento da logo no crachá.
- [x] PDF gerado com o tamanho da folha A6.

### Limitações

* Não realiza o "crop" do fundo do crachá. (Necessário para fundos desproporcionais ao A6).
* Imprime apenas texto alinhado à esquerda.
* Não imprime sublinhamento do texto.
* Textos não responsivos (textos serão cortados se ultrapassarem a margem do arquivo PDF).

