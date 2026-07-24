export const downloadPageAsWord = (
  element,
  fileName = "Employee-Details.doc"
) => {
  if (!element) return;

  const html = `
  <!DOCTYPE html>
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">

  <head>
      <meta charset="utf-8" />
      <title>${fileName}</title>

      <!-- Word Settings -->
      <!--[if gte mso 9]>
      <xml>
          <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
      </xml>
      <![endif]-->

      <style>

      @page{
          size:A4;
          margin:1.5cm;
      }

      body{
          font-family:Calibri, Arial, sans-serif;
          font-size:12pt;
          color:#222;
          line-height:1.6;
          margin:0;
          padding:0;
          background:#fff;
      }

      h1{
          text-align:center;
          font-size:22pt;
          margin-bottom:25px;
      }

      h2{
          font-size:16pt;
          margin-top:28px;
          margin-bottom:12px;
          border-bottom:2px solid #222;
          padding-bottom:6px;
      }

      h3{
          font-size:14pt;
          margin:18px 0 10px;
      }

      p{
          margin:6px 0;
      }

      table{
          width:100%;
          border-collapse:collapse;
          margin:12px 0 22px;
      }

      table tr{
          page-break-inside:avoid;
      }

      th{
          border:1px solid #000;
          background:#e9ecef;
          font-weight:bold;
          text-align:left;
          padding:8px;
      }

      td{
          border:1px solid #000;
          padding:8px;
          vertical-align:top;
      }

      .section{
          margin-bottom:30px;
      }

      .label{
          font-weight:bold;
      }

      .answer-box{
          border:1px solid #000;
          min-height:80px;
          padding:10px;
          margin-top:8px;
      }

      .signature{
          margin-top:60px;
      }

      .signature table{
          border:none;
      }

      .signature td{
          border:none;
          padding:8px 0;
      }

      .page-break{
          page-break-before:always;
      }

      hr{
          border:none;
          border-top:1px solid #999;
          margin:25px 0;
      }

      </style>

  </head>

  <body>

      ${element.innerHTML}

  </body>

  </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};