import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import 'font-awesome/css/font-awesome.min.css';

export const App = () => {
  const [searchData, setSearchData] = useState({
    nome: "", // Para pesquisa por nome
  });

  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    bi: "",
    naturalidade: "",
    dataNascimento: "",
    localTrabalho: "",
    profissao: "",
    proveniencia: "",
    lesao: "",
    funcoesAlteradas: "",
    antiguidadeLesao: "",
    contraiuServico: "",
    sessaoData: "",
    opiniaoJunta: "",

  });



  // Função para buscar dados da API com autenticação e filtragem por nome
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://sisma.misau.gov.mz/sisma/api/trackedEntityInstances.json?program=zotyuVPrmLh&totalPages=true&ou=LJX5GuypkKy&fields=*",
        {
          auth: {
            username: "cromao", // seu username
            password: "Clesio2020!", // sua senha
          },
        }
      );

      const dados = response.data.trackedEntityInstances;

      // Filtrar os dados pelo nome informado
      const filteredData = dados.find(dado =>
        dado.attributes.find(attr => attr.attribute === 'SxaYBd9dxCI')?.value === searchData.nome
      );

      if (filteredData) {

// Extrair a proveniência fora do setFormData
const proveniencia = filteredData.enrollments
.flatMap(enrollment => enrollment.events) // Extrai todos os eventos
.flatMap(event => event.dataValues) // Extrai todos os dataValues
.find(dataValue => dataValue.dataElement === 'vNhE2Iq4ocJ')?.value || ""; // Busca o valor de proveniência

        // Preencher o formulário com os dados filtrados
        setFormData({
          nome: filteredData.attributes.find(attr => attr.attribute === 'SxaYBd9dxCI')?.value || "",
          apelido: filteredData.attributes.find(attr => attr.attribute === 'pGxMJFRnsd0')?.value || "",
          bi: filteredData.attributes.find(attr => attr.attribute === 'DQfJkgslJt6')?.value || "",
          naturalidade: filteredData.attributes.find(attr => attr.attribute === 'a9YIhnSwo9j')?.value || "",
          dataNascimento: filteredData.attributes.find(attr => attr.attribute === 'LsEh6golj56')?.value || "",
          localTrabalho: filteredData.attributes.find(attr => attr.attribute === 'f2bttuYO8Nk')?.value || "",
          profissao: filteredData.attributes.find(attr => attr.attribute === 'u5rnWY3v0hX')?.value || "",
          //proveniencia: filteredData.dataValues.find(data => data.dataElement === 'vNhE2Iq4ocJ')?.value || "",
          //proveniencia: filteredData.attributes.find(attr => attr.attribute === 'u5rnWY3v0hX')?.value || "",
          proveniencia: proveniencia, // Adiciona o valor de proveniência
          lesao: "",
          funcoesAlteradas: "",
          antiguidadeLesao: "",
          contraiuServico: "",
          sessaoData: "",
          opiniaoJunta: "",
        });
      } else {
        alert("Nenhum registro encontrado com o nome fornecido.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API", error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    alert("Formulário enviado com sucesso!");
  };

  const handleClear = () => {
    setFormData({
      proveniencia: "",
      nome: "",
      apelido: "",
      bi: "",
      naturalidade: "",
      dataNascimento: "",
      localTrabalho: "",
      profissao: "",
      lesao: "",
      funcoesAlteradas: "",
      antiguidadeLesao: "",
      contraiuServico: "",
      sessaoData: "",
      opiniaoJunta: "",
    });
  };

 // Carregar imagem do emblema e preparar para o PDF
  const loadImage = () => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = '/emblema.jpeg';
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        resolve(canvas.toDataURL('image/jpeg')); 
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  };

 
  const handlePrint = async () => {
    const doc = new jsPDF(); 
    doc.setFontSize(12);
    const imgData = await loadImage(); // Carregar a imagem

    doc.addImage(imgData, 'JPEG', 50, 10, 15, 15); // Adicionando a imagem ao PDF, na posição (10, 10) e tamanho (50x50)
    doc.setFontSize(10);
    doc.text('REPUBLICA DE MOÇAMBIQUE', 28, 30);
    doc.text("|", 100, 6);
    doc.text("|", 100, 9);
    doc.text("|", 100, 12);
    doc.text("|", 100, 15);
    doc.text("|", 100, 18);
    doc.text("|", 100, 21);
    doc.text("|", 100, 24);
    doc.text("|", 100, 27);
    doc.text("|", 100, 30);
    doc.text("|", 100, 33);
    doc.text("|", 100, 36);
    doc.text("|", 100, 39);
    doc.text("|", 100, 42);
    doc.text("|", 100, 45);

    doc.setFontSize(12);
    doc.text('SERVIÇO NACIONAL DE SAÚDE', 20, 40);
    doc.text("__________________________________________________________________________", 20, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MAPA DA JUNTA", 125, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Sessão de: ${formData.sessaoData}`, 105, 40);
    doc.text("________________________________________", 100.5, 30);

    // Adicionando os dados do formulário
    doc.setFontSize(10);
    doc.text("|", 30, 48.5);
    doc.text("|", 30, 51);
    doc.text("|", 30, 54);
    doc.text("|", 30, 57);
    doc.text("|", 30, 60);
    doc.text("|", 30, 63);
    doc.text("|", 30, 66);
    doc.text("|", 30, 69);
    doc.text("|", 30, 72);
    doc.text("|", 30, 75);
    doc.text("|", 30, 78);
    doc.text("|", 30, 81);
    doc.text("|", 30, 84);
    doc.text("|", 30, 87);
    doc.text("|", 30, 90);
    doc.text("|", 30, 93);
    doc.text("|", 30, 96);
    doc.text("|", 30, 99);
    doc.text("|", 30, 102);
    doc.text("|", 30, 105);
    doc.text("|", 30, 108);
    doc.text("|", 30, 111);
    doc.text("|", 30, 114);
    doc.text("|", 30, 117);
    doc.text("|", 30, 120);
    doc.text("|", 30, 123);
    doc.text("|", 30, 126);
    doc.text("|", 30, 129);
    doc.text("|", 30, 132);
    doc.text("|", 30, 135);
    doc.text("|", 30, 138);
    doc.text("|", 30, 141);
    doc.text("|", 30, 144);
    doc.text("|", 30, 147);
    doc.text("|", 30, 150);
    doc.text("|", 30, 153);
    doc.text("|", 30, 156);
    doc.text("|", 30, 159);
    doc.text("|", 30, 162);
    doc.text("|", 30, 165);
    doc.text("|", 30, 168);
    doc.text("|", 30, 171);
    doc.text("|", 30, 174);
    doc.text("|", 30, 177);
    doc.text("|", 30, 180);    
    doc.text("|", 30, 183);
    doc.text("|", 30, 186);
    doc.text("|", 30, 189);    
    doc.text("|", 30, 192);
    doc.text("|", 30, 195);
    doc.text("|", 30, 198);    
    doc.text("|", 30, 201);
    doc.text("|", 30, 204);
    doc.text("|", 30, 207);
    doc.text("|", 30, 210);
    doc.text("|", 30, 213);
    doc.text("|", 30, 216);
    doc.text("|", 30, 219);
    doc.text("|", 30, 222);
    doc.text("|", 30, 225);
    doc.text("|", 30, 228);
    doc.text("|", 30, 231);
    doc.text("|", 30, 234);
    doc.text("|", 30, 237);
    doc.text("|", 30, 240);
    doc.text("|", 30, 243);
    doc.text("|", 30, 246);
    doc.text("|", 30, 249);
    doc.text("|", 30, 252);
    doc.text("|", 30, 255);
    doc.text("|", 30, 258);
    doc.text("|", 30, 261);
    doc.text("|", 30, 264);
    doc.text("|", 30, 267);
    doc.text("|", 30, 270);
    doc.text("|", 30, 273);
    doc.text("|", 30, 276);
    doc.text("|", 30, 279);
    doc.text("|", 30, 282);
    doc.text("|", 30, 285);

    doc.text(`Proveniencia: ${formData.proveniencia}`, 33, 52);
    doc.text("___________________________________________________________________________________", 30.5, 55);

    // doc.setFontSize(12);
    doc.text(`Nome: ${formData.nome}`, 40, 62);
    doc.text(`Apelido: ${formData.apelido}`, 40, 69);
    doc.text(`BI: ${formData.bi}`, 40, 76);
    doc.text(`Naturalidade: ${formData.naturalidade}`, 40, 83);
    doc.text(`Data de Nascimento: ${formData.dataNascimento}`, 40, 90);
    doc.text(`Local de Trabalho: ${formData.localTrabalho}`, 40, 97);
    doc.text(`Profissão: ${formData.profissao}`, 40, 104);
    
    doc.text("___________________________________________________________________________________", 30.5, 110);
    doc.text(`Licença da junta: `, 33, 117);
    doc.text("___________________________________________________________________________________", 30.5, 120);
    
    
    doc.text("|", 40, 123);
    doc.text("|", 40, 126);
    doc.text("|", 40, 129);
    doc.text("|", 40, 132);
    doc.text("|", 40, 135);
    doc.text("|", 40, 138);
    doc.text("|", 40, 141);
    doc.text("|", 40, 144);
    doc.text("|", 40, 147);
    doc.text("|", 40, 150);
    doc.text("|", 40, 153);
    doc.text("|", 40, 156);
    doc.text("|", 40, 159);
    doc.text("|", 40, 162);
    doc.text("|", 40, 165);
    doc.text("|", 40, 168);
    doc.text("|", 40, 171);
    doc.text("|", 40, 174);
    doc.text("|", 40, 177);
    doc.text("|", 40, 180);
    doc.text("|", 40, 183);
    doc.text("|", 40, 186);
    doc.text("|", 40, 189);
    doc.text("|", 40, 192);
    doc.text("|", 40, 195);
    doc.text("|", 40, 198);
    doc.text("|", 40, 201);
    doc.text("|", 40, 204);
    doc.text("|", 40, 207);
    doc.text("|", 40, 210);
    doc.text("|", 40, 213);
    doc.text("|", 40, 216);
    doc.text("|", 40, 219);
    doc.text("|", 40, 222);
    doc.text("|", 40, 225);
    doc.text("|", 40, 228);
    doc.text("|", 40, 231);
    doc.text("|", 40, 234);
    doc.text("|", 40, 237);
    doc.text("|", 40, 240);

    doc.text('INFORÇÃO DA JUNTA', 37, 180, { angle: 90 });
    doc.text('OPINIÃO DA JUNTA', 37, 235, { angle: 90 });

    
    doc.text("|", 83, 123);
    doc.text("|", 83, 126);
    doc.text("|", 83, 129);
    doc.text("|", 83, 132);
    doc.text("|", 83, 135);
    doc.text("|", 83, 138);
    doc.text("|", 83, 141);
    doc.text("|", 83, 144);
    doc.text("|", 83, 147);
    doc.text("|", 83, 150);
    doc.text("|", 83, 153);
    doc.text("|", 83, 156);
    doc.text("|", 83, 159);
    doc.text("|", 83, 162);
    doc.text("|", 83, 165);
    doc.text("|", 83, 168);
    doc.text("|", 83, 171);
    doc.text("|", 83, 174);
    doc.text("|", 83, 177);
    doc.text("|", 83, 180);
    doc.text("|", 83, 183);
    doc.text("|", 83, 186);
    doc.text("|", 83, 189);
    doc.text("|", 83, 192);
    doc.text("|", 83, 195);


    doc.text(`    Lesão e número
    correspondente
    da tabela`, 43, 127);
    doc.text("______________________________________________________________________________", 40.5, 142);
    doc.text(`    Funções alternadas
    e em que grau`, 43, 150);
    doc.text("______________________________________________________________________________", 40.5, 160);
    doc.text(`    Antiguidade 
    a lesao`, 43, 168);
    doc.text("______________________________________________________________________________", 40.5, 175);
    doc.text(`    Se foi contraido 
    em servico e por 
    efeito do mesmo`, 43, 183);
    doc.text("___________________________________________________________________________________", 30.5, 195); 


    doc.text("............................................................................................................................................................", 40.5, 202);
    doc.text("............................................................................................................................................................", 40.5, 210);
    doc.text("............................................................................................................................................................", 40.5, 218);
    doc.text("............................................................................................................................................................", 40.5, 226);
    doc.text("............................................................................................................................................................", 40.5, 234);
    doc.text("___________________________________________________________________________________", 30.5, 240);

    doc.text(`1ª Vogal`, 62, 250);
    doc.text(".........................................................", 45, 258);
    doc.text(`O Presidente`, 152, 250);
    doc.text(".........................................................", 135, 258);

    doc.text(`2ª Vogal`, 62, 275);
    doc.text(".........................................................", 45, 283);
    doc.text(`O Secretário`, 152, 275);
    doc.text(".........................................................", 135, 283);

    doc.save("Mapa Da Junta.pdf");
  };

  return (
    <>
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h1>REPÚBLICA DE MOÇAMBIQUE</h1>
      <h2>SERVIÇO NACIONAL DE SAÚDE</h2>
      <h3>MAPA DA JUNTA</h3>


      {/* Campo de pesquisa com ícone */}
      {/* <div style={{ position: 'relative', width: '100%' }}>
        <label
          style={{
            width: "200px",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          Pesquisar por Nome:
        </label>

        <input
          type="text"
          name="nome"
          placeholder="Pesquisar nome ..."
          value={searchData.nome}
          onChange={handleSearchChange}
          style={{
            width: "calc(100% - 220px)",
            padding: "8px 40px 8px 10px", // Adiciona espaçamento à esquerda e direita para o ícone
            textAlign: "left",
            borderRadius: "20px",
            border: "1px solid #ccc", // Borda leve
            position: "relative",
          }}
        />

        {/* Ícone de pesquisa dentro do input */}
        {/* <i
          className="fa fa-search"
          onClick={fetchData}
          style={{
            position: "absolute",
            right: "100px", // Alinha o ícone à direita
            top: "70%",
            transform: "translateY(-50%)", // Centraliza verticalmente
            fontSize: "12px",
            color: "#888",
            cursor: "pointer",
          }}
        ></i>
      </div> */} 








      {/* Campo de pesquisa por nome */}
      <div style={{ position: 'relative', width: '100%'}}>
        <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Pesquisar por Nome:</label>
        <input
          type="text"
          name="nome"
          placeholder="Pesquisar nome ..."
          value={searchData.nome}
          onChange={handleSearchChange}
          style={{ width: "calc(100% - 220px)", padding: "9px", textAlign: "left", borderRadius: "20px", border: "1px solid #ccc",}}
        />

        <i
          className="fa fa-search"
          onClick={fetchData}
          style={{
            position: "absolute",
            right: "20px", 
            top: "50%",
            transform: "translateY(-50%)", 
            fontSize: "12px",
            color: "#888",
            cursor: "pointer",
          }}
        ></i>
      </div>

      <button
        type="button"
        onClick={fetchData} // Botão para carregar dados com base no nome
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          marginTop: "10px",
          cursor: "pointer",
          borderRadius: "35px",
        }}
      >
        Carregar Dados
      </button>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Em Sessão de:</label>
          <input
            type="date"
            name="sessaoData"
            value={formData.sessaoData}
            onChange={handleChange}
            style={{ padding: "8px", width: "calc(100% - 220px)", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Apelido:</label>
          <input
            type="text"
            name="apelido"
            value={formData.apelido}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>
        
        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>BI (No Arq. Data):</label>
          <input
            type="text"
            name="bi"
            value={formData.bi}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Naturalidade:</label>
          <input
            type="text"
            name="naturalidade"
            value={formData.naturalidade}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Data de Nascimento:</label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Local de Trabalho:</label>
          <input
            type="text"
            name="localTrabalho"
            value={formData.localTrabalho}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Profissão:</label>
          <input
            type="text"
            name="profissao"
            value={formData.profissao}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Proveniencia</label>
          <input
            type="text"
            name="entidade_que_envia"
            value={formData.proveniencia}
            onChange={handleChange}
            style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
          />
        </div>

        <div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              marginRight: "10px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Enviar
          </button>

          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              border: "none",
              color: "white",
              marginRight: "10px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              border: "none",
              color: "white",
              marginLeft: "10px",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            Imprimir
          </button>
        </div>

      </form>


    </div>
    </>
  );
}
