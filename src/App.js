import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function App() {
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
        "https://sisma.misau.gov.mz/sisma/api/trackedEntityInstances.json?program=zotyuVPrmLh&totalPages=true&ou=LJX5GuypkKy",
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
        // Preencher o formulário com os dados filtrados
        setFormData({
          nome: filteredData.attributes.find(attr => attr.attribute === 'SxaYBd9dxCI')?.value || "",
          apelido: filteredData.attributes.find(attr => attr.attribute === 'pGxMJFRnsd0')?.value || "",
          bi: filteredData.attributes.find(attr => attr.attribute === 'DQfJkgslJt6')?.value || "",
          naturalidade: filteredData.attributes.find(attr => attr.attribute === 'a9YIhnSwo9j')?.value || "",
          dataNascimento: filteredData.attributes.find(attr => attr.attribute === 'LsEh6golj56')?.value || "",
          localTrabalho: filteredData.attributes.find(attr => attr.attribute === 'f2bttuYO8Nk')?.value || "",
          profissao: filteredData.attributes.find(attr => attr.attribute === 'u5rnWY3v0hX')?.value || "",
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
    doc.text("_________________________________________________________________________", 20, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("MAPA DA JUNTA", 125, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "solid");
    doc.text(`Sessão de: ${formData.sessaoData}`, 105, 40);
    doc.text("___________________________________________", 100.5, 30);

    // Adicionando os dados do formulário
    doc.setFontSize(12);
    doc.text(`Nome: ${formData.nome}`, 20, 60);
    doc.text(`Apelido: ${formData.apelido}`, 20, 70);
    doc.text(`BI: ${formData.bi}`, 20, 80);
    doc.text(`Naturalidade: ${formData.naturalidade}`, 20, 90);
    doc.text(`Data de Nascimento: ${formData.dataNascimento}`, 20, 100);
    doc.text(`Local de Trabalho: ${formData.localTrabalho}`, 20, 110);
    doc.text(`Profissão: ${formData.profissao}`, 20, 120);
    

    // Adicionando uma linha de separação
    doc.text("___________________________________", 20, 140);

    // Gerando o PDF e permitindo o download
    doc.save("Mapa Da Junta.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", textAlign: "center" }}>
      <h1>REPÚBLICA DE MOÇAMBIQUE</h1>
      <h2>SERVIÇO NACIONAL DE SAÚDE</h2>
      <h3>MAPA DA JUNTA</h3>

      {/* Campo de pesquisa por nome */}
      <div>
        <label style={{ width: "200px", display: "inline-block", textAlign: "left" }}>Pesquisar por Nome:</label>
        <input
          type="text"
          name="nome"
          value={searchData.nome}
          onChange={handleSearchChange}
          style={{ width: "calc(100% - 220px)", padding: "8px", textAlign: "left" }}
        />
      </div>

      <button
        type="button"
        onClick={fetchData} // Botão para carregar dados com base no nome
        style={{
          padding: "10px 20px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          marginTop: "10px",
          cursor: "pointer",
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
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              marginRight: "10px",
              cursor: "pointer",
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
              color: "white",
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
              color: "white",
              marginLeft: "10px",
            }}
          >
            Imprimir
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;