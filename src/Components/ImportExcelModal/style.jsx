import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const FileName = styled.form`
  font-size: ${props => props.selected ? '13px' : '18px'};
  text-align: center;
`;

export const FormModal = styled.p`
  display:flex;
  flex-direction: column;
`;

export const ModalContent = styled.div`
  position: relative;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 500px;
  max-width: 90%;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export const FileUploadLabel = styled.label`
  cursor: pointer;
  background-color: ${props => props.selected ? '#dff1df' : '#ddd'};
  padding: 30px 70px;
  border-radius: 40px;
  border: 2px;
  border-style: dashed;
  border-color: ${props => props.selected ? '#089c08' : 'rgb(82, 82, 82)'};
  box-shadow: 0px 0px 50px -20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background-color 0.3s;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const BrowseButton = styled.span`
  background-color: rgb(82, 82, 82);
  padding: 8px 20px;
  border-radius: 10px;
  color: white;
  transition: all 0.3s;

  &:hover {
    background-color: rgb(14, 14, 14);
  }
`;

export const UploadSvg = styled.svg`
  height: 50px;
  fill: rgb(82, 82, 82);
`;

export const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px 30px;
  border-radius: 10px;
  border: none;
  background-color: #28a745;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

export const ExelIcon = styled.img`
  height: 60px;
  width: 60px;
  margin-bottom: 25px;
`;


export const Icon = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  min-height: 80px;
`;
