import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {
  ModalOverlay,
  ModalContent,
  CloseButton,
  FileUploadLabel,
  HiddenInput,
  ExelIcon,
  UploadSvg,
  SubmitButton,
  FormModal,
  FileName,
  Icon,
} from "./style";
import Spinner from "../Spinner";
import { api } from "../../services/api";
import { getHeaders } from "../../services/headers";

export default function ImportExcelModal({ onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.warning("Selecione um arquivo primeiro.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post(`/data/upload-excel`, formData, {
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resposta:", response.data);

      setSearch((prev) => {
        const p = new URLSearchParams(prev);
        p.set("page", 1);
        p.set("refresh", Date.now().toString());
        return p;
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error("Erro ao importar excel:", error);
      toast.error("Erro ao importar excel.");
    }

    setLoading(false);
    onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <FormModal onSubmit={(e) => e.preventDefault()}>
          <FileUploadLabel htmlFor="file" selected={selectedFile}>
            <Icon>
              {loading ? (
                <Spinner />
              ) : selectedFile ? (
                <ExelIcon src="excel-green.png" alt="Excel" />
              ) : (
                <UploadSvg viewBox="0 0 640 512">
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                </UploadSvg>
              )}
            </Icon>

            <FileName selected={selectedFile}>
              {selectedFile
                ? selectedFile.name
                : "Clique para escolher o arquivo."}
            </FileName>

            <HiddenInput
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xls,.xlsx,.xlsm"
            />
          </FileUploadLabel>

          <SubmitButton type="button" onClick={handleSubmit}>
            Enviar Excel
          </SubmitButton>
        </FormModal>
      </ModalContent>
    </ModalOverlay>
  );
}
