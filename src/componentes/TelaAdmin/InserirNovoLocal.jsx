import React, { useState } from 'react';
import * as yup from 'yup';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const InserirNovoLocal = () => {
  const [validated, setValidated] = useState(false);

  const schema = yup.object().shape({
    NomeLocal: yup.string().required('Insira um nome'),
    Latitude: yup.number().required('Insira a latitude'),
    Longitude: yup.number().required('Insira a longitude'),
    qtdPassagens: yup.number().required('Insira a quantidade de passagens'),
    precoPassagem: yup.number().required('Insira o preço da passagem'),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const token = sessionStorage.getItem('token');

    try {
      // Validação do formulário usando o schema definido
      await schema.validate({
        NomeLocal: form.NomeLocal.value,
        Latitude: parseFloat(form.Latitude.value),
        Longitude: parseFloat(form.Longitude.value),
        qtdPassagens: parseInt(form.qtdPassagens.value, 10),
        precoPassagem: parseFloat(form.precoPassagem.value),
      }, { abortEarly: false });

      // Preparação dos dados para envio ao servidor
      const data = {
        nome: form.NomeLocal.value,
        latitude: parseFloat(form.Latitude.value),
        longitude: parseFloat(form.Longitude.value),
        passagens: parseInt(form.qtdPassagens.value, 10),
        precoPassagem: parseFloat(form.precoPassagem.value), // Converter para número
      };

      // Envio dos dados para o backend usando Axios
      const response = await axios.post('https://traveller-api-xiex.vercel.app/api/localidades', data, {
        headers: {
          Authorization: `Bearer ${token}` // Envia o token no cabeçalho da requisição
        }
      });
      
      if (response.status === 200) {
        // Exibição de mensagem de sucesso com Toastify
        toast.success('Local inserido com sucesso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Limpar os campos do formulário após o envio bem-sucedido
        form.reset();
        setValidated(false); // Marca o formulário como não validado após limpar
      } else {
        // Exibição de mensagem de erro caso ocorra algum problema
        toast.error('Erro ao inserir local. Por favor, tente novamente mais tarde.');
      }

    } catch (error) {
      // Exibir toast de erro com a mensagem de validação ou erro de rede
      toast.error(error.message || 'Erro ao enviar formulário. Por favor, tente novamente mais tarde.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group as={Col} controlId="NomeLocal">
        <Form.Label>Nome do Local</Form.Label>
        <Form.Control type="text" name="NomeLocal" required />
        <Form.Control.Feedback type="invalid">
          Insira um nome para o local.
        </Form.Control.Feedback>
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} sm={6} controlId="Latitude">
          <Form.Label>Latitude</Form.Label>
          <Form.Control type="number" step="any" name="Latitude" required />
          <Form.Control.Feedback type="invalid">
            Insira a latitude.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} sm={6} controlId="Longitude">
          <Form.Label>Longitude</Form.Label>
          <Form.Control type="number" step="any" name="Longitude" required />
          <Form.Control.Feedback type="invalid">
            Insira a longitude.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} sm={6} controlId="qtdPassagens">
          <Form.Label>Quantidade de Passagens</Form.Label>
          <Form.Control type="number" name="qtdPassagens" required />
          <Form.Control.Feedback type="invalid">
            Insira a quantidade de passagens.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} sm={6} controlId="precoPassagem">
          <Form.Label>Preço da Passagem</Form.Label>
          <Form.Control type="number" step="any" name="precoPassagem" required />
          <Form.Control.Feedback type="invalid">
            Insira o preço da passagem.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <div className="d-flex justify-content-center mt-3">
        <Button variant="success" type="submit" id="enviar">
          Enviar
        </Button>
      </div>
    </Form>
  );
};

export default InserirNovoLocal;
