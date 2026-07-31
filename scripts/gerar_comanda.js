import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateComandaPDF() {
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'comanda-espaço-auad-2026.pdf');

  // HTML com layout da comanda (15cm × 20cm)
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Helvetica, Arial, sans-serif;
      width: 15cm;
      height: 20cm;
      padding: 0.8cm;
      page-break-after: always;
      background: white;
      color: black;
      line-height: 1.1;
    }

    .header {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 0.4cm;
      border-bottom: 1px solid black;
      padding-bottom: 0.3cm;
    }

    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-top: 0.3cm;
      margin-bottom: 0.2cm;
    }

    .combo-box {
      border: 1px solid black;
      padding: 0.3cm;
      margin-bottom: 0.3cm;
    }

    .combo-item {
      font-size: 8pt;
      margin-bottom: 0.2cm;
      display: flex;
      justify-content: space-between;
    }

    .combo-item::before {
      content: '( ) ';
      margin-right: 0.3cm;
    }

    .content {
      font-size: 8pt;
      margin-bottom: 0.15cm;
      line-height: 1.05;
    }

    .compact {
      font-size: 7.5pt;
      margin-bottom: 0.13cm;
      line-height: 1.0;
    }

    .observation-line {
      border-bottom: 1px solid black;
      width: 100%;
      margin-left: 0.3cm;
      margin-top: -0.15cm;
    }

    .sabores {
      font-size: 7.5pt;
      margin-bottom: 0.1cm;
      line-height: 1.05;
    }

    .sabores-title {
      font-weight: bold;
      font-size: 10pt;
      margin-bottom: 0.1cm;
    }

    .sabores-subtext {
      font-size: 6.5pt;
      margin-left: 4cm;
      margin-top: -0.2cm;
      margin-bottom: 0.1cm;
    }

    .footer {
      border-top: 1px solid black;
      margin-top: 0.3cm;
      padding-top: 0.2cm;
      font-size: 7pt;
      line-height: 1.3;
    }

    .checkbox {
      display: inline;
      margin-right: 0.3cm;
    }
  </style>
</head>
<body>

<div class="header">ESPAÇO AUAD — COMANDA</div>

<div class="combo-box">
  <div class="section-title" style="margin-top: 0; margin-bottom: 0.15cm;">COMBOS DE SHAKE</div>
  <div class="combo-item">Shake Base<span>29</span></div>
  <div class="combo-item">Shake + 2 Chás<span>39</span></div>
  <div class="combo-item">Shake Base + Whey<span>39</span></div>
  <div class="combo-item">Shake Base+Whey+2 Chás<span>49</span></div>
  <div class="combo-item">Shake + Hype Drink<span>59</span></div>
  <div class="combo-item">Shake + Hype Drink GS<span>65</span></div>
</div>

<div class="section-title">ADICIONAIS DE BEBIDAS</div>
<div class="compact">( ) Colágeno 2,00  |  ( ) Creatina 8,00  |  ( ) CR7 8,00</div>
<div class="compact">( ) Fiber Líquida 8,00  |  ( ) Lift Off 20,00</div>
<div class="compact">( ) Hype Drink 30,00  |  ( ) Hype Drink Com Gás 35,00</div>

<div class="content" style="margin-top: 0.2cm;">
  <strong>Observações:</strong>
  <div class="observation-line"></div>
</div>

<div class="sabores-title">SABORES DE SHAKE</div>
<div class="sabores-subtext">(Circule até 2 — Sabor Adic. R\$5,00)</div>
<div class="sabores">Abacaxi  |  Banana Caramelizada  |  Baunilha  |  Capuccino</div>
<div class="sabores">Chocolate  |  Coco  |  Cookies  |  Doce de Leite</div>
<div class="sabores">Morango  |  Pistache  |  Torta de Limão</div>

<div class="section-title" style="margin-top: 0.15cm;">ADICIONAIS DE SHAKE</div>
<div class="compact">Amendoim 8 | Borda 8 | Borda Dupla 6 | Docinho 10</div>
<div class="compact">Farofa 8 | Fiber Manga 8 | Fibra Sem Sabor 8 | Fiber Uva 8</div>
<div class="compact">Glutamina 8 | Protein Crunch 8 | Kit Kat 8 | Morango 8</div>
<div class="compact">Petit Gateau 8 | Prot. Isolada 5g 8 | Prot. Isolada 10g 6</div>
<div class="compact">¼ Waffle 8 | Biscoito de Queijo 7 | Muffin Castanha 5</div>

<div class="section-title" style="margin-top: 0.15cm;">OPÇÕES PROTEICAS SALGADAS</div>
<div class="compact">( ) Escondidinho Frango ... 40  |  ( ) Nutri Soup ... 35</div>
<div class="compact">( ) Lanche Frango ... 20  |  ( ) Lanche Cebola ... 20</div>
<div class="compact">( ) Quiche Frango ... 30  |  ( ) Wafle Pão de Queijo ... 30</div>
<div class="compact">( ) Pão de Queijo ... 5  |  ( ) Omelete/Ovos Mexidos ... 29</div>
<div class="compact">( ) Empada/Coxinha ... 5  |  ( ) Quibe/Disco ... 30</div>
<div class="compact">( ) Scoop Whey ... 10</div>

<div class="footer">
  <div>Nome: ________________  Data: ___/___/___</div>
  <div>Total: R\$ _________</div>
  <div>Forma de Pagamento: ☐ Pix  ☐ Cartão  ☐ Dinheiro</div>
</div>

</body>
</html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Gerar PDF com tamanho fixo 15×20cm (396×567 pixels em 96 DPI)
    await page.pdf({
      path: outputPath,
      width: '15cm',
      height: '20cm',
      margin: 0,
      printBackground: true,
      scale: 1
    });

    await browser.close();

    console.log(`✅ PDF gerado: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Erro ao gerar PDF: ${error.message}`);
    process.exit(1);
  }
}

generateComandaPDF();
