import React, { useState } from "react";
import { Editor } from "primereact/editor";
import { Form, Button } from 'react-bootstrap';
import { FileUpload } from 'primereact/fileupload';

export default function BasicDemo() {
  const [text, setText] = useState('');
  const [titre, setTitre] = useState('');

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
    };
  };

  return (
    <div className="profileMain">
      <div className="card">
        <h4 style={{ fontSize: "150%" }}>Postuler Nouveau Blog : </h4>
        <div className="puts">
          <Form>
            <Form.Group controlId="titre">
              <Form.Label>Titre de Blog</Form.Label>
              <Form.Control type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="titre">
              <Form.Label>Contenu de Blog</Form.Label>
              <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
            </Form.Group>
            <div className="flex justify-content-center">
              <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" customUpload uploadHandler={customBase64Uploader} />
            </div>
            <div>
            <Button variant="primary" type="submit">
      Postuler
    </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
